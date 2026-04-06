import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import FooterPages from "../Footer/FooterPages";
import { useSelector } from "react-redux";
import ChatBot from "./ChatBot/ChatBot";

const IndexPage = ({ theme = "light", toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { salesData, loading } = useSelector((state) => state.dashboard || {});
  const brandName = salesData?.brand || "Brand";
  const currentFY = salesData?.current_fy || "Current FY";
  const previousFY = salesData?.previous_fy || "Previous FY";
  const dataTillMonth = salesData?.data_present_till;


  const quickLinks = [
    {
      label: "Model Performance",
      to: "/dashboard/modelperformance",
      icon: "fas fa-chart-line",
    },
    {
      label: "Brand Analysis",
      to: "/dashboard/brandanalysis",
      icon: "fas fa-industry",
    },
    {
      label: "Market Analysis",
      to: "/dashboard/marketanalysis",
      icon: "fas fa-store",
    },
    {
      label: "Simulation",
      to: "/dashboard/simulator",
      icon: "fas fa-flask",
    },
    {
      label: "Optimization",
      to: "/dashboard/optimizer",
      icon: "fas fa-bullseye",
    },
  ];

  return (
    <>
      <div className={`dashboard-layout d-flex dashboard-container ${theme}-theme`}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme}
        />

        <div className="main-container flex-grow-1 d-flex flex-column">

          {/* Quick Navigation Bar */}
          {
            <div className={`quick-links-strip ${loading ? "disabled-links" : ""}`}>
              <div className="quick-links-inner">
                <div className="d-flex px-2 gap-3" style={{width:'80%', paddingLeft: '16px'}}>
                  {quickLinks.map((item) => (
                    <NavLink
                      key={item.label}
                      to={loading ? "#" : item.to}
                      onClick={(e) => loading && e.preventDefault()}
                      className={({ isActive }) =>
                        `quick-link-chip 
                      ${isActive ? "active-quick-link" : ""} 
                      ${loading ? "link-disabled" : ""}`
                      }
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme} type="button">
                  <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
                  <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
                </button>
              </div>
            </div>
          }

          <div className="topbar-info">
            <div className="topbar-inner">
              <div className="topbar-left">
                {/* <div className="topbar-tag">Executive Dashboard</div> */}

                <h2 className="topbar-title">
                  {loading ? "Preparing Dashboard..." : `Brand Cockpit - ${brandName}`}
                </h2>

                <p className="topbar-subtitle mb-0">
                  {loading
                    ? "Fetching dashboard insights and preparing visualizations"
                    : "Track yearly performance, regional insights, media efficiency and contribution trends"}
                </p>
              </div>

              <div className="topbar-right">
                {!loading && (
                  <div className="topbar-meta">
                    <span className="meta-pill warning-pill">
                      <i className="fas fa-calendar-alt"></i>
                      Previous FY : {previousFY}
                    </span>

                    <span className="meta-pill success-pill">
                      <i className="fas fa-chart-line"></i>
                      Current FY : {currentFY}
                    </span>

                    {dataTillMonth && (
                      <span className="meta-pill neutral-pill">
                        <i className="fas fa-clock"></i>
                        Data Till : {dataTillMonth}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="content-area flex-grow-1">
            <Outlet context={{ theme }} />
          </div>

          <FooterPages />
        </div>
      </div>

      <ChatBot theme={theme} />

      <style>{`
  .dashboard-layout {
    min-height: 100vh;
    transition: background 0.25s ease, color 0.25s ease;
  }

  /* ===== LIGHT THEME — 60-30-10 Rule ===== */
  /* 60% Foundation: White #FFFFFF, Light Gray #F8F9FA */
  /* 30% Structural: Deep Slate #2C3E50, Soft Gray #E5E7EB */
  /* 10% Accent: Forest Emerald #0D7C66 */
  .light-theme {
    --bg-main: #F8F9FA;
    --bg-soft: #FFFFFF;
    --bg-topbar: rgba(255, 255, 255, 0.85);
    --text-main: #2C3E50;
    --text-muted: #6C757D;
    --border-soft: #E5E7EB;
    --shadow-soft: 0 4px 24px rgba(44, 62, 80, 0.06);
    --header-grad: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 60%, #E8F5E8 100%);
    --pill-bg: #FFFFFF;
    --accent: #0D7C66;
    --accent-hover: #0A6B57;
    --accent-light: #E8F5E8;
    --teal: #17A2B8;
    --teal-light: #E6F7FF;

    /* quick links panel */
    --quickbar-panel: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 249, 250, 0.98) 100%);
    --quickbar-border: #E5E7EB;
    --quickbar-shadow: 0 4px 20px rgba(44, 62, 80, 0.06);

    /* quick links chip */
    --quickbar-chip: #FFFFFF;
    --quickbar-chip-text: #2C3E50;
    --quickbar-chip-hover: #FFFFFF;
    --quickbar-active-bg: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
    --quickbar-active-text: #FFFFFF;
  }

  /* ===== DARK THEME — Deep Slate Foundation ===== */
  /* 60% Foundation: Deep Slate #1A252F, #2C3E50 */
  /* 30% Structural: Slate surfaces #34495E, borders #4A6274 */
  /* 10% Accent: Forest Emerald #0D7C66, Teal #17A2B8 */
  .dark-theme {
    --bg-main: #1A252F;
    --bg-soft: #2C3E50;
    --bg-topbar: rgba(26, 37, 47, 0.92);
    --text-main: #F8F9FA;
    --text-muted: #ADB5BD;
    --border-soft: #4A6274;
    --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.3);
    --header-grad: linear-gradient(135deg, #2C3E50 0%, #263545 60%, #1E3A34 100%);
    --pill-bg: #34495E;
    --accent: #0D7C66;
    --accent-hover: #0A6B57;
    --accent-light: rgba(13, 124, 102, 0.15);
    --teal: #17A2B8;
    --teal-light: rgba(23, 162, 184, 0.12);

    /* quick links panel */
    --quickbar-panel: linear-gradient(180deg, rgba(44, 62, 80, 0.95) 0%, rgba(26, 37, 47, 0.97) 100%);
    --quickbar-border: #4A6274;
    --quickbar-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

    /* quick links chip */
    --quickbar-chip: #34495E;
    --quickbar-chip-text: #E5E7EB;
    --quickbar-chip-hover: #3D566E;
    --quickbar-active-bg: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
    --quickbar-active-text: #FFFFFF;
  }

  .main-container {
    min-width: 0;
    background: var(--bg-main);
    color: var(--text-main);
    transition: background 0.25s ease, color 0.25s ease;
  }

  /* QUICK LINKS STRIP */
  .quick-links-strip {
    position: sticky;
    top: 0;
    z-index: 11;
    padding: 16px 24px 8px;
    background: transparent;
  }

  .quick-links-inner {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content:space-between;
    padding: 12px 16px;
    border-radius: 16px;
    background: var(--quickbar-panel);
    border: 1px solid var(--quickbar-border);
    box-shadow: var(--quickbar-shadow);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* BASE CHIP */
  .quick-link-chip {
  width:fit-content !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 0 0 auto;
    padding: 12px 16px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    background: var(--quickbar-chip);
    color: var(--quickbar-chip-text);
    border: 1px solid rgba(148, 163, 184, 0.18);
    transition: all 0.25s ease;
  }

  /* ICON */
  .quick-link-chip i {
    font-size: 13px;
    opacity: 0.85;
  }

  /* HOVER */
  .quick-link-chip:hover {
    transform: translateY(-2px);
    background: var(--accent);
    color: #FFFFFF;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(13, 124, 102, 0.25);
  }

  /* ACTIVE */
  .active-quick-link {
    background: var(--quickbar-active-bg) !important;
    color: var(--quickbar-active-text) !important;
    border-color: transparent !important;
  }

  .active-quick-link i {
    opacity: 1;
  }

  /* DARK MODE CHIP POLISH */
  .dark-theme .quick-link-chip {
    border: 1px solid rgba(255,255,255,0.08);
  }

  .dark-theme .quick-link-chip:hover {
    background: var(--accent);
    color: #FFFFFF;
    border-color: transparent;
    box-shadow: 0 4px 16px rgba(13, 124, 102, 0.3);
  }

  /* DISABLED STATE */
  .link-disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    filter: grayscale(0.15);
  }

  .disabled-links .quick-links-inner {
    opacity: 0.82;
  }

  .topbar-info {
    position: sticky;
    top: 84px;
    z-index: 10;
    padding: 16px 24px;
    background: var(--bg-topbar);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }

  .topbar-inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 1.25rem 1.5rem;
    border-radius: 16px;
    background: var(--header-grad);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-soft);
  }

  .topbar-left {
    min-width: 0;
  }

  .topbar-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .topbar-tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--accent-light);
    color: var(--accent);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .dark-theme .topbar-tag {
    background: var(--accent-light);
    color: #FFC107;
  }

  .topbar-title {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 24px;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 6px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .topbar-subtitle {
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
    max-width: 720px;
  }

  .topbar-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    border: 1px solid var(--border-soft);
    background: var(--pill-bg);
    color: var(--text-main);
    white-space: nowrap;
    box-shadow: var(--shadow-soft);
  }

  .warning-pill {
    background: #FFF4E6;
    color: #FF8C00;
    border-color: rgba(255, 140, 0, 0.25);
  }

  .dark-theme .warning-pill {
    background: rgba(255, 140, 0, 0.12);
    color: #FFC107;
    border-color: rgba(255, 193, 7, 0.2);
  }

  .success-pill {
    background: #E8F5E8;
    color: #0D7C66;
    border-color: rgba(13, 124, 102, 0.2);
  }

  .dark-theme .success-pill {
    background: rgba(13, 124, 102, 0.12);
    color: #FFC107;
    border-color: rgba(13, 124, 102, 0.25);
  }

  .neutral-pill {
    background: var(--pill-bg);
    color: var(--text-muted);
    border-color: var(--border-soft);
  }

  .dark-theme .neutral-pill {
    background: #34495E;
    color: #ADB5BD;
  }

  .theme-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--border-soft);
    background: var(--pill-bg);
    color: var(--text-main);
    padding: 8px 12px;
    border-radius: 8px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;

    /* smooth animation */
    transition: all 0.2s ease;

    /* base subtle shadow */
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }

  .theme-toggle-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 6px 16px rgba(0,0,0,0.12),
      0 0 8px rgba(13, 124, 102, 0.25);
    border-color: rgba(13, 124, 102, 0.5);
  }

  .theme-toggle-btn:active {
    transform: translateY(1px) scale(0.98);

    /* pressed feel */
    box-shadow: 
      inset 0 3px 6px rgba(0,0,0,0.15),
      0 1px 2px rgba(0,0,0,0.05);
  }

  .content-area {
    padding: 24px;
    background: var(--bg-main);
    color: var(--text-main);
  }

  @media (max-width: 1200px) {
    .topbar-inner {
      flex-direction: column;
      align-items: flex-start;
    }

    .topbar-right {
      width: 100%;
      align-items: flex-start;
    }

    .topbar-meta {
      justify-content: flex-start;
    }
  }

  @media (max-width: 768px) {
    .quick-links-strip {
      padding: 12px 14px 8px;
    }

    .quick-links-inner {
      padding: 12px;
      border-radius: 16px;
    }

    .topbar-info {
      top: 86px;
      padding: 14px;
    }

    .topbar-inner {
      padding: 1rem;
      border-radius: 16px;
    }

    .topbar-title {
      font-size: 1.35rem;
    }

    .topbar-subtitle {
      font-size: 12px;
    }

    .content-area {
      padding: 14px;
    }

    .meta-pill,
    .theme-toggle-btn {
      width: 100%;
      justify-content: flex-start;
    }

    .quick-link-chip {
      width: 100%;
      justify-content: flex-start;
    }
  }
`}</style>
    </>
  );
};

export default IndexPage;