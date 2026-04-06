import React, { useState } from 'react'
import Plot from "react-plotly.js";
import { useOutletContext } from "react-router-dom";

function LineChartMarketAnalysis({ plotdatamonthly, plotdataweekly, displaynames }) {

  const { theme } = useOutletContext();
  const [plotdata1, setplotdata1] = useState({});
  const [ifweekly, setifweekly] = useState(false)

  function getStartOfWeek(weekYear) {
    const [week, year] = weekYear.split('/').map(Number);

    // Validate input
    if (isNaN(week) || isNaN(year) || week < 1 || week > 53) {
      throw new Error('Invalid input: Ensure the format is "week/year" and the week is between 1 and 53.');
    }

    // January 4th is guaranteed to be in the first ISO week of the year
    const firstThursday = new Date(Date.UTC(2000 + year, 0, 4));

    // Find the first day of the first ISO week (Monday)
    const firstMonday = new Date(
      firstThursday.setUTCDate(firstThursday.getUTCDate() - ((firstThursday.getUTCDay() + 6) % 7))
    );

    // Calculate the start of the target week (Saturday instead of Monday)
    const startOfWeek = new Date(firstMonday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() + (week - 1) * 7 + 5); // +5 days to get Saturday

    // Format as dd-mm-yyyy
    const day = String(startOfWeek.getUTCDate()).padStart(2, '0');
    const month = String(startOfWeek.getUTCMonth() + 1).padStart(2, '0');
    const yearString = startOfWeek.getUTCFullYear();

    return `${day}-${month}-${yearString}`;
  }

  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // Short form of month
  };
  const processplotdata = (plotresponse) => {


    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let plot_data1 = [];
    let plot_data2 = []
    const colors = [
      'green',
      "red",
      "blue",
      "purple",
      "cyan",
      "magenta",
      "yellow",
      "lime",
      "pink",
      "teal",
      "indigo",
      "brown",
      "grey",
      "violet",
      "olive",
      "navy",
      "maroon",
      "gold",

      "darkred",
      "darkblue",
      "darkorange",
      "darkcyan",
      "darkmagenta",
      "darkyellow",
      "darklime",
      "darkpink",
      "darkteal",
      "darkviolet",
    ];
    if (ifweekly) {
      plotresponse?.map((it, index) => {
        it?.variables.map((item) => {
          const isHighValueSeries = item?.weekly_values?.some((item) => item.rounded_value > 10000000); // Threshold for high values
          plot_data1.push(
            {
              x: item?.weekly_values?.map((it) => getStartOfWeek(it?.week_format)),
              y: item?.weekly_values?.map((it) => it?.rounded_value),
              name: `${it.market}`,
              showlegend: true,
              type: "scatter",
              mode: "lines",
              marker: { color: colors[index] },

              // yaxis: isHighValueSeries ? "y2" : "y", // Assign to the appropriate axis
            },
            {
              x: item?.weekly_values?.map((it) => getStartOfWeek(it.week_format)),
              y: linear(item?.weekly_values?.map((it) => it.week_format), item?.weekly_values?.map((it) => it.rounded_value)),
              name: `${it.market}-Linear Trendline`,
              showlegend: true,
              type: "scatter",
              mode: "lines",
              visible: "legendonly",
              marker: { color: colors[index] },

              line: {
                dash: "dot",
                width: 1,
              },

              // yaxis: isHighValueSeries ? "y2" : "y", // Match the corresponding Y-axis
            }
          );
        })

      });
      return plot_data1
    }
    else {
      plotresponse?.map((it, index) => {
        it?.variables.map((item) => {
          const isHighValueSeries = item?.monthly_values?.some((it) => it.rounded_value > 10000000); // Threshold for high values
          plot_data2.push(
            {
              x: item?.monthly_values?.map((it) => formatDate(it.month_format?.split("-")?.reverse().join("-"))),
              y: item?.monthly_values?.map((it) => it.rounded_value),
              name: `${it.market}`,
              showlegend: true,
              type: "scatter",
              mode: "lines",
              marker: { color: colors[index] },
              hovertemplate: `<b>${item.variables}</b><br>Month-Year: %{x}<br>Value: %{y}(${item?.units})`,
              // yaxis: isHighValueSeries ? "y" : "y", // Assign to the appropriate axis
            },
            {
              x: item?.monthly_values?.map((it) => formatDate(it.month_format?.split("-")?.reverse().join("-"))),
              y: linear(item?.monthly_values?.map((it) => it.month_format?.split("-")?.reverse().join("-")), item?.monthly_values?.map((it) => it.rounded_value)),
              name: `${it.market}-Linear Trendline`,
              showlegend: true,
              type: "scatter",
              mode: "lines",
              visible: "legendonly",
              marker: { color: colors[index] },

              line: {
                dash: "dot",
                width: 1,
              },
              hovertemplate: `<b>${item.variables}</b><br>Month-Year: %{x}<br>Value: %{y}(${item?.units})`,
              // yaxis: isHighValueSeries ? "y" : "y", // Match the corresponding Y-axis
            }
          );
        })

      });

      return plot_data2
    }


  };
  const linear = (xAxis, data) => {
    const xaxisvalue = xAxis.length;
    const xaxis = Array.from({ length: xaxisvalue }, (_, i) => i);
    const yaxis = [];
    data.forEach((it) => yaxis.push(it));

    const n = xaxis.length;
    //console.log(xaxis,yaxis)
    // Calculate mean of X and Y
    const meanX = xaxis.reduce((sum, point) => sum + point, 0) / n;
    const meanY = yaxis.reduce((sum, point) => sum + point, 0) / n;
    //console.log(meanX,meanY)
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const diffX = xaxis[i] - meanX;
      const diffY = yaxis[i] - meanY;
      numerator += diffX * diffY;
      denominator += diffX * diffX;
    }

    const m = numerator / denominator;
    const b = meanY - m * meanX;

    let lineararr = [];

    xaxis.forEach((it) => {
      lineararr.push(m * it + b);
    });

    return lineararr;
  };
  const isDark = theme !== "light";
  const textColor = isDark ? "#e9e9e9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.25)";
  const lineColor = isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(15, 23, 42, 0.25)";
  const paperBg = "transparent";
  const plotBg = "transparent";

  return (
    <>
      <div className="lba-page">
        <div className="lba-toolbar mb-4">
            <div className="lba-toolbar-left">
              <div className="lba-breadcrumb-chip">Trend Comparison View</div>
              <h5 className="lba-title mb-1">
                {displaynames?.selectedbrand}{" "}
                {displaynames?.variable ? `- ${displaynames.variable}` : ""}
              </h5>
              <p className="lba-subtitle mb-0">
                Compare monthly and weekly patterns in a clean, theme-consistent
                chart experience.
              </p>
            </div>

            <div className="lba-toolbar-right">
              <div className="lba-toggle-group" role="group">
                <button
                  className={`lba-toggle-btn ${!ifweekly ? "active" : ""}`}
                  onClick={() => setifweekly(false)}
                >
                  Monthly
                </button>
                <button
                  className={`lba-toggle-btn ${ifweekly ? "active" : ""}`}
                  onClick={() => setifweekly(true)}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>

          <div className="lba-chart-shell">
            <div className="lba-chart-card">
              <div className="d-flex justify-content-center">
                {plotdataweekly.length > 0 && plotdatamonthly.length > 0 ? (
                  <div className="lba-plot-wrap w-100">
                    <Plot
                      className="w-100 plotbrandanalysis"
                      style={{ maxWidth: "100%", height: "100%" }}
                      data={[
                        ...(ifweekly
                          ? processplotdata(plotdataweekly).map((trace) => ({
                            ...trace,
                            customdata: trace.x.map((weekYear) => ({
                              weekYear,
                              startDate: weekYear,
                            })),
                          }))
                          : processplotdata(plotdatamonthly).map((trace) => ({
                            ...trace,
                            customdata: trace.x.map((month_year) => ({
                              month_year,
                            })),
                          }))),
                      ]}
                      layout={{
                        title: {
                          text: `<b>${displaynames?.selectedbrand} - ${displaynames?.variable}</b>`,
                          x: 0.5,
                          xanchor: "center",
                          font: {
                            size: 18,
                            color: "var(--rr-text-main)",
                          },
                        },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        margin: { l: 60, r: 30, t: 70, b: 90 },
                        autosize: true,
                        xaxis: {
                          title: {
                            text: ifweekly ? "Week / Year" : "Month - Year",
                            font: {
                              color: "var(--rr-text-main)",
                              size: 13,
                            },
                          },
                          showgrid: false,
                          tickangle: -45,
                          tickfont: {
                            color: "var(--rr-text-muted)",
                            size: 12,
                          },
                          tickvals:
                            ifweekly &&
                              processplotdata(plotdataweekly)[0]?.x?.length > 18
                              ? processplotdata(plotdataweekly)[0]?.x?.filter(
                                (_, index) => index % 6 === 0
                              )
                              : undefined,
                          showline: true,
                          zeroline: false,
                          linecolor: "var(--rr-border)",
                          linewidth: 1,
                          automargin: true,
                        },
                        yaxis: {
                          title: {
                            text: displaynames?.type ? displaynames?.type : "",
                            font: {
                              color: "var(--rr-text-main)",
                              size: 13,
                            },
                          },
                          tickfont: {
                            color: "var(--rr-text-muted)",
                            size: 12,
                          },
                          automargin: true,
                          showline: true,
                          zeroline: true,
                          zerolinewidth: 1,
                          gridcolor: "rgba(148, 163, 184, 0.14)",
                          zerolinecolor: "rgba(148, 163, 184, 0.2)",
                          linecolor: "var(--rr-border)",
                          linewidth: 1,
                        },
                        legend: {
                          orientation: "h",
                          x: 0.5,
                          y: -0.28,
                          xanchor: "center",
                          font: {
                            size: 12,
                            color: "var(--rr-text-main)",
                          },
                        },
                        font: {
                          color: "var(--rr-text-main)",
                        },
                        hoverlabel: {
                          bgcolor: "var(--rr-bg-soft)",
                          bordercolor: "var(--rr-border)",
                          font: {
                            color: "var(--rr-text-main)",
                          },
                        },
                      }}
                      config={{ responsive: true }}
                      useResizeHandler={true}
                    />
                  </div>
                ) : (
                  <div className="lba-empty-state w-100">
                    <div className="lba-empty-icon">📊</div>
                    <div className="lba-empty-title">No data available</div>
                    <div className="lba-empty-text">
                      There are no records to display for this chart right now.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>

      <style>{`
      .lba-page {
        color: var(--rr-text-main);
      }

      .lba-section-card,
      .lba-chart-card,
      .lba-empty-state {
        border: 1px solid var(--rr-border);
        background: linear-gradient(
          180deg,
          var(--rr-bg-panel) 0%,
          var(--rr-bg-soft) 100%
        );
        box-shadow: var(--rr-shadow);
        border-radius: 22px;
      }

      .lba-section-card {
        padding: 20px;
      }

      .lba-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding: 18px 20px;
        border-radius: 20px;
        border: 1px solid var(--rr-border);
        background: var(
          --rr-topbar-grad,
          linear-gradient(135deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%)
        );
        box-shadow: var(--rr-shadow);
      }

      .lba-toolbar-left {
        min-width: 0;
      }

      .lba-toolbar-right {
        display: flex;
        align-items: center;
      }

      .lba-breadcrumb-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        margin-bottom: 10px;
        border-radius: 999px;
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        color: var(--rr-text-muted);
        font-size: 12px;
        font-weight: 700;
      }

      .lba-title {
        color: var(--rr-text-main);
        font-size: 1.12rem;
        font-weight: 800;
      }

      .lba-subtitle {
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.7;
        max-width: 760px;
        font-weight: 500;
      }

      .lba-toggle-group {
        display: inline-flex;
        align-items: center;
        padding: 4px;
        border-radius: 14px;
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
        gap: 4px;
      }

      .lba-toggle-btn {
        border: none;
        border-radius: 10px;
        padding: 10px 18px;
        font-size: 13px;
        font-weight: 700;
        background: transparent;
        color: var(--rr-text-muted);
        transition: all 0.25s ease;
        min-width: 110px;
      }

      .lba-toggle-btn.active {
        color: #ffffff;
        background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
      }

      .lba-toggle-btn:not(.active):hover {
        background: rgba(148, 163, 184, 0.12);
        color: var(--rr-text-main);
      }

      .lba-chart-shell {
        margin-top: 18px;
      }

      .lba-chart-card {
        padding: 16px;
        overflow: hidden;
      }

      .lba-plot-wrap {
        width: 100%;
        min-height: 520px;
      }

      .plotbrandanalysis {
        width: 100% !important;
      }

      .lba-empty-state {
        min-height: 320px;
        padding: 36px 24px;
        text-align: center;
        color: var(--rr-text-muted);
        font-weight: 700;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .lba-empty-icon {
        font-size: 34px;
        margin-bottom: 10px;
      }

      .lba-empty-title {
        color: var(--rr-text-main);
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 6px;
      }

      .lba-empty-text {
        color: var(--rr-text-muted);
        font-size: 13px;
        font-weight: 500;
        max-width: 420px;
        line-height: 1.7;
      }

      @media (max-width: 992px) {
        .lba-toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .lba-toolbar-right {
          width: 100%;
        }

        .lba-toggle-group {
          width: 100%;
          justify-content: stretch;
        }

        .lba-toggle-btn {
          flex: 1;
          min-width: unset;
        }
      }

      @media (max-width: 768px) {
        .lba-section-card,
        .lba-chart-card,
        .lba-empty-state,
        .lba-toolbar {
          border-radius: 18px;
        }

        .lba-section-card {
          padding: 16px;
        }

        .lba-toolbar {
          padding: 16px;
        }

        .lba-title {
          font-size: 1rem;
        }

        .lba-plot-wrap {
          min-height: 460px;
        }
      }
    `}</style>
    </>
  );
}

export default LineChartMarketAnalysis