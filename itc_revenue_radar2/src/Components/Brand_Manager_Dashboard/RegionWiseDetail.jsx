import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import Chart from "react-apexcharts";

const RegionWiseDetail = () => {
  const { regionWiseData, loading } = useSelector((state) => state.dashboard || {});
  const { theme } = useOutletContext();
  const isDark = theme === "dark";
  
  const navigate = useNavigate()
  useEffect(()=>{
    const data = regionWiseData || {};
    if(Object.keys(data).length === 0){
      navigate('/cockpit/sales-performance')
    }
  },[regionWiseData,navigate])

  const [activeQuarter, setActiveQuarter] = useState("");

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
    quarterBg: isDark ? "#34495E" : "#F8F9FA",
    quarterHover: isDark ? "#3D566E" : "#E5E7EB",
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
    goldBg: isDark ? "rgba(255, 140, 0, 0.12)" : "#FFF4E6",
    goldText: isDark ? "#FFC107" : "#FF8C00",
    neutralBg: isDark ? "#34495E" : "#F8F9FA",
    neutralText: isDark ? "#ADB5BD" : "#6C757D",
    successSoft: isDark ? "rgba(13, 124, 102, 0.15)" : "#E8F5E8",
    successSoftText: isDark ? "#FFC107" : "#0D7C66",
    dangerSoft: isDark ? "rgba(220, 53, 69, 0.15)" : "#FEF2F2",
    dangerSoftText: isDark ? "#fca5a5" : "#DC3545",
    emptyBg: isDark ? "#34495E" : "#F8F9FA",
    emptyText: isDark ? "#ADB5BD" : "#6C757D",
    tableLikeBg: isDark ? "#2C3E50" : "#FBFDFF",
    momentumBg: isDark
      ? "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)"
      : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
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

  const formatCr = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₹ 0 Cr";
    return `₹ ${(Number(value) / 10000000).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} Cr`;
  };

  const getGrowthClass = (value) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-secondary";
  };

  const getGrowthBadgeClass = (value) => {
    if (value > 0) return "growth-badge growth-positive";
    if (value < 0) return "growth-badge growth-negative";
    return "growth-badge growth-neutral";
  };

  const yearlyRegions = useMemo(() => {
    return [...(regionWiseData?.yearly_sales_region_wise || [])].sort((a, b) =>
      a.final_market.localeCompare(b.final_market)
    );
  }, [regionWiseData]);

  const quarterList = useMemo(() => {
    return regionWiseData?.qtr_sales_region_wise?.map((item) => item.fy_quarter) || [];
  }, [regionWiseData]);

  useEffect(() => {
    if (quarterList.length && !activeQuarter) {
      setActiveQuarter(quarterList[0]);
    }
  }, [quarterList, activeQuarter]);

  const activeQuarterData = useMemo(() => {
    const quarterData =
      regionWiseData?.qtr_sales_region_wise?.find(
        (item) => item.fy_quarter === activeQuarter
      ) || null;

    if (!quarterData) return null;

    return {
      ...quarterData,
      regions: [...(quarterData.regions || [])].sort((a, b) =>
        a.final_market.localeCompare(b.final_market)
      ),
    };
  }, [regionWiseData, activeQuarter]);

  const totalPreviousFY = useMemo(() => {
    return yearlyRegions.reduce((sum, item) => sum + (Number(item.previous_fy) || 0), 0);
  }, [yearlyRegions]);

  const totalCurrentFY = useMemo(() => {
    return yearlyRegions.reduce((sum, item) => sum + (Number(item.current_fy) || 0), 0);
  }, [yearlyRegions]);

  const overallGrowth = useMemo(() => {
    if (!totalPreviousFY) return 0;
    return ((totalCurrentFY - totalPreviousFY) / totalPreviousFY) * 100;
  }, [totalPreviousFY, totalCurrentFY]);

  const bestRegion = useMemo(() => {
    if (!yearlyRegions.length) return null;
    return [...yearlyRegions].sort(
      (a, b) => (b.change_percent || 0) - (a.change_percent || 0)
    )[0];
  }, [yearlyRegions]);

  const weakestRegion = useMemo(() => {
    if (!yearlyRegions.length) return null;
    return [...yearlyRegions].sort(
      (a, b) => (a.change_percent || 0) - (b.change_percent || 0)
    )[0];
  }, [yearlyRegions]);

  const chartBaseOptions = useMemo(
    () => ({
      chart: {
        toolbar: { show: false },
        fontFamily: "Inter, system-ui, sans-serif",
        foreColor: ui.textMuted,
        background: "transparent",
      },
      theme: {
        mode: isDark ? "dark" : "light",
      },
      grid: {
        borderColor: ui.grid,
        strokeDashArray: 4,
        padding: {
          left: 8,
          right: 8,
        },
      },
      colors: ["#17A2B8", "#0D7C66"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
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
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: "12px",
            fontWeight: 600,
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
          text: "Sales (₹ Cr)",
          style: {
            fontSize: "12px",
            fontWeight: 700,
            color: ui.textAxis,
          },
        },
        labels: {
          formatter: (val) => `₹ ${Number(val).toFixed(0)}`,
          style: {
            colors: [ui.textMuted],
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: ui.tooltipTheme,
        y: {
          formatter: (val) => `₹ ${Number(val).toFixed(2)} Cr`,
        },
      },
      noData: {
        text: "No data available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: ui.textMuted,
          fontSize: "14px",
        },
      },
    }),
    [isDark, ui]
  );

  const yearlyRegionChart = useMemo(() => {
    const categories = yearlyRegions.map((item) => item.final_market);

    return {
      series: [
        {
          name: regionWiseData?.previous_fy || "Previous FY",
          data: yearlyRegions.map((item) =>
            Number(((Number(item.previous_fy) || 0) / 10000000).toFixed(2))
          ),
        },
        {
          name: regionWiseData?.current_fy || "Current FY",
          data: yearlyRegions.map((item) =>
            Number(((Number(item.current_fy) || 0) / 10000000).toFixed(2))
          ),
        },
      ],
      options: {
        ...chartBaseOptions,
        chart: {
          ...chartBaseOptions.chart,
          type: "bar",
          height: 360,
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Number(val).toFixed(2)} Cr`,
          style: {
            fontSize: "13px",
            fontWeight: 700,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "45%",
            borderRadius: 16,
            borderRadiusApplication: "end",
          },
        },
        xaxis: {
          ...chartBaseOptions.xaxis,
          categories,
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 600,
              colors: categories.map(() => ui.textAxis),
            },
          },
        },
      },
    };
  }, [yearlyRegions, regionWiseData, chartBaseOptions, ui.textAxis]);

  const quarterRegionChart = useMemo(() => {
    const categories = activeQuarterData?.regions?.map((item) => item.final_market) || [];

    return {
      series: [
        {
          name: regionWiseData?.previous_fy || "Previous FY",
          data: (activeQuarterData?.regions || []).map((item) =>
            Number(((Number(item.previous_fy) || 0) / 10000000).toFixed(2))
          ),
        },
        {
          name: regionWiseData?.current_fy || "Current FY",
          data: (activeQuarterData?.regions || []).map((item) =>
            Number(((Number(item.current_fy) || 0) / 10000000).toFixed(2))
          ),
        },
      ],
      options: {
        ...chartBaseOptions,
        chart: {
          ...chartBaseOptions.chart,
          type: "bar",
          height: 340,
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Number(val).toFixed(2)} Cr`,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            borderRadius: 16,
            borderRadiusApplication: "end",
          },
        },
        xaxis: {
          ...chartBaseOptions.xaxis,
          categories,
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 600,
              colors: categories.map(() => ui.textAxis),
            },
          },
        },
      },
    };
  }, [activeQuarterData, regionWiseData, chartBaseOptions, ui.textAxis]);

  const regionShareChart = useMemo(() => {
    const labels = yearlyRegions.map((item) => item.final_market);
    const series = yearlyRegions.map((item) =>
      Number(((Number(item.current_fy) || 0) / 10000000).toFixed(2))
    );

    return {
      series,
      options: {
        chart: {
          type: "donut",
          height: 340,
          fontFamily: "Inter, system-ui, sans-serif",
          background: "transparent",
          foreColor: ui.textMuted,
        },
        theme: {
          mode: isDark ? "dark" : "light",
        },
        labels,
        colors: ["#17A2B8", "#0D7C66", "#FF8C00", "#8b5cf6", "#DC3545", "#198754"],
        legend: {
          position: "bottom",
          fontSize: "12px",
          fontWeight: 600,
          labels: {
            colors: ui.textSecondary,
          },
        },
        stroke: {
          width: 3,
          colors: [ui.surfaceStrong],
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Number(val).toFixed(1)}%`,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
        },
        tooltip: {
          theme: ui.tooltipTheme,
          y: {
            formatter: (val) => `₹ ${Number(val).toFixed(2)} Cr`,
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: ui.textMuted,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: ui.textPrimary,
                },
                total: {
                  show: true,
                  label: "Current FY",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: ui.textMuted,
                  formatter: () =>
                    `₹ ${((totalCurrentFY || 0) / 10000000).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })} Cr`,
                },
              },
            },
          },
        },
      },
    };
  }, [yearlyRegions, totalCurrentFY, isDark, ui]);

  const styles = `
    .region-dashboard {
      --surface-bg: ${ui.surfaceBg};
      --surface-strong: ${ui.surfaceStrong};
      --surface-soft: ${ui.surfaceSoft};
      --surface-soft-2: ${ui.surfaceSoft2};
      --border-soft: ${ui.borderSoft};
      --border-soft-2: ${ui.borderSoft2};
      --text-main: ${ui.textPrimary};
      --text-secondary: ${ui.textSecondary};
      --text-muted: ${ui.textMuted};
      --shadow-soft: ${ui.shadowSoft};
      --shadow-hover: ${ui.shadowHover};
    }

    .region-dashboard {
      background: transparent;
      color: var(--text-main);
    }

    .region-dashboard .premium-header-card {
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

    .region-dashboard .premium-header-card h3 {
      font-family: 'Playfair Display', Georgia, serif !important;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
    }

    .region-dashboard .section-label {
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

    .region-dashboard .header-icon {
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

    .region-dashboard .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .region-dashboard .meta-chip {
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

    .region-dashboard .meta-chip-success {
      background: ${ui.chipSuccessBg};
      color: ${ui.chipSuccessText};
      border-color: ${isDark ? "#1f5b45" : "#d1fae5"};
    }

    .region-dashboard .premium-kpi-card {
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
      color: var(--text-main);
    }

    .region-dashboard .premium-kpi-card:hover,
    .region-dashboard .premium-region-card:hover,
    .region-dashboard .premium-panel:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
    }

    .region-dashboard .kpi-label {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      line-height: 1.4;
    }

    .region-dashboard .kpi-value {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 8px;
      margin-bottom: 4px;
      color: var(--text-main);
    }

    .region-dashboard .kpi-value.text-primary {
      color: ${isDark ? "#F8F9FA" : "#2C3E50"} !important;
    }

    .region-dashboard .kpi-value.text-success {
      color: ${isDark ? "#FFC107" : "#198754"} !important;
    }

    .region-dashboard .kpi-value.text-danger {
      color: ${isDark ? "#fca5a5" : "#DC3545"} !important;
    }

    .region-dashboard .kpi-value.text-dark {
      color: var(--text-main) !important;
    }

    .region-dashboard .kpi-subtext {
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    .region-dashboard .kpi-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .region-dashboard .kpi-icon-blue {
      background: ${ui.blueBg};
      color: ${ui.blueText};
    }

    .region-dashboard .kpi-icon-green {
      background: ${ui.greenBg};
      color: ${ui.greenText};
    }

    .region-dashboard .kpi-icon-red {
      background: ${ui.redBg};
      color: ${ui.redText};
    }

    .region-dashboard .kpi-icon-gold {
      background: ${ui.goldBg};
      color: ${ui.goldText};
    }

    .region-dashboard .premium-panel {
      background: var(--surface-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      box-shadow: var(--shadow-soft);
      transition: all 0.28s ease;
      overflow: hidden;
      color: var(--text-main);
    }

    .region-dashboard .panel-header {
      padding: 1.5rem 1.5rem 0.75rem;
    }

    .region-dashboard .panel-body {
      padding: 1rem 1.25rem 1.25rem;
    }

    .region-dashboard .panel-title {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
      color: var(--text-main);
    }

    .region-dashboard .panel-subtitle {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
      line-height: 1.5;
    }

    .region-dashboard .quarter-switch {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 4px;
      background: ${ui.quarterBg};
      border-radius: 12px;
      border: 1px solid ${ui.borderSoft2};
    }

    .region-dashboard .quarter-switch-btn {
      border: none;
      background: transparent;
      color: var(--text-muted);
      padding: 8px 14px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.22s ease;
    }

    .region-dashboard .quarter-switch-btn:hover {
      background: ${ui.quarterHover};
      color: var(--text-main);
    }

    .region-dashboard .quarter-switch-btn.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
    }

    .region-dashboard .premium-region-card {
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

    .region-dashboard .growth-badge {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 12px;
      font-weight: 700;
    }

    .region-dashboard .growth-positive {
      background: ${ui.successSoft};
      color: ${ui.successSoftText};
      border: 1px solid ${isDark ? "#1f5b45" : "#d1fae5"};
    }

    .region-dashboard .growth-negative {
      background: ${ui.dangerSoft};
      color: ${ui.dangerSoftText};
      border: 1px solid ${isDark ? "#7f1d1d" : "#fee2e2"};
    }

    .region-dashboard .growth-neutral {
      background: ${ui.neutralBg};
      color: ${ui.neutralText};
      border: 1px solid ${ui.borderSoft2};
    }

    .region-dashboard .region-metric-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      color: var(--text-muted);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    .region-dashboard .region-metric-row strong {
      color: var(--text-main);
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 13px;
      font-weight: 500;
    }

    .region-dashboard .region-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${ui.borderSoft2}, transparent);
      margin: 6px 0;
    }

    .region-dashboard .insight-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .region-dashboard .insight-box-icon {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .region-dashboard .insight-box-icon.success {
      background: ${ui.successSoft};
      color: ${ui.successSoftText};
    }

    .region-dashboard .insight-box-icon.danger {
      background: ${ui.dangerSoft};
      color: ${ui.dangerSoftText};
    }

    .region-dashboard .momentum-box {
      border: 1px solid var(--border-soft);
      background: ${ui.momentumBg};
      border-radius: 16px;
      padding: 1.25rem;
    }

    .region-dashboard .momentum-value {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 12px;
    }

    .region-dashboard .premium-spinner {
      width: 46px;
      height: 46px;
      margin: 0 auto;
      border-radius: 50%;
      border: 4px solid ${ui.spinnerTrack};
      border-top-color: ${ui.spinnerHead};
      animation: spinPremium 0.8s linear infinite;
    }

    .region-dashboard .empty-state-icon {
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

    .region-dashboard .text-muted {
      color: var(--text-muted) !important;
    }

    .region-dashboard .text-dark {
      color: var(--text-main) !important;
    }

    .region-dashboard h3,
    .region-dashboard h5,
    .region-dashboard h6,
    .region-dashboard .fw-bold,
    .region-dashboard .fw-semibold {
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text-main);
    }

    .region-dashboard h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }

    .region-dashboard h5 {
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
    }

    .region-dashboard h6 {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
    }

    .region-dashboard .small,
    .region-dashboard small {
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
      .region-dashboard .kpi-value {
        font-size: 1.35rem;
      }

      .region-dashboard .momentum-value {
        font-size: 1.7rem;
      }
    }

    @media (max-width: 768px) {
      .region-dashboard .premium-header-card,
      .region-dashboard .premium-panel,
      .region-dashboard .premium-kpi-card,
      .region-dashboard .premium-region-card {
        border-radius: 12px;
      }

      .region-dashboard .panel-header {
        padding: 1.1rem 1rem 0.65rem;
      }

      .region-dashboard .panel-body {
        padding: 0.85rem 0.9rem 1rem;
      }

      .region-dashboard .quarter-switch {
        width: 100%;
      }

      .region-dashboard .quarter-switch-btn {
        flex: 1;
      }
    }
  `;

  return (
    <div className="container-fluid py-3 region-dashboard">
      <div className="premium-header-card mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="section-label mb-2">Performance Overview</div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span className="header-icon">
                <i className="fas fa-globe-asia"></i>
              </span>
              Region Wise Details
            </h3>
            <div className="text-muted small">
              Deep dive into yearly and quarterly regional sales performance
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="premium-kpi-card kpi-blue h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Previous FY Sales</div>
                <div className="kpi-value text-primary">{formatCr(totalPreviousFY)}</div>
                <div className="kpi-subtext">{regionWiseData.previous_fy}</div>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="premium-kpi-card kpi-green h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Current FY Sales</div>
                <div className="kpi-value text-success">{formatCr(totalCurrentFY)}</div>
                <div className="kpi-subtext">{regionWiseData.current_fy}</div>
              </div>
              <div className="kpi-icon kpi-icon-green">
                <i className="fas fa-signal"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Overall Growth</div>
                <div className={`kpi-value ${getGrowthClass(overallGrowth)}`}>
                  {overallGrowth >= 0 ? "+" : ""}
                  {overallGrowth.toFixed(2)}%
                </div>
                <div className="kpi-subtext">All regions combined</div>
              </div>
              <div
                className={`kpi-icon ${
                  overallGrowth >= 0 ? "kpi-icon-green" : "kpi-icon-red"
                }`}
              >
                <i className="fas fa-level-up-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="premium-kpi-card h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="kpi-label">Best Growth Region</div>
                <div className="kpi-value text-dark">{bestRegion?.final_market || "-"}</div>
                <div className="kpi-subtext text-success fw-semibold">
                  {bestRegion
                    ? `${bestRegion.change_percent >= 0 ? "+" : ""}${Number(
                        bestRegion.change_percent || 0
                      ).toFixed(2)}%`
                    : "-"}
                </div>
              </div>
              <div className="kpi-icon kpi-icon-gold">
                <i className="fas fa-trophy"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-panel mb-4">
        <div className="panel-header">
          <div>
            <h5 className="panel-title mb-1">YoY Region Sales Comparison</h5>
            <div className="panel-subtitle">
              {regionWiseData.previous_fy} vs {regionWiseData.current_fy}
            </div>
          </div>
        </div>

        <div className="panel-body pt-0">
          <Chart
            options={yearlyRegionChart.options}
            series={yearlyRegionChart.series}
            type="bar"
            height={360}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="premium-panel h-100">
            <div className="panel-header d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h5 className="panel-title mb-1">Quarter Wise Regional Comparison</h5>
                <div className="panel-subtitle">
                  Compare performance across markets for selected quarter
                </div>
              </div>

              <div className="quarter-switch">
                {quarterList.map((quarter) => (
                  <button
                    key={quarter}
                    className={`quarter-switch-btn ${
                      activeQuarter === quarter ? "active" : ""
                    }`}
                    onClick={() => setActiveQuarter(quarter)}
                    type="button"
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-body pt-0">
              {activeQuarterData?.regions?.length ? (
                <Chart
                  options={quarterRegionChart.options}
                  series={quarterRegionChart.series}
                  type="bar"
                  height={340}
                />
              ) : (
                <div className="text-center py-5 text-muted">
                  No quarter-wise regional data available.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="premium-panel h-100">
            <div className="panel-header">
              <h5 className="panel-title mb-1">Current FY Region Share</h5>
              <div className="panel-subtitle">Contribution split across all regions</div>
            </div>

            <div className="panel-body pt-0">
              <Chart
                options={regionShareChart.options}
                series={regionShareChart.series}
                type="donut"
                height={340}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {yearlyRegions.map((item, index) => {
          const diff = (Number(item.current_fy) || 0) - (Number(item.previous_fy) || 0);

          return (
            <div className="col-xl-3 col-md-6" key={`${item.final_market}-${index}`}>
              <div className="premium-region-card h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="fw-bold mb-0">{item.final_market}</h6>
                  <span className={getGrowthBadgeClass(item.change_percent)}>
                    {item.change_percent >= 0 ? "+" : ""}
                    {Number(item.change_percent || 0).toFixed(2)}%
                  </span>
                </div>

                <div className="region-metric-row">
                  <span>{regionWiseData.previous_fy}</span>
                  <strong>{formatCr(item.previous_fy)}</strong>
                </div>

                <div className="region-metric-row">
                  <span>{regionWiseData.current_fy}</span>
                  <strong>{formatCr(item.current_fy)}</strong>
                </div>

                <div className="region-divider"></div>

                <div className="region-metric-row">
                  <span>Absolute Change</span>
                  <strong className={getGrowthClass(diff)}>
                    {diff >= 0 ? "+" : ""}
                    {formatCr(diff)}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="premium-panel h-100">
            <div className="panel-header">
              <h5 className="panel-title mb-0">Key Highlights</h5>
            </div>

            <div className="panel-body">
              <div className="insight-row mb-3">
                <div className="insight-box-icon success">
                  <i className="fas fa-arrow-up"></i>
                </div>
                <div>
                  <div className="fw-semibold mb-1">Top Growth Region</div>
                  <div className="text-muted small">
                    <strong>{bestRegion?.final_market || "-"}</strong> delivered the
                    highest yearly growth at{" "}
                    <span className="fw-bold text-success">
                      {bestRegion?.change_percent?.toFixed(2)}%
                    </span>
                    .
                  </div>
                </div>
              </div>

              <div className="insight-row">
                <div className="insight-box-icon danger">
                  <i className="fas fa-arrow-down"></i>
                </div>
                <div>
                  <div className="fw-semibold mb-1">Lowest Growth Region</div>
                  <div className="text-muted small">
                    <strong>{weakestRegion?.final_market || "-"}</strong> showed the
                    lowest yearly growth at{" "}
                    <span className="fw-bold text-danger">
                      {weakestRegion?.change_percent?.toFixed(2)}%
                    </span>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="premium-panel h-100">
            <div className="panel-header">
              <h5 className="panel-title mb-0">Overall Momentum</h5>
            </div>

            <div className="panel-body">
              <div className="momentum-box">
                <div className={`momentum-value ${getGrowthClass(overallGrowth)}`}>
                  {overallGrowth >= 0 ? "+" : ""}
                  {overallGrowth.toFixed(2)}%
                </div>

                <p className="text-muted mb-0">
                  <strong>{regionWiseData.brand}</strong> moved from{" "}
                  <strong>{formatCr(totalPreviousFY)}</strong> in{" "}
                  <strong>{regionWiseData.previous_fy}</strong> to{" "}
                  <strong>{formatCr(totalCurrentFY)}</strong> in{" "}
                  <strong>{regionWiseData.current_fy}</strong>, showing strong
                  aggregated regional movement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
};

export default RegionWiseDetail;