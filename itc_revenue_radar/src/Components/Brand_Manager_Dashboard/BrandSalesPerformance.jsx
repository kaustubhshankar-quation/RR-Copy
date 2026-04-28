import React, { useEffect, useMemo } from "react";
import QuarterlySalesDashboard from "./SalesCompariosionLineChart";
import { useDispatch, useSelector } from "react-redux";
import { loadDashboardData } from "../Global_store/BrandmanagerDashboard/dashboardSlice";
import UserService from "../../services/UserService";
import { useOutletContext } from "react-router-dom";

const BrandSalesPerformance = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state?.dashboard || {});
  const { salesData, loading } = useSelector((state) => state.dashboard || {});
  const yearlySalesData = salesData?.yearly?.yearly_sales || [];
  const currentFY = salesData?.current_fy || "Current FY";
  const previousFY = salesData?.previous_fy || "Previous FY";
  const tilldate = salesData?.data_present_till;
  const brandName = salesData?.brand || "Brand";

  const { theme } = useOutletContext();
  const isDark = theme === "dark";

  const formatCr = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₹ 0 Cr";
    return `₹ ${(Number(value) / 10000000).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} Cr`;
  };

  const previousTotal = useMemo(() => {
    return Number(yearlySalesData?.[0]?.previous_fy || 0);
  }, [yearlySalesData]);

  const currentTotal = useMemo(() => {
    return Number(yearlySalesData?.[1]?.current_fy || 0);
  }, [yearlySalesData]);

  const yoyChange = useMemo(() => {
    if (!previousTotal) return 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  }, [previousTotal, currentTotal]);

  const previousTillLabel = useMemo(() => {
    if (!tilldate) return previousFY;
    const [year, month] = tilldate.split("-");
    return `${previousFY} (${year}-${String(Number(month) - 1).padStart(2, "0")})`;
  }, [previousFY, tilldate]);

  const currentTillLabel = useMemo(() => {
    if (!tilldate) return currentFY;
    return `${currentFY} (${tilldate})`;
  }, [currentFY, tilldate]);

  useEffect(() => {
    if (!dashboard.loaded) {
      const payload = UserService.hasRole(["BBMNGR"])
        ? {
          brand: "BAD BANGLES",
          fy: "2025-26",
        }
        : (UserService.hasRole(["OODMNGR"]) || UserService.hasRole(["SALES"]))
          ? {
            brand: "OODLES",
            fy: "2025-26",
          }
          : UserService.hasRole(["CBMNGR"])
            ? {
              brand: "CHERRY BRIGHT",
              fy: "2025-26",
            }
            : {
              brand: "MILD URGENCY",
              fy: "2025-26",
            };

      dispatch(loadDashboardData(payload));
    }
  }, [dashboard.loaded, dispatch]);

  const getGrowthClass = (value) => {
    if (Number(value) > 0) return "text-success";
    if (Number(value) < 0) return "text-danger";
    return "text-secondary";
  };

  const premiumStyles = `
    .brand-sales-dashboard {
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
      --shadow-soft: ${isDark ? "0 4px 24px rgba(0, 0, 0, 0.3)" : "0 4px 24px rgba(44, 62, 80, 0.06)"};
      --shadow-hover: ${isDark ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(44, 62, 80, 0.10)"};
    }

    .brand-sales-dashboard {
      background: transparent;
      color: var(--text-primary);
    }

    .premium-header-card {
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
    }

    .premium-header-card h3 {
      font-family: 'Playfair Display', Georgia, serif !important;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
    }

    .section-label {
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

    .header-icon {
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
    }

    .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .meta-chip {
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

    .meta-chip-success {
      background: var(--chip-success-bg);
      color: var(--chip-success-text);
      border-color: ${isDark ? "rgba(13, 124, 102, 0.3)" : "rgba(13, 124, 102, 0.2)"};
    }

    .premium-kpi-card {
      background: linear-gradient(
        180deg,
        var(--surface-bg-strong) 0%,
        ${isDark ? "#2C3E50" : "#FCFDFF"} 100%
      );
      border: 1px solid var(--border-soft);
      border-left: 4px solid ${isDark ? "#17A2B8" : "#0D7C66"};
      border-radius: 16px;
      padding: 1.25rem;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      color: var(--text-primary);
    }

    .premium-kpi-card:hover,
    .premium-panel:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
    }

    .kpi-label {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      line-height: 1.4;
    }

    .kpi-value {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 8px;
      margin-bottom: 4px;
      color: var(--text-primary);
    }

    .kpi-value.text-primary {
      color: ${isDark ? "#F8F9FA" : "#2C3E50"} !important;
    }

    .kpi-value.text-success {
      color: ${isDark ? "#17A2B8" : "#198754"} !important;
    }

    .kpi-value.text-danger {
      color: ${isDark ? "#fca5a5" : "#DC3545"} !important;
    }

    .kpi-subtext {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
    }

    .kpi-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .kpi-icon-blue {
      background: var(--icon-blue-bg);
      color: var(--icon-blue-text);
    }

    .kpi-icon-green {
      background: var(--icon-green-bg);
      color: var(--icon-green-text);
    }

    .kpi-icon-red {
      background: var(--icon-red-bg);
      color: var(--icon-red-text);
    }

    .premium-panel {
      background: var(--surface-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      overflow: hidden;
      color: var(--text-primary);
    }

    .premium-spinner {
      width: 46px;
      height: 46px;
      margin: 0 auto;
      border-radius: 50%;
      border: 4px solid ${isDark ? "#4A6274" : "#E5E7EB"};
      border-top-color: ${isDark ? "#0D7C66" : "#0D7C66"};
      animation: spinPremium 0.8s linear infinite;
    }

    @keyframes spinPremium {
      to {
        transform: rotate(360deg);
      }
    }

    .brand-sales-dashboard .text-muted {
      color: var(--text-muted) !important;
    }

    .brand-sales-dashboard h3,
    .brand-sales-dashboard h5,
    .brand-sales-dashboard .fw-bold {
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text-primary);
    }

    .brand-sales-dashboard h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }

    .brand-sales-dashboard h5 {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.4;
    }

    .brand-sales-dashboard .small,
    .brand-sales-dashboard small {
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .premium-header-card,
      .premium-kpi-card,
      .premium-panel {
        border-radius: 12px;
      }
    }
  `;

  if (loading) {
    return (
      <div className="container-fluid py-3 brand-sales-dashboard">
        <div
          className="premium-panel text-center py-5"
        >
          <div className="premium-spinner mb-3"></div>
          <h5 className="fw-bold mb-1">Preparing Sales Performance...</h5>
          <p className="text-muted mb-0">
            Fetching yearly and monthly sales insights
          </p>
        </div>

        <style>{premiumStyles}</style>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 brand-sales-dashboard">
      <div className="premium-header-card mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="section-label mb-2">Sales Overview</div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span className="header-icon">
                <i className="fas fa-chart-line"></i>
              </span>
              Sales Performance
            </h3>
            <div className="text-muted small">
              Yearly, quarterly and monthly sales comparison across financial years
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4 col-md-6 col-12">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Previous FY Sales</div>
                <div className="kpi-value text-primary">{formatCr(previousTotal)}</div>
                <div className="kpi-subtext">{previousTillLabel}</div>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <i className="fas fa-chart-bar"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Current FY Sales</div>
                <div className="kpi-value text-success">{formatCr(currentTotal)}</div>
                <div className="kpi-subtext">{currentTillLabel}</div>
              </div>
              <div className="kpi-icon kpi-icon-green">
                <i className="fas fa-signal"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12 col-12">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">YoY Growth</div>
                <div className={`kpi-value ${getGrowthClass(yoyChange)}`}>
                  {yoyChange >= 0 ? "+" : ""}
                  {Number(yoyChange).toFixed(2)}%
                </div>
                <div className="kpi-subtext">Overall yearly movement</div>
              </div>
              <div className={`kpi-icon ${yoyChange >= 0 ? "kpi-icon-green" : "kpi-icon-red"}`}>
                <i className={`fas ${yoyChange >= 0 ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuarterlySalesDashboard theme={theme} />

      <style>{premiumStyles}</style>
    </div>
  );
};

export default BrandSalesPerformance;