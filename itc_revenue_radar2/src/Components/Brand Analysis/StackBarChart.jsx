import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

function StackBarChart({
  reviews,
  plotdatamonthly,
  plotdataweekly,
  displaynames,
  theme = "light",
}) {
  const [ifweekly, setifweekly] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 50, 400));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 50, 100));
  const handleZoomReset = () => setZoomLevel(100);

  const isDark = theme === "dark";

  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  function getStartOfWeek(weekYear) {
    const [week, year] = weekYear.split("/").map(Number);

    if (isNaN(week) || isNaN(year) || week < 1 || week > 53) {
      throw new Error(
        'Invalid input: Ensure the format is "week/year" and the week is between 1 and 53.'
      );
    }

    const firstThursday = new Date(Date.UTC(2000 + year, 0, 4));

    const firstMonday = new Date(
      firstThursday.setUTCDate(
        firstThursday.getUTCDate() - ((firstThursday.getUTCDay() + 6) % 7)
      )
    );

    const startOfWeek = new Date(firstMonday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() + (week - 1) * 7 + 5);

    const day = String(startOfWeek.getUTCDate()).padStart(2, "0");
    const month = String(startOfWeek.getUTCMonth() + 1).padStart(2, "0");
    const yearString = startOfWeek.getUTCFullYear();

    return `${day}-${month}-${yearString}`;
  }

  const getUniqueSortedDatesmonthly = (values) => {
    return Array.from(new Set(values)).sort((a, b) => new Date(a) - new Date(b));
  };

  const getUniqueSortedDatesWeekly = (values) => {
    return Array.from(new Set(values)).sort((a, b) => new Date(a) - new Date(b));
  };

  const uniqueSortedXAxismonthly = useMemo(() => {
    return getUniqueSortedDatesmonthly(
      (plotdatamonthly || []).flatMap((marketwise) =>
        (marketwise?.variables || []).flatMap((item) =>
          (item?.monthly_values || []).map((it) =>
            formatDate(it.month_format?.split("-")?.reverse().join("-"))
          )
        )
      )
    );
  }, [plotdatamonthly]);

  const uniqueSortedXAxisWeekly = useMemo(() => {
    return getUniqueSortedDatesWeekly(
      (plotdataweekly || []).flatMap((marketwise) =>
        (marketwise?.variables || []).flatMap((item) =>
          (item?.weekly_values || []).map((it) => getStartOfWeek(it.week_format))
        )
      )
    );
  }, [plotdataweekly]);

  const series = useMemo(() => {
    if (ifweekly) {
      return (
        plotdataweekly?.[0]?.variables?.map((variable) => ({
          name: variable.variables,
          data: uniqueSortedXAxisWeekly.map((week) => ({
            x: week,
            y:
              variable.weekly_values.find(
                (val) => getStartOfWeek(val.week_format) === week
              )?.rounded_value || null,
          })),
        })) || []
      );
    }

    return (
      plotdatamonthly?.[0]?.variables?.map((variable) => ({
        name: variable.variables,
        data: uniqueSortedXAxismonthly.map((month) => ({
          x: month,
          y:
            variable.monthly_values.find(
              (val) =>
                formatDate(val.month_format?.split("-")?.reverse().join("-")) ===
                month
            )?.rounded_value || null,
        })),
      })) || []
    );
  }, [
    ifweekly,
    plotdataweekly,
    plotdatamonthly,
    uniqueSortedXAxisWeekly,
    uniqueSortedXAxismonthly,
  ]);

  const chartText = {
    main: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#cbd5e1" : "#475569",
    soft: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(148,163,184,0.18)" : "#e2e8f0",
    grid: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.18)",
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
  };

  const options = useMemo(
    () => ({
      chart: {
        id: "Download-Brand Analysis Chart",
        height: 450,
        type: "bar",
        stacked: true,
        toolbar: {
          show: true,
        },
        background: "transparent",
      },
      theme: {
        mode: isDark ? "dark" : "light",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          borderRadius: 6,
        },
      },
      colors: [
        "#4CAF50",
        "#FFC107",
        "#FF5722",
        "#03A9F4",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#00BCD4",
        "#009688",
        "#8BC34A",
        "#CDDC39",
        "#FF9800",
        "#FFEB3B",
        "#795548",
        "#607D8B",
        "#FFB6C1",
        "#7CFC00",
        "#ADD8E6",
      ],
      stroke: {
        width: 0,
      },
      title: {
        text: "",
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: 700,
          color: chartText.main,
        },
      },
      xaxis: {
        title: {
          text: ifweekly ? "Dates" : "Month-Year",
          style: {
            color: chartText.main,
            fontSize: "13px",
            fontWeight: 700,
          },
        },
        labels: {
          style: {
            colors: chartText.muted,
            fontSize: "12px",
            fontWeight: 500,
          },
          rotate: -45,
          formatter: function (val) {
            return val;
          },
        },
        axisBorder: {
          show: true,
          color: chartText.border,
        },
        axisTicks: {
          show: true,
          color: chartText.border,
        },
      },
      yaxis: {
        title: {
          text:
            plotdataweekly?.[0]?.variables?.[0]?.units ||
            plotdatamonthly?.[0]?.variables?.[0]?.units ||
            "Values",
          style: {
            color: chartText.main,
            fontSize: "13px",
            fontWeight: 700,
          },
        },
        labels: {
          style: {
            colors: chartText.muted,
            fontSize: "12px",
            fontWeight: 500,
          },
          formatter: function (val) {
            return val;
          },
        },
      },
      legend: {
        position: "bottom",
        fontSize: "13px",
        fontWeight: 600,
        labels: {
          colors: chartText.main,
        },
      },
      grid: {
        borderColor: chartText.grid,
        strokeDashArray: 4,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "12px",
        },
      },
    }),
    [ifweekly, isDark, plotdataweekly, plotdatamonthly]
  );

  const hasData = series?.length > 0;

  return (
    <>
      <div className={`sbc-page ${isDark ? "sbc-dark" : "sbc-light"}`}>
        <div className="sbc-card">
          <div className="sbc-toolbar">
            <div className="sbc-toolbar-left">
              <div className="sbc-chip">Stacked Contribution Analysis</div>
              <h5 className="sbc-title mb-1">
                {displaynames?.brand || displaynames?.selectedbrand || "Brand"}{" "}
                Analysis
              </h5>
              <p className="sbc-subtitle mb-0">
                Compare variable contribution across {ifweekly ? "weekly" : "monthly"}{" "}
                trends with a theme-consistent stacked view.
              </p>
            </div>

            <div className="sbc-toolbar-right">
              <div className="sbc-zoom-controls">
                <button className="sbc-zoom-btn" onClick={handleZoomOut} disabled={zoomLevel <= 100} title="Zoom Out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <span className="sbc-zoom-label">{zoomLevel}%</span>
                <button className="sbc-zoom-btn" onClick={handleZoomIn} disabled={zoomLevel >= 400} title="Zoom In">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <button className="sbc-zoom-btn" onClick={handleZoomReset} title="Reset Zoom">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                </button>
              </div>
              <button
                className="sbc-toggle-btn"
                onClick={() => setifweekly(!ifweekly)}
              >
                {!ifweekly ? "Weekly" : "Monthly"}
              </button>
            </div>
          </div>

          <div className="sbc-chart-wrap">
            {hasData ? (
              <div className="sbc-chart-card" id="chart">
                <div className="sbc-chart-scroll">
                  <div
                    className="sbc-chart-inner"
                    style={{
                      minWidth: `${Math.max(
                        800,
                        (ifweekly
                          ? uniqueSortedXAxisWeekly.length
                          : uniqueSortedXAxismonthly.length) * 22
                      ) * (zoomLevel / 100)}px`,
                    }}
                  >
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="bar"
                      height={450}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="sbc-empty-state">
                <div className="sbc-empty-icon">📊</div>
                <div className="sbc-empty-title">No data available</div>
                <div className="sbc-empty-text">
                  There are no records to display for this chart right now.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .sbc-page {
          width: 100%;
          color: var(--rr-text-main);
        }

        .sbc-light {
          --rr-bg-main: #f8fafc;
          --rr-bg-panel: rgba(255, 255, 255, 0.96);
          --rr-bg-soft: #ffffff;
          --rr-bg-soft-2: #f8fbff;
          --rr-text-main: #0f172a;
          --rr-text-muted: #475569;
          --rr-text-soft: #64748b;
          --rr-border: #e2e8f0;
          --rr-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
          --rr-topbar-grad: linear-gradient(135deg, #ffffff 0%, #f8fbff 52%, #eefbf3 100%);
          --rr-chip-bg: rgba(37, 99, 235, 0.08);
          --rr-chip-text: #1d4ed8;
        }

        .sbc-dark {
          --rr-bg-main: #0b1220;
          --rr-bg-panel: rgba(15, 23, 42, 0.94);
          --rr-bg-soft: #111827;
          --rr-bg-soft-2: #172033;
          --rr-text-main: #f8fafc;
          --rr-text-muted: #cbd5e1;
          --rr-text-soft: #94a3b8;
          --rr-border: rgba(148, 163, 184, 0.18);
          --rr-shadow: 0 14px 40px rgba(2, 6, 23, 0.45);
          --rr-topbar-grad: linear-gradient(135deg, #111827 0%, #172033 52%, #0f1f17 100%);
          --rr-chip-bg: rgba(59, 130, 246, 0.14);
          --rr-chip-text: #93c5fd;
        }

        .sbc-card {
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 22px;
          padding: 20px;
        }

        .sbc-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 20px;
          border: 1px solid var(--rr-border);
          background: var(--rr-topbar-grad);
          box-shadow: var(--rr-shadow);
          margin-bottom: 18px;
        }

        .sbc-toolbar-left {
          min-width: 0;
        }

        .sbc-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          margin-bottom: 10px;
          border-radius: 999px;
          background: var(--rr-chip-bg);
          border: 1px solid var(--rr-border);
          color: var(--rr-chip-text);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .sbc-title {
          color: var(--rr-text-main);
          font-size: 1.1rem;
          font-weight: 800;
        }

        .sbc-subtitle {
          color: var(--rr-text-soft);
          font-size: 13px;
          line-height: 1.7;
          max-width: 780px;
          font-weight: 500;
        }

        .sbc-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sbc-zoom-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--rr-bg-soft);
          border: 1px solid var(--rr-border);
          border-radius: 12px;
          padding: 4px 6px;
        }

        .sbc-zoom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--rr-text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sbc-zoom-btn:hover:not(:disabled) {
          background: var(--rr-chip-bg);
          color: var(--rr-chip-text);
        }

        .sbc-zoom-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .sbc-zoom-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--rr-text-main);
          min-width: 42px;
          text-align: center;
          user-select: none;
        }

        .sbc-toggle-btn {
          border: none;
          border-radius: 12px;
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
          transition: all 0.25s ease;
          min-width: 120px;
        }

        .sbc-toggle-btn:hover {
          transform: translateY(-1px);
        }

        .sbc-chart-wrap {
          margin-top: 6px;
        }

        .sbc-chart-card {
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft-2) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 20px;
          padding: 16px 14px 8px;
        }

        .sbc-chart-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 6px;
        }

        .sbc-chart-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .sbc-chart-scroll::-webkit-scrollbar-track {
          background: var(--rr-bg-soft);
          border-radius: 4px;
        }

        .sbc-chart-scroll::-webkit-scrollbar-thumb {
          background: var(--rr-text-soft);
          border-radius: 4px;
        }

        .sbc-chart-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--rr-text-muted);
        }

        .sbc-chart-inner {
          width: 100%;
        }

        .sbc-empty-state {
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft-2) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 20px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 20px;
        }

        .sbc-empty-icon {
          font-size: 34px;
          margin-bottom: 10px;
        }

        .sbc-empty-title {
          color: var(--rr-text-main);
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .sbc-empty-text {
          color: var(--rr-text-soft);
          font-size: 13px;
          font-weight: 500;
          max-width: 420px;
          line-height: 1.7;
        }

        @media (max-width: 992px) {
          .sbc-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .sbc-toolbar-right {
            width: 100%;
          }

          .sbc-toggle-btn {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .sbc-card,
          .sbc-toolbar,
          .sbc-chart-card,
          .sbc-empty-state {
            border-radius: 18px;
          }

          .sbc-card {
            padding: 16px;
          }

          .sbc-toolbar {
            padding: 16px;
          }

          .sbc-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default StackBarChart;