import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import CampaignSalesChart from "../CFO_Dashboard/ApexMeidaLineChart";
import BrandPredictionSummary from "./BrandPredictionSummary";

const MediaSalesVsSpends = () => {
  const { spendsData, mediaSalesData, brandWiseMAPEData } = useSelector((state) => state.dashboard || {});

  const { theme } = useOutletContext();
  const isDark = theme === "dark";

  const [view, setView] = useState('Channel_Wise')

  const [qtrSpendsData, setQtrSpendsData] = useState([])
  const [qtrSalesData, setQtrSalesData] = useState([])
  let yearlySpendsData = spendsData?.yearly_spends_media_wise || [];
  let yearlySalesData = mediaSalesData?.yearly_sales_media_grp_wise || [];

  const currentFY = spendsData?.current_fy || "Current FY";
  const previousFY = spendsData?.previous_fy || "Previous FY";
  const tilldate = spendsData?.data_present_till;
  const brandName = spendsData?.brand || mediaSalesData?.brand || "Brand";

  useEffect(() => {
    view === "Channel_Wise" ? setQtrSpendsData(spendsData?.qtr_spends_var_wise) : setQtrSpendsData(spendsData?.qtr_spends_media_wise);
    view === "Channel_Wise" ? setQtrSalesData(mediaSalesData?.qtr_sales_media_var_wise) : setQtrSalesData(mediaSalesData?.qtr_sales_media_grp_wise);
  }, [view])

  const navigate = useNavigate()
  useEffect(() => {
    const data = spendsData || {};

    if (Object.keys(data).length === 0) {
      navigate('/cockpit/sales-performance');
    }
  }, [spendsData, navigate]);

  const formatCr = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₹ 0 Cr";
    return `₹ ${(Number(value) / 10000000).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} Cr`;
  };

  const previousTillLabel = useMemo(() => {
    if (!tilldate) return previousFY;
    const [year, month] = tilldate.split("-");
    return `${previousFY} (${year}-${String(Number(month) - 1).padStart(2, "0")})`;
  }, [previousFY, tilldate]);

  const currentTillLabel = useMemo(() => {
    if (!tilldate) return currentFY;
    return `${currentFY} (${tilldate})`;
  }, [currentFY, tilldate]);

  const spendsTotals = useMemo(() => {
    return yearlySpendsData.reduce(
      (acc, item) => {
        acc.previous += Number(item.previous_fy) || 0;
        acc.current += Number(item.current_fy) || 0;
        return acc;
      },
      { previous: 0, current: 0 }
    );
  }, [yearlySpendsData]);

  const spendsYOY = useMemo(() => {
    if (!spendsTotals.previous) return 0;
    return ((spendsTotals.current - spendsTotals.previous) / spendsTotals.previous) * 100;
  }, [spendsTotals]);

  const salesTotals = useMemo(() => {
    return yearlySalesData.reduce(
      (acc, item) => {
        acc.previous += Number(item.previous_fy) || 0;
        acc.current += Number(item.current_fy) || 0;
        return acc;
      },
      { previous: 0, current: 0 }
    );
  }, [yearlySalesData]);

  const salesYOY = useMemo(() => {
    if (!salesTotals.previous) return 0;
    return ((salesTotals.current - salesTotals.previous) / salesTotals.previous) * 100;
  }, [salesTotals]);

  const getGrowthClass = (value) => {
    if (Number(value) > 0) return "text-success";
    if (Number(value) < 0) return "text-danger";
    return "text-secondary";
  };

  const premiumStyles = `
  .media-compare-dashboard {
    --page-bg: ${isDark ? "#1A252F" : "#F8F9FA"};
    --surface-bg: ${isDark ? "rgba(44, 62, 80, 0.92)" : "rgba(255, 255, 255, 0.92)"};
    --surface-bg-strong: ${isDark ? "#2C3E50" : "#FFFFFF"};
    --surface-bg-soft: ${isDark ? "#34495E" : "#F8F9FA"};
    --surface-bg-soft-2: ${isDark ? "#1E3A34" : "#E8F5E8"};
    --border-soft: ${isDark ? "#4A6274" : "#E5E7EB"};
    --text-primary: ${isDark ? "#F8F9FA" : "#2C3E50"};
    --text-secondary: ${isDark ? "#E5E7EB" : "#2C3E50"};
    --text-muted: ${isDark ? "#ADB5BD" : "#6C757D"};
    --chip-bg: ${isDark ? "#34495E" : "#FFFFFF"};
    --chip-text: ${isDark ? "#E5E7EB" : "#2C3E50"};
    --chip-success-bg: ${isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8"};
    --chip-success-text: ${isDark ? "#17A2B8" : "#0D7C66"};
    --section-bg: ${isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8"};
    --section-text: ${isDark ? "#17A2B8" : "#0D7C66"};
    --icon-blue-bg: ${isDark ? "rgba(44, 62, 80, 0.15)" : "#F0F4F8"};
    --icon-blue-text: ${isDark ? "#F8F9FA" : "#2C3E50"};
    --icon-green-bg: ${isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8"};
    --icon-green-text: ${isDark ? "#17A2B8" : "#0D7C66"};
    --icon-red-bg: ${isDark ? "rgba(220, 53, 69, 0.15)" : "#FEF2F2"};
    --icon-red-text: ${isDark ? "#fca5a5" : "#DC3545"};
    --empty-bg: ${isDark ? "#34495E" : "#F0F4F8"};
    --empty-text: ${isDark ? "#ADB5BD" : "#6C757D"};
    --pill-bg: ${isDark ? "rgba(44, 62, 80, 0.88)" : "rgba(255, 255, 255, 0.95)"};
    --pill-hover-bg: ${isDark ? "rgba(52, 73, 94, 0.96)" : "#FFFFFF"};
    --shadow-soft: ${isDark ? "0 4px 24px rgba(0, 0, 0, 0.3)" : "0 4px 24px rgba(44, 62, 80, 0.06)"};
    --shadow-hover: ${isDark ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(44, 62, 80, 0.10)"};

    background: transparent;
    color: var(--text-primary);
  }

  .media-compare-dashboard .premium-header-card {
    background: linear-gradient(
      135deg,
      var(--surface-bg-strong) 0%,
      var(--surface-bg-soft) 55%,
      var(--surface-bg-soft-2) 100%
    );
    border: 1px solid var(--border-soft);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: var(--shadow-soft);
    color: var(--text-primary);
    z-index:1;
  }

  .media-compare-dashboard .info-wrap{
    position: relative;
  }
  .info-wrapper {
    position: absolute;
    top: 1.55rem;
    right: 1.05rem;
    z-index: 20;
  }

  /* icon */
  .info-tag {
    height: 22px;
    width: 22px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    background: linear-gradient(135deg, #fff7cc 0%, #ffe45e 45%, #facc15 100%);
    color: #7a5a00;
    border: 1px solid rgba(250, 204, 21, 0.75);

    box-shadow:
      0 6px 18px rgba(250, 204, 21, 0.28),
      0 2px 8px rgba(0, 0, 0, 0.12);

    cursor: pointer;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      background 0.22s ease,
      filter 0.22s ease;

    animation: infoPulseGlow 1.9s ease-in-out infinite;
  }

  .info-tag::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    border: 1.5px solid rgba(250, 204, 21, 0.58);
    animation: infoRingPulse 1.9s ease-out infinite;
    pointer-events: none;
  }

  .info-tag i {
    font-size: 0.7rem;
    line-height: 1;
    font-weight: 700;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
  }

  .info-wrapper:hover .info-tag {
    transform: translateY(-3px) scale(1.1);
    box-shadow:
      0 10px 26px rgba(250, 204, 21, 0.38),
      0 0 18px rgba(250, 204, 21, 0.32),
      0 4px 14px rgba(0, 0, 0, 0.16);
    filter: saturate(1.08);
  }

  .info-tag:active {
    transform: scale(0.94);
    box-shadow:
      0 4px 10px rgba(250, 204, 21, 0.22),
      0 2px 6px rgba(0, 0, 0, 0.14);
  }

  /* full tooltip panel */
  .info-tooltip-table {
    position: absolute;
    right: 11px;
    top:  0.65rem;
    width: fit-content;

    background: #ffffff;
    border: 2px solid #000;
    border-radius: 16px;
    box-shadow: var(--shadow-hover);

    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(10px) scale(0.97);
    transform-origin: bottom right;
    transition: opacity 0.24s ease, transform 0.24s ease, visibility 0.24s ease;
  }

  .info-wrapper:hover 
  .info-tooltip-table {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0) scale(1);
    border: 2px solid #ffe45e !important;
  }

  /* small arrow */
  .info-tooltip-table::after {
    content: "";
    position: absolute;
    right: -1px;
    top: -2px;
    width: 15px;
    height: 12px;
    background: linear-gradient(135deg, #fff7cc 0%, #ffe45e 45%, #facc15 100%) !important;
    border-right: 1px solid var(--border-soft);
    border-bottom: 1px solid var(--border-soft);
    transform: rotate(90deg);
  }

  /* header */
  .info-tooltip-header {
    padding: 12px 14px 10px;
    background: #f8fafc;
    border-bottom: 1px solid var(--border-soft);
  }

  .info-tooltip-title {
    margin: 0;
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .info-tooltip-subtitle {
    margin: 3px 0 0;
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  /* table wrap */
  .info-tooltip-table-wrap {
    height:fit;
    min-width:320px;
    overflow-y: auto;
    background: #ffffff;
  }

  /* table */
  .info-mini-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
    background: #ffffff;
    /* MOVE THIS HERE: */
    table-layout: fixed; 
  }

  .info-mini-table thead {
    position: sticky;
    top: 0;
    z-index: 999;
    /* Removed table-layout from here */
    background: #f8fafc;
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border-soft);
  }

  /* Ensure text-align is on the header cells, not the thead container */
  .info-mini-table th {
    text-align: left;
    padding: 10px 14px;
  }

  .info-mini-table tbody td {
    padding: 10px 14px;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-soft);
    vertical-align: middle;
    background: #ffffff;
    /* Handles long text like "OTHER_MEDIA_CHANNEL" */
    word-wrap: break-word;
    overflow-wrap: break-word;
  }


  .info-mini-table tbody tr:last-child td {
    border-bottom: none;
  }

  .info-mini-table tbody tr:hover td {
    background: #f8fafc;
  }

  .info-mini-table tbody td:last-child {
    text-align: right;
    color: var(--text-primary);
  }

  /* scrollbar */
  .info-tooltip-table-wrap::-webkit-scrollbar {
    width: 6px;
  }

  .info-tooltip-table-wrap::-webkit-scrollbar-track {
    background: transparent;
  }

  .info-tooltip-table-wrap::-webkit-scrollbar-thumb {
    background: var(--border-soft);
    border-radius: 999px;
  }

  /* Dark theme solid override */
  .dark-theme .info-tooltip-table,
  [data-theme="dark"] .info-tooltip-table {
    background: #2C3E50;
  }

  .dark-theme .info-tooltip-table::after,
  [data-theme="dark"] .info-tooltip-table::after {
    background: #2C3E50;
  }

  .dark-theme .info-tooltip-header,
  [data-theme="dark"] .info-tooltip-header {
    background: #34495E;
  }

  .dark-theme .info-tooltip-table-wrap,
  [data-theme="dark"] .info-tooltip-table-wrap,
  .dark-theme .info-mini-table,
  [data-theme="dark"] .info-mini-table,
  .dark-theme .info-mini-table tbody,
  [data-theme="dark"] .info-mini-table tbody,
  .dark-theme .info-mini-table tbody tr,
  [data-theme="dark"] .info-mini-table tbody tr,
  .dark-theme .info-mini-table tbody td,
  [data-theme="dark"] .info-mini-table tbody td {
    background: #2C3E50;
  }

  .dark-theme .info-mini-table thead th,
  [data-theme="dark"] .info-mini-table thead th {
    background: #34495E;
  }

  .dark-theme .info-mini-table tbody tr:hover td,
  [data-theme="dark"] .info-mini-table tbody tr:hover td {
    background: #3D566E;
  }

  /* animation */
  @keyframes infoPulseGlow {
    0%,
    100% {
      box-shadow:
        0 6px 18px rgba(250, 204, 21, 0.24),
        0 2px 8px rgba(0, 0, 0, 0.12);
      transform: scale(1.5);
    }
    50% {
      box-shadow:
        0 10px 24px rgba(250, 204, 21, 0.38),
        0 0 22px rgba(250, 204, 21, 0.3),
        0 2px 10px rgba(0, 0, 0, 0.14);
      transform: scale(1.25);
    }
  }

  @keyframes infoRingPulse {
    0% {
      opacity: 0.55;
      transform: scale(0.92);
    }
    70% {
      opacity: 0.75;
      transform: scale(1.45);
    }
    100% {
      opacity: 0.55;
      transform: scale(1.45);
    }
  }

  .media-compare-dashboard .section-label {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--section-bg);
    color: var(--section-text);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .media-compare-dashboard .header-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      ${isDark ? "rgba(13, 124, 102, 0.2)" : "#E8F5E8"} 0%,
      ${isDark ? "rgba(23, 162, 184, 0.15)" : "#E6F7FF"} 100%
    );
    color: ${isDark ? "#17A2B8" : "#0D7C66"};
    font-size: 1rem;
    flex-shrink: 0;
  }

  .media-compare-dashboard .view-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1.5px solid var(--border-soft);
    background: var(--pill-bg);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    margin-left: auto;
    align-self: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease;
  }

  .media-compare-dashboard .view-toggle-btn:hover {
    background: var(--pill-hover-bg);
    transform: translateY(-2px);
    border-color: ${isDark ? "rgba(23, 162, 184, 0.55)" : "rgba(13, 124, 102, 0.28)"};
    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.14),
      0 0 0 3px ${isDark ? "rgba(23, 162, 184, 0.10)" : "rgba(13, 124, 102, 0.08)"};
  }

  .media-compare-dashboard .view-toggle-btn:active {
    transform: translateY(1px) scale(0.98);
    box-shadow:
      inset 0 3px 6px rgba(0, 0, 0, 0.18),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .media-compare-dashboard .view-toggle-btn:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px ${isDark ? "rgba(23, 162, 184, 0.18)" : "rgba(13, 124, 102, 0.14)"},
      0 8px 18px rgba(0, 0, 0, 0.12);
  }

  .media-compare-dashboard .header-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .media-compare-dashboard .meta-chip {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--chip-bg);
    border: 1px solid var(--border-soft);
    color: var(--chip-text);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  }

  .media-compare-dashboard .meta-chip-success {
    background: var(--chip-success-bg);
    color: var(--chip-success-text);
    border-color: ${isDark ? "rgba(13, 124, 102, 0.3)" : "rgba(13, 124, 102, 0.2)"};
  }

  .media-compare-dashboard .premium-panel {
    background: var(--surface-bg);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-soft);
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    transition: all 0.28s ease;
    overflow: hidden;
    color: var(--text-primary);
  }

  .media-compare-dashboard .premium-panel:hover,
  .media-compare-dashboard .premium-kpi-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }

  .media-compare-dashboard .panel-header {
    padding: 1.5rem 1.5rem 0.75rem;
  }

  .media-compare-dashboard .panel-body {
    padding: 1rem 1.25rem 1.25rem;
  }

  .media-compare-dashboard .panel-title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
    color: var(--text-primary);
  }

  .media-compare-dashboard .panel-subtitle {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 15px;
    color: var(--text-muted);
    font-weight: 400;
    line-height: 1.5;
  }

  .media-compare-dashboard .premium-kpi-card {
    background: linear-gradient(
      180deg,
      var(--surface-bg-strong) 0%,
      ${isDark ? "#2C3E50" : "#FCFDFF"} 100%
    );
    border: 1px solid var(--border-soft);
    border-left: 4px solid ${isDark ? "#17A2B8" : "#0D7C66"};
    border-radius: 16px;
    padding: 1.1rem 1.15rem;
    box-shadow: var(--shadow-soft);
    transition: all 0.28s ease;
    color: var(--text-primary);
  }

  .media-compare-dashboard .kpi-label {
    color: var(--text-muted);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    line-height: 1.4;
    margin-bottom: 6px;
  }

  .media-compare-dashboard .kpi-value {
    font-family: 'JetBrains Mono', 'Inter', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  .media-compare-dashboard .kpi-subtext {
    color: var(--text-muted);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .media-compare-dashboard .kpi-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .media-compare-dashboard .kpi-icon-blue {
    background: var(--icon-blue-bg);
    color: var(--icon-blue-text);
  }

  .media-compare-dashboard .kpi-icon-green {
    background: var(--icon-green-bg);
    color: var(--icon-green-text);
  }

  .media-compare-dashboard .kpi-icon-red {
    background: var(--icon-red-bg);
    color: var(--icon-red-text);
  }

  .media-compare-dashboard .premium-spinner {
    width: 46px;
    height: 46px;
    margin: 0 auto;
    border-radius: 50%;
    border: 4px solid ${isDark ? "#4A6274" : "#E5E7EB"};
    border-top-color: ${isDark ? "#17A2B8" : "#0D7C66"};
    animation: spinPremium 0.8s linear infinite;
  }

  .media-compare-dashboard .empty-state-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    border-radius: 18px;
    background: var(--empty-bg);
    color: var(--empty-text);
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .media-compare-dashboard .text-muted {
    color: var(--text-muted) !important;
  }

  .media-compare-dashboard .text-primary {
    color: ${isDark ? "#17A2B8" : "#2C3E50"} !important;
  }

  .media-compare-dashboard .text-success {
    color: ${isDark ? "#17A2B8" : "#0D7C66"} !important;
  }

  .media-compare-dashboard .text-danger {
    color: #DC3545 !important;
  }

  .media-compare-dashboard .text-secondary {
    color: var(--text-secondary) !important;
  }

  .media-compare-dashboard h3,
  .media-compare-dashboard h5,
  .media-compare-dashboard .fw-bold {
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--text-primary);
  }

  .media-compare-dashboard h3 {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .media-compare-dashboard h5 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
  }

  .media-compare-dashboard .small,
  .media-compare-dashboard small {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
  }

  @keyframes spinPremium {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .media-compare-dashboard .premium-header-card,
    .media-compare-dashboard .premium-panel,
    .media-compare-dashboard .premium-kpi-card {
      border-radius: 12px;
    }

    .media-compare-dashboard .panel-header {
      padding: 1.1rem 1rem 0.65rem;
    }

    .media-compare-dashboard .panel-body {
      padding: 0.85rem 0.9rem 1rem;
    }

    .media-compare-dashboard .view-toggle-btn {
      width: 100%;
      margin-left: 0;
    }
  }
`;

  const handleViewToggle = () => {
    if (view === 'Channel_Wise') {
      setView('Group_Wise')
    }
    else {
      setView('Channel_Wise')
    }
  }

  return (
    <div className="container-fluid media-compare-dashboard">
      <div className="premium-header-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex flex-column">

            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span className="header-icon">
                <i className="fas fa-bullhorn"></i>
              </span>
              Media Spends vs Contribution
            </h3>

            <div className="text-muted small">
              Compare channel spends against contribution across financial years
            </div>
          </div>

          <button
            className="view-toggle-btn"
            onClick={handleViewToggle}
            type="button"
          >
            {view === 'Channel_Wise' ? 'View Group Wise' : 'View Channel Wise '}
          </button>
        </div>
      </div>

      <BrandPredictionSummary apiData={brandWiseMAPEData} isDark={isDark}/>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="info-wrap premium-panel h-100">
            <div className="panel-header">
              {view === "Group_Wise" && (
                <div className="info-wrapper">
                  <div className="info-tag">
                    <i className="fas fa-info"></i>
                  </div>

                  <div className="info-tooltip-table">
                    <div className="info-tooltip-header">
                      <div>
                        <h6 className="info-tooltip-title">Group Wise Yearly Spends</h6>
                      </div>
                    </div>

                    <div className="info-tooltip-table-wrap">
                      <table className="info-mini-table">
                        <thead>
                          <tr>
                            <th>Media Group</th>
                            <th>Previous FY</th>
                            <th>Current FY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spendsData?.yearly_spends_media_wise?.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item?.media_group}</td>
                              <td className="text-center text-primary" ><strong>{`₹ ${(Number((item?.previous_fy) / 10000000).toFixed(3))} Cr.`}</strong></td>
                              <td className="text-center text-success"><strong>{`₹ ${(Number((item?.current_fy) / 10000000).toFixed(3))} Cr.`}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <h5 className="panel-title mb-1">Media Spends</h5>
              <div className="panel-subtitle">
                Channel-wise spend movement across financial years
              </div>
            </div>

            <div className="panel-body pt-0">
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className=" d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">Previous FY</div>
                        <div className="kpi-value text-primary">
                          {formatCr(spendsTotals.previous)}
                        </div>
                        <div className="kpi-subtext">{previousTillLabel}</div>
                      </div>
                      <div className="kpi-icon kpi-icon-blue">
                        <i className="fas fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">Current FY</div>
                        <div className="kpi-value text-success">
                          {formatCr(spendsTotals.current)}
                        </div>
                        <div className="kpi-subtext">{currentTillLabel}</div>
                      </div>
                      <div className="kpi-icon kpi-icon-green">
                        <i className="fas fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">YoY Growth</div>
                        <div className={`kpi-value ${getGrowthClass(spendsYOY)}`}>
                          {spendsYOY >= 0 ? "+" : ""}
                          {Number(spendsYOY).toFixed(2)}%
                        </div>
                        <div className="kpi-subtext">Spend change</div>
                      </div>
                      <div
                        className={`kpi-icon ${spendsYOY >= 0 ? "kpi-icon-green" : "kpi-icon-red"
                          }`}
                      >
                        <i
                          className={`fas ${spendsYOY >= 0 ? "fa-arrow-up" : "fa-arrow-down"
                            }`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CampaignSalesChart
                theme={theme}
                tilldate={tilldate}
                heading={view === 'Channel_Wise' ? "Media Channel Wise" : "Media Group Wise"}
                campaignData={qtrSpendsData}
                previousFY={previousFY}
                currentFY={currentFY}
                metricLabel="Spends (₹ in Crores)"
                viewType={view}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="premium-panel h-100">
            <div className="panel-header">
              <h5 className="panel-title mb-1">Media Contribution</h5>
              <div className="panel-subtitle">
                Channel-wise contribution movement across financial years
              </div>
              {view === "Group_Wise" && (
                <div className="info-wrapper">
                  <div className="info-tag">
                    <i className="fas fa-info"></i>
                  </div>

                  <div className="info-tooltip-table">
                    <div className="info-tooltip-header">
                      <div>
                        <h6 className="info-tooltip-title">Group Wise Yearly Contribution</h6>
                      </div>
                    </div>

                    <div className="info-tooltip-table-wrap">
                      <table className="info-mini-table">
                        <thead>
                          <tr>
                            <th>Media Group</th>
                            <th>Previous FY</th>
                            <th>Current FY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearlySalesData?.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item?.media_group}</td>
                              <td className="text-center text-primary" ><strong>{`₹ ${(Number((item?.previous_fy) / 10000000).toFixed(3))} Cr.`}</strong></td>
                              <td className="text-center text-success"><strong>{`₹ ${(Number((item?.current_fy) / 10000000).toFixed(3))} Cr.`}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="panel-body pt-0">
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">Previous FY</div>
                        <div className="kpi-value text-primary">
                          {formatCr(salesTotals.previous)}
                        </div>
                        <div className="kpi-subtext">{previousTillLabel}</div>
                      </div>
                      <div className="kpi-icon kpi-icon-blue">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">Current FY</div>
                        <div className="kpi-value text-success">
                          {formatCr(salesTotals.current)}
                        </div>
                        <div className="kpi-subtext">{currentTillLabel}</div>
                      </div>
                      <div className="kpi-icon kpi-icon-green">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="premium-kpi-card h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="kpi-label">YoY Growth</div>
                        <div className={`kpi-value ${getGrowthClass(salesYOY)}`}>
                          {salesYOY >= 0 ? "+" : ""}
                          {Number(salesYOY).toFixed(2)}%
                        </div>
                        <div className="kpi-subtext">Contribution change</div>
                      </div>
                      <div
                        className={`kpi-icon ${salesYOY >= 0 ? "kpi-icon-green" : "kpi-icon-red"
                          }`}
                      >
                        <i
                          className={`fas ${salesYOY >= 0 ? "fa-arrow-up" : "fa-arrow-down"
                            }`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CampaignSalesChart
                theme={theme}
                tilldate={tilldate}
                heading={view === 'Channel_Wise' ? "Media Channel Wise" : "Media Group Wise"}
                campaignData={qtrSalesData}
                previousFY={previousFY}
                currentFY={currentFY}
                metricLabel="Contribution (₹ in Crores)"
                viewType={view}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{premiumStyles}</style>
    </div>
  );
};

export default MediaSalesVsSpends;