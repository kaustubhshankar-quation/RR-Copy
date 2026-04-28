import React, { useState, useRef, useEffect } from "react";
import { BsRobot } from "react-icons/bs";
import axios from "axios";
import "./ChatBot.css";

const AiIcon = ({ size = 28, className = "" }) => (
  <BsRobot className={`ai-svg-icon ${className}`} size={size} />
);

// ─── Flask API call ───
const callChatbotAPI = async (message, sessionId = null) => {
  const payload = { message };
  if (sessionId) payload.session_id = sessionId;
  const response = await axios.post('https://demo.revenue.radar.chatbot.quation.co.in/chatbot/scenario/ask', payload);
  return response.data;
};



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
    // Split on **bold** and *italic* markers
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={pi}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("*")  && part.endsWith("*"))  return <em key={pi}>{part.slice(1, -1)}</em>;
      return part;
    });
    return (<React.Fragment key={li}>{li > 0 && <br />}{rendered}</React.Fragment>);
  });
};

// ─── Parse structured backend response into typed message ───
const parseBotResponse = (data) => {
  const cfg = data.optimizer_config || {};

  // Rule 1: allowed === false → denial (output metric targeted)
  if (data.allowed === false) {
    const backendReason = data.denial_reason || "";
    const conversationalMsg = backendReason
      ? `${backendReason}\n\nWere you perhaps trying to boost those numbers **through** media or trade investment? Try rephrasing, for example:\n- *"Increase media investment for [Brand] in FY 2025-26"*\n- *"Optimize TV spend for [Brand] in [Market]"*\n\nWhat are you actually looking to do? 😊`
      : `Hmm, it looks like you're targeting an **output metric** directly — things like **sales**, **revenue**, or **volume** can't be set as direct inputs in a scenario.\n\nBut I can help you hit those goals through **input levers** like media spend or distribution! Try something like:\n- *"Increase media investment for [Brand] in FY 2025-26"*\n- *"Optimize TV spend for [Brand] in [Market]"*\n- *"Boost media mix for [Brand] in [Market], half yearly"*\n\nWhat would you like to optimize? 😊`;
    return { type: "denial", text: conversationalMsg, sessionId: data.session_id || null };
  }
  // FY / general error
  if (data.error) {
    return { type: "error", text: data.error, sessionId: data.session_id || null };
  }

  // missing_fields can be at top-level OR nested inside optimizer_config
  let missingFields =
    (Array.isArray(data.missing_fields) && data.missing_fields.length > 0 ? data.missing_fields : null) ||
    (Array.isArray(cfg.missing_fields)  && cfg.missing_fields.length  > 0 ? cfg.missing_fields  : null);

  const missingFieldOptions = data.missing_field_options || cfg.missing_field_options || {};
  const summaryText = data.summary || cfg.summary || "";

  // Always inject "timeline" when time_hints is empty — even if backend says ready_to_run.
  // Backend frequently omits timeline from missing_fields despite it being unset.
  if (Array.isArray(cfg.time_hints) && cfg.time_hints.length === 0) {
    const hasTimeline = missingFields && missingFields.some((f) => ["timeline", "time_hints", "time_period"].includes(f));
    if (!hasTimeline) {
      missingFields = missingFields ? [...missingFields, "timeline"] : ["timeline"];
    }
  }

  // Rule 2: ask for the FIRST missing field conversationally, one at a time
  if (missingFields) {
    const firstField = missingFields[0];
    const fieldOptions = getFieldOptions(missingFieldOptions, firstField);
    const questionText = generateQuestion(firstField, missingFieldOptions);
    // Extract brand from cfg or summaryText for the welcome message
    const brand = cfg.brand || (summaryText.match(/\bfor(?:\s+the\s+brand)?\s+([A-Z][A-Z0-9_]+)/i) || [])[1] || "";
    return {
      type: "question",
      questionText,
      fieldName: firstField,
      fieldOptions,
      sessionId: data.session_id || null,
      contextSummary: summaryText,
      introText: generateIntro(brand),
    };
  }
  // All parameters present — scenario ready
  if (data.ready_to_run === true) {
    const rawHints = Array.isArray(cfg.time_hints) ? cfg.time_hints : (Array.isArray(data.time_hints) ? data.time_hints : []);
    const timeline = rawHints.map((h) => h.period).filter(Boolean).join(", ");
    return {
      type: "ready",
      sessionId: data.session_id || null,
      summaryText,
      scenarioName: data.scenario_name_suggestion || cfg.scenario_name_suggestion || cfg.scenario_name || "",
      brand: cfg.brand || "",
      market: cfg.market || "",
      fy: cfg.fy || "",
      timeline,
    };
  }
  // Plain text fallback
  const text = data.reply ?? data.message ?? data.response ?? data.answer ?? JSON.stringify(data);
  return { type: "text", text: String(text), sessionId: data.session_id || null };
};

// ─── Default options for known missing fields when backend doesn't supply them ───
const FIELD_DEFAULT_OPTIONS = {
  market:           ["NORTH", "SOUTH", "EAST", "WEST"],
  timeline:         ["yearly", "quarterly", "half yearly"],
  time_hints:       ["yearly", "quarterly", "half yearly"],
  time_period:      ["yearly", "quarterly", "half yearly"],
  fy:               [],
  brand:            [],
  magnitude:        ["10%", "15%", "20%", "25%"],
  percentage:       ["10%", "15%", "20%", "25%"],
  change_percent:   ["10%", "15%", "20%", "25%"],
  target_percent:   ["10%", "15%", "20%", "25%"],
  increase_by:      ["10%", "15%", "20%", "25%"],
};

// Normalize field label for display
const fieldLabel = (field) =>
  field === "time_hints" || field === "time_period" ? "Timeline" : field.replace(/_/g, " ");

// Normalize field value to inject into the continue message
const fieldMsgKey = (field) =>
  field === "time_hints" || field === "time_period" ? "timeline" : field.replace(/_/g, " ");

const getFieldOptions = (missingFieldOptions, field) => {
  const opts = missingFieldOptions[field];
  if (Array.isArray(opts) && opts.length > 0) return opts;
  return FIELD_DEFAULT_OPTIONS[field] || [];
};

const VALID_SCENARIO_FY = "2025-26";

// Expand shorthand FY inputs like "25-26" → "2025-26"
const normalizeFY = (input) => {
  const s = input.trim();
  // "25-26" → "2025-26"
  if (/^\d{2}-\d{2}$/.test(s)) {
    return `20${s.slice(0, 2)}-${s.slice(3)}`;
  }
  // "2526" or "202526" edge-cases — leave as-is
  return s;
};

// Friendly openers rotated for variety
const FY_QUESTION_VARIANTS = [
  `Got it! Which **FY** should this scenario run for? I currently support **${VALID_SCENARIO_FY}** — just type that in and we're good to go! 🗓️`,
  `Almost there! Could you tell me the **fiscal year** for this scenario? *(supported: ${VALID_SCENARIO_FY})*`,
  `Sure thing! Which **fiscal year** are you targeting? I can work with **${VALID_SCENARIO_FY}** right now.`,
];

const MARKET_QUESTION_VARIANTS = [
  `Which **market** would you like to target? *(EAST / NORTH / SOUTH / WEST)*`,
  `Which **market** are you focusing on? You can choose from **EAST, NORTH, SOUTH** or **WEST**.`,
  `Almost set! What **market** should this scenario cover? *(EAST / NORTH / SOUTH / WEST)*`,
];

const TIMELINE_QUESTION_VARIANTS = [
  `What **timeline** works best for this scenario? *(yearly / quarterly / half yearly)*`,
  `How would you like to break down the timeline — **yearly**, **quarterly**, or **half yearly**?`,
  `One more thing — what **time period** should I plan this scenario across? *(yearly / quarterly / half yearly)*`,
];

const BRAND_QUESTION_VARIANTS = [
  `Which **brand** would you like to create this scenario for?`,
  `Could you tell me the **brand** name for this scenario?`,
  `Sure! Which **brand** should I build this scenario around?`,
];

const OBJECTIVE_QUESTION_VARIANTS = [
  `Almost there! 🌟 What's the **objective** for this scenario? *(e.g. Media spends, Cost Reduction)*`,
  `Great progress! Could you tell me the **objective** of this scenario? *(e.g. Brand Awareness, Maximize Reach, Improve ROI)*`,
  `Nearly done! What **objective** are you targeting? *(e.g. Digital Spends, Media Efficiency)*`,
];

const SCENARIO_TYPE_QUESTION_VARIANTS = [
  `Perfect! One final question — would you like to build on a **Base Scenario** or start fresh with a **New Scenario**?\n\n📐 **Base Scenario** — layer changes on top of existing actuals *(e.g. 10% increase in TV spends over current plan)*\n✨ **New Scenario** — start with a clean slate and define all inputs from scratch`,
  `Almost done! 🚀 Should this be a **Base Scenario** *(adjust existing media mix)* or a **New Scenario** *(build from scratch with custom inputs)*?`,
  `Last step! Are you building on a **Base Scenario** or creating a completely **New Scenario**?\n\n📊 **Base Scenario** — builds on current actuals *(e.g. 15% uplift in Digital spends)*\n🎨 **New Scenario** — fully custom inputs from the ground up`,
];

const SCENARIO_TYPE_OPTIONS = ["Base Scenario", "New Scenario"];

const PERCENTAGE_QUESTION_VARIANTS = [
  `By **what percentage** are you looking to change this? *(e.g. 10% / 15% / 20% / 25%)*`,
  `Got it! And **how much** of a change are you targeting — **10%, 15%, 20%**, or something else?`,
  `Sure! Just one more thing — **by how much** should this scenario target the change? *(e.g. 10% / 15% / 20%)*`,
];

const pickVariant = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Welcome message shown once before the first missing-field question
const INTRO_VARIANTS = [
  (brand) => `Hey there! 👋 Welcome to **Revenue Chat**!\n\nI can see you'd like to create a scenario${brand ? ` for **${brand}**` : ""} — great choice! I just need a couple of quick details before we get started. Let's go! 🚀`,
  (brand) => `Hi! Welcome aboard 😊\n\nI'd love to help you set up a scenario${brand ? ` for **${brand}**` : ""} right away. There are just a few things I need to confirm first — it'll only take a moment!`,
  (brand) => `Hello! 👋 Welcome to **Revenue Chat**! Great to have you here.\n\nYou're looking to create a scenario${brand ? ` for **${brand}**` : ""} — I'm on it! I just have a few quick questions to fill in the details. Let's knock these out together!`,
];

const generateIntro = (brand) => pickVariant(INTRO_VARIANTS)(brand);

// Build a rich, conversational question for a single missing field
const generateQuestion = (field, missingFieldOptions) => {
  if (isFyField(field))        return pickVariant(FY_QUESTION_VARIANTS);
  if (field === "market")      return pickVariant(MARKET_QUESTION_VARIANTS);
  if (field === "brand") {
    const brandOpts = getFieldOptions(missingFieldOptions, field);
    const brandHint = brandOpts.length > 0 ? `\n\nAvailable brands: **${brandOpts.join(", ")}**` : "";
    return `${pickVariant(BRAND_QUESTION_VARIANTS)}${brandHint}`;
  }
  if (field === "objective")    return pickVariant(OBJECTIVE_QUESTION_VARIANTS);
  if (field === "scenario_type") return pickVariant(SCENARIO_TYPE_QUESTION_VARIANTS);
  if (isPercentageField(field))  return pickVariant(PERCENTAGE_QUESTION_VARIANTS);
  if (["timeline", "time_hints", "time_period"].includes(field)) return pickVariant(TIMELINE_QUESTION_VARIANTS);

  // Generic fallback for any other field
  const label   = fieldLabel(field);
  const options  = getFieldOptions(missingFieldOptions, field);
  const hint     = options.length > 0 ? ` *(${options.join(" / ")})*` : "";
  return `Could you share the **${label.toLowerCase()}** for this scenario?${hint}`;
};
const isFyField = (f) => ["fy", "FY", "fiscal_year"].includes(f);
const isPercentageField = (f) => ["magnitude", "percentage", "change_percent", "target_percent", "increase_by"].includes(f);

// ─── Scenario Ready Card ───
const ScenarioReadyCard = ({ msg }) => {
  const [confirming, setConfirming] = useState(false);

  const handleOpen = () => {
    window.open("/dashboard/simulator", "_blank", "noopener,noreferrer");
    setConfirming(false);
  };

  return (
    <div className="scenario-card scenario-card-ready">
      <div className="scenario-ready-header">
        <i className="fas fa-check-circle scenario-ready-icon"></i>
        Scenario Ready for Creation
      </div>
      {msg.summaryText && <p className="scenario-summary">{msg.summaryText}</p>}
      <div className="scenario-ready-details">
        {msg.brand     && <div className="scenario-detail-row"><span className="scenario-detail-label">Brand</span><span className="scenario-detail-value">{msg.brand}</span></div>}
        {msg.market    && <div className="scenario-detail-row"><span className="scenario-detail-label">Market</span><span className="scenario-detail-value">{msg.market}</span></div>}
        {msg.fy        && <div className="scenario-detail-row"><span className="scenario-detail-label">FY</span><span className="scenario-detail-value">{msg.fy}</span></div>}
        {msg.timeline   && <div className="scenario-detail-row"><span className="scenario-detail-label">Timeline</span><span className="scenario-detail-value">{msg.timeline}</span></div>}
        {msg.magnitude    && <div className="scenario-detail-row"><span className="scenario-detail-label">Target Change</span><span className="scenario-detail-value">{msg.magnitude}</span></div>}
        {msg.objective    && <div className="scenario-detail-row"><span className="scenario-detail-label">Objective</span><span className="scenario-detail-value">{msg.objective}</span></div>}
        {msg.scenarioType && <div className="scenario-detail-row"><span className="scenario-detail-label">Scenario Type</span><span className="scenario-detail-value">{msg.scenarioType}</span></div>}
        {msg.scenarioName && (
          <div className="scenario-detail-row">
            <span className="scenario-detail-label">Scenario Name</span>
            <span className="scenario-name-pill"><i className="fas fa-tag"></i> {msg.scenarioName}</span>
          </div>
        )}
      </div>

      {confirming ? (
        <div className="scenario-open-confirm">
          <span className="scenario-open-confirm-text">
            <i className="fas fa-external-link-alt"></i> Open Scenario Planner in a new tab?
          </span>
          <div className="scenario-open-confirm-actions">
            <button className="scenario-confirm-yes" onClick={handleOpen}>
              <i className="fas fa-check"></i> Yes, open
            </button>
            <button className="scenario-confirm-no" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="scenario-open-btn" onClick={() => setConfirming(true)}>
          <i className="fas fa-arrow-up-right-from-square"></i> Open Scenario Planner
        </button>
      )}
    </div>
  );
};

// ─── Denial / Error Card ───
const ScenarioDenialCard = ({ msg }) => (
  <div className="scenario-card scenario-card-denial">
    <div className="scenario-denial-header">
      <i className={`fas ${msg.type === "error" ? "fa-times-circle" : "fa-ban"} scenario-denial-icon`}></i>
      <span>{msg.type === "error" ? "Scenario Error" : "Request Not Allowed"}</span>
    </div>
    <p className="scenario-summary scenario-denial-text">{msg.text}</p>
  </div>
);

// ─── Unified bot message renderer ───
const renderBotMessage = (msg) => {
  if (msg.type === "question") return renderText(msg.questionText || "");
  if (msg.type === "ready")    return <ScenarioReadyCard msg={msg} />;
  if (msg.type === "denial")   return renderText(msg.text || "");   // conversational — no hard card
  if (msg.type === "error")    return <ScenarioDenialCard msg={msg} />;
  return renderText(msg.text || "");
};

// ─── Inline Chat Popup (shown on floating button click) ───
const ChatPopup = ({ theme, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatIdRef = useRef(`chat_${Date.now()}`);
  const sessionIdRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const pendingReadyRef    = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Auto-save popup messages to saved chats history
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
  };

  const handleSend = async (text) => {
    const rawInput = (text || inputValue).trim();
    if (!rawInput) return;
    let apiMessage = rawInput;
    const sessionId = sessionIdRef.current;
    let wasAnsweringQuestion = false;

    // Conversational mode — wrap typed answer into full context sentence
    if (currentQuestionRef.current) {
      wasAnsweringQuestion = true;
      const { fieldName, fieldOptions, contextSummary } = currentQuestionRef.current;

      // Magnitude answer — store in pendingReady then ask objective
      if (fieldName === "magnitude" && pendingReadyRef.current) {
        pendingReadyRef.current = { ...pendingReadyRef.current, magnitude: rawInput };
        const objQuestion = pickVariant(OBJECTIVE_QUESTION_VARIANTS);
        const ctxSum = pendingReadyRef.current.summaryText || "";
        currentQuestionRef.current = { fieldName: "objective", fieldOptions: [], contextSummary: ctxSum };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", type: "question", questionText: objQuestion, fieldName: "objective", fieldOptions: [], contextSummary: ctxSum, time: new Date() }]);
        setInputValue("");
        return;
      }

      // Objective answer — store then ask scenario type
      if (fieldName === "objective" && pendingReadyRef.current) {
        pendingReadyRef.current = { ...pendingReadyRef.current, objective: rawInput };
        const stQuestion = pickVariant(SCENARIO_TYPE_QUESTION_VARIANTS);
        const ctxSum = pendingReadyRef.current.summaryText || "";
        currentQuestionRef.current = { fieldName: "scenario_type", fieldOptions: SCENARIO_TYPE_OPTIONS, contextSummary: ctxSum };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", type: "question", questionText: stQuestion, fieldName: "scenario_type", fieldOptions: SCENARIO_TYPE_OPTIONS, contextSummary: ctxSum, time: new Date() }]);
        setInputValue("");
        return;
      }

      // Scenario type answer — finalise and show ready card
      if (fieldName === "scenario_type" && pendingReadyRef.current) {
        const readyMsg = { ...pendingReadyRef.current, scenarioType: rawInput };
        pendingReadyRef.current = null;
        currentQuestionRef.current = null;
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", ...readyMsg, introText: undefined, time: new Date() }]);
        setInputValue("");
        return;
      }

      const normalizedInput = isFyField(fieldName) ? normalizeFY(rawInput) : rawInput;
      if (isFyField(fieldName) && normalizedInput !== VALID_SCENARIO_FY) {
        const errMsg = { from: "bot", type: "text", text: `Hmm, I'm afraid I can only work with **FY ${VALID_SCENARIO_FY}** right now. You entered **"${rawInput}"** — could you try **${VALID_SCENARIO_FY}** instead? 😊`, time: new Date() };
        const reAsk  = { from: "bot", type: "question", questionText: pickVariant(FY_QUESTION_VARIANTS), fieldName, fieldOptions, contextSummary, time: new Date() };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, errMsg, reAsk]);
        setInputValue("");
        return;
      }
      const resolvedInput = isFyField(fieldName) ? normalizedInput : rawInput;
      const base = contextSummary ? contextSummary.replace(/^User wants to /i, "").replace(/\.$/, "") : "";
      apiMessage = base ? `${base} with ${fieldMsgKey(fieldName)} ${resolvedInput}` : `${fieldMsgKey(fieldName)} ${resolvedInput}`;
      currentQuestionRef.current = null;
    }

    const userMsg = { from: "user", text: rawInput, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    try {
      const botData = await callChatbotAPI(apiMessage, sessionId);
      const botMsg = parseBotResponse(botData);
      if (botMsg.sessionId) sessionIdRef.current = botMsg.sessionId;
      if (botMsg.type === "question") {
        currentQuestionRef.current = { fieldName: botMsg.fieldName, fieldOptions: botMsg.fieldOptions, contextSummary: botMsg.contextSummary };
      }
      // Intercept ready state — ask % change first, then objective
      if (botMsg.type === "ready") {
        pendingReadyRef.current = botMsg;
        const ctxSum = botMsg.summaryText || "";
        const alreadyHasPct = /\d+%/.test(ctxSum);
        if (alreadyHasPct) {
          // % already captured in intent — skip straight to objective
          const objQuestion = pickVariant(OBJECTIVE_QUESTION_VARIANTS);
          currentQuestionRef.current = { fieldName: "objective", fieldOptions: [], contextSummary: ctxSum };
          const firstMsg = { from: "bot", type: "question", questionText: objQuestion, fieldName: "objective", fieldOptions: [], contextSummary: ctxSum, time: new Date() };
          if (botMsg.introText && !wasAnsweringQuestion) {
            setMessages((prev) => [...prev, { from: "bot", type: "text", text: botMsg.introText, time: new Date() }, firstMsg]);
          } else {
            setMessages((prev) => [...prev, firstMsg]);
          }
        } else {
          // Ask % change first
          const pctQuestion = pickVariant(PERCENTAGE_QUESTION_VARIANTS);
          currentQuestionRef.current = { fieldName: "magnitude", fieldOptions: ["10%", "15%", "20%", "25%"], contextSummary: ctxSum };
          const firstMsg = { from: "bot", type: "question", questionText: pctQuestion, fieldName: "magnitude", fieldOptions: ["10%", "15%", "20%", "25%"], contextSummary: ctxSum, time: new Date() };
          if (botMsg.introText && !wasAnsweringQuestion) {
            setMessages((prev) => [...prev, { from: "bot", type: "text", text: botMsg.introText, time: new Date() }, firstMsg]);
          } else {
            setMessages((prev) => [...prev, firstMsg]);
          }
        }
      } else if (botMsg.introText && !wasAnsweringQuestion) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", type: "text", text: botMsg.introText, time: new Date() },
          { from: "bot", ...botMsg, introText: undefined, time: new Date() },
        ]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", ...botMsg, introText: undefined, time: new Date() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { from: "bot", type: "text", text: "Sorry, I couldn't reach the server. Please try again.", time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const overlayRef = useRef(null);
  const [maximizing, setMaximizing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedChats, setSavedChats] = useState([]);

  const refreshSavedChats = () => {
    const all = loadSessions().filter((s) => s.id !== chatIdRef.current);
    setSavedChats(all);
  };

  const handleHistoryToggle = () => {
    if (!historyOpen) refreshSavedChats();
    setHistoryOpen((prev) => !prev);
  };

  const loadSavedChat = (session) => {
    chatIdRef.current = session.id;
    sessionIdRef.current = null;
    currentQuestionRef.current = null;
    pendingReadyRef.current = null;
    setMessages(session.messages.map((m) => ({ ...m, time: new Date(m.time) })));
    setHistoryOpen(false);
  };

  const deleteSavedChat = (id) => {
    const sessions = loadSessions().filter((s) => s.id !== id);
    saveSessions(sessions);
    setSavedChats(sessions.filter((s) => s.id !== chatIdRef.current));
    if (chatIdRef.current === id) {
      chatIdRef.current = `chat_${Date.now()}`;
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    chatIdRef.current = `chat_${Date.now()}`;
    sessionIdRef.current = null;
    currentQuestionRef.current = null;
    pendingReadyRef.current = null;
    setMessages([]);
    setHistoryOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleMaximize = () => {
    if (messages.length > 0) {
      localStorage.setItem(POPUP_TRANSFER_KEY, JSON.stringify(messages));
    }
    setMaximizing(true);
    setTimeout(() => {
      window.open("/chatbot", "_blank");
      setMaximizing(false);
      onClose();
    }, 450);
  };

  return (
    <div ref={overlayRef} className={`chatbot-popup-overlay ${theme}-theme${maximizing ? " popup-maximizing" : ""}`}>
      <div className={`chatbot-popup ${theme}-theme`}>
        {/* Popup header */}
        <div className="chatbot-popup-header">
          <span className="chatbot-popup-title"><AiIcon size={22} /> Revenue Chat</span>
          <div className="chatbot-popup-header-actions">
            <button
              className="chatbot-popup-history-btn"
              onClick={handleHistoryToggle}
              title="Saved chats"
            >
              <i className="fas fa-history"></i>
            </button>
            <button
              className="chatbot-popup-newchat-btn"
              onClick={handleNewChat}
              title="New chat"
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              className="chatbot-popup-maximize-btn"
              onClick={handleMaximize}
              disabled={maximizing}
              title="Open full page"
            >
              <i className="fas fa-expand"></i>
            </button>
            <button className="chatbot-popup-close-btn" onClick={onClose} title="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* History dropdown */}
        {historyOpen && (
          <div className="chatbot-popup-history">
            <div className="popup-history-header">
              <i className="fas fa-clock-rotate-left"></i> Recent Chats
            </div>
            <div className="popup-history-list">
              {savedChats.length === 0 ? (
                <div className="popup-history-empty"><i className="far fa-comment-dots popup-history-empty-icon"></i>No saved chats yet</div>
              ) : (
                savedChats.map((session) => (
                  <div key={session.id} className="popup-history-item" onClick={() => loadSavedChat(session)}>
                    <i className="far fa-comment popup-history-item-icon"></i>
                    <span className="popup-history-title">{session.title}</span>
                    <button
                      className="popup-history-delete"
                      onClick={(e) => { e.stopPropagation(); deleteSavedChat(session.id); }}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Popup body */}
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
                    <div className="msg-bubble">{msg.from === "bot" ? renderBotMessage(msg) : msg.text}</div>
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
                  <div className="msg-content">
                    <div className="msg-bubble typing-bubble">
                      <div className="typing-dots"><span></span><span></span><span></span></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Popup input */}
        <div className="chatbot-popup-input-wrapper">
          <div className="chatbot-popup-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-popup-input"
              placeholder="Ask about your marketing data..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isTyping}
            />
            <button
              className="chatbot-popup-send-btn"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Floating Button + Popup wrapper (default export) ───
const ChatBot_API_v2 = ({ theme }) => {
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
      el.style.transition = 'none';
      el.style.animation = 'none';
    };

    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      hasMoved.current = true;
      const touch = e.touches ? e.touches[0] : e;
      const x = touch.clientX - offset.current.x;
      const y = touch.clientY - offset.current.y;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    };

    const onUp = () => {
      dragging.current = false;
      el.style.transition = '';
      el.style.animation = '';
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const handleClick = () => {
    if (!hasMoved.current) {
      setPopupOpen((prev) => !prev);
    }
  };

  return (
    <>
      <div
        ref={btnRef}
        className={`chatbot-nav-wrapper ${theme}-theme`}
        onClick={handleClick}
        title="✨ Ask me anything about your Revenue!"
      >
        <button className={`chatbot-nav-btn ${theme}-theme`}>
          <span className="chatbot-nav-icon" role="img" aria-label="AI bot"><AiIcon size={38} /></span>
        </button>
      </div>
      {popupOpen && (
        <ChatPopup theme={theme} onClose={() => setPopupOpen(false)} />
      )}
    </>
  );
};

// ─── Full-page ChatBot Page (named export) ───
export const ChatBotPage = ({ theme: themeProp }) => {
  const theme = themeProp || "light";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState(loadSessions);
  const [currentChatId, setCurrentChatId] = useState(() => `chat_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const skipSaveRef = useRef(false);
  const sessionIdRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const pendingReadyRef    = useRef(null);
  useEffect(() => {
    try {
      const transferred = localStorage.getItem(POPUP_TRANSFER_KEY);
      if (transferred) {
        const parsed = JSON.parse(transferred);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m) => ({ ...m, time: new Date(m.time) })));
        }
        localStorage.removeItem(POPUP_TRANSFER_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-save messages to localStorage
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    if (messages.length === 0) return;

    setChatSessions((prev) => {
      const existing = prev.find((s) => s.id === currentChatId);
      let updated;
      if (existing) {
        updated = prev.map((s) =>
          s.id === currentChatId
            ? { ...s, messages, updatedAt: Date.now() }
            : s
        );
      } else {
        const firstUserMsg = messages.find((m) => m.from === "user");
        const rawText = firstUserMsg ? firstUserMsg.text : "New Chat";
        const stopWords = new Set(["is","the","a","an","in","for","of","to","and","or","how","what","which","show","me","has","vs","does","do","can","all","across","much","goes"]);
        const keywords = rawText.split(/\s+/).filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1);
        const title = keywords.length > 0 ? keywords.slice(0, 5).join(" ") : rawText.slice(0, 30);
        updated = [
          { id: currentChatId, title, messages, createdAt: Date.now(), updatedAt: Date.now() },
          ...prev,
        ];
      }
      saveSessions(updated);
      return updated;
    });
  }, [messages, currentChatId]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(`chat_${Date.now()}`);
    sessionIdRef.current = null;
    currentQuestionRef.current = null;
    pendingReadyRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (val) => {
    setInputValue(val);
  };

  const loadChat = (session) => {
    skipSaveRef.current = true;
    sessionIdRef.current = null;
    currentQuestionRef.current = null;
    pendingReadyRef.current = null;
    setCurrentChatId(session.id);
    setMessages(
      session.messages.map((m) => ({ ...m, time: new Date(m.time) }))
    );
  };

  const deleteChat = (id) => {
    setChatSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSessions(updated);
      return updated;
    });
    if (currentChatId === id) {
      setMessages([]);
      setCurrentChatId(`chat_${Date.now()}`);
    }
  };

  const handleSend = async (text) => {
    const rawInput = (text || inputValue).trim();
    if (!rawInput) return;
    let apiMessage = rawInput;
    const sessionId = sessionIdRef.current;
    let wasAnsweringQuestion = false;

    // Conversational mode — wrap typed answer into full context sentence
    if (currentQuestionRef.current) {
      wasAnsweringQuestion = true;
      const { fieldName, fieldOptions, contextSummary } = currentQuestionRef.current;

      // Magnitude answer — store in pendingReady then ask objective
      if (fieldName === "magnitude" && pendingReadyRef.current) {
        pendingReadyRef.current = { ...pendingReadyRef.current, magnitude: rawInput };
        const objQuestion = pickVariant(OBJECTIVE_QUESTION_VARIANTS);
        const ctxSum = pendingReadyRef.current.summaryText || "";
        currentQuestionRef.current = { fieldName: "objective", fieldOptions: [], contextSummary: ctxSum };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", type: "question", questionText: objQuestion, fieldName: "objective", fieldOptions: [], contextSummary: ctxSum, time: new Date() }]);
        setInputValue("");
        return;
      }

      // Objective answer — store then ask scenario type
      if (fieldName === "objective" && pendingReadyRef.current) {
        pendingReadyRef.current = { ...pendingReadyRef.current, objective: rawInput };
        const stQuestion = pickVariant(SCENARIO_TYPE_QUESTION_VARIANTS);
        const ctxSum = pendingReadyRef.current.summaryText || "";
        currentQuestionRef.current = { fieldName: "scenario_type", fieldOptions: SCENARIO_TYPE_OPTIONS, contextSummary: ctxSum };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", type: "question", questionText: stQuestion, fieldName: "scenario_type", fieldOptions: SCENARIO_TYPE_OPTIONS, contextSummary: ctxSum, time: new Date() }]);
        setInputValue("");
        return;
      }

      // Scenario type answer — finalise and show ready card
      if (fieldName === "scenario_type" && pendingReadyRef.current) {
        const readyMsg = { ...pendingReadyRef.current, scenarioType: rawInput };
        pendingReadyRef.current = null;
        currentQuestionRef.current = null;
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, { from: "bot", ...readyMsg, introText: undefined, time: new Date() }]);
        setInputValue("");
        return;
      }

      // FY validation: only 2025-26 is allowed
      const normalizedInput = isFyField(fieldName) ? normalizeFY(rawInput) : rawInput;
      if (isFyField(fieldName) && normalizedInput !== VALID_SCENARIO_FY) {
        const errMsg = { from: "bot", type: "text", text: `Hmm, I'm afraid I can only work with **FY ${VALID_SCENARIO_FY}** right now. You entered **"${rawInput}"** — could you try **${VALID_SCENARIO_FY}** instead? 😊`, time: new Date() };
        const reAsk  = { from: "bot", type: "question", questionText: pickVariant(FY_QUESTION_VARIANTS), fieldName, fieldOptions, contextSummary, time: new Date() };
        setMessages((prev) => [...prev, { from: "user", text: rawInput, time: new Date() }, errMsg, reAsk]);
        setInputValue("");
        return;
      }
      const resolvedInput = isFyField(fieldName) ? normalizedInput : rawInput;
      const base = contextSummary ? contextSummary.replace(/^User wants to /i, "").replace(/\.$/, "") : "";
      apiMessage = base ? `${base} with ${fieldMsgKey(fieldName)} ${resolvedInput}` : `${fieldMsgKey(fieldName)} ${resolvedInput}`;
      currentQuestionRef.current = null;
    }

    const userMsg = { from: "user", text: rawInput, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botData = await callChatbotAPI(apiMessage, sessionId);
      const botMsg = parseBotResponse(botData);
      if (botMsg.sessionId) sessionIdRef.current = botMsg.sessionId;
      if (botMsg.type === "question") {
        currentQuestionRef.current = { fieldName: botMsg.fieldName, fieldOptions: botMsg.fieldOptions, contextSummary: botMsg.contextSummary };
      }
      // Intercept ready state — ask % change first, then objective
      if (botMsg.type === "ready") {
        pendingReadyRef.current = botMsg;
        const ctxSum = botMsg.summaryText || "";
        const alreadyHasPct = /\d+%/.test(ctxSum);
        if (alreadyHasPct) {
          // % already captured in intent — skip straight to objective
          const objQuestion = pickVariant(OBJECTIVE_QUESTION_VARIANTS);
          currentQuestionRef.current = { fieldName: "objective", fieldOptions: [], contextSummary: ctxSum };
          const firstMsg = { from: "bot", type: "question", questionText: objQuestion, fieldName: "objective", fieldOptions: [], contextSummary: ctxSum, time: new Date() };
          if (botMsg.introText && !wasAnsweringQuestion) {
            setMessages((prev) => [...prev, { from: "bot", type: "text", text: botMsg.introText, time: new Date() }, firstMsg]);
          } else {
            setMessages((prev) => [...prev, firstMsg]);
          }
        } else {
          // Ask % change first
          const pctQuestion = pickVariant(PERCENTAGE_QUESTION_VARIANTS);
          currentQuestionRef.current = { fieldName: "magnitude", fieldOptions: ["10%", "15%", "20%", "25%"], contextSummary: ctxSum };
          const firstMsg = { from: "bot", type: "question", questionText: pctQuestion, fieldName: "magnitude", fieldOptions: ["10%", "15%", "20%", "25%"], contextSummary: ctxSum, time: new Date() };
          if (botMsg.introText && !wasAnsweringQuestion) {
            setMessages((prev) => [...prev, { from: "bot", type: "text", text: botMsg.introText, time: new Date() }, firstMsg]);
          } else {
            setMessages((prev) => [...prev, firstMsg]);
          }
        }
      } else if (botMsg.introText && !wasAnsweringQuestion) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", type: "text", text: botMsg.introText, time: new Date() },
          { from: "bot", ...botMsg, introText: undefined, time: new Date() },
        ]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", ...botMsg, introText: undefined, time: new Date() }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", type: "text", text: "Sorry, I couldn't reach the server. Please try again.", time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-page ${theme}-theme`}>
      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="chatbot-sidebar">
        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">MANAGER_BRAND_2</span>
            <span className="sidebar-user-role">Dashboard User</span>
          </div>
        </div>

        {/* New Chat */}
        <button
          className="sidebar-newchat-btn"
          onClick={handleNewChat}
          title="New Chat"
        >
          <i className="fas fa-plus"></i> New Chat
        </button>

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
              <div
                key={session.id}
                className={`sidebar-chat-item ${session.id === currentChatId ? "active" : ""}`}
                onClick={() => loadChat(session)}
              >
                <i className="far fa-comment sidebar-chat-icon"></i>
                <span className="sidebar-chat-title">{session.title}</span>
                <button
                  className="sidebar-chat-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(session.id);
                  }}
                  title="Delete chat"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="chatbot-main">
        <div className="chatbot-topbar">
          <span className="chatbot-title-text"><AiIcon size={30} /> Revenue Chat</span>
        </div>
        {messages.length === 0 ? (
          /* Empty state — ChatGPT style centered */
          <div className="chatbot-empty-state">
            <h2 className="chatbot-empty-title">Where should we begin?</h2>
            <div className="chatbot-center-input-wrapper">
              <div className="chatbot-center-input-area">
                <input
                  ref={inputRef}
                  type="text"
                  className="chatbot-center-input"
                  placeholder="AI-powered marketing intelligence hub — Explore brand performance, media ROI, model accuracy & optimization"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              <button className="chatbot-center-voice-btn" title="Voice input">
                <i className="fas fa-microphone"></i>
              </button>
              <button
                className="chatbot-center-send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat messages */
          <>
            <div className="chatbot-body">
              <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chatbot-msg ${msg.from === "bot" ? "msg-bot" : "msg-user"}`}
                  >
                    {msg.from === "bot" && (
                      <div className="msg-avatar"><AiIcon size={24} /></div>
                    )}
                    <div className="msg-content">
                      <div className="msg-bubble">
                        {msg.from === "bot" ? renderBotMessage(msg) : msg.text}
                      </div>
                      {msg.from === "bot" && msg.recommendations?.length > 0 && (
                        <div className="msg-recommendations">
                          <span className="msg-rec-label">You might also ask:</span>
                          {msg.recommendations.map((rec, ri) => (
                            <button
                              key={ri}
                              className="msg-rec-btn"
                              onClick={() => handleSend(rec)}
                            >
                              → {rec}
                            </button>
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
                    <div className="msg-content">
                      <div className="msg-bubble typing-bubble">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
              <button
                className="chatbot-send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBot_API_v2;
