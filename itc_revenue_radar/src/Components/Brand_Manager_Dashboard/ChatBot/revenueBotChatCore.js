/**
 * Revenue bot — WebSocket connection, message mapping, chat hooks, and session/prefill storage.
 * UI lives in ChatBot_API_v2.jsx.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import UserService from "../../../services/UserService";

// ─── Constants ───
const CHAT_STORAGE_KEY = "revenue_chat_sessions";
export const POPUP_TRANSFER_KEY = "revenue_chat_popup_transfer";
export const POPUP_RESTORE_OPEN_KEY = "revenue_chat_restore_popup";
export const SCENARIO_PREFILL_KEY = "revenue_chat_scenario_prefill";
const WS_BASE =
  process.env.REACT_APP_REVENUE_BOT_WS_BASE ||
  "wss://revenue.radar.bot.api.quation.co.in/revenue-bot/ws";

export const WS_STATUS = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  ERROR: "error",
};

export const WS_STATUS_LABELS = {
  connecting: "Connecting…",
  connected: "Online",
  disconnected: "Offline",
  error: "Connection error",
};

const REVENUE_BOT_ROLE_MAP = [
  { codes: ["adminrole"], role: "ADMIN" },
  { codes: ["BBMNGR"], role: "BBMNGR" },
  { codes: ["OODMNGR"], role: "OODMNGR" },
  { codes: ["CBMNGR"], role: "CBMNGR" },
  { codes: ["MUMNGR"], role: "MUMNGR" },
  { codes: ["SALES"], role: "SALES" },
];

const getRevenueBotRoleCode = () => {
  for (const { codes, role } of REVENUE_BOT_ROLE_MAP) {
    if (UserService.hasRole(codes)) return role;
  }
  return "";
};

/** Backend may return display/session roles (e.g. viewer, brand_manager). Confirm must use Keycloak API codes. */
const API_ROLE_TO_CONFIRM_CODE = {
  admin: "ADMIN",
  adminrole: "ADMIN",
  brand_manager: "BBMNGR",
  bbmngr: "BBMNGR",
  oodles_manager: "OODMNGR",
  oodmngr: "OODMNGR",
  cbmngr: "CBMNGR",
  mumngr: "MUMNGR",
  sales: "SALES",
};

const resolveConfirmRole = (apiRole) => {
  const keycloakRole = getRevenueBotRoleCode();
  if (keycloakRole) return keycloakRole;

  const normalized = String(apiRole || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
  if (!normalized || normalized === "viewer") return "";

  return API_ROLE_TO_CONFIRM_CODE[normalized] || "";
};

const makeAbortError = () => {
  const err = new Error("Aborted");
  err.name = "CanceledError";
  err.code = "ERR_CANCELED";
  return err;
};

export const toLabel = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

// ─── localStorage helpers ───
export const loadSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveSessions = (sessions) =>
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));

// ─── Map WebSocket RESPONSE (backend sends canonical JSON) ───
export const getMissingFieldPrompt = (field, fieldHints, fieldOptions) => {
  if (fieldHints?.[field]) {
    return { question: fieldHints[field], example: null };
  }
  const label = toLabel(field);
  const opts = fieldOptions?.[field];
  if (Array.isArray(opts) && opts.length > 0) {
    return {
      question: `What should I use for ${label}?`,
      example: `e.g. ${opts.join(", ")}`,
    };
  }
  return { question: `What should I use for ${label}?`, example: null };
};

export const formatScenarioDriver = (item) => {
  if (!item || typeof item !== "object") return String(item ?? "");
  const name = toLabel(item.driver_name || "driver");
  const changeType = String(item.change_type || "").toLowerCase();
  const value = item.change_value ?? "";
  const unit = item.change_unit || "%";
  if (!value && value !== 0) return name;
  return `${changeType ? `${changeType} ` : ""}${name} by ${value}${unit}`;
};

const mapFieldOptions = (raw) => {
  const fieldOptions = {};
  const fieldHints = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { fieldOptions, fieldHints };
  Object.entries(raw).forEach(([key, value]) => {
    if (Array.isArray(value)) fieldOptions[key] = value.map(String).filter(Boolean);
    else if (typeof value === "string" && value.trim()) fieldHints[key] = value.trim();
  });
  return { fieldOptions, fieldHints };
};

const buildConfirmPayload = (data) => {
  const {
    brand,
    market,
    fy,
    timeline,
    scenario_details: scenarioDetails,
    suggested_scenario_name: suggestedScenarioName,
    scenario_name: scenarioName,
    role,
  } = data;
  const name = suggestedScenarioName || scenarioName;
  if (!name && !brand && !market) return null;
  const confirmRole = resolveConfirmRole(role);

  return {
    action: "confirm",
    role: confirmRole,
    scenario_name: String(name || ""),
    brand: brand ?? null,
    market: market ?? null,
    fy: fy ?? null,
    timeline: timeline ?? null,
    ...(Array.isArray(scenarioDetails) && scenarioDetails.length > 0
      ? { scenario_details: scenarioDetails }
      : {}),
  };
};

export const TIMETYPE_LABELS = { Y: "Yearly", HY: "Half-Yearly", Q: "Quarterly", M: "Monthly" };

export const resolveTimetype = (scenarioName, timeline) => {
  const name = String(scenarioName || "");
  if (name.startsWith("M_")) return "M";
  if (name.startsWith("Y_")) return "Y";
  if (name.startsWith("Q_")) return "Q";
  if (name.startsWith("HY_")) return "HY";
  const value = String(timeline || "").toLowerCase();
  if (value.includes("quarter") || value === "q") return "Q";
  if (value.includes("half") || value === "hy") return "HY";
  if (value.includes("year") || value === "y") return "Y";
  if (value.includes("month") || value === "m") return "M";
  return "";
};

export const buildScenarioPrefillFromConfirm = (reply, fallback = {}) => {
  const scenario_name = reply?.scenarioName || fallback?.scenario_name || "";
  const timeline = reply?.timeline || fallback?.timeline || "";
  const scenario_details =
    fallback?.scenario_details ||
    (Array.isArray(reply?.scenarioDetails) ? reply.scenarioDetails : null);
  return {
    brand: reply?.brand || fallback?.brand || "",
    market: reply?.market || fallback?.market || "",
    fy: reply?.fy || fallback?.fy || "",
    timeline,
    scenario_name,
    scenario_timestamp: reply?.scenarioTimestamp || fallback?.scenario_timestamp || "",
    scenario_details: Array.isArray(scenario_details) ? scenario_details : [],
    scenarionewoldscreen: "old",
    timetype: resolveTimetype(scenario_name, timeline),
    from_chatbot: true,
  };
};

export const saveScenarioPrefill = (prefill) =>
  localStorage.setItem(SCENARIO_PREFILL_KEY, JSON.stringify(prefill));

export const consumeScenarioPrefill = () => {
  try {
    const raw = localStorage.getItem(SCENARIO_PREFILL_KEY);
    if (!raw) return null;
    localStorage.removeItem(SCENARIO_PREFILL_KEY);
    const prefill = JSON.parse(raw);
    return prefill && typeof prefill === "object" ? prefill : null;
  } catch {
    return null;
  }
};

const mapWsResponse = (data) => {
  const fail = (text, reason = "server_error") => ({
    text,
    quickReplies: [],
    recommendations: [],
    missingFields: [],
    fieldOptions: {},
    fieldHints: {},
    readyToRun: false,
    intentType: null,
    status: "failed",
    reason,
    errors: [text],
    clarifyingQuestion: null,
    resolvedRole: null,
    completionCard: null,
    confirmPayload: null,
    isSaved: false,
    scenarioName: null,
    scenarioTimestamp: null,
    brand: null,
    market: null,
    fy: null,
    timeline: null,
  });

  if (!data || typeof data !== "object") return fail("Got it. Please share more details.");

  const {
    message,
    intent,
    status,
    reason,
    role,
    ready_to_run: readyToRun,
    missing_parameters: missingParameters = [],
    missing_field_options: optionsRaw,
    errors = [],
    clarifying_question: clarifyingQuestion,
    quick_replies: quickReplies = [],
    brand,
    market,
    fy,
    timeline,
    scenario_details: scenarioDetails,
    suggested_scenario_name: suggestedScenarioName,
    scenario_name: scenarioName,
    scenario_timestamp: scenarioTimestamp,
  } = data;

  const { fieldOptions, fieldHints } = mapFieldOptions(optionsRaw);
  const text = String(message || clarifyingQuestion || "").trim() || "Got it. Please share more details.";
  const missingFields = Array.isArray(missingParameters) ? missingParameters.map(String) : [];
  const errList = Array.isArray(errors) ? errors.map(String).filter(Boolean) : [];
  const replies = Array.isArray(quickReplies) ? quickReplies : [];
  const isSaved = String(status || "").toLowerCase() === "saved";
  const resolvedScenarioName = scenarioName || suggestedScenarioName || null;

  const isMissingParams = reason === "missing_parameters" || (missingFields.length > 0 && readyToRun === false);

  const baseFields = {
    text,
    intentType: intent || null,
    status: status || null,
    reason: reason || null,
    resolvedRole: role || null,
    missingFields,
    fieldOptions,
    fieldHints,
    errors: errList,
    clarifyingQuestion: clarifyingQuestion || null,
    quickReplies: replies,
    recommendations: replies,
    isMissingParams,
    brand: brand || null,
    market: market || null,
    fy: fy || null,
    timeline: timeline || null,
    scenarioName: resolvedScenarioName,
    scenarioTimestamp: scenarioTimestamp || null,
    confirmPayload: null,
    isSaved,
  };

  if (isSaved) {
    return {
      ...baseFields,
      readyToRun: false,
      completionCard: null,
      confirmPayload: null,
    };
  }

  const showCompletionCard = readyToRun === true;

  return {
    ...baseFields,
    readyToRun: typeof readyToRun === "boolean" ? readyToRun : null,
    completionCard: showCompletionCard
      ? {
          title: "Scenario ready to run",
          message: text,
          suggestedName: suggestedScenarioName || scenarioName || null,
          details: { brand, market, fy, timeline, scenarioDetails },
        }
      : null,
    confirmPayload: showCompletionCard ? buildConfirmPayload(data) : null,
  };
};

// ─── WebSocket ───
const getWsUserId = () => {
  const username = UserService.getUsername();
  const safe = String(username || "test_user").trim().replace(/[^\w.-]/g, "_");
  return safe || "test_user";
};

const buildWsUrl = () => {
  const base = String(WS_BASE || "").replace(/\/$/, "");
  return `${base}/${encodeURIComponent(getWsUserId())}`;
};

const createRevenueBotSocket = () => {
  let socket = null;
  let status = WS_STATUS.DISCONNECTED;
  let pending = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let shouldStayConnected = false;
  let refCount = 0;
  let wsSessionId = null;
  let scenarioFlowActive = false;
  const statusListeners = new Set();
  const sessionListeners = new Set();
  const scenarioFlowListeners = new Set();

  const notifyStatus = (next) => {
    status = next;
    statusListeners.forEach((fn) => fn(next));
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const rejectPending = (error) => {
    if (!pending) return;
    const { reject } = pending;
    pending = null;
    reject(error);
  };

  const scheduleReconnect = () => {
    if (!shouldStayConnected) return;
    clearReconnectTimer();
    const delay = Math.min(1000 * 2 ** reconnectAttempt, 15000);
    reconnectAttempt += 1;
    reconnectTimer = setTimeout(() => {
      if (shouldStayConnected) openSocket();
    }, delay);
  };

  const openSocket = () => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    notifyStatus(WS_STATUS.CONNECTING);

    try {
      socket = new WebSocket(buildWsUrl());
    } catch (error) {
      notifyStatus(WS_STATUS.ERROR);
      scheduleReconnect();
      return;
    }

    socket.onopen = () => {
      reconnectAttempt = 0;
      notifyStatus(WS_STATUS.CONNECTED);
    };

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      const eventType = String(data?.event || "").toUpperCase();

      if (eventType === "CONNECTED") {
        wsSessionId = data?.session_id ? String(data.session_id) : wsSessionId;
        sessionListeners.forEach((fn) => fn(wsSessionId));
        return;
      }

      if (eventType === "THINKING" || !pending) return;

      if (eventType === "ERROR") {
        const { reject } = pending;
        pending = null;
        reject(new Error(String(data?.message || "Server error")));
        return;
      }

      if (eventType !== "RESPONSE") return;

      const { resolve } = pending;
      pending = null;
      if (process.env.NODE_ENV !== "production") console.debug("Revenue bot WS response:", data);
      const mapped = mapWsResponse(data);
      mapped.sessionId = wsSessionId;

      const isScenarioIntent = String(mapped.intentType || "").toLowerCase().includes("scenario");
      if (mapped.isSaved || mapped.readyToRun === true) {
        scenarioFlowActive = false;
        scenarioFlowListeners.forEach((fn) => fn(false));
      } else if (isScenarioIntent || mapped.isMissingParams) {
        scenarioFlowActive = true;
        scenarioFlowListeners.forEach((fn) => fn(true));
      }

      resolve(mapped);
    };

    socket.onerror = () => {
      if (status !== WS_STATUS.CONNECTED) notifyStatus(WS_STATUS.ERROR);
    };

    socket.onclose = () => {
      socket = null;
      rejectPending(new Error("WebSocket disconnected"));
      notifyStatus(WS_STATUS.DISCONNECTED);
      scheduleReconnect();
    };
  };

  const connect = () => {
    shouldStayConnected = true;
    reconnectAttempt = 0;
    clearReconnectTimer();
    openSocket();
  };

  const disconnect = () => {
    shouldStayConnected = false;
    refCount = 0;
    scenarioFlowActive = false;
    clearReconnectTimer();
    rejectPending(new Error("WebSocket closed"));
    if (socket) {
      socket.onclose = null;
      socket.close();
      socket = null;
    }
    wsSessionId = null;
    notifyStatus(WS_STATUS.DISCONNECTED);
  };

  /** Close and reopen WebSocket so backend starts a fresh session (after scenario completes or new chat). */
  const resetSession = () => {
    scenarioFlowActive = false;
    scenarioFlowListeners.forEach((fn) => fn(false));
    wsSessionId = null;
    if (!shouldStayConnected) return Promise.resolve();

    return new Promise((resolve) => {
      const finish = () => {
        clearReconnectTimer();
        reconnectAttempt = 0;
        openSocket();
        const unsub = subscribeStatus((next) => {
          if (next === WS_STATUS.CONNECTED) {
            unsub();
            resolve(wsSessionId);
          }
        });
      };

      rejectPending(new Error("Session reset"));
      if (socket) {
        socket.onclose = () => {
          socket = null;
          notifyStatus(WS_STATUS.DISCONNECTED);
          finish();
        };
        socket.close();
      } else {
        finish();
      }
    });
  };

  const acquire = () => {
    refCount += 1;
    if (refCount === 1) connect();
  };

  const release = () => {
    refCount = Math.max(0, refCount - 1);
    if (refCount === 0) disconnect();
  };

  const sendPayload = (payload, options = {}) => {
    const { signal = undefined } = options;

    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(makeAbortError());
        return;
      }

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      if (pending) {
        pending.reject(new Error("Previous request superseded"));
        pending = null;
      }

      const onAbort = () => {
        if (pending?.resolve === resolve) pending = null;
        reject(makeAbortError());
      };

      signal?.addEventListener("abort", onAbort, { once: true });

      pending = {
        resolve: (value) => {
          signal?.removeEventListener("abort", onAbort);
          resolve(value);
        },
        reject: (error) => {
          signal?.removeEventListener("abort", onAbort);
          reject(error);
        },
      };

      socket.send(JSON.stringify(payload));
    });
  };

  const sendMessage = (message, options = {}) => {
    const {
      role = getRevenueBotRoleCode(),
      brand = null,
      market = null,
      fy = null,
      timeline = null,
      signal = undefined,
    } = options;

    return sendPayload(
      {
        message: String(message || "").trim(),
        role: role ?? "",
        brand: brand ?? null,
        market: market ?? null,
        fy: fy ?? null,
        timeline: timeline ?? null,
      },
      { signal }
    );
  };

  const subscribeStatus = (listener) => {
    statusListeners.add(listener);
    listener(status);
    return () => statusListeners.delete(listener);
  };

  const subscribeSession = (listener) => {
    sessionListeners.add(listener);
    if (wsSessionId) listener(wsSessionId);
    return () => sessionListeners.delete(listener);
  };

  const subscribeScenarioFlow = (listener) => {
    scenarioFlowListeners.add(listener);
    listener(scenarioFlowActive);
    return () => scenarioFlowListeners.delete(listener);
  };

  const isScenarioFlowActive = () => scenarioFlowActive;

  return {
    acquire,
    release,
    sendMessage,
    sendPayload,
    resetSession,
    subscribeStatus,
    subscribeSession,
    subscribeScenarioFlow,
    getStatus: () => status,
    getSessionId: () => wsSessionId,
    isScenarioFlowActive,
  };
};

export const revenueBotSocket = createRevenueBotSocket();
let wsConnectToastShown = false;

const showWsConnectedToast = () => {
  if (wsConnectToastShown) return;
  wsConnectToastShown = true;
  toast.success("Real-time chat enabled — you are online.", {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const useRevenueBotWebSocket = ({ enabled = true } = {}) => {
  const [wsStatus, setWsStatus] = useState(revenueBotSocket.getStatus());

  useEffect(() => {
    if (!enabled) return undefined;

    revenueBotSocket.acquire();
    const unsubscribe = revenueBotSocket.subscribeStatus((next) => {
      setWsStatus(next);
      if (next === WS_STATUS.CONNECTED) showWsConnectedToast();
      if (next === WS_STATUS.DISCONNECTED || next === WS_STATUS.ERROR) {
        wsConnectToastShown = false;
      }
    });

    return () => {
      unsubscribe();
      revenueBotSocket.release();
    };
  }, [enabled]);

  const sendBotMessage = useCallback(
    (message, options) => revenueBotSocket.sendMessage(message, options),
    []
  );

  const sendBotPayload = useCallback(
    (payload, options) => revenueBotSocket.sendPayload(payload, options),
    []
  );

  return { wsStatus, sendBotMessage, sendBotPayload };
};

// ─── Shared send logic (backend keeps session on the same WebSocket until confirm saved) ───
export const useChatSend = ({
  setMessages,
  setInputValue,
  setIsTyping,
  requestControllerRef,
  sendBotMessage,
  wsStatus,
  feOverrides = {},
}) => {
  const handleSend = async (text, inputValue) => {
    const msg = (text || inputValue || "").trim();
    if (!msg) return;

    if (wsStatus !== WS_STATUS.CONNECTED) {
      toast.info(
        wsStatus === WS_STATUS.CONNECTING
          ? "Connecting to Revenue assistant…"
          : "Reconnecting to Revenue assistant. Please try again in a moment.",
        { position: "top-right", autoClose: 3000 }
      );
      return;
    }

    setMessages((prev) => [...prev, { from: "user", text: msg, time: new Date() }]);
    setInputValue("");
    setIsTyping(true);

    try {
      requestControllerRef.current?.abort?.();
      const controller = new AbortController();
      requestControllerRef.current = controller;

      const reply = await sendBotMessage(msg, {
        role: getRevenueBotRoleCode(),
        signal: controller.signal,
        ...feOverrides,
      });
      setMessages((prev) => [...prev, { from: "bot", ...reply, time: new Date() }]);
    } catch (error) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
      const errText = String(error?.message || "");
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errText.includes("WebSocket")
            ? "Sorry, I couldn't reach the assistant. Please check your connection and try again."
            : errText || "Sorry, something went wrong. Please try again.",
          recommendations: [],
          errors: errText ? [errText] : [],
          time: new Date(),
        },
      ]);
    } finally {
      requestControllerRef.current = null;
      setIsTyping(false);
    }
  };
  return handleSend;
};

export const useScenarioConfirm = ({ wsStatus, setMessages, setIsTyping, navigate, onClose }) => {
  const [confirmingMessageIndex, setConfirmingMessageIndex] = useState(null);
  const [confirmedMessageIndexes, setConfirmedMessageIndexes] = useState([]);
  const confirmLockRef = useRef(new Set());

  const lockConfirmCard = useCallback(
    (messageIndex) => {
      confirmLockRef.current.add(messageIndex);
      setConfirmedMessageIndexes((prev) => [...new Set([...prev, messageIndex])]);
      setMessages((prev) =>
        prev.map((m, i) => (i === messageIndex ? { ...m, scenarioConfirmed: true } : m))
      );
    },
    [setMessages]
  );

  const handleConfirmScenario = useCallback(
    async (msg, messageIndex) => {
      if (confirmLockRef.current.has(messageIndex) || msg?.scenarioConfirmed) return;

      const basePayload = msg?.confirmPayload;
      if (!basePayload) return;

      const payload = {
        ...basePayload,
        role: resolveConfirmRole(basePayload.role) || getRevenueBotRoleCode(),
      };

      if (!payload.role) {
        toast.error(
          "Your account does not have permission to save scenarios. Please contact your administrator.",
          { position: "top-right", autoClose: 5000 }
        );
        return;
      }

      if (wsStatus !== WS_STATUS.CONNECTED) {
        toast.info("Reconnecting to Revenue assistant. Please try again in a moment.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      lockConfirmCard(messageIndex);
      setConfirmingMessageIndex(messageIndex);
      setIsTyping(true);

      try {
        const reply = await revenueBotSocket.sendPayload(payload);
        if (reply.isSaved || String(reply.status || "").toLowerCase() === "saved") {
          const prefill = buildScenarioPrefillFromConfirm(reply, payload);
          saveScenarioPrefill(prefill);
          toast.success(
            reply.text ||
              `Scenario "${prefill.scenario_name || "saved"}" saved. Opening Scenario Planner…`
          );
          await revenueBotSocket.resetSession().catch(() => {});
          onClose?.();
          navigate("/dashboard/simulator");
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: reply.text || "Could not save this scenario. Please try again.",
            errors: reply.errors?.length ? reply.errors : [],
            recommendations: [],
            time: new Date(),
          },
        ]);
      } catch (error) {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "I could not confirm this scenario right now. Please try again.",
            recommendations: [],
            time: new Date(),
          },
        ]);
      } finally {
        setConfirmingMessageIndex(null);
        setIsTyping(false);
      }
    },
    [wsStatus, setMessages, setIsTyping, navigate, onClose, lockConfirmCard]
  );

  const resetConfirmState = useCallback(() => {
    confirmLockRef.current.clear();
    setConfirmingMessageIndex(null);
    setConfirmedMessageIndexes([]);
  }, []);

  return {
    confirmingMessageIndex,
    confirmedMessageIndexes,
    handleConfirmScenario,
    resetConfirmState,
  };
};
