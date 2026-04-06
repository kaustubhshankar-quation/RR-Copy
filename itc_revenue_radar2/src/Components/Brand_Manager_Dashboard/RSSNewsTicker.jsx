import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRss } from "react-icons/fa";

const FEED_URL =
  "https://news.google.com/rss/search?q=sunfeast&hl=en-IN&gl=IN&ceid=IN:en";
const LOCAL_PROXY = "/api/rss-feed?q=sunfeast";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const ROTATE_INTERVAL = 4000; // ms between news items

function parseRSSItems(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  return Array.from(doc.querySelectorAll("item")).map((item) => ({
    title: item.querySelector("title")?.textContent || "",
    link: item.querySelector("link")?.textContent || "#",
    pubDate: item.querySelector("pubDate")?.textContent || "",
    source: item.querySelector("source")?.textContent || "",
  }));
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const RSSNewsTicker = ({ collapsed = false, setCollapsed }) => {

  const [newsItems, setNewsItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try local dev proxy first, fallback to CORS proxy
      let xmlText;
      try {
        const res = await fetch(LOCAL_PROXY);
        if (!res.ok) throw new Error("Local proxy failed");
        xmlText = await res.text();
      } catch {
        const res = await fetch(
          `${CORS_PROXY}${encodeURIComponent(FEED_URL)}`
        );
        if (!res.ok) throw new Error("Failed to fetch news");
        xmlText = await res.text();
      }

      const items = parseRSSItems(xmlText);
      if (items.length === 0) throw new Error("No news items found");
      // Randomly pick up to 10 items
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setNewsItems(shuffled.slice(0, 10));
      setActiveIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    // refresh feed every 10 minutes
    const interval = setInterval(fetchFeed, 600000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  // auto-rotate
  useEffect(() => {
    if (paused || newsItems.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsItems.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, newsItems.length]);

  const goPrev = () =>
    setActiveIndex((p) => (p - 1 + newsItems.length) % newsItems.length);
  const goNext = () =>
    setActiveIndex((p) => (p + 1) % newsItems.length);

  const current = newsItems[activeIndex];

  /* ---------- News ticker content (shared between inline & modal) ---------- */
  const renderTickerContent = () => (
    <div
      className="rss-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card header */}
      <div className="rss-card-header">
        <div className="rss-card-badge">
          <i className="fas fa-rss"></i>
        </div>
        <span className="rss-card-label">News</span>
        <span className="rss-card-live"></span>
        <div className="rss-card-nav">
          <span className="rss-card-counter">
            {newsItems.length > 0 ? `${activeIndex + 1}/${newsItems.length}` : ""}
          </span>
          {newsItems.length > 1 && (
            <>
              <button className="rss-card-btn" onClick={goPrev}><i className="fas fa-chevron-left"></i></button>
              <button className="rss-card-btn" onClick={goNext}><i className="fas fa-chevron-right"></i></button>
            </>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="rss-card-body">
        {loading && <div className="rss-card-skeleton" />}

        {error && (
          <div className="rss-card-error">
            <i className="fas fa-exclamation-circle"></i> {error}
            <button onClick={fetchFeed} className="rss-card-retry">Retry</button>
          </div>
        )}

        {!loading && !error && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <a
                href={current.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rss-card-title"
              >
                {current.title}
              </a>
              <div className="rss-card-meta">
                {current.source && (
                  <span className="rss-card-source">{current.source}</span>
                )}
                {current.pubDate && (
                  <span className="rss-card-time">
                    <i className="far fa-clock"></i> {timeAgo(current.pubDate)}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Progress */}
      {!paused && newsItems.length > 1 && (
        <div className="rss-card-progress" key={`prog-${activeIndex}`} />
      )}
    </div>
  );

  /* ---------- Collapsed: show icon only ---------- */
  if (collapsed) {
    return (
      <>
        <button
          className="rss-collapsed-icon-btn"
          title="News"
          onClick={() => setCollapsed && setCollapsed(false)}
          type="button"
        >
          <span className="sidebar-nav-icon"><FaRss /></span>
        </button>

        <style>{`${collapsedStyles}${cardStyles}`}</style>
      </>
    );
  }

  /* ---------- Expanded: inline render ---------- */
  return (
    <>
      {renderTickerContent()}
      <style>{cardStyles}</style>
    </>
  );
};

/* ---- Shared CSS strings ---- */
const collapsedStyles = `
  .rss-collapsed-icon-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    border-radius: 14px;
    color: #ADB5BD;
    text-decoration: none;
    border: 1px solid transparent;
    background: transparent;
    transition: all 0.24s ease;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }
  .rss-collapsed-icon-btn:hover {
    background: rgba(13, 124, 102, 0.12);
    color: #0D7C66;
    border-color: rgba(13, 124, 102, 0.18);
  }
  .rss-collapsed-icon-btn .sidebar-nav-icon {
    width: 20px;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
`;

const cardStyles = `
  /* 10% Accent zone — Forest Emerald / Teal card */
  .rss-card {
    background: linear-gradient(145deg, rgba(13, 124, 102, 0.10) 0%, rgba(23, 162, 184, 0.08) 50%, rgba(44, 62, 80, 0.15) 100%);
    border: 1px solid rgba(13, 124, 102, 0.18);
    border-radius: 16px;
    padding: 14px;
    margin-top: 16px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.15), inset 0 1px 0 rgba(13, 124, 102, 0.08);
    transition: border-color 0.24s ease, box-shadow 0.24s ease;
  }
  .rss-card:hover {
    border-color: rgba(13, 124, 102, 0.30);
    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.20), inset 0 1px 0 rgba(13, 124, 102, 0.12);
  }
  .rss-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  /* Badge — Forest Emerald primary */
  .rss-card-badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0D7C66, #0B6B57);
    color: #FFFFFF;
    font-size: 11px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(13, 124, 102, 0.30);
  }
  .rss-card-label {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6C757D;
  }
  /* Semantic — Warm Amber live dot */
  .rss-card-live {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FF8C00;
    animation: rss-card-pulse 1.4s infinite;
    box-shadow: 0 0 6px rgba(255, 140, 0, 0.5);
  }
  @keyframes rss-card-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.6); }
  }
  .rss-card-nav {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .rss-card-counter {
    font-size: 10px;
    font-weight: 600;
    color: #6C757D;
    font-variant-numeric: tabular-nums;
    margin-right: 2px;
  }
  .rss-card-btn {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid rgba(13, 124, 102, 0.15);
    background: transparent;
    color: #ADB5BD;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 9px;
    padding: 0;
  }
  /* Hover — Forest Emerald accent */
  .rss-card-btn:hover {
    background: rgba(13, 124, 102, 0.15);
    color: #0D7C66;
    border-color: rgba(13, 124, 102, 0.30);
  }
  .rss-card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .rss-card-title {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14.5px;
    font-weight: 700;
    line-height: 1.6;
    color: #F8F9FA;
    text-decoration: none;
    transition: color 0.2s;
    margin-bottom: 12px;
  }
  /* Hover — Forest Emerald #0D7C66 */
  .rss-card-title:hover {
    color: #0D7C66;
  }
  .rss-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  /* Source — Sophisticated Teal #17A2B8 */
  .rss-card-source {
    font-size: 11px;
    font-weight: 700;
    color: #17A2B8;
    background: rgba(23, 162, 184, 0.12);
    padding: 3px 9px;
    border-radius: 5px;
  }
  .rss-card-time {
    font-size: 11px;
    color: #6C757D;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  /* Progress — Forest Emerald gradient */
  .rss-card-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #0D7C66, #17A2B8);
    border-radius: 0 0 16px 16px;
    animation: rss-card-prog ${ROTATE_INTERVAL}ms linear;
  }
  @keyframes rss-card-prog {
    from { width: 0%; }
    to { width: 100%; }
  }
  .rss-card-error {
    font-size: 11px;
    color: #ADB5BD;
    text-align: center;
    padding: 6px 0;
  }
  /* Retry — Forest Emerald CTA */
  .rss-card-retry {
    background: none;
    border: none;
    color: #0D7C66;
    cursor: pointer;
    font-weight: 600;
    font-size: 11px;
    margin-left: 4px;
    transition: color 0.2s;
  }
  .rss-card-retry:hover {
    color: #0B6B57;
  }
  .rss-card-skeleton {
    width: 80%;
    height: 12px;
    border-radius: 6px;
    background: rgba(44, 62, 80, 0.40);
    animation: rss-card-shimmer 1.2s ease-in-out infinite;
  }
  @keyframes rss-card-shimmer {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

export default RSSNewsTicker;
