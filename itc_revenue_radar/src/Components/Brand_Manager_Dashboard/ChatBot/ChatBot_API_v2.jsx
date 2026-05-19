/**
 * Revenue bot — UI components (popup, full page, message rendering).
 * WebSocket, hooks, and session logic live in revenueBotChatCore.js.
 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsRobot } from "react-icons/bs";
import { VscChromeMinimize } from "react-icons/vsc";
import "./ChatBot.css";
import QuationChatbotAvatar from "./ChatbotIcon";
import UserService from "../../../services/UserService";
import {
  WS_STATUS,
  WS_STATUS_LABELS,
  POPUP_TRANSFER_KEY,
  POPUP_RESTORE_OPEN_KEY,
  revenueBotSocket,
  loadSessions,
  saveSessions,
  useRevenueBotWebSocket,
  useChatSend,
  useScenarioConfirm,
  toLabel,
  getMissingFieldPrompt,
  formatScenarioDriver,
} from "./revenueBotChatCore";

// Re-export for Simulator / other modules (backward compatible)
export {
  SCENARIO_PREFILL_KEY,
  TIMETYPE_LABELS,
  resolveTimetype,
  buildScenarioPrefillFromConfirm,
  saveScenarioPrefill,
  consumeScenarioPrefill,
} from "./revenueBotChatCore";

// ─── UI helpers ───
const AiIcon = ({ size = 28, className = "" }) => (
  <BsRobot className={`ai-svg-icon ${className}`} size={size} />
);

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const renderText = (text) =>
  text.split("\n").map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={pi}>{part.slice(2, -2)}</strong>
        : part
    );
    return <React.Fragment key={li}>{li > 0 && <br />}{parts}</React.Fragment>;
  });

const WsConnectionStatus = ({ status }) => (
  <span
    className={`chatbot-ws-status chatbot-ws-status--${status}`}
    title={`WebSocket: ${WS_STATUS_LABELS[status] || status}`}
    role="status"
    aria-live="polite"
  >
    <span className="chatbot-ws-status-dot" aria-hidden />
    {WS_STATUS_LABELS[status] || status}
  </span>
);

// ─── BotReply component ───
const BotReply = ({ msg, onSend, onConfirmScenario, isConfirming, isConfirmed }) => {
  const quickReplies = msg.quickReplies?.length ? msg.quickReplies : msg.recommendations;
  const isUnclear = msg.status === "clarification_needed" || msg.intentType === "unclear_query";
  const showMissing = msg.isMissingParams || (msg.missingFields?.length > 0 && !msg.readyToRun);
  const showMeta = !showMissing && (msg.intentType || typeof msg.readyToRun === "boolean" || msg.resolvedRole);
  const scenarioDrivers = Array.isArray(msg.completionCard?.details?.scenarioDetails)
    ? msg.completionCard.details.scenarioDetails
    : [];
  const confirmCardLocked = Boolean(isConfirming || isConfirmed || msg.scenarioConfirmed);
  return (
  <div className="bot-rich-reply">
    {!showMissing && <div className="bot-main-text">{renderText(msg.text || "")}</div>}

    {showMissing && (
      <div className="bot-missing-intro">I need a few more details to build your scenario:</div>
    )}

    {msg.clarifyingQuestion && msg.clarifyingQuestion !== msg.text && !showMissing && (
      <div className="bot-clarifying-question">{renderText(msg.clarifyingQuestion)}</div>
    )}

    {showMeta && (
      <div className="bot-meta-row">
        {msg.intentType && <span className="bot-meta-chip">Intent: {toLabel(msg.intentType)}</span>}
        {msg.resolvedRole && <span className="bot-meta-chip">Role: {toLabel(msg.resolvedRole)}</span>}
        {typeof msg.readyToRun === "boolean" && (
          <span className={`bot-status-chip ${msg.readyToRun ? "ready" : "pending"}`}>
            {msg.readyToRun ? "Ready to run" : "Awaiting details"}
          </span>
        )}
      </div>
    )}

    {msg.errors?.length > 0 && (
      <ul className="bot-error-list">
        {msg.errors.map((err, i) => (
          <li key={`${err}-${i}`}>{err}</li>
        ))}
      </ul>
    )}

    {showMissing && (
      <ul className="bot-missing-questions">
        {msg.missingFields.map((field, idx) => {
          const { question, example } = getMissingFieldPrompt(field, msg.fieldHints, msg.fieldOptions);
          return (
            <li key={`${field}-${idx}`} className="bot-missing-question">
              <span className="bot-missing-question-text">{question}</span>
              {example && <span className="bot-missing-example"> {example}</span>}
            </li>
          );
        })}
      </ul>
    )}

    {msg.completionCard && (
      <div
        className={`bot-completion-card${confirmCardLocked ? " bot-completion-card--locked" : ""}`}
      >
        <div className="bot-completion-title">{msg.completionCard.title}</div>
        {msg.completionCard.suggestedName && (
          <div className="bot-completion-name">
            <span className="bot-completion-label">Suggested name:</span>{" "}
            {msg.completionCard.suggestedName}
          </div>
        )}
        <div className="bot-completion-name bot-completion-message">{msg.completionCard.message}</div>
        <div className="bot-completion-name"><span className="bot-completion-label">Brand:</span> {msg.completionCard.details?.brand || "-"}</div>
        <div className="bot-completion-name"><span className="bot-completion-label">Market:</span> {msg.completionCard.details?.market || "-"}</div>
        <div className="bot-completion-name"><span className="bot-completion-label">FY:</span> {msg.completionCard.details?.fy || "-"}</div>
        <div className="bot-completion-name"><span className="bot-completion-label">Timeline:</span> {msg.completionCard.details?.timeline || "-"}</div>
        {scenarioDrivers.length > 0 && (
          <div className="bot-completion-drivers">
            <span className="bot-completion-label">Changes:</span>
            <ul className="bot-driver-list">
              {scenarioDrivers.map((item, i) => (
                <li key={i}>{formatScenarioDriver(item)}</li>
              ))}
            </ul>
          </div>
        )}
        {msg.readyToRun && msg.confirmPayload && (
          <div className="bot-scenario-actions">
            <button
              type="button"
              className="scenario-open-btn"
              onClick={() => !confirmCardLocked && onConfirmScenario?.(msg)}
              disabled={confirmCardLocked}
            >
              {isConfirming
                ? "Confirming…"
                : confirmCardLocked
                  ? "Scenario confirmed"
                  : "Confirm scenario"}
            </button>
            <button
              type="button"
              className="scenario-edit-btn"
              onClick={() => !confirmCardLocked && onSend?.("Edit scenario details")}
              disabled={confirmCardLocked}
            >
              Edit
            </button>
          </div>
        )}
        {isConfirming && (
          <div className="scenario-confirming-note">Confirming, please wait a few seconds…</div>
        )}
      </div>
    )}

    {isUnclear && quickReplies?.length > 0 && (
      <div className="msg-recommendations enhanced bot-inline-quick-replies">
        <div className="msg-recommendations-title">Quick replies</div>
        {quickReplies.map((rec, ri) => (
          <button key={ri} type="button" className="msg-rec-btn" onClick={() => onSend?.(rec)}>
            {rec}
          </button>
        ))}
      </div>
    )}

  </div>
  );
};

// ─── Typing indicator ───
const TypingIndicator = ({ size = 18 }) => (
  <div className="chatbot-msg msg-bot">
    <div className="msg-avatar"><AiIcon size={size} /></div>
    <div className="msg-content">
      <div className="msg-bubble typing-bubble">
        <div className="typing-dots"><span /><span /><span /></div>
      </div>
    </div>
  </div>
);

// ─── Message list ───
const MessageList = ({
  messages,
  isTyping,
  avatarSize,
  onSend,
  onConfirmScenario,
  confirmingMessageIndex = null,
  confirmedMessageIndexes = [],
}) => (
  <>
    {messages.map((msg, idx) => (
      <div key={idx} className={`chatbot-msg ${msg.from === "bot" ? "msg-bot" : "msg-user"}`}>
        {msg.from === "bot" && <div className="msg-avatar"><AiIcon size={avatarSize} /></div>}
        <div className="msg-content">
          <div className="msg-bubble">
            {msg.from === "bot" ? (
              <BotReply
                msg={msg}
                onSend={onSend}
                onConfirmScenario={(botMsg) => onConfirmScenario?.(botMsg, idx)}
                isConfirming={confirmingMessageIndex === idx}
                isConfirmed={confirmedMessageIndexes.includes(idx) || Boolean(msg.scenarioConfirmed)}
              />
            ) : (
              msg.text
            )}
          </div>
          {msg.from === "bot" &&
            msg.recommendations?.length > 0 &&
            msg.status !== "clarification_needed" &&
            msg.intentType !== "unclear_query" && (
            <div className="msg-recommendations enhanced">
              <div className="msg-recommendations-title">Try one of these next:</div>
              {msg.recommendations.map((rec, ri) => (
                <button key={ri} className="msg-rec-btn" onClick={() => onSend(rec)}>{rec}</button>
              ))}
            </div>
          )}
          <span className="msg-time">{formatTime(msg.time)}</span>
        </div>
      </div>
    ))}
    {isTyping && <TypingIndicator size={avatarSize} />}
  </>
);

// ─── Chat Popup ───
const ChatPopup = ({ theme, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [maximizing, setMaximizing] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(`chat_${Date.now()}`);
  const { wsStatus, sendBotMessage } = useRevenueBotWebSocket({ enabled: true });
  const requestControllerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(POPUP_RESTORE_OPEN_KEY) !== "1") return;
      localStorage.removeItem(POPUP_RESTORE_OPEN_KEY);
      const transferred = localStorage.getItem(POPUP_TRANSFER_KEY);
      if (!transferred) return;
      const parsed = JSON.parse(transferred);
      if (Array.isArray(parsed) && parsed.length) {
        setMessages(parsed.map((m) => ({ ...m, time: new Date(m.time) })));
      }
      localStorage.removeItem(POPUP_TRANSFER_KEY);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    const sessions = loadSessions();
    const existing = sessions.find((s) => s.id === currentChatId);
    let updated;
    if (existing) {
      updated = sessions.map((s) =>
        s.id === currentChatId ? { ...s, messages, updatedAt: Date.now() } : s
      );
    } else {
      const raw = messages.find((m) => m.from === "user")?.text || "New Chat";
      const stopWords = new Set([
        "is", "the", "a", "an", "in", "for", "of", "to", "and", "or", "how", "what", "which",
        "show", "me", "has", "vs", "does", "do", "can", "all", "across", "much", "goes",
      ]);
      const title =
        raw
          .split(/\s+/)
          .filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1)
          .slice(0, 5)
          .join(" ") || raw.slice(0, 30);
      updated = [
        { id: currentChatId, title, messages, createdAt: Date.now(), updatedAt: Date.now() },
        ...sessions,
      ];
    }
    saveSessions(updated);
  }, [messages, currentChatId]);

  const {
    confirmingMessageIndex,
    confirmedMessageIndexes,
    handleConfirmScenario,
    resetConfirmState,
  } = useScenarioConfirm({ wsStatus, setMessages, setIsTyping, navigate, onClose });

  const handleSend = useChatSend({
    setMessages,
    setInputValue,
    setIsTyping,
    requestControllerRef,
    sendBotMessage,
    wsStatus,
  });

  const inputDisabled = isTyping || wsStatus !== WS_STATUS.CONNECTED;

  const handleStopGenerating = () => {
    requestControllerRef.current?.abort?.();
    requestControllerRef.current = null;
    setIsTyping(false);
  };

  const handleNewChat = () => {
    requestControllerRef.current?.abort?.();
    revenueBotSocket.resetSession().catch(() => {});
    resetConfirmState();
    setCurrentChatId(`chat_${Date.now()}`);
    setMessages([]);
    setHistoryOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleHistoryToggle = () => {
    if (!historyOpen) setSavedChats(loadSessions().filter((s) => s.id !== currentChatId));
    setHistoryOpen((p) => !p);
  };

  const loadSavedChat = (session) => {
    setCurrentChatId(session.id);
    setMessages(session.messages.map((m) => ({ ...m, time: new Date(m.time) })));
    setHistoryOpen(false);
  };

  const deleteSavedChat = (id) => {
    const updated = loadSessions().filter((s) => s.id !== id);
    saveSessions(updated);
    setSavedChats(updated.filter((s) => s.id !== currentChatId));
    if (currentChatId === id) {
      setCurrentChatId(`chat_${Date.now()}`);
      setMessages([]);
    }
  };

  const handleMaximize = () => {
    if (messages.length) localStorage.setItem(POPUP_TRANSFER_KEY, JSON.stringify(messages));
    setMaximizing(true);
    setTimeout(() => {
      navigate("/chatbot");
      setMaximizing(false);
      onClose();
    }, 450);
  };

  return (
    <div className={`chatbot-popup-overlay ${theme}-theme${maximizing ? " popup-maximizing" : ""}`}>
      <div className={`chatbot-popup ${theme}-theme`}>
        <div className="chatbot-popup-header">
          <div className="chatbot-popup-title-row">
            <span className="chatbot-popup-title"><AiIcon size={22} /> Revenue Chat</span>
            <WsConnectionStatus status={wsStatus} />
          </div>
          <div className="chatbot-popup-header-actions">
            <button className="chatbot-popup-history-btn" onClick={handleHistoryToggle} title="Saved chats"><i className="fas fa-history" /></button>
            <button className="chatbot-popup-newchat-btn" onClick={handleNewChat} title="New chat"><i className="fas fa-plus" /></button>
            <button className="chatbot-popup-maximize-btn" onClick={handleMaximize} disabled={maximizing} title="Open full page"><i className="fas fa-expand" /></button>
            <button className="chatbot-popup-close-btn" onClick={onClose} title="Close"><i className="fas fa-times" /></button>
          </div>
        </div>

        {historyOpen && (
          <div className="chatbot-popup-history">
            <div className="popup-history-header"><i className="fas fa-clock-rotate-left" /> Recent Chats</div>
            <div className="popup-history-list">
              {savedChats.length === 0
                ? <div className="popup-history-empty"><i className="far fa-comment-dots popup-history-empty-icon" />No saved chats yet</div>
                : savedChats.map((session) => (
                  <div key={session.id} className="popup-history-item" onClick={() => loadSavedChat(session)}>
                    <i className="far fa-comment popup-history-item-icon" />
                    <span className="popup-history-title">{session.title}</span>
                    <button className="popup-history-delete" onClick={(e) => { e.stopPropagation(); deleteSavedChat(session.id); }} title="Delete"><i className="fas fa-trash-alt" /></button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="chatbot-popup-body">
          {messages.length === 0
            ? (
              <div className="chatbot-popup-empty">
                <AiIcon size={40} className="popup-empty-icon" />
                <p>Ask me anything about your Revenue!</p>
                {wsStatus === WS_STATUS.CONNECTING && (
                  <p className="chatbot-ws-hint chatbot-ws-hint--pending">Connecting to real-time assistant…</p>
                )}
                {wsStatus === WS_STATUS.ERROR && (
                  <p className="chatbot-ws-hint chatbot-ws-hint--error">Unable to connect. Retrying automatically…</p>
                )}
              </div>
            )
            : <div className="chatbot-popup-messages">
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  avatarSize={18}
                  onSend={(t) => handleSend(t, "")}
                  onConfirmScenario={handleConfirmScenario}
                  confirmingMessageIndex={confirmingMessageIndex}
                  confirmedMessageIndexes={confirmedMessageIndexes}
                />
                <div ref={messagesEndRef} />
              </div>}
        </div>

        <div className="chatbot-popup-input-wrapper">
          <div className="chatbot-popup-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-popup-input"
              placeholder="Ask about your marketing data..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !inputDisabled && handleSend(null, inputValue)}
              disabled={inputDisabled}
            />
            <button
              className="chatbot-popup-send-btn"
              onClick={() => handleSend(null, inputValue)}
              disabled={!inputValue.trim() || inputDisabled}
            >
              <i className="fas fa-paper-plane" />
            </button>
            {isTyping && (
              <button className="chatbot-popup-stop-btn" onClick={handleStopGenerating} type="button" title="Stop generating">
                <i className="fas fa-stop" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Floating button (fixed position; opens/closes popup on click) ───
const ChatBot_API_v2 = ({ theme }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(POPUP_RESTORE_OPEN_KEY) === "1") setPopupOpen(true);
    } catch { /* ignore */ }
  }, []);

  return (
    <>
      <div className={`chatbot-nav-wrapper ${theme}-theme${popupOpen ? " popup-open" : ""}`}>
        <QuationChatbotAvatar
          open={popupOpen}
          onClick={() => setPopupOpen((p) => !p)}
          idleTooltip="✨ Ask me anything regarding Revenue!"
          ariaLabel={popupOpen ? "Close Revenue assistant" : "Open Revenue assistant"}
        />
      </div>
      {popupOpen && <ChatPopup theme={theme} onClose={() => setPopupOpen(false)} />}
    </>
  );
};

// ─── Full-page ChatBot ───
export const ChatBotPage = ({ theme: themeProp }) => {
  const navigate = useNavigate();
  const theme = themeProp || "light";
  const sidebarUserName =
    UserService.getFullName() ||
    UserService.getUsername() ||
    "Chatbot User";

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState(loadSessions);
  const [currentChatId, setCurrentChatId] = useState(() => `chat_${Date.now()}`);
  const { wsStatus, sendBotMessage } = useRevenueBotWebSocket({ enabled: true });
  const requestControllerRef = useRef(null);
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
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed.map((m) => ({ ...m, time: new Date(m.time) })));
        }
        localStorage.removeItem(POPUP_TRANSFER_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    if (!messages.length) return;
    setChatSessions((prev) => {
      const existing = prev.find((s) => s.id === currentChatId);
      let updated;
      if (existing) {
        updated = prev.map((s) =>
          s.id === currentChatId ? { ...s, messages, updatedAt: Date.now() } : s
        );
      } else {
        const raw = messages.find((m) => m.from === "user")?.text || "New Chat";
        const stopWords = new Set([
          "is", "the", "a", "an", "in", "for", "of", "to", "and", "or", "how", "what", "which",
          "show", "me", "has", "vs", "does", "do", "can", "all", "across", "much", "goes",
        ]);
        const title =
          raw
            .split(/\s+/)
            .filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1)
            .slice(0, 5)
            .join(" ") || raw.slice(0, 30);
        updated = [
          { id: currentChatId, title, messages, createdAt: Date.now(), updatedAt: Date.now() },
          ...prev,
        ];
      }
      saveSessions(updated);
      return updated;
    });
  }, [messages, currentChatId]);

  const {
    confirmingMessageIndex,
    confirmedMessageIndexes,
    handleConfirmScenario,
    resetConfirmState,
  } = useScenarioConfirm({ wsStatus, setMessages, setIsTyping, navigate });

  const handleSend = useChatSend({
    setMessages,
    setInputValue,
    setIsTyping,
    requestControllerRef,
    sendBotMessage,
    wsStatus,
  });

  const inputDisabled = isTyping || wsStatus !== WS_STATUS.CONNECTED;

  const handleStopGenerating = () => {
    requestControllerRef.current?.abort?.();
    requestControllerRef.current = null;
    setIsTyping(false);
  };

  const handleNewChat = () => {
    requestControllerRef.current?.abort?.();
    revenueBotSocket.resetSession().catch(() => {});
    resetConfirmState();
    setMessages([]);
    setCurrentChatId(`chat_${Date.now()}`);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const loadChat = (session) => {
    skipSaveRef.current = true;
    setCurrentChatId(session.id);
    setMessages(session.messages.map((m) => ({ ...m, time: new Date(m.time) })));
  };

  const deleteChat = (id) => {
    setChatSessions((prev) => {
      const u = prev.filter((s) => s.id !== id);
      saveSessions(u);
      return u;
    });
    if (currentChatId === id) {
      setMessages([]);
      setCurrentChatId(`chat_${Date.now()}`);
    }
  };

  const handleMinimizeToCockpit = () => {
    try {
      if (messages.length) localStorage.setItem(POPUP_TRANSFER_KEY, JSON.stringify(messages));
      else localStorage.removeItem(POPUP_TRANSFER_KEY);
      localStorage.setItem(POPUP_RESTORE_OPEN_KEY, "1");
    } catch { /* ignore */ }
    navigate("/cockpit");
  };

  const handleBackToBrandCockpit = () => {
    navigate("/cockpit");
  };

  return (
    <div className={`chatbot-page ${theme}-theme`}>
      <aside className="chatbot-sidebar">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar"><i className="fas fa-user" /></div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{sidebarUserName}</span>
            <span className="sidebar-user-role">Chatbot User</span>
          </div>
        </div>
        <button className="sidebar-newchat-btn" onClick={handleNewChat} title="New Chat">
          <i className="fas fa-plus" /> New Chat
        </button>
        <div className="sidebar-divider" />
        <div className="sidebar-header"><i className="fas fa-clock-rotate-left sidebar-header-icon" /><span>Saved Chats</span></div>
        <div className="sidebar-chats">
          {chatSessions.length === 0
            ? <div className="sidebar-no-chats">No saved chats yet</div>
            : chatSessions.map((session) => (
              <div
                key={session.id}
                className={`sidebar-chat-item ${session.id === currentChatId ? "active" : ""}`}
                onClick={() => loadChat(session)}
              >
                <i className="far fa-comment sidebar-chat-icon" />
                <span className="sidebar-chat-title">{session.title}</span>
                <button
                  className="sidebar-chat-delete"
                  onClick={(e) => { e.stopPropagation(); deleteChat(session.id); }}
                  title="Delete chat"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            ))}
        </div>
      </aside>

      <div className="chatbot-main">
        <div className="chatbot-topbar">
          <div className="chatbot-topbar-title-row">
            <span className="chatbot-title-text"><AiIcon size={30} /> Revenue Chat</span>
            <WsConnectionStatus status={wsStatus} />
          </div>
          <div className="chatbot-topbar-actions">
            <button type="button" className="chatbot-topbar-btn chatbot-topbar-btn-primary" onClick={handleBackToBrandCockpit} title="Leave full-page chat and return to Brand Cockpit">
              <i className="fas fa-arrow-left" aria-hidden /> Back to Brand Cockpit
            </button>
            <button
              type="button"
              className="chatbot-topbar-btn chatbot-topbar-btn-icon-only"
              onClick={handleMinimizeToCockpit}
              title="Minimize to floating chat"
              aria-label="Minimize to floating chat"
            >
              <VscChromeMinimize className="chatbot-minimize-icon" size={20} aria-hidden />
            </button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="chatbot-empty-state">
            <h2 className="chatbot-empty-title">Where should we begin?</h2>
            {wsStatus === WS_STATUS.CONNECTING && (
              <p className="chatbot-ws-hint chatbot-ws-hint--pending">Connecting to real-time assistant…</p>
            )}
            {wsStatus === WS_STATUS.ERROR && (
              <p className="chatbot-ws-hint chatbot-ws-hint--error">Unable to connect. Retrying automatically…</p>
            )}
            <div className="chatbot-center-input-wrapper">
              <div className="chatbot-center-input-area">
                <input
                  ref={inputRef}
                  type="text"
                  className="chatbot-center-input"
                  placeholder="AI-powered marketing intelligence hub — Explore brand performance, media ROI, model accuracy & optimization"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !inputDisabled && handleSend(null, inputValue)}
                  disabled={inputDisabled}
                />
                <button className="chatbot-center-voice-btn" title="Voice input"><i className="fas fa-microphone" /></button>
                <button className="chatbot-center-send-btn" onClick={() => handleSend(null, inputValue)} disabled={!inputValue.trim() || inputDisabled}><i className="fas fa-paper-plane" /></button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="chatbot-body">
              <div className="chatbot-messages">
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  avatarSize={24}
                  onSend={(t) => handleSend(t, "")}
                  onConfirmScenario={handleConfirmScenario}
                  confirmingMessageIndex={confirmingMessageIndex}
                  confirmedMessageIndexes={confirmedMessageIndexes}
                />
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="chatbot-input-wrapper">
              <div className="chatbot-input-area">
                <input
                  ref={inputRef}
                  type="text"
                  className="chatbot-input"
                  placeholder="Ask about your marketing data..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !inputDisabled && handleSend(null, inputValue)}
                  disabled={inputDisabled}
                />
                <button className="chatbot-send-btn" onClick={() => handleSend(null, inputValue)} disabled={!inputValue.trim() || inputDisabled}><i className="fas fa-paper-plane" /></button>
                {isTyping && (
                  <button className="chatbot-stop-btn" onClick={handleStopGenerating} type="button" title="Stop generating">
                    <i className="fas fa-stop" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBot_API_v2;
