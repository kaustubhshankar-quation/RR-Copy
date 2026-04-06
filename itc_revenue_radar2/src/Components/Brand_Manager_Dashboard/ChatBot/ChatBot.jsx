import React, { useState, useRef, useEffect, useCallback } from "react";
import "./ChatBot.css";

const FAQ_LIST = [
  {
    category: "Brand Performance",
    icon: "fa-chart-line",
    items: [
      {
        question: "Which brands and markets are tracked?",
        answer: [
          { label: "Brands", value: "MILD URGENCY, CHERY BRIGHT, OODLES, BAD BANGLES" },
          { label: "Markets", value: "EAST, WEST, NORTH, SOUTH" },
          { label: "Time Periods", value: "Q1–Q4 FY25 and Full-Year FY25" },
        ],
      },
      {
        question: "Which brand leads in market share?",
        answer: [
          { label: "NORTH", value: "OODLES — 36.0%" },
          { label: "EAST", value: "OODLES — 29.7%" },
          { label: "WEST", value: "CHERY BRIGHT — 28.2%" },
          { label: "SOUTH", value: "MILD URGENCY — 22.6%" },
        ],
        footnote: "OODLES is the overall market share leader.",
      },
      {
        question: "Which brand has the highest revenue?",
        answer: [
          { label: "Top Revenue", value: "CHERY BRIGHT — ₹15,460.8 Lakhs (NORTH, FY25)" },
          { label: "Top Volume", value: "OODLES — 1,401.8 MT (NORTH, FY25)" },
        ],
        footnote: "CHERY BRIGHT leads in revenue due to a higher price per MT.",
      },
    ],
  },
  {
    category: "Media Mix & ROI",
    icon: "fa-bullhorn",
    items: [
      {
        question: "Which channel gives the best ROI?",
        answer: [
          { label: "Digital", value: "4.8x (CHERY BRIGHT) · 3.8x (OODLES)", tag: "Best" },
          { label: "TV", value: "1.9x – 3.6x" },
          { label: "Consumer Promo", value: "1.6x – 2.4x" },
          { label: "Trade Promo", value: "1.1x – 1.7x" },
          { label: "OOH", value: "0.9x – 1.5x", tag: "Lowest" },
        ],
      },
      {
        question: "How much is spent on each channel?",
        answer: [
          { label: "TV", value: "₹240 – 680 Lakhs" },
          { label: "Digital", value: "₹150 – 420 Lakhs" },
          { label: "Trade Promo", value: "₹240 – 410 Lakhs" },
          { label: "Consumer Promo", value: "₹160 – 280 Lakhs" },
          { label: "OOH", value: "₹55 – 110 Lakhs" },
        ],
        footnote: "Total brand budgets range from ₹1,135L to ₹1,630L per market.",
      },
    ],
  },
  {
    category: "Model Performance",
    icon: "fa-brain",
    items: [
      {
        question: "How accurate are the models?",
        answer: [
          { label: "CHERY BRIGHT", value: "92.5 – 93.1% accuracy · R² 0.97", tag: "Best" },
          { label: "MILD URGENCY", value: "91.0 – 91.9% accuracy" },
          { label: "OODLES", value: "90.6 – 92.2% accuracy" },
          { label: "BAD BANGLES", value: "87.9 – 89.2% accuracy" },
        ],
        footnote: "All models built on 144 weekly observations (Apr 2022 – Dec 2024).",
      },
      {
        question: "What is MAPE and R²?",
        answer: [
          { label: "MAPE", value: "Prediction error % — lower is better. Under 10% = good, under 7% = excellent" },
          { label: "R²", value: "Model fit score — closer to 1.0 is better. Above 0.90 = strong model" },
        ],
      },
    ],
  },
  {
    category: "Optimization & Scenarios",
    icon: "fa-sliders-h",
    items: [
      {
        question: "What uplift does optimization deliver?",
        answer: [
          { label: "CHERY BRIGHT NORTH", value: "+10.0% uplift (1,288 → 1,417 MT)", tag: "Best" },
          { label: "OODLES NORTH", value: "+8.9% uplift (1,401 → 1,527 MT)" },
          { label: "BAD BANGLES NORTH", value: "+7.9% uplift (892 → 963 MT)" },
        ],
        footnote: "Same total budget — only channel reallocation. Digital ↑22–30%, TV ↑10–15%, OOH ↓32–88%.",
      },
      {
        question: "What is base vs optimized scenario?",
        answer: [
          { label: "Base", value: "Current channel allocation and projected sales at existing splits" },
          { label: "Optimized", value: "Model-recommended reallocation for maximum sales impact" },
        ],
        footnote: "Same total spend, different channel distribution, higher forecasted volume.",
      },
    ],
  },
];

const SIDEBAR_PROMPTS = [
  {
    category: "Brand & Market",
    icon: "📊",
    prompts: [
      "How is OODLES performing in NORTH?",
      "Which brand has the highest revenue in WEST?",
      "Show me market share for all brands",
    ],
  },
  {
    category: "Media & ROI",
    icon: "📈",
    prompts: [
      "What is the best ROI channel for CHERY BRIGHT?",
      "Show Digital channel performance across brands",
      "How much budget goes to Trade Promo vs OOH?",
    ],
  },
  {
    category: "Model & Optimization",
    icon: "🎯",
    prompts: [
      "Compare base vs optimized scenario for CHERY BRIGHT",
      "What is the model accuracy for BAD BANGLES?",
    ],
  },
  {
    category: "Trends",
    icon: "📅",
    prompts: [
      "TV spend and GRPs for OODLES",
      "Show quarterly sales trends for Q3 FY25",
    ],
  },
];

const ChatBot = ({ theme }) => {
  return (
    <button
      className={`chatbot-fab ${theme}-theme`}
      onClick={() => window.open("/chatbot", "_blank")}
      title="Dashboard Assistant"
    >
      <div className="fab-icon-wrap">
        <span role="img" aria-label="AI bot" style={{ fontSize: '34px', lineHeight: 1 }}>🤖</span>
      </div>
      <span className="fab-badge">AI</span>
    </button>
  );
};

export const ChatBotPage = ({ theme: themeProp }) => {
  const theme = themeProp || "light";
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount and tab switch
  useEffect(() => {
    if (activeTab === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  const generateBotReply = useCallback(
    (input) => {
      const lower = input.toLowerCase();

      // ─── Specific sidebar prompt answers (checked first) ───

      if (lower.includes("oodles") && lower.includes("performing") && lower.includes("north")) {
        return "**OODLES — NORTH Performance (FY25):**\n\n• **Sales:** 1,401.8 MT\n• **Revenue:** ₹10,406.7 Lakhs\n• **Growth:** +20.2% YoY\n• **Market Share:** 36.0% (highest across all brands)\n\n**Quarterly Breakdown:**\n• Q1: 312.7 MT (₹2,321.2L) — +18.6%\n• Q2: 341.5 MT (₹2,534.8L) — +21.3%\n• Q3: 389.2 MT (₹2,889.5L) — +24.1% ← Peak\n• Q4: 358.4 MT (₹2,661.2L) — +16.8%\n\n💡 OODLES is the #1 brand in NORTH by market share.";
      }
      if (lower.includes("highest revenue") && lower.includes("west")) {
        return "**Highest Revenue in WEST (FY25):**\n\n• **CHERY BRIGHT** — ₹13,184.4 Lakhs (1,098.7 MT) ← Highest Revenue\n• **MILD URGENCY** — ₹7,650.0 Lakhs (850.0 MT)\n• **OODLES** — ₹6,635.4 Lakhs (894.1 MT)\n• **BAD BANGLES** — ₹4,915.8 Lakhs (546.2 MT)\n\n💡 **CHERY BRIGHT** leads WEST in revenue — nearly 2x OODLES, despite lower volume. Higher price per MT drives the gap.";
      }
      if ((lower.includes("best roi") || lower.includes("best channel")) && lower.includes("chery bright")) {
        return "**Best ROI Channels for CHERY BRIGHT:**\n\n• **Digital** — 4.8x ROI (NORTH), 4.5x (WEST), 4.2x (EAST) ← Best Channel\n• **TV** — 3.6x ROI (NORTH), 3.4x (WEST), 3.1x (EAST)\n• **Consumer Promo** — 2.4x (NORTH), 2.3x (EAST), 2.1x (WEST)\n• **Trade Promo** — 1.7x (NORTH), 1.6x (EAST), 1.5x (WEST)\n• **OOH** — 1.3x (NORTH), 1.2x (WEST), 1.1x (EAST)\n\n💡 Digital delivers 4.8x ROI in NORTH — invest more here. OOH at 1.1x is barely breaking even.";
      }
      if (lower.includes("trade promo") && lower.includes("ooh")) {
        return "**Trade Promo vs OOH — Budget Comparison:**\n\n**Trade Promo:**\n• Spend: ₹240 – 410 Lakhs per brand-market\n• ROI: 1.1x – 1.7x\n• Contribution: 11 – 18% of sales\n• Largest: OODLES NORTH ₹410L (1.6x ROI)\n\n**OOH (Out-of-Home):**\n• Spend: ₹55 – 110 Lakhs per brand-market\n• ROI: 0.9x – 1.5x\n• Contribution: 2 – 6% of sales\n• Largest: OODLES WEST ₹110L (1.5x ROI)\n\n**Trade Promo gets 3–5x more budget than OOH** but both have below-average ROI.\n\n💡 Optimization recommends: Trade Promo ↓10–40%, OOH ↓32–88% — shift to Digital & TV.";
      }
      if (lower.includes("scenario") && lower.includes("chery bright")) {
        return "**CHERY BRIGHT — Base vs Optimized Scenario:**\n\n**NORTH (Budget ₹1,630L):**\n• Base: 1,288.4 MT → Optimized: 1,417.2 MT → **+10.0% uplift**\n• Digital ₹420→546L (+30%), TV ₹680→748L (+10%)\n• Trade Promo ₹250→150L (-40%), OOH ₹85→10.5L (-88%)\n\n**WEST (Budget ₹1,555L):**\n• Base: 1,098.7 MT → Optimized: 1,207.6 MT → **+9.9% uplift**\n• Digital ₹380→494L (+30%), TV ₹610→671L (+10%)\n• Trade Promo ₹270→175L (-35%), OOH ₹75→17L (-77%)\n\n**EAST (Budget ₹1,315L):**\n• Base: 803.5 MT → Optimized: 876.2 MT → **+9.1% uplift**\n\n💡 CHERY BRIGHT has the highest optimization uplift across all brands.";
      }
      if (lower.includes("model") && lower.includes("accuracy") && lower.includes("bad bangles")) {
        return "**BAD BANGLES — Model Accuracy:**\n\n• **NORTH** — MAPE: 10.8%, R²: 0.90, Accuracy: 89.2%\n• **EAST** — MAPE: 11.3%, R²: 0.89, Accuracy: 88.7%\n• **WEST** — MAPE: 12.1%, R²: 0.87, Accuracy: 87.9%\n\n**Compared to other brands:**\n• CHERY BRIGHT: 92.5–93.1% accuracy (best)\n• OODLES: 90.6–92.2% accuracy\n• MILD URGENCY: 91.0–91.9% accuracy\n• BAD BANGLES: 87.9–89.2% accuracy (needs improvement)\n\nBuilt on 144 weekly observations (Apr 2022 – Dec 2024).\n\n💡 BAD BANGLES models are maturing — MAPE above 10% suggests room for improvement with more data or feature tuning.";
      }
      if (lower.includes("tv") && lower.includes("grp") && lower.includes("oodles")) {
        return "**OODLES — TV Spend & GRPs:**\n\n• **NORTH** — 2,100 GRPs, ₹520L spend, 3.1x ROI, 34.2% contribution\n• **EAST** — 1,850 GRPs, ₹450L spend, 2.8x ROI, 32.5% contribution\n• **WEST** — 1,620 GRPs, ₹380L spend, 2.5x ROI, 29.8% contribution\n\n**Total TV investment:** ₹1,350 Lakhs across 3 markets\n**Total GRPs:** 5,570\n\n💡 NORTH has highest GRPs (2,100) and best TV ROI (3.1x). Optimization suggests increasing TV by 10–15%.";
      }

      // ─── General keyword answers ───

      if (lower.includes("brand") && (lower.includes("available") || lower.includes("list") || lower.includes("which") || lower.includes("what"))) {
        return "The system tracks **4 brands**: MILD URGENCY, CHERY BRIGHT, OODLES, and BAD BANGLES across **4 markets** — EAST, WEST, NORTH, and SOUTH. Data covers Q1–Q4 FY25 and full-year FY25.";
      }
      if (lower.includes("market share")) {
        return `**Market Share highlights (FY25):**\n\n• **OODLES** — NORTH: 36.0%, EAST: 29.7%, WEST: 23.4%, SOUTH: 21.8%\n• **CHERY BRIGHT** — NORTH: 32.8%, WEST: 28.2%, EAST: 20.7%, SOUTH: 19.5%\n• **MILD URGENCY** — NORTH: 33.5%, EAST: 27.1%, WEST: 25.0%, SOUTH: 22.6%\n• **BAD BANGLES** — NORTH: 22.1%, EAST: 16.6%, WEST: 13.6%, SOUTH: 11.9%\n\nOODLES leads in NORTH with 36.0% market share.`;
      }
      if (lower.includes("roi") || lower.includes("best channel") || lower.includes("best media")) {
        return "**Best ROI channels across brands:**\n\n• **Digital** delivers the highest ROI — CHERY BRIGHT: 4.2x–4.8x, OODLES: 3.2x–3.8x, BAD BANGLES: 2.8x–3.3x\n• **TV** follows with 1.9x–3.6x ROI and the largest sales contribution (25–39%)\n• **Consumer Promo** offers moderate ROI (1.6x–2.4x)\n• **Trade Promo** has lower ROI (1.1x–1.7x) despite high spend\n• **OOH** has the lowest ROI (0.9x–1.3x)\n\n💡 **Recommendation:** Shift budget from OOH → Digital for better returns.";
      }
      if (lower.includes("sales") || lower.includes("revenue") || lower.includes("performance")) {
        return `**FY25 Sales Performance highlights:**\n\n• **OODLES** — NORTH: 1,401.8 MT (₹10,406.7L), +20.2% growth\n• **CHERY BRIGHT** — NORTH: 1,288.4 MT (₹15,460.8L), +18.5% growth\n• **MILD URGENCY** — NORTH: 1,320.5 MT (₹11,884.5L), +19.1% growth\n• **BAD BANGLES** — NORTH: 892.9 MT (₹8,036.1L), +13.8% growth\n\nNORTH is the strongest market across all brands. Q3 FY25 is the peak quarter.`;
      }
      if (lower.includes("spend") || lower.includes("media mix") || lower.includes("channel spend")) {
        return "**Media Spend (₹ Lakhs) — typical allocation:**\n\n• **TV:** ₹240–680L (largest share, 25–39% contribution)\n• **Digital:** ₹150–420L (highest ROI at 2.8x–4.8x)\n• **Trade Promo:** ₹240–410L (distribution-driven)\n• **Consumer Promo:** ₹160–280L (below-the-line)\n• **OOH:** ₹55–110L (smallest allocation)\n\n5 channels tracked across EAST, WEST, NORTH, SOUTH.";
      }
      if (lower.includes("mape") || lower.includes("r2") || lower.includes("r²") || lower.includes("model") || lower.includes("accuracy")) {
        return "**Model Performance (MMM accuracy):**\n\n• **CHERY BRIGHT** — Best models: MAPE 6.9–7.5%, R² 0.96–0.97, Accuracy 92.5–93.1%\n• **OODLES** — Strong models: MAPE 7.8–9.4%, R² 0.92–0.95, Accuracy 90.6–92.2%\n• **MILD URGENCY** — Solid models: MAPE 8.1–9.0%, R² 0.93–0.95, Accuracy 91.0–91.9%\n• **BAD BANGLES** — Maturing models: MAPE 10.8–12.1%, R² 0.87–0.90, Accuracy 87.9–89.2%\n\nAll models built on 144 observations (Apr 2022 – Dec 2024).";
      }
      if (lower.includes("optim") || lower.includes("budget") || lower.includes("allocat") || lower.includes("uplift")) {
        return "**Optimization Impact (same budget, better allocation):**\n\n• **CHERY BRIGHT NORTH:** +10.0% uplift (1,288→1,417 MT) — best gain, budget ₹1,630L\n• **CHERY BRIGHT WEST:** +9.9% uplift (1,098→1,207 MT), budget ₹1,555L\n• **OODLES NORTH:** +8.9% uplift (1,401→1,527 MT), budget ₹1,545L\n• **BAD BANGLES NORTH:** +7.9% uplift (892→963 MT), budget ₹1,135L\n\n**Key moves:** Digital ↑22–30%, TV ↑10–15%, OOH ↓32–88%, Trade Promo ↓10–40%\n\n💡 All optimizations keep total budget constant — only reallocation.";
      }
      if (lower.includes("simulat") || lower.includes("scenario") || lower.includes("what if")) {
        return "Use the **Simulation** section to model budget scenarios:\n\n• Adjust spend sliders for TV, Digital, Consumer Promo, Trade Promo, OOH\n• Compare **Base** (current allocation) vs **Optimized** (model-recommended)\n• See forecasted sales (MT) and revenue (₹ Lakhs) impact instantly\n\nExample: CHERY BRIGHT in WEST — base ₹1,555L → optimized allocation → +9.9% incremental sales (1,098→1,207 MT).";
      }
      if (lower.includes("region") || lower.includes("east") || lower.includes("west") || lower.includes("north") || lower.includes("south") || lower.includes("market") || lower.includes("geography")) {
        return "**Market-wise performance (FY25):**\n\n• **NORTH** — Strongest market overall. Highest growth (13.8–24.1%) and market shares across brands\n• **EAST** — Mid-tier performance. OODLES at 29.7% share, growth 6.8–18.3%\n• **WEST** — Strong for CHERY BRIGHT (28.2% share, 16.2% growth). OODLES at 23.4% share\n• **SOUTH** — Growing market. OODLES at 21.8% share, BAD BANGLES at 11.9%\n\n4 markets tracked: EAST, WEST, NORTH, SOUTH.";
      }
      if (lower.includes("quarter") || lower.includes("qtr") || lower.includes("q1") || lower.includes("q2") || lower.includes("q3") || lower.includes("q4")) {
        return "**Quarterly trends (FY25):**\n\n• **Q3 FY25** is consistently the strongest quarter — OODLES NORTH peaks at 389.2 MT (+24.1%), CHERY BRIGHT at 352.8 MT (+22.9%)\n• **Q2 FY25** shows solid mid-year momentum\n• **Q4 FY25** sees a slight dip from Q3 peaks\n• **Q1 FY25** is the baseline quarter with lowest volumes\n\nPeriods available: Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, FY25.";
      }
      if (lower.includes("tv") || lower.includes("grp") || lower.includes("television")) {
        return "**TV Performance:**\n\n• TV GRPs range from **1,050 to 2,650** depending on brand and market\n• Highest GRPs: **CHERY BRIGHT** in NORTH — 2,650 GRPs, ₹680L spend, 38.9% contribution\n• **OODLES** in NORTH — 2,100 GRPs, ₹520L spend, 34.2% contribution\n• **BAD BANGLES** in NORTH — 1,380 GRPs, ₹320L spend, 30.1% contribution\n• TV ROI ranges from 1.9x to 3.6x\n\n💡 Optimization recommends increasing TV spend by 10–15%.";
      }
      if (lower.includes("digital") || lower.includes("online")) {
        return "**Digital Channel Performance:**\n\n• **CHERY BRIGHT** NORTH — 4.8x ROI, 28.4% contribution, ₹420L spend (best performer)\n• **CHERY BRIGHT** WEST — 4.5x ROI, 26.8% contribution, ₹380L spend\n• **OODLES** NORTH — 3.8x ROI, 22.1% contribution, ₹240L spend\n• **BAD BANGLES** NORTH — 3.3x ROI, 21.8% contribution, ₹195L spend\n\n💡 Optimization recommends **+22–30% increase** in Digital spend.";
      }
      if (lower.includes("ooh") || lower.includes("out of home") || lower.includes("outdoor")) {
        return "**OOH (Out-of-Home) Performance:**\n\n• ROI: 0.9x–1.5x — lowest across all channels\n• Contribution: only 2.2–5.6% of sales\n• Spend: ₹55–110 Lakhs (smallest allocation)\n• OODLES WEST has the highest OOH ROI at 1.5x (₹110L spend, 5.6% contribution)\n\n💡 Optimization recommends cutting OOH by **32–88%** and reallocating to Digital and TV.";
      }
      if (lower.includes("trade promo") || lower.includes("trade promotion")) {
        return "**Trade Promo Performance:**\n\n• **OODLES** NORTH — ₹410L spend, 1.6x ROI, 17.8% contribution\n• **OODLES** EAST — ₹350L spend, 1.4x ROI, 15.9% contribution\n• **BAD BANGLES** NORTH — ₹330L spend, 1.3x ROI, 17.1% contribution\n• Overall ROI: 1.1x–1.7x (below average)\n\n💡 Optimization suggests reducing Trade Promo by **10–40%**.";
      }
      if (lower.includes("consumer promo")) {
        return "**Consumer Promo Performance:**\n\n• **OODLES** NORTH — ₹280L spend, 2.1x ROI, 15.8% contribution\n• **CHERY BRIGHT** NORTH — ₹195L spend, 2.4x ROI, 12.8% contribution\n• **BAD BANGLES** NORTH — ₹210L spend, 1.9x ROI, 15.2% contribution\n• Overall ROI: 1.6x–2.4x (moderate)\n\n💡 Optimization typically reduces Consumer Promo by **8–10%**, redirecting to Digital.";
      }
      if (lower.includes("contribution") || lower.includes("driver")) {
        return "**Sales Contribution by Channel (typical):**\n\n1. **TV** — 25–39% (largest driver, highest for CHERY BRIGHT at 38.9%)\n2. **Digital** — 18–28% (fastest growing, peaks at 28.4% for CHERY BRIGHT)\n3. **Trade Promo** — 11–18%\n4. **Consumer Promo** — 12–16%\n5. **OOH** — 2–6% (smallest)\n\nRemaining sales come from base/organic demand not attributed to media.";
      }
      if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey") || lower === "hi") {
        return `Hello! 😊 I'm your **Revenue Radar Assistant**. I can help with brand performance, media ROI, model accuracy, and optimization insights across MILD URGENCY, CHERY BRIGHT, OODLES & BAD BANGLES in EAST, WEST, NORTH & SOUTH.`;
      }
      if (lower.includes("thank")) {
        return "You're welcome! Feel free to ask more about brand performance, media mix, or optimization. 😊";
      }

      return `I can help with questions about:\n\n• **Brand Performance** — sales (MT), revenue (₹ Lakhs), growth, market share\n• **Media Mix & ROI** — TV, Digital, Consumer Promo, Trade Promo, OOH\n• **Model Accuracy** — MAPE, R², accuracy metrics\n• **Optimization** — base vs optimized budget scenarios\n• **Markets** — EAST, WEST, NORTH, SOUTH performance\n• **Channels** — individual channel deep-dives\n\nBrands: MILD URGENCY, CHERY BRIGHT, OODLES, BAD BANGLES\n\nTry asking about any of these topics!`;
    },
    []
  );

  const handleSend = (text) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;

    const userMsg = { from: "user", text: msg, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(msg);
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply, time: new Date() }]);
    }, 800 + Math.random() * 400);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Simple markdown bold parser
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`chatbot-page ${theme}-theme`}>
      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="chatbot-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-header-icon">💡</span>
          <span>Try asking</span>
        </div>
        <div className="sidebar-prompts">
          {SIDEBAR_PROMPTS.map((group, gi) => (
            <div key={gi} className="sidebar-group">
              <div className="sidebar-group-label">
                <span className="sidebar-group-icon">{group.icon}</span>
                {group.category}
              </div>
              {group.prompts.map((prompt, pi) => (
                <button
                  key={pi}
                  className="sidebar-prompt-btn"
                  onClick={() => handleSend(prompt)}
                >
                  <span className="sidebar-prompt-arrow">→</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="chatbot-main">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <div className="chatbot-header-title-row">
                <h6 className="chatbot-header-title">Revenue Radar Chatbot</h6>
                <span className="chatbot-online-badge"><span className="chatbot-online-dot"></span> Online</span>
              </div>
              <span className="chatbot-header-sub">
                <i className="fas fa-user-circle"></i>
                <strong>Brand Manager</strong>
              </span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button
              className="chatbot-newchat-btn"
              onClick={() => setMessages([])}
              title="New Chat"
            >
              <i className="fas fa-plus"></i> New Chat
            </button>
            <button className="chatbot-close-btn" onClick={() => window.close()}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="chatbot-tabs">
          <button
            className={`chatbot-tab ${activeTab === "chat" ? "chatbot-tab-active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            <i className="fas fa-comment-dots"></i> Chat
          </button>
          <button
            className={`chatbot-tab ${activeTab === "faq" ? "chatbot-tab-active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <i className="fas fa-book-open"></i> FAQ
          </button>
        </div>

        {/* Body */}
        <div className="chatbot-body">
          {activeTab === "chat" ? (
            <>
              {/* Welcome Section */}
              <div className={`welcome-section${messages.length > 0 ? " welcome-compact" : ""}`}>
                <div className="welcome-greeting">
                  <span className="welcome-bot-icon">🤖</span>
                  <div>
                    <span>Hello! I'm your <strong>Revenue Radar</strong> assistant.</span>
                    <p className="welcome-subtext"><strong>Your AI-powered marketing intelligence hub</strong> — explore brand insights, media ROI, model accuracy & budget optimization in seconds.</p>
                  </div>
                </div>
                <div className="welcome-capabilities">
                  <div className="capability-item">
                    <span className="cap-icon cap-brand">📊</span>
                    <div>
                      <strong>Brand performance</strong>
                      <span className="cap-desc">Sales, revenue, growth & market share across regions</span>
                    </div>
                  </div>
                  <div className="capability-item">
                    <span className="cap-icon cap-media">📢</span>
                    <div>
                      <strong>Media mix analysis</strong>
                      <span className="cap-desc">Channel spend, ROI & contribution breakdowns</span>
                    </div>
                  </div>
                  <div className="capability-item">
                    <span className="cap-icon cap-model">🧠</span>
                    <div>
                      <strong>Model performance</strong>
                      <span className="cap-desc">MAPE, R², accuracy & model refresh details</span>
                    </div>
                  </div>
                  <div className="capability-item">
                    <span className="cap-icon cap-scenario">🎯</span>
                    <div>
                      <strong>Scenario planning</strong>
                      <span className="cap-desc">Base vs optimized budget allocation & uplift</span>
                    </div>
                  </div>
                </div>
                <p className="welcome-hint">💡 Try one of the sample questions on the left, or type your own below!</p>
              </div>

              {/* Chat Messages */}
              {messages.length > 0 && (
                <div className="chatbot-messages">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`chatbot-msg ${msg.from === "bot" ? "msg-bot" : "msg-user"}`}
                    >
                      {msg.from === "bot" && (
                        <div className="msg-avatar">🤖</div>
                      )}
                      <div className="msg-content">
                        <div className="msg-bubble">
                          {msg.from === "bot" ? renderText(msg.text) : msg.text}
                        </div>
                        <span className="msg-time">{formatTime(msg.time)}</span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="chatbot-msg msg-bot">
                      <div className="msg-avatar">🤖</div>
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
              )}
            </>
          ) : (
            /* FAQ Content */
            <div className="chatbot-faq-wrapper">
              <div className="faq-header-section">
                <h3 className="faq-main-title">Frequently Asked Questions</h3>
                <p className="faq-main-subtitle">Quick answers about brand performance, media ROI, model accuracy & optimization.</p>
              </div>
              <div className="chatbot-faq-list">
                {FAQ_LIST.map((cat, catIdx) => (
                  <div key={catIdx} className={`faq-category ${expandedCategory === catIdx ? "faq-category-open" : ""}`}>
                    <button
                      className={`faq-category-header ${expandedCategory === catIdx ? "faq-cat-active" : ""}`}
                      onClick={() =>
                        setExpandedCategory(expandedCategory === catIdx ? null : catIdx)
                      }
                    >
                      <div className="faq-cat-left">
                        <div className="faq-cat-icon">
                          <i className={`fas ${cat.icon}`}></i>
                        </div>
                        <div className="faq-cat-info">
                          <span className="faq-cat-name">{cat.category}</span>
                          <span className="faq-cat-count">{cat.items.length} questions</span>
                        </div>
                      </div>
                      <i
                        className={`fas fa-chevron-${expandedCategory === catIdx ? "up" : "down"} faq-cat-chevron`}
                      ></i>
                    </button>

                    {expandedCategory === catIdx && (
                      <div className="faq-category-items">
                        {cat.items.map((item, idx) => {
                          const faqKey = `${catIdx}-${idx}`;
                          return (
                            <div
                              key={faqKey}
                              className={`chatbot-faq-item ${expandedFaq === faqKey ? "faq-expanded" : ""}`}
                            >
                              <button
                                className="chatbot-faq-question"
                                onClick={() =>
                                  setExpandedFaq(expandedFaq === faqKey ? null : faqKey)
                                }
                              >
                                <div className="faq-q-left">
                                  <span className="faq-q-bullet">Q</span>
                                  <span>{item.question}</span>
                                </div>
                                <i
                                  className={`fas fa-chevron-${expandedFaq === faqKey ? "up" : "down"} faq-chevron`}
                                ></i>
                              </button>
                              {expandedFaq === faqKey && (
                                <div className="chatbot-faq-answer">
                                  <div className="faq-answer-inner">
                                    <div className="faq-answer-rows">
                                      {item.answer.map((row, ri) => (
                                        <div key={ri} className="faq-answer-row">
                                          <span className="faq-row-label">{row.label}</span>
                                          <span className="faq-row-value">{row.value}</span>
                                          {row.tag && <span className={`faq-row-tag ${row.tag === "Best" ? "faq-tag-best" : "faq-tag-low"}`}>{row.tag}</span>}
                                        </div>
                                      ))}
                                    </div>
                                    {item.footnote && (
                                      <p className="faq-answer-footnote">{item.footnote}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input - visible on chat tab */}
        {activeTab === "chat" && (
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Ask about your marketing data..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
        )}
      </div>
    </div>
  );
};

export default ChatBot;
