import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import Chart from "react-apexcharts";

const MediaWiseROI = () => {
  const { mediaROIData, loading } = useSelector((state) => state.dashboard || {});
  const { theme } = useOutletContext();
  const isDark = theme === "dark";
  const yearly_roi = mediaROIData?.yearly_roi || [];
  const current_fy = mediaROIData?.current_fy || "Current FY";
  const previous_fy = mediaROIData?.previous_fy || "Previous FY";
  const brandName = mediaROIData?.brand || "Brand";
  const dataTillMonth = mediaROIData?.data_present_till;
  const navigate = useNavigate()
  useEffect(() => {
    const data = mediaROIData || {};

    if (Object.keys(data).length === 0) {
      navigate('/cockpit/sales-performance');
    }
  }, [mediaROIData, navigate]);

  const ui = {
    surfaceBg: isDark ? "rgba(44, 62, 80, 0.92)" : "rgba(255, 255, 255, 0.92)",
    surfaceStrong: isDark ? "#2C3E50" : "#FFFFFF",
    surfaceSoft: isDark ? "#34495E" : "#F8F9FA",
    surfaceSoft2: isDark ? "#1E3A34" : "#E8F5E8",
    borderSoft: isDark ? "#4A6274" : "#E5E7EB",
    borderSoft2: isDark ? "#4A6274" : "#E5E7EB",
    textPrimary: isDark ? "#F8F9FA" : "#2C3E50",
    textSecondary: isDark ? "#E5E7EB" : "#2C3E50",
    textMuted: isDark ? "#ADB5BD" : "#6C757D",
    textAxis: isDark ? "#E5E7EB" : "#2C3E50",
    grid: isDark ? "#4A6274" : "#E5E7EB",
    chipBg: isDark ? "#34495E" : "#FFFFFF",
    chipText: isDark ? "#E5E7EB" : "#2C3E50",
    chipSuccessBg: isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8",
    chipSuccessText: isDark ? "#FFC107" : "#0D7C66",
    blueBg: isDark ? "rgba(44, 62, 80, 0.15)" : "#F0F4F8",
    blueText: isDark ? "#F8F9FA" : "#2C3E50",
    greenBg: isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8",
    greenText: isDark ? "#FFC107" : "#0D7C66",
    redBg: isDark ? "rgba(220, 53, 69, 0.15)" : "#FEF2F2",
    redText: isDark ? "#fca5a5" : "#DC3545",
    successSoft: isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8",
    successSoftText: isDark ? "#FFC107" : "#0D7C66",
    dangerSoft: isDark ? "rgba(220, 53, 69, 0.15)" : "#FEF2F2",
    dangerSoftText: isDark ? "#fca5a5" : "#DC3545",
    emptyBg: isDark ? "#34495E" : "#F8F9FA",
    emptyText: isDark ? "#ADB5BD" : "#6C757D",
    shadowSoft: isDark
      ? "0 4px 24px rgba(0, 0, 0, 0.3)"
      : "0 4px 24px rgba(44, 62, 80, 0.06)",
    shadowHover: isDark
      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
      : "0 8px 32px rgba(44, 62, 80, 0.10)",
    tooltipTheme: isDark ? "dark" : "light",
    spinnerTrack: isDark ? "#4A6274" : "#E5E7EB",
    spinnerHead: isDark ? "#0D7C66" : "#0D7C66",
  };

  const filteredData = useMemo(() => {
    return yearly_roi
      .filter((item) => Number(item.previous_fy) > 0 && Number(item.current_fy) > 0)
      .sort((a, b) => a.attribute_name.localeCompare(b.attribute_name));
  }, [yearly_roi]);

  const categories = filteredData.map((item) =>
    String(item.attribute_name || "").replace(/_/g, " ")
  );

  const previousAvg = useMemo(() => {
    if (!filteredData.length) return 0;
    const total = filteredData.reduce(
      (sum, item) => sum + (Number(item.previous_fy) || 0),
      0
    );
    return total / filteredData.length;
  }, [filteredData]);

  const currentAvg = useMemo(() => {
    if (!filteredData.length) return 0;
    const total = filteredData.reduce(
      (sum, item) => sum + (Number(item.current_fy) || 0),
      0
    );
    return total / filteredData.length;
  }, [filteredData]);

  const yoyChange = useMemo(() => {
    if (!previousAvg) return 0;
    return ((currentAvg - previousAvg) / previousAvg) * 100;
  }, [previousAvg, currentAvg]);

  const topPrevious = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort((a, b) => b.previous_fy - a.previous_fy)[0];
  }, [filteredData]);

  const lowPrevious = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort((a, b) => a.previous_fy - b.previous_fy)[0];
  }, [filteredData]);

  const topCurrent = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort((a, b) => b.current_fy - a.current_fy)[0];
  }, [filteredData]);

  const lowCurrent = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort((a, b) => a.current_fy - b.current_fy)[0];
  }, [filteredData]);

  const formatROI = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00x";
    return `${Number(value).toFixed(2)}x`;
  };

  const getGrowthClass = (value) => {
    if (Number(value) > 0) return "text-success";
    if (Number(value) < 0) return "text-danger";
    return "text-secondary";
  };

  const series = [
    {
      name: previous_fy,
      data: filteredData.map((item) => Number(item.previous_fy) || 0),
    },
    {
      name: current_fy,
      data: filteredData.map((item) => Number(item.current_fy) || 0),
    },
  ];

  const options = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 420,
        toolbar: { show: false },
        fontFamily: "Inter, system-ui, sans-serif",
        foreColor: ui.textMuted,
        background: "transparent",
      },
      theme: {
        mode: isDark ? "dark" : "light",
      },
      colors: ["#17A2B8", "#0D7C66"],
      plotOptions: {
        bar: {
          columnWidth: "42%",
          borderRadius: 8,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: ui.grid,
        strokeDashArray: 4,
        padding: {
          left: 8,
          right: 8,
        },
      },
      xaxis: {
        categories,
        title: {
          text: "Media Channel",
          style: {
            fontWeight: 700,
            color: ui.textAxis,
          },
        },
        labels: {
          rotate: -35,
          trim: true,
          style: {
            fontSize: "11px",
            fontWeight: 600,
            colors: categories.map(() => ui.textAxis),
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: "ROI",
          style: {
            fontWeight: 700,
            color: ui.textAxis,
          },
        },
        labels: {
          formatter: (val) => `${Number(val).toFixed(1)}x`,
          style: {
            fontSize: "12px",
            colors: [ui.textMuted],
          },
        },
      },
      tooltip: {
        theme: ui.tooltipTheme,
        y: {
          formatter: (val) => `${Number(val).toFixed(2)}x ROI`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        fontWeight: 600,
        labels: {
          colors: ui.textSecondary,
        },
        markers: {
          radius: 10,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 360,
            },
            plotOptions: {
              bar: {
                columnWidth: "55%",
              },
            },
            xaxis: {
              labels: {
                rotate: -45,
              },
            },
          },
        },
      ],
      noData: {
        text: "No ROI data available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: ui.textMuted,
          fontSize: "14px",
        },
      },
    }),
    [categories, current_fy, previous_fy, isDark, ui]
  );

  const styles = `
    .media-roi-dashboard {
      --surface-bg: ${ui.surfaceBg};
      --surface-strong: ${ui.surfaceStrong};
      --surface-soft: ${ui.surfaceSoft};
      --surface-soft-2: ${ui.surfaceSoft2};
      --border-soft: ${ui.borderSoft};
      --text-main: ${ui.textPrimary};
      --text-secondary: ${ui.textSecondary};
      --text-muted: ${ui.textMuted};
      --shadow-soft: ${ui.shadowSoft};
      --shadow-hover: ${ui.shadowHover};
    }

    .media-roi-dashboard {
      background: transparent;
      color: var(--text-main);
    }

    .media-roi-dashboard .premium-header-card {
      background: linear-gradient(
        135deg,
        var(--surface-strong) 0%,
        var(--surface-soft) 55%,
        var(--surface-soft-2) 100%
      );
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: var(--shadow-soft);
      color: var(--text-main);
    }

    .media-roi-dashboard .premium-header-card h3 {
      font-family: 'Playfair Display', Georgia, serif !important;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
    }

    .media-roi-dashboard .section-label {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 999px;
      background: ${isDark ? "#172554" : "#eff6ff"};
      color: ${isDark ? "#93c5fd" : "#2563eb"};
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      line-height: 1.4;
      text-transform: uppercase;
    }

    .media-roi-dashboard .header-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        ${isDark ? "#172554" : "#dbeafe"} 0%,
        ${isDark ? "#0f3a55" : "#e0f2fe"} 100%
      );
      color: ${isDark ? "#93c5fd" : "#2563eb"};
      font-size: 1rem;
    }

    .media-roi-dashboard .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .media-roi-dashboard .meta-chip {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background: ${ui.chipBg};
      border: 1px solid var(--border-soft);
      color: ${ui.chipText};
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.4;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
    }

    .media-roi-dashboard .meta-chip-success {
      background: ${ui.chipSuccessBg};
      color: ${ui.chipSuccessText};
      border-color: ${isDark ? "#1f5b45" : "#d1fae5"};
    }

    .media-roi-dashboard .premium-kpi-card {
      background: linear-gradient(
        180deg,
        var(--surface-strong) 0%,
        ${isDark ? "#2C3E50" : "#FCFDFF"} 100%
      );
      border: 1px solid var(--border-soft);
      border-left: 4px solid ${isDark ? "#FFC107" : "#0D7C66"};
      border-radius: 16px;
      padding: 1.25rem;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      position: relative;
      overflow: hidden;
      color: var(--text-main);
    }

    .media-roi-dashboard .premium-kpi-card:hover,
    .media-roi-dashboard .premium-region-card:hover,
    .media-roi-dashboard .premium-panel:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
    }

    .media-roi-dashboard .kpi-label {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      line-height: 1.4;
    }

    .media-roi-dashboard .kpi-value {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 8px;
      margin-bottom: 4px;
      color: var(--text-main);
    }

    .media-roi-dashboard .kpi-value.text-primary {
      color: ${isDark ? "#F8F9FA" : "#2C3E50"} !important;
    }

    .media-roi-dashboard .kpi-value.text-success {
      color: ${isDark ? "#FFC107" : "#198754"} !important;
    }

    .media-roi-dashboard .kpi-value.text-danger {
      color: ${isDark ? "#fca5a5" : "#DC3545"} !important;
    }

    .media-roi-dashboard .kpi-subtext {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    .media-roi-dashboard .kpi-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .media-roi-dashboard .kpi-icon-blue {
      background: ${ui.blueBg};
      color: ${ui.blueText};
    }

    .media-roi-dashboard .kpi-icon-green {
      background: ${ui.greenBg};
      color: ${ui.greenText};
    }

    .media-roi-dashboard .kpi-icon-red {
      background: ${ui.redBg};
      color: ${ui.redText};
    }

    .media-roi-dashboard .premium-panel {
      background: var(--surface-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      overflow: hidden;
      color: var(--text-main);
    }

    .media-roi-dashboard .panel-header {
      padding: 1.5rem 1.5rem 0.75rem;
    }

    .media-roi-dashboard .panel-body {
      padding: 1rem 1.25rem 1.25rem;
    }

    .media-roi-dashboard .panel-title {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
      color: var(--text-main);
    }

    .media-roi-dashboard .panel-subtitle {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
      line-height: 1.5;
    }

    .media-roi-dashboard .premium-region-card {
      background: linear-gradient(
        180deg,
        var(--surface-strong) 0%,
        ${isDark ? "#2C3E50" : "#FBFDFF"} 100%
      );
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      padding: 1rem;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      color: var(--text-main);
    }

    .media-roi-dashboard .mini-card-label {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .media-roi-dashboard .mini-card-label.text-success {
      color: ${isDark ? "#FFC107" : "#198754"} !important;
    }

    .media-roi-dashboard .mini-card-label.text-danger {
      color: ${isDark ? "#fca5a5" : "#DC3545"} !important;
    }

    .media-roi-dashboard .mini-card-title {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-main);
      line-height: 1.65;
      margin-bottom: 8px;
    }

    .media-roi-dashboard .mini-card-metric {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .media-roi-dashboard .mini-card-metric.text-success {
      color: ${isDark ? "#FFC107" : "#198754"} !important;
    }

    .media-roi-dashboard .mini-card-metric.text-danger {
      color: ${isDark ? "#fca5a5" : "#DC3545"} !important;
    }

    .media-roi-dashboard .premium-spinner {
      width: 46px;
      height: 46px;
      margin: 0 auto;
      border-radius: 50%;
      border: 4px solid ${ui.spinnerTrack};
      border-top-color: ${ui.spinnerHead};
      animation: spinPremium 0.8s linear infinite;
    }

    .media-roi-dashboard .empty-state-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      border-radius: 16px;
      background: ${ui.emptyBg};
      color: ${ui.emptyText};
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .media-roi-dashboard .text-muted {
      color: var(--text-muted) !important;
    }

    .media-roi-dashboard h3,
    .media-roi-dashboard h5,
    .media-roi-dashboard .fw-bold,
    .media-roi-dashboard .fw-semibold {
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text-main);
    }

    .media-roi-dashboard h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }

    .media-roi-dashboard h5 {
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
    }

    .media-roi-dashboard .small,
    .media-roi-dashboard small {
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    @keyframes spinPremium {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 992px) {
      .media-roi-dashboard .kpi-value {
        font-size: 1.35rem;
      }
    }

    @media (max-width: 768px) {
      .media-roi-dashboard .premium-header-card,
      .media-roi-dashboard .premium-panel,
      .media-roi-dashboard .premium-kpi-card,
      .media-roi-dashboard .premium-region-card {
        border-radius: 12px;
      }

      .media-roi-dashboard .panel-header {
        padding: 1.1rem 1rem 0.65rem;
      }

      .media-roi-dashboard .panel-body {
        padding: 0.85rem 0.9rem 1rem;
      }
    }
  `;


  return (
    <div className="container-fluid py-3 media-roi-dashboard">
      <div className="premium-header-card mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="section-label mb-2">Marketing Efficiency</div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span className="header-icon">
                <i className="fas fa-bullhorn"></i>
              </span>
              Media Wise ROI
            </h3>
            <div className="text-muted small">
              Channel-wise return on investment comparison across financial years
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4 col-md-6 col-12">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Average ROI of Previous FY</div>
                <div className="kpi-value text-primary">{formatROI(previousAvg)}</div>
                <div className="kpi-subtext">{previous_fy}</div>
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
                <div className="kpi-label">Average ROI of Current FY</div>
                <div className="kpi-value text-success">{formatROI(currentAvg)}</div>
                <div className="kpi-subtext">{current_fy}</div>
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
                <div className="kpi-label">YoY ROI Change</div>
                <div className={`kpi-value ${getGrowthClass(yoyChange)}`}>
                  {Number(yoyChange) >= 0 ? "+" : ""}
                  {Number(yoyChange).toFixed(2)}%
                </div>
                <div className="kpi-subtext">Average ROI movement</div>
              </div>
              <div
                className={`kpi-icon ${Number(yoyChange) >= 0 ? "kpi-icon-green" : "kpi-icon-red"
                  }`}
              >
                <i
                  className={`fas ${Number(yoyChange) >= 0 ? "fa-arrow-up" : "fa-arrow-down"
                    }`}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6 col-12">
          <div className="premium-region-card h-100">
            <div className="mini-card-label text-success">Top Performer of Previous FY</div>
            <div className="mini-card-title">
              {topPrevious?.attribute_name?.replace(/_/g, " ") || "-"}
            </div>
            <div className="mini-card-metric text-success">
              {formatROI(topPrevious?.previous_fy)}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12">
          <div className="premium-region-card h-100">
            <div className="mini-card-label text-danger">Under Performer of Previous FY</div>
            <div className="mini-card-title">
              {lowPrevious?.attribute_name?.replace(/_/g, " ") || "-"}
            </div>
            <div className="mini-card-metric text-danger">
              {formatROI(lowPrevious?.previous_fy)}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12">
          <div className="premium-region-card h-100">
            <div className="mini-card-label text-success">Top Performer of Current FY</div>
            <div className="mini-card-title">
              {topCurrent?.attribute_name?.replace(/_/g, " ") || "-"}
            </div>
            <div className="mini-card-metric text-success">
              {formatROI(topCurrent?.current_fy)}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12">
          <div className="premium-region-card h-100">
            <div className="mini-card-label text-danger">Under Performer of Current FY</div>
            <div className="mini-card-title">
              {lowCurrent?.attribute_name?.replace(/_/g, " ") || "-"}
            </div>
            <div className="mini-card-metric text-danger">
              {formatROI(lowCurrent?.current_fy)}
            </div>
          </div>
        </div>
      </div>

      <div className="premium-panel">
        <div className="panel-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="panel-title mb-1">ROI Comparison by Media Channel</h5>
            <div className="panel-subtitle">
              {previous_fy} vs {current_fy}
            </div>
          </div>
        </div>

        <div className="panel-body pt-0">
          <Chart options={options} series={series} type="bar" height={420} />
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
};

export default MediaWiseROI;