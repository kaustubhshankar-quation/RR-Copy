import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { FaChartLine, FaEye, FaEyeSlash } from "react-icons/fa";

const BrandPredictionSummary = ({ apiData, isDark = false }) => {
    const [showChart, setShowChart] = useState(false);
    const [selectedFy, setSelectedFy] = useState("current");

    const summaryData = useMemo(() => {
        const brandLevelMape = apiData?.brand_level_mape || [];

        if (!brandLevelMape.length) {
            return {
                brand: "-",
                previousFy: "-",
                previousFyMape: "-",
                currentFy: "-",
                currentFyMape: "-",
            };
        }

        const sortedFyData = [...brandLevelMape].sort((a, b) =>
            a.fy.localeCompare(b.fy)
        );

        const previous = sortedFyData[0] || {};
        const current = sortedFyData[1] || {};

        return {
            brand: previous.brand || current.brand || "-",
            previousFy: previous.fy || "-",
            previousFyMape:
                previous.sales !== undefined && previous.sales !== null
                    ? `${(previous.sales * 100).toFixed(1)}%`
                    : "-",
            currentFy: current.fy || "-",
            currentFyMape:
                current.sales !== undefined && current.sales !== null
                    ? `${(current.sales * 100).toFixed(1)}%`
                    : "-",
        };
    }, [apiData]);

    const getFyFromMonth = (monthYear) => {
        const [yearStr, monthStr] = monthYear.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr);

        if (month >= 4) {
            return `${year}-${String(year + 1).slice(-2)}`;
        }
        return `${year - 1}-${String(year).slice(-2)}`;
    };

    const filteredChartData = useMemo(() => {
        const chartData = apiData?.month_wise_actual_vs_predicted || {};
        const categories = chartData?.month_year || [];
        const series = chartData?.series || [];

        const previousFy = summaryData.previousFy;
        const currentFy = summaryData.currentFy;
        const targetFy = selectedFy === "previous" ? previousFy : currentFy;

        if (!categories.length || !series.length || !targetFy || targetFy === "-") {
            return {
                categories: [],
                series: [],
            };
        }

        const matchedIndexes = categories.reduce((acc, item, index) => {
            if (getFyFromMonth(item) === targetFy) acc.push(index);
            return acc;
        }, []);

        const filteredCategories = matchedIndexes.map((idx) => categories[idx]);

        const filteredSeries = series.map((item) => ({
            ...item,
            data: matchedIndexes.map((idx) =>
                Number((item.data[idx] / 10000000).toFixed(4))
            ),
        }));

        return {
            categories: filteredCategories,
            series: filteredSeries,
            fy: targetFy,
        };
    }, [apiData, summaryData.previousFy, summaryData.currentFy, selectedFy]);

    const chartConfig = useMemo(() => {
        const categories = filteredChartData?.categories || [];
        const series = filteredChartData?.series || [];

        return {
            series,
            options: {
                chart: {
                    type: "line",
                    height: 360,
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    background: "transparent",
                },
                theme: {
                    mode: isDark ? "dark" : "light",
                },
                stroke: {
                    curve: "smooth",
                    width: 3,
                },
                markers: {
                    size: 4,
                    strokeWidth: 0,
                    hover: {
                        sizeOffset: 3,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                colors: ["#0D7C66", "#17A2B8"],
                legend: {
                    position: "top",
                    horizontalAlign: "right",
                    labels: {
                        colors: isDark ? "#E5E7EB" : "#2C3E50",
                    },
                },
                xaxis: {
                    categories,
                    tickPlacement: "on",
                    title: {
                        text: "Year-Month",
                        style: {
                            color: isDark ? "#ADB5BD" : "#6C757D",
                            fontSize: "12px",
                            fontWeight: 600,
                        },
                    },
                    labels: {
                        rotate: -45,
                        trim: true,
                        style: {
                            colors: categories.map(() => (isDark ? "#ADB5BD" : "#6C757D")),
                            fontSize: "12px",
                            fontWeight: 500,
                        },
                    },
                    axisBorder: {
                        color: isDark ? "#4A6274" : "#E5E7EB",
                    },
                    axisTicks: {
                        color: isDark ? "#4A6274" : "#E5E7EB",
                    },
                },
                yaxis: {
                    title: {
                        text: "Sales (₹ Cr)",
                        style: {
                            color: isDark ? "#ADB5BD" : "#6C757D",
                            fontSize: "12px",
                            fontWeight: 600,
                        },
                    },
                    labels: {
                        style: {
                            colors: [isDark ? "#ADB5BD" : "#6C757D"],
                            fontSize: "12px",
                            fontWeight: 500,
                        },
                        formatter: function (val) {
                            return `₹ ${Number(val).toFixed(4)} Cr`;
                        },
                    },
                },
                tooltip: {
                    theme: isDark ? "dark" : "light",
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (val) {
                            return `₹ ${Number(val).toFixed(4)} Cr`;
                        },
                    },
                },
                grid: {
                    borderColor: isDark
                        ? "rgba(74,98,116,0.35)"
                        : "rgba(229,231,235,0.8)",
                    strokeDashArray: 4,
                },
            },
        };
    }, [filteredChartData, isDark]);

    const premiumStyles = `
    .prediction-dashboard {
      --page-bg: ${isDark ? "#1A252F" : "#F8F9FA"};
      --surface-bg: ${isDark ? "rgba(44, 62, 80, 0.94)" : "rgba(255, 255, 255, 0.96)"};
      --surface-bg-strong: ${isDark ? "#2C3E50" : "#FFFFFF"};
      --surface-bg-soft: ${isDark ? "#34495E" : "#F8F9FA"};
      --surface-bg-soft-2: ${isDark ? "#1E3A34" : "#E8F5E8"};
      --border-soft: ${isDark ? "#4A6274" : "#E5E7EB"};
      --border-strong: ${isDark ? "#5A7289" : "#D1D5DB"};
      --text-primary: ${isDark ? "#F8F9FA" : "#2C3E50"};
      --text-secondary: ${isDark ? "#E5E7EB" : "#2C3E50"};
      --text-muted: ${isDark ? "#ADB5BD" : "#6C757D"};
      --chip-bg: ${isDark ? "#34495E" : "#FFFFFF"};
      --blue-bg: ${isDark ? "rgba(13, 124, 102, 0.16)" : "rgba(13, 124, 102, 0.10)"};
      --blue-text: ${isDark ? "#17A2B8" : "#0D7C66"};
      --green-bg: ${isDark ? "rgba(23, 162, 184, 0.16)" : "rgba(23, 162, 184, 0.10)"};
      --green-text: ${isDark ? "#17A2B8" : "#17A2B8"};
      --shadow-soft: ${isDark ? "0 4px 24px rgba(0, 0, 0, 0.3)" : "0 4px 24px rgba(44, 62, 80, 0.06)"};
      --shadow-hover: ${isDark ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(44, 62, 80, 0.10)"};

      width: 100%;
      color: var(--text-primary);
      background: transparent;
    }

    .prediction-dashboard .prediction-panel {
      width: 100%;
      background: var(--surface-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
      transition: all 0.28s ease;
    }

    .prediction-dashboard .prediction-panel:hover {
      box-shadow: var(--shadow-hover);
    }

    .prediction-dashboard .prediction-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-soft);
      background: linear-gradient(
        135deg,
        var(--surface-bg-strong) 0%,
        var(--surface-bg-soft) 55%,
        var(--surface-bg-soft-2) 100%
      );
    }

    .prediction-dashboard .prediction-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .prediction-dashboard .prediction-icon {
      width: 42px;
      height: 42px;
      min-width: 42px;
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

    .prediction-dashboard .prediction-title {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text-primary);
    }

    .prediction-dashboard .prediction-subtitle {
      margin: 2px 0 0;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      color: var(--text-muted);
      font-weight: 400;
      line-height: 1.5;
    }

    .prediction-dashboard .prediction-panel-body {
      padding: 1rem 1.25rem 1.25rem;
    }

    .prediction-dashboard .prediction-table-wrap {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--border-soft);
      border-radius: 12px;
      background: var(--surface-bg-strong);
    }

    .prediction-dashboard .prediction-table {
      width: 100%;
      min-width: 860px;
      border-collapse: separate;
      border-spacing: 0;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text-primary);
      background: transparent;
    }

    .prediction-dashboard .prediction-table thead th {
      background: ${isDark ? "#34495E" : "#F0F4F8"};
      color: var(--text-secondary);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 0.95rem 1rem;
      white-space: nowrap;
      border-right: 1px solid var(--border-soft);
      border-bottom: 1px solid var(--border-soft);
    }

    .prediction-dashboard .prediction-table thead th:last-child {
      border-right: none;
    }

    .prediction-dashboard .prediction-table tbody td {
      background: var(--surface-bg-strong);
      color: var(--text-primary);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.92rem;
      padding: 1rem;
      white-space: nowrap;
      vertical-align: middle;
      border-right: 1px solid var(--border-soft);
      border-bottom: 1px solid var(--border-soft);
    }

    .prediction-dashboard .prediction-table tbody td:last-child {
      border-right: none;
    }

    .prediction-dashboard .prediction-table tbody tr:last-child td {
      border-bottom: none;
    }

    .prediction-dashboard .prediction-table tbody tr:hover td {
      background: ${isDark ? "#3D566E" : "#F8F9FA"};
    }

    .prediction-dashboard .brand-cell {
      font-weight: 700;
      color: var(--text-primary);
    }

    .prediction-dashboard .mape-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 82px;
      padding: 0.42rem 0.75rem;
      border-radius: 999px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      border: 1px solid transparent;
    }

    .prediction-dashboard .mape-chip.previous {
      background: var(--blue-bg);
      color: var(--blue-text);
      border-color: ${isDark ? "rgba(23,162,184,0.22)" : "rgba(13,124,102,0.15)"};
    }

    .prediction-dashboard .mape-chip.current {
      background: var(--green-bg);
      color: var(--green-text);
      border-color: ${isDark ? "rgba(23,162,184,0.22)" : "rgba(23,162,184,0.15)"};
    }

    .prediction-dashboard .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 40px;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      border: 1px solid transparent;
      background: linear-gradient(135deg, #0D7C66, #0A6B57);
      color: #FFFFFF;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(13, 124, 102, 0.22);
      transition: all 0.22s ease;
    }

    .prediction-dashboard .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(13, 124, 102, 0.30);
      color: #FFFFFF;
    }

    .prediction-dashboard .action-btn:active {
      transform: translateY(0) scale(0.985);
    }

    .prediction-dashboard .chart-section {
      margin-top: 1rem;
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      overflow: hidden;
      background: var(--surface-bg-strong);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
    }

    .prediction-dashboard .chart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-soft);
      background: linear-gradient(
        135deg,
        ${isDark ? "rgba(44,62,80,0.96)" : "rgba(248,249,250,0.98)"} 0%,
        ${isDark ? "rgba(52,73,94,0.98)" : "rgba(232,245,232,0.95)"} 100%
      );
      flex-wrap: wrap;
    }

    .prediction-dashboard .chart-title {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text-primary);
    }

    .prediction-dashboard .chart-subtitle {
      margin: 3px 0 0;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      color: var(--text-muted);
      font-weight: 400;
      line-height: 1.5;
    }

    .prediction-dashboard .chart-body {
      padding: 0.85rem 0.85rem 0.35rem;
    }

    .prediction-dashboard .table-label-chip {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background: var(--chip-bg);
      border: 1px solid var(--border-soft);
      color: var(--text-secondary);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .prediction-dashboard .fy-toggle-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .prediction-dashboard .fy-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 0.52rem 0.95rem;
      border-radius: 8px;
      border: 1px solid var(--border-soft);
      background: ${isDark ? "rgba(52,73,94,0.92)" : "#FFFFFF"};
      color: var(--text-secondary);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.81rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.22s ease;
    }

    .prediction-dashboard .fy-toggle-btn:hover {
      transform: translateY(-1px);
      border-color: ${isDark ? "rgba(23,162,184,0.40)" : "rgba(13,124,102,0.25)"};
    }

    .prediction-dashboard .fy-toggle-btn.active.previous {
      background: rgba(13,124,102,0.14);
      color: #0D7C66;
      border-color: rgba(13,124,102,0.26);
      box-shadow: 0 4px 12px rgba(13,124,102,0.14);
    }

    .prediction-dashboard .fy-toggle-btn.active.current {
      background: rgba(23,162,184,0.14);
      color: #17A2B8;
      border-color: rgba(23,162,184,0.26);
      box-shadow: 0 4px 12px rgba(23,162,184,0.14);
    }

    .prediction-dashboard .prediction-table-wrap::-webkit-scrollbar {
      height: 8px;
    }

    .prediction-dashboard .prediction-table-wrap::-webkit-scrollbar-track {
      background: transparent;
    }

    .prediction-dashboard .prediction-table-wrap::-webkit-scrollbar-thumb {
      background: var(--border-strong);
      border-radius: 999px;
    }

    @media (max-width: 992px) {
      .prediction-dashboard .prediction-panel-header {
        padding: 1rem 1rem;
      }

      .prediction-dashboard .prediction-panel-body {
        padding: 0.9rem;
      }

      .prediction-dashboard .chart-body {
        padding: 0.65rem 0.5rem 0.2rem;
      }
    }

    @media (max-width: 768px) {
      .prediction-dashboard .prediction-panel,
      .prediction-dashboard .chart-section {
        border-radius: 12px;
      }

      .prediction-dashboard .prediction-panel-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .prediction-dashboard .prediction-title {
        font-size: 0.98rem;
      }

      .prediction-dashboard .prediction-table {
        min-width: 760px;
      }

      .prediction-dashboard .prediction-table thead th,
      .prediction-dashboard .prediction-table tbody td {
        padding: 0.82rem 0.78rem;
        font-size: 0.82rem;
      }

      .prediction-dashboard .action-btn {
        min-height: 38px;
        padding: 0.55rem 0.85rem;
        font-size: 0.78rem;
      }

      .prediction-dashboard .fy-toggle-btn {
        font-size: 0.76rem;
        padding: 0.48rem 0.75rem;
      }
    }
  `;

    return (
        <div className="prediction-dashboard mb-3">
            <div className="prediction-panel">
                <div className="prediction-panel-header">
                    <div className="prediction-title-wrap">
                        <div>
                            <h5 className="prediction-title">MAPE Summary</h5>
                            <p className="prediction-subtitle">
                                Brand-level MAPE summary with FY-wise expandable trend view
                            </p>
                        </div>
                    </div>

                    <span className="table-label-chip">Performance Overview</span>
                </div>

                <div className="prediction-panel-body">
                    <div className="prediction-table-wrap">
                        <table className="prediction-table">
                            <thead>
                                <tr className="text-center">
                                    <th>Previous FY</th>
                                    <th>MAPE</th>
                                    <th>Current FY</th>
                                    <th>MAPE</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <td>{summaryData.previousFy}</td>
                                    <td>
                                        <span className="mape-chip previous">
                                            {summaryData.previousFyMape}
                                        </span>
                                    </td>
                                    <td>{summaryData.currentFy}</td>
                                    <td>
                                        <span className="mape-chip current">
                                            {summaryData.currentFyMape}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            type="button"
                                            className="action-btn"
                                            onClick={() => setShowChart((prev) => !prev)}
                                        >
                                            {showChart ? <FaEyeSlash /> : <FaEye />}
                                            {showChart ? "Hide Chart" : "View Chart"}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {showChart && (
                        <div className="chart-section">
                            <div className="chart-header">
                                <div>
                                    <h6 className="chart-title">
                                        Month-wise Actual vs Predicted ({filteredChartData?.fy || "-"})
                                    </h6>
                                    <p className="chart-subtitle">
                                        View one FY at a time using the filter buttons
                                    </p>
                                </div>

                                <div className="fy-toggle-group">
                                    <button
                                        type="button"
                                        className={`fy-toggle-btn ${selectedFy === "previous" ? "active previous" : ""
                                            }`}
                                        onClick={() => setSelectedFy("previous")}
                                    >
                                        {summaryData.previousFy}
                                    </button>

                                    <button
                                        type="button"
                                        className={`fy-toggle-btn ${selectedFy === "current" ? "active current" : ""
                                            }`}
                                        onClick={() => setSelectedFy("current")}
                                    >
                                        {summaryData.currentFy}
                                    </button>
                                </div>
                            </div>

                            <div className="chart-body">
                                <Chart
                                    options={chartConfig.options}
                                    series={chartConfig.series}
                                    type="line"
                                    height={360}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{premiumStyles}</style>
        </div>
    );
};

export default BrandPredictionSummary;