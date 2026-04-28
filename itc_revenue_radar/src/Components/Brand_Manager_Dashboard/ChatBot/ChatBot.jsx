import React, { useState, useRef, useEffect, useCallback } from "react";
import { BsRobot } from "react-icons/bs";
import "./ChatBot.css";

const AiIcon = ({ size = 28, className = "" }) => (
  <BsRobot className={`ai-svg-icon ${className}`} size={size} />
);

// ─── Prompts from Try Asking (for keyword matching + recommendations) ───
const ALL_PROMPTS = [
  "How is OODLES performing in NORTH?",
  "Which brand has the highest revenue in WEST?",
  "Show me market share for all brands",
  "What is the best ROI channel for CHERY BRIGHT?",
  "Show Digital channel performance across brands",
  "How much budget goes to Trade Promo vs OOH?",
  "Compare base vs optimized scenario for CHERY BRIGHT",
  "What is the model accuracy for BAD BANGLES?",
  "TV spend and GRPs for OODLES",
  "Show quarterly sales trends for Q3 FY25",
];

// ─── Knowledge base ───
const CHAT_KNOWLEDGE = [
  {
    keywords: [["oodles", "performing", "north"], ["oodles", "performance", "north"], ["oodles", "north"]],
    response: "**OODLES — NORTH Performance (FY25):**\n\n• **Sales:** 1,401.8 MT\n• **Revenue:** ₹10,406.7 Lakhs\n• **Growth:** +20.2% YoY\n• **Market Share:** 36.0% (highest across all brands)\n\n**Quarterly Breakdown:**\n• Q1: 312.7 MT (₹2,321.2L) — +18.6%\n• Q2: 341.5 MT (₹2,534.8L) — +21.3%\n• Q3: 389.2 MT (₹2,889.5L) — +24.1% ← Peak\n• Q4: 358.4 MT (₹2,661.2L) — +16.8%\n\n💡 OODLES is the #1 brand in NORTH by market share.",
    relatedPrompts: [1, 8, 2],
  },
  {
    keywords: [["highest", "revenue", "west"], ["brand", "revenue", "west"], ["revenue", "west"]],
    response: "**Highest Revenue in WEST (FY25):**\n\n• **CHERY BRIGHT** — ₹13,184.4 Lakhs (1,098.7 MT) ← Highest Revenue\n• **MILD URGENCY** — ₹7,650.0 Lakhs (850.0 MT)\n• **OODLES** — ₹6,635.4 Lakhs (894.1 MT)\n• **BAD BANGLES** — ₹4,915.8 Lakhs (546.2 MT)\n\n💡 **CHERY BRIGHT** leads WEST in revenue — nearly 2x OODLES, despite lower volume. Higher price per MT drives the gap.",
    relatedPrompts: [0, 2, 5],
  },
  {
    keywords: [["market", "share"]],
    response: "**Market Share highlights (FY25):**\n\n• **OODLES** — NORTH: 36.0%, EAST: 29.7%, WEST: 23.4%, SOUTH: 21.8%\n• **CHERY BRIGHT** — NORTH: 32.8%, WEST: 28.2%, EAST: 20.7%, SOUTH: 19.5%\n• **MILD URGENCY** — NORTH: 33.5%, EAST: 27.1%, WEST: 25.0%, SOUTH: 22.6%\n• **BAD BANGLES** — NORTH: 22.1%, EAST: 16.6%, WEST: 13.6%, SOUTH: 11.9%\n\nOODLES leads in NORTH with 36.0% market share.",
    relatedPrompts: [0, 1, 4],
  },
  {
    keywords: [["best roi", "chery bright"], ["roi channel", "chery bright"], ["roi", "chery bright"], ["best channel", "chery bright"]],
    response: "**Best ROI Channels for CHERY BRIGHT:**\n\n• **Digital** — 4.8x ROI (NORTH), 4.5x (WEST), 4.2x (EAST) ← Best Channel\n• **TV** — 3.6x ROI (NORTH), 3.4x (WEST), 3.1x (EAST)\n• **Consumer Promo** — 2.4x (NORTH), 2.3x (EAST), 2.1x (WEST)\n• **Trade Promo** — 1.7x (NORTH), 1.6x (EAST), 1.5x (WEST)\n• **OOH** — 1.3x (NORTH), 1.2x (WEST), 1.1x (EAST)\n\n💡 Digital delivers 4.8x ROI in NORTH — invest more here. OOH at 1.1x is barely breaking even.",
    relatedPrompts: [4, 5, 6],
  },
  {
    keywords: [["digital", "channel", "performance"], ["digital", "performance", "brands"], ["digital", "channel", "brands"], ["digital", "performance"]],
    response: "**Digital Channel Performance:**\n\n• **CHERY BRIGHT** NORTH — 4.8x ROI, 28.4% contribution, ₹420L spend (best performer)\n• **CHERY BRIGHT** WEST — 4.5x ROI, 26.8% contribution, ₹380L spend\n• **OODLES** NORTH — 3.8x ROI, 22.1% contribution, ₹240L spend\n• **BAD BANGLES** NORTH — 3.3x ROI, 21.8% contribution, ₹195L spend\n\n💡 Optimization recommends **+22–30% increase** in Digital spend.",
    relatedPrompts: [3, 5, 2],
  },
  {
    keywords: [["trade promo", "ooh"], ["budget", "trade promo"], ["trade promo", "budget"], ["trade promo", "vs"]],
    response: "**Trade Promo vs OOH — Budget Comparison:**\n\n**Trade Promo:**\n• Spend: ₹240 – 410 Lakhs per brand-market\n• ROI: 1.1x – 1.7x\n• Contribution: 11 – 18% of sales\n• Largest: OODLES NORTH ₹410L (1.6x ROI)\n\n**OOH (Out-of-Home):**\n• Spend: ₹55 – 110 Lakhs per brand-market\n• ROI: 0.9x – 1.5x\n• Contribution: 2 – 6% of sales\n• Largest: OODLES WEST ₹110L (1.5x ROI)\n\n**Trade Promo gets 3–5x more budget than OOH** but both have below-average ROI.\n\n💡 Optimization recommends: Trade Promo ↓10–40%, OOH ↓32–88% — shift to Digital & TV.",
    relatedPrompts: [3, 4, 6],
  },
  {
    keywords: [["base", "optimized", "chery bright"], ["scenario", "chery bright"], ["compare", "scenario", "chery bright"], ["optimized", "chery bright"], ["base", "optimized", "scenario"], ["compare", "base", "optimized"]],
    response: "**CHERY BRIGHT — Base vs Optimized Scenario:**\n\n**NORTH (Budget ₹1,630L):**\n• Base: 1,288.4 MT → Optimized: 1,417.2 MT → **+10.0% uplift**\n• Digital ₹420→546L (+30%), TV ₹680→748L (+10%)\n• Trade Promo ₹250→150L (-40%), OOH ₹85→10.5L (-88%)\n\n**WEST (Budget ₹1,555L):**\n• Base: 1,098.7 MT → Optimized: 1,207.6 MT → **+9.9% uplift**\n• Digital ₹380→494L (+30%), TV ₹610→671L (+10%)\n• Trade Promo ₹270→175L (-35%), OOH ₹75→17L (-77%)\n\n**EAST (Budget ₹1,315L):**\n• Base: 803.5 MT → Optimized: 876.2 MT → **+9.1% uplift**\n\n💡 CHERY BRIGHT has the highest optimization uplift across all brands.",
    relatedPrompts: [3, 7, 5],
  },
  {
    keywords: [["model", "accuracy", "bad bangles"], ["accuracy", "bad bangles"], ["model", "bad bangles"]],
    response: "**BAD BANGLES — Model Accuracy:**\n\n• **NORTH** — MAPE: 10.8%, R²: 0.90, Accuracy: 89.2%\n• **EAST** — MAPE: 11.3%, R²: 0.89, Accuracy: 88.7%\n• **WEST** — MAPE: 12.1%, R²: 0.87, Accuracy: 87.9%\n\n**Compared to other brands:**\n• CHERY BRIGHT: 92.5–93.1% accuracy (best)\n• OODLES: 90.6–92.2% accuracy\n• MILD URGENCY: 91.0–91.9% accuracy\n• BAD BANGLES: 87.9–89.2% accuracy (needs improvement)\n\nBuilt on 144 weekly observations (Apr 2022 – Dec 2024).\n\n💡 BAD BANGLES models are maturing — MAPE above 10% suggests room for improvement with more data or feature tuning.",
    relatedPrompts: [6, 3, 0],
  },
  {
    keywords: [["tv", "spend", "oodles"], ["tv", "grp", "oodles"], ["grp", "oodles"], ["tv spend", "grp"]],
    response: "**OODLES — TV Spend & GRPs:**\n\n• **NORTH** — 2,100 GRPs, ₹520L spend, 3.1x ROI, 34.2% contribution\n• **EAST** — 1,850 GRPs, ₹450L spend, 2.8x ROI, 32.5% contribution\n• **WEST** — 1,620 GRPs, ₹380L spend, 2.5x ROI, 29.8% contribution\n\n**Total TV investment:** ₹1,350 Lakhs across 3 markets\n**Total GRPs:** 5,570\n\n💡 NORTH has highest GRPs (2,100) and best TV ROI (3.1x). Optimization suggests increasing TV by 10–15%.",
    relatedPrompts: [0, 4, 9],
  },
  {
    keywords: [["quarterly", "sales", "trends"], ["quarterly", "trends"], ["sales", "trends"], ["quarterly", "sales"]],
    response: "**Quarterly trends (FY25):**\n\n• **Q3 FY25** is consistently the strongest quarter — OODLES NORTH peaks at 389.2 MT (+24.1%), CHERY BRIGHT at 352.8 MT (+22.9%)\n• **Q2 FY25** shows solid mid-year momentum\n• **Q4 FY25** sees a slight dip from Q3 peaks\n• **Q1 FY25** is the baseline quarter with lowest volumes\n\nPeriods available: Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, FY25.",
    relatedPrompts: [0, 1, 8],
  },
];

// ─── localStorage helpers ───
const CHAT_STORAGE_KEY = "revenue_chat_sessions";

const loadSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveSessions = (sessions) => {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
};

const POPUP_TRANSFER_KEY = "revenue_chat_popup_transfer";

const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const renderText = (text) => {
  return text.split("\n").map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={pi}>{part.slice(2, -2)}</strong>;
      return part;
    });
    return (<React.Fragment key={li}>{li > 0 && <br />}{rendered}</React.Fragment>);
  });
};

const getRandomPrompts = (count, excludeIndices = []) => {
  const available = ALL_PROMPTS.map((p, i) => ({ prompt: p, index: i })).filter(
    (item) => !excludeIndices.includes(item.index)
  );
  return available
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((item) => item.prompt);
};

const generateBotReply = (input) => {
  const lower = input.toLowerCase();

  if (/\b(hello|hi|hey)\b/.test(lower)) {
    return {
      text: "Hello! 😊 I'm your **Revenue Radar Assistant**. I can help with brand performance, media ROI, model accuracy, and optimization insights across MILD URGENCY, CHERY BRIGHT, OODLES & BAD BANGLES in EAST, WEST, NORTH & SOUTH.",
      recommendations: getRandomPrompts(3),
    };
  }
  if (/\bthank/.test(lower)) {
    return {
      text: "You're welcome! Feel free to ask more about brand performance, media mix, or optimization. 😊",
      recommendations: [],
    };
  }

  for (let i = 0; i < CHAT_KNOWLEDGE.length; i++) {
    const entry = CHAT_KNOWLEDGE[i];
    const matched = entry.keywords.some((group) =>
      group.every((word) => lower.includes(word.toLowerCase()))
    );
    if (matched) {
      return {
        text: entry.response,
        recommendations: entry.relatedPrompts.map((idx) => ALL_PROMPTS[idx]),
      };
    }
  }

  return {
    text: "Training in progress. I may not answer that yet—please try again later.",
    recommendations: getRandomPrompts(3),
  };
};

// ─── Inline Chat Popup ───
const ChatPopup = ({ theme, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatIdRef = useRef(`chat_${Date.now()}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const id = chatIdRef.current;
    const sessions = loadSessions();
    const existing = sessions.find((s) => s.id === id);
    let updated;
    if (existing) {
      updated = sessions.map((s) => s.id === id ? { ...s, messages, updatedAt: Date.now() } : s);
    } else {
      const firstUserMsg = messages.find((m) => m.from === "user");
      const rawText = firstUserMsg ? firstUserMsg.text : "New Chat";
      const stopWords = new Set(["is","the","a","an","in","for","of","to","and","or","how","what","which","show","me","has","vs","does","do","can","all","across","much","goes"]);
      const keywords = rawText.split(/\s+/).filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1);
      const title = keywords.length > 0 ? keywords.slice(0, 5).join(" ") : rawText.slice(0, 30);
      updated = [{ id, title, messages, createdAt: Date.now(), updatedAt: Date.now() }, ...sessions];
    }
    saveSessions(updated);
  }, [messages]);

  const handleInputChange = (val) => {
    setInputValue(val);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    const lower = val.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);
    const matched = ALL_PROMPTS.filter((p) => words.every((w) => p.toLowerCase().includes(w)));
    setSuggestions(matched.slice(0, 5));
  };

  const pickSuggestion = (text) => { setSuggestions([]); handleSend(text); };

  const handleSend = (text) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: "user", text: msg, time: new Date() }]);
    setInputValue("");
    setSuggestions([]);
    setIsTyping(true);
    setTimeout(() => {
      const result = generateBotReply(msg);
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: result.text, recommendations: result.recommendations, time: new Date() }]);
    }, 800 + Math.random() * 400);
  };

  const overlayRef = useRef(null);
  const [maximizing, setMaximizing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedChats, setSavedChats] = useState([]);

  const refreshSavedChats = () => setSavedChats(loadSessions().filter((s) => s.id !== chatIdRef.current));

  const handleHistoryToggle = () => {
    if (!historyOpen) refreshSavedChats();
    setHistoryOpen((prev) => !prev);
  };

  const loadSavedChat = (session) => {
    chatIdRef.current = session.id;
    setMessages(session.messages.map((m) => ({ ...m, time: new Date(m.time) })));
    setHistoryOpen(false);
  };

  const deleteSavedChat = (id) => {
    const sessions = loadSessions().filter((s) => s.id !== id);
    saveSessions(sessions);
    setSavedChats(sessions.filter((s) => s.id !== chatIdRef.current));
    if (chatIdRef.current === id) { chatIdRef.current = `chat_${Date.now()}`; setMessages([]); }
  };

  const handleNewChat = () => {
    chatIdRef.current = `chat_${Date.now()}`;
    setMessages([]);
    setSuggestions([]);
    setHistoryOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleMaximize = () => {
    if (messages.length > 0) localStorage.setItem(POPUP_TRANSFER_KEY, JSON.stringify(messages));
    setMaximizing(true);
    setTimeout(() => { window.open("/chatbot", "_blank"); setMaximizing(false); onClose(); }, 450);
  };

  return (
    <div ref={overlayRef} className={`chatbot-popup-overlay ${theme}-theme${maximizing ? " popup-maximizing" : ""}`}>
      <div className={`chatbot-popup ${theme}-theme`}>
        <div className="chatbot-popup-header">
          <span className="chatbot-popup-title"><AiIcon size={22} /> Revenue Chat</span>
          <div className="chatbot-popup-header-actions">
            <button className="chatbot-popup-history-btn" onClick={handleHistoryToggle} title="Saved chats"><i className="fas fa-history"></i></button>
            <button className="chatbot-popup-newchat-btn" onClick={handleNewChat} title="New chat"><i className="fas fa-plus"></i></button>
            <button className="chatbot-popup-maximize-btn" onClick={handleMaximize} disabled={maximizing} title="Open full page"><i className="fas fa-expand"></i></button>
            <button className="chatbot-popup-close-btn" onClick={onClose} title="Close"><i className="fas fa-times"></i></button>
          </div>
        </div>

        {historyOpen && (
          <div className="chatbot-popup-history">
            <div className="popup-history-header"><i className="fas fa-clock-rotate-left"></i> Recent Chats</div>
            <div className="popup-history-list">
              {savedChats.length === 0 ? (
                <div className="popup-history-empty"><i className="far fa-comment-dots popup-history-empty-icon"></i>No saved chats yet</div>
              ) : (
                savedChats.map((session) => (
                  <div key={session.id} className="popup-history-item" onClick={() => loadSavedChat(session)}>
                    <i className="far fa-comment popup-history-item-icon"></i>
                    <span className="popup-history-title">{session.title}</span>
                    <button className="popup-history-delete" onClick={(e) => { e.stopPropagation(); deleteSavedChat(session.id); }} title="Delete"><i className="fas fa-trash-alt"></i></button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="chatbot-popup-body">
          {messages.length === 0 ? (
            <div className="chatbot-popup-empty">
              <AiIcon size={40} className="popup-empty-icon" />
              <p>Ask me anything about your Revenue!</p>
            </div>
          ) : (
            <div className="chatbot-popup-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chatbot-msg ${msg.from === "bot" ? "msg-bot" : "msg-user"}`}>
                  {msg.from === "bot" && <div className="msg-avatar"><AiIcon size={18} /></div>}
                  <div className="msg-content">
                    <div className="msg-bubble">{msg.from === "bot" ? renderText(msg.text) : msg.text}</div>
                    {msg.from === "bot" && msg.recommendations?.length > 0 && (
                      <div className="msg-recommendations">
                        {msg.recommendations.map((rec, ri) => (
                          <button key={ri} className="msg-rec-btn" onClick={() => handleSend(rec)}>→ {rec}</button>
                        ))}
                      </div>
                    )}
                    <span className="msg-time">{formatTime(msg.time)}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-msg msg-bot">
                  <div className="msg-avatar"><AiIcon size={18} /></div>
                  <div className="msg-content"><div className="msg-bubble typing-bubble"><div className="typing-dots"><span></span><span></span><span></span></div></div></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chatbot-popup-input-wrapper">
          {suggestions.length > 0 && (
            <div className="chatbot-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="chatbot-suggestion-btn" onClick={() => pickSuggestion(s)}>
                  <i className="fas fa-search suggestion-icon"></i>{s}
                </button>
              ))}
            </div>
          )}
          <div className="chatbot-popup-input-area">
            <input ref={inputRef} type="text" className="chatbot-popup-input" placeholder="Ask about your marketing data..." value={inputValue} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} disabled={isTyping} />
            <button className="chatbot-popup-send-btn" onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Floating Button + Popup wrapper (default export) ───
const ChatBot = ({ theme }) => {
  const btnRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const onDown = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = el.getBoundingClientRect();
      offset.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      dragging.current = true;
      hasMoved.current = false;
      el.style.transition = "none";
      el.style.animation = "none";
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      hasMoved.current = true;
      const touch = e.touches ? e.touches[0] : e;
      el.style.left = `${touch.clientX - offset.current.x}px`;
      el.style.top = `${touch.clientY - offset.current.y}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";
    };
    const onUp = () => { dragging.current = false; el.style.transition = ""; el.style.animation = ""; };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handleClick = () => { if (!hasMoved.current) setPopupOpen((prev) => !prev); };

  return (
    <>
      <div ref={btnRef} className={`chatbot-nav-wrapper ${theme}-theme`} onClick={handleClick} title="✨ Ask me anything about your Revenue!">
        <button className={`chatbot-nav-btn ${theme}-theme`}>
          <span className="chatbot-nav-icon" role="img" aria-label="AI bot"><AiIcon size={38} /></span>
        </button>
      </div>
      {popupOpen && <ChatPopup theme={theme} onClose={() => setPopupOpen(false)} />}
    </>
  );
};

// ─── Full-page ChatBot Page (named export) ───
export const ChatBotPage = ({ theme: themeProp }) => {
  const theme = themeProp || "light";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [chatSessions, setChatSessions] = useState(loadSessions);
  const [currentChatId, setCurrentChatId] = useState(() => `chat_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const skipSaveRef = useRef(false);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  useEffect(() => {
    try {
      const transferred = localStorage.getItem(POPUP_TRANSFER_KEY);
      if (transferred) {
        const parsed = JSON.parse(transferred);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed.map((m) => ({ ...m, time: new Date(m.time) })));
        localStorage.removeItem(POPUP_TRANSFER_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (skipSaveRef.current) { skipSaveRef.current = false; return; }
    if (messages.length === 0) return;
    setChatSessions((prev) => {
      const existing = prev.find((s) => s.id === currentChatId);
      let updated;
      if (existing) {
        updated = prev.map((s) => s.id === currentChatId ? { ...s, messages, updatedAt: Date.now() } : s);
      } else {
        const firstUserMsg = messages.find((m) => m.from === "user");
        const rawText = firstUserMsg ? firstUserMsg.text : "New Chat";
        const stopWords = new Set(["is","the","a","an","in","for","of","to","and","or","how","what","which","show","me","has","vs","does","do","can","all","across","much","goes"]);
        const keywords = rawText.split(/\s+/).filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1);
        const title = keywords.length > 0 ? keywords.slice(0, 5).join(" ") : rawText.slice(0, 30);
        updated = [{ id: currentChatId, title, messages, createdAt: Date.now(), updatedAt: Date.now() }, ...prev];
      }
      saveSessions(updated);
      return updated;
    });
  }, [messages, currentChatId]);

  const handleNewChat = () => { setMessages([]); setCurrentChatId(`chat_${Date.now()}`); setSuggestions([]); setTimeout(() => inputRef.current?.focus(), 100); };

  const handleInputChange = (val) => {
    setInputValue(val);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    const lower = val.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);
    const matched = ALL_PROMPTS.filter((p) => words.every((w) => p.toLowerCase().includes(w)));
    setSuggestions(matched.slice(0, 5));
  };

  const pickSuggestion = (text) => { setSuggestions([]); handleSend(text); };

  const loadChat = (session) => {
    skipSaveRef.current = true;
    setCurrentChatId(session.id);
    setMessages(session.messages.map((m) => ({ ...m, time: new Date(m.time) })));
  };

  const deleteChat = (id) => {
    setChatSessions((prev) => { const updated = prev.filter((s) => s.id !== id); saveSessions(updated); return updated; });
    if (currentChatId === id) { setMessages([]); setCurrentChatId(`chat_${Date.now()}`); }
  };

  const handleSend = (text) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: "user", text: msg, time: new Date() }]);
    setInputValue("");
    setSuggestions([]);
    setIsTyping(true);
    setTimeout(() => {
      const result = generateBotReply(msg);
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: result.text, recommendations: result.recommendations, time: new Date() }]);
    }, 800 + Math.random() * 400);
  };

  return (
    <div className={`chatbot-page ${theme}-theme`}>
      <aside className="chatbot-sidebar">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar"><i className="fas fa-user"></i></div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">MANAGER_BRAND_2</span>
            <span className="sidebar-user-role">Dashboard User</span>
          </div>
        </div>
        <button className="sidebar-newchat-btn" onClick={handleNewChat} title="New Chat"><i className="fas fa-plus"></i> New Chat</button>
        <div className="sidebar-divider"></div>
        <div className="sidebar-header">
          <i className="fas fa-clock-rotate-left sidebar-header-icon"></i>
          <span>Saved Chats</span>
        </div>
        <div className="sidebar-chats">
          {chatSessions.length === 0 ? (
            <div className="sidebar-no-chats">No saved chats yet</div>
          ) : (
            chatSessions.map((session) => (
              <div key={session.id} className={`sidebar-chat-item ${session.id === currentChatId ? "active" : ""}`} onClick={() => loadChat(session)}>
                <i className="far fa-comment sidebar-chat-icon"></i>
                <span className="sidebar-chat-title">{session.title}</span>
                <button className="sidebar-chat-delete" onClick={(e) => { e.stopPropagation(); deleteChat(session.id); }} title="Delete chat"><i className="fas fa-trash-alt"></i></button>
              </div>
            ))
          )}
        </div>
      </aside>

      <div className="chatbot-main">
        <div className="chatbot-topbar">
          <span className="chatbot-title-text"><AiIcon size={30} /> Revenue Chat</span>
        </div>
        {messages.length === 0 ? (
          <div className="chatbot-empty-state">
            <h2 className="chatbot-empty-title">Where should we begin?</h2>
            <div className="chatbot-center-input-wrapper">
              {suggestions.length > 0 && (
                <div className="chatbot-suggestions">
                  {suggestions.map((s, i) => (
                    <button key={i} className="chatbot-suggestion-btn" onClick={() => pickSuggestion(s)}>
                      <i className="fas fa-search suggestion-icon"></i>{s}
                    </button>
                  ))}
                </div>
              )}
              <div className="chatbot-center-input-area">
                <input ref={inputRef} type="text" className="chatbot-center-input" placeholder="AI-powered marketing intelligence hub — Explore brand performance, media ROI, model accuracy & optimization" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                <button className="chatbot-center-voice-btn" title="Voice input"><i className="fas fa-microphone"></i></button>
                <button className="chatbot-center-send-btn" onClick={() => handleSend()} disabled={!inputValue.trim()}><i className="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="chatbot-body">
              <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chatbot-msg ${msg.from === "bot" ? "msg-bot" : "msg-user"}`}>
                    {msg.from === "bot" && <div className="msg-avatar"><AiIcon size={24} /></div>}
                    <div className="msg-content">
                      <div className="msg-bubble">{msg.from === "bot" ? renderText(msg.text) : msg.text}</div>
                      {msg.from === "bot" && msg.recommendations?.length > 0 && (
                        <div className="msg-recommendations">
                          <span className="msg-rec-label">You might also ask:</span>
                          {msg.recommendations.map((rec, ri) => (
                            <button key={ri} className="msg-rec-btn" onClick={() => handleSend(rec)}>→ {rec}</button>
                          ))}
                        </div>
                      )}
                      <span className="msg-time">{formatTime(msg.time)}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chatbot-msg msg-bot">
                    <div className="msg-avatar"><AiIcon size={24} /></div>
                    <div className="msg-content"><div className="msg-bubble typing-bubble"><div className="typing-dots"><span></span><span></span><span></span></div></div></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="chatbot-input-wrapper">
              {suggestions.length > 0 && (
                <div className="chatbot-suggestions">
                  {suggestions.map((s, i) => (
                    <button key={i} className="chatbot-suggestion-btn" onClick={() => pickSuggestion(s)}>
                      <i className="fas fa-search suggestion-icon"></i>{s}
                    </button>
                  ))}
                </div>
              )}
              <div className="chatbot-input-area">
                <input ref={inputRef} type="text" className="chatbot-input" placeholder="Ask about your marketing data..." value={inputValue} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} disabled={isTyping} />
                <button className="chatbot-send-btn" onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}><i className="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
