import React, { useState } from 'react'
import Plot from "react-plotly.js";
import maskedBrandOption from '../JSON Files/MaskedBrandOption.json'

function LineBarChartBrandAnalysis({ plotdatamonthly, plotdataweekly, displaynames }) {
  const [ifbar, setifbar] = useState([])
  const [selectedIndexifbar, setselectedIndexifbar] = useState(0)
  const [plotdata1, setplotdata1] = useState({});
  const [ifweekly, setifweekly] = useState(false)
  const uniqueunits = Array.from(new Set(plotdataweekly[0]?.variables?.map((variable) => variable.units)))

  const yaxisObjectsArray = uniqueunits?.map((unit, index) => ({
    [`yaxis${index + 1 === 1 ? "" : index + 1}`]: index + 1 === 1 ?
      {
        title: { text: unit },
        automargin: true,
        showgrid: false,
        showline: true,
        zeroline: true,
        zerolinewidth: 1,
        linecolor: 'black',
        linewidth: 1,
      } : {

        title: { text: unit },
        anchor: 'free',
        overlaying: "y",
        position: 1 - (0.05 * index),
        side: "right",
        showgrid: false,
        automargin: true,
        showline: true,
        zeroline: true,
        zerolinewidth: 1,
        linecolor: 'black',
        linewidth: 1,
      },
  }));

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
    const colors = [
      "#0D7C66", "#DC3545", "#17A2B8", "#2C3E50", "#FF8C00", "#198754", "#FFC107", "#6C757D", "#0B6B57", "#34495E",
      "#ADB5BD", "#E5E7EB", "#0A6B57", "#138496", "#E67E00", "#157347", "#B02A37", "#495057", "#F8F9FA",
      "#E8F5E8", "#FFF4E6", "#E6F7FF", "#343A40", "#868E96", "#DEE2E6", "#ADB5BD", "#CED4DA", "#6C757D",
    ];

    let plot_data = [];

    const unitToYAxis = uniqueunits.reduce((acc, unit, index) => {
      //acc is a dictionary blank {}  
      acc[unit] = `y${index + 1 === 1 ? "" : index + 1}`;
      return acc;
    }, {});

    const getUniqueSortedDates = (values, dateExtractor) => {
      return Array.from(
        new Set(values.flatMap((it) => dateExtractor(it)))
      ).sort((a, b) => new Date(a) - new Date(b));
    };

    const alignDataWithXAxis = (xAxis, data, dateExtractor, valueExtractor) => {
      const dateToValueMap = data.reduce((acc, it) => {
        const date = dateExtractor(it);
        acc[date] = valueExtractor(it);
        return acc;
      }, {});
      return xAxis.map((date) => dateToValueMap[date] || null);
    };

    const uniqueSortedXAxis = ifweekly
      ? getUniqueSortedDates(
        plotresponse.flatMap((marketwise) =>
          marketwise?.variables.flatMap((item) =>
            item?.weekly_values.map((it) => getStartOfWeek(it.week_format))
          )
        ),
        (date) => date
      )
      : getUniqueSortedDates(
        plotresponse.flatMap((marketwise) =>
          marketwise?.variables.flatMap((item) =>
            item?.monthly_values.map((it) =>
              formatDate(it.month_format?.split("-")?.reverse().join("-"))
            )
          )
        ),
        (date) => date
      );

    plotresponse.forEach((marketwise) => {
      marketwise?.variables.forEach((item, index) => {
        const yValues = alignDataWithXAxis(
          uniqueSortedXAxis,
          ifweekly ? item?.weekly_values : item?.monthly_values,
          ifweekly
            ? (it) => getStartOfWeek(it?.week_format)
            : (it) =>
              formatDate(it.month_format?.split("-")?.reverse().join("-")),
          (it) => it?.rounded_value
        );

        plot_data.push({
          x: uniqueSortedXAxis,
          y: yValues,
          name: `${item.variables}`,
          showlegend: true,
          type: ifbar[index] ? "bar" : "scatter",
          marker: { color: colors[index] },
          yaxis: unitToYAxis[item.units], // Dynamically assign yaxis based on unit
          hovertemplate: `<b>${item.variables}</b><br>Date: %{x}<br>Value: %{y} (${item?.units})`,
        });
      });
    });

    return plot_data;
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

  return (
    <>
      <div className="">
        <div className="">
          {!displaynames?.variable?.some((obj) => obj.includes("Aggregated")) && (
            <div className="lba-inner-card mb-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-lg-7">
                  <label className="lba-label">
                    Change plot type for Variables
                  </label>
                  <select
                    className="form-select lba-input"
                    value={selectedIndexifbar}
                    onChange={(e) => setselectedIndexifbar(Number(e.target.value))}
                  >
                    {plotdatamonthly[0]?.variables?.map((it, index) => (
                      <option key={index} value={index}>
                        {it.variables}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedIndexifbar !== null && (
                  <div className="col-12 col-lg-5">
                    <button
                      className="lba-outline-btn w-100"
                      onClick={() => {
                        const updatedifbar = [...ifbar];
                        updatedifbar[selectedIndexifbar] = !updatedifbar[selectedIndexifbar];
                        setifbar(updatedifbar);
                      }}
                    >
                      {!ifbar[selectedIndexifbar]
                        ? "Change to Bar Chart"
                        : "Change to Line Chart"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="lba-toolbar mb-4">
            <div className="lba-toolbar-left">
              <div className="lba-breadcrumb-chip">Brand Analysis View</div>
              <h5 className="lba-title mb-1">
                {maskedBrandOption.maskedBrandOption[displaynames?.selectedbrand]}{" "}
                {displaynames?.market ? `- ${displaynames.market}` : ""}
              </h5>
              <p className="lba-subtitle mb-0">
                Toggle between weekly and monthly trends, and switch variables
                between line and bar view from a single analysis workspace.
              </p>
            </div>

            <div className="lba-toolbar-right">
              <button
                className="lba-primary-btn"
                onClick={() => setifweekly(!ifweekly)}
              >
                {!ifweekly ? "Weekly" : "Monthly"}
              </button>
            </div>
          </div>

          <div className="lba-chart-shell">
            <div className="lba-chart-card">
              {plotdataweekly.length > 0 && plotdatamonthly.length > 0 ? (
                <div className="lba-plot-wrap">
                  <Plot
                    className="plotbrandanalysis"
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
                          customdata: trace.x.map((month_year) => ({ month_year })),
                        }))),
                    ]}
                    layout={{
                      title: {
                        text: `${maskedBrandOption.maskedBrandOption[
                          displaynames?.selectedbrand
                          ]
                          } - ${displaynames?.market}`,
                        font: {
                          size: 20,
                          color: "var(--rr-text-main)",
                        },
                      },
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      barmode: "group",
                      xaxis: {
                        domain: [0, 1 - (uniqueunits?.length - 1) * 0.05],
                        title: {
                          text: ifweekly ? "Week / Year" : "Month - Year",
                          font: { color: "var(--rr-text-main)" },
                        },
                        showgrid: false,
                        tickangle: -90,
                        tickfont: { color: "var(--rr-text-muted)" },
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
                      },
                      ...(yaxisObjectsArray
                        ? Object.fromEntries(
                          Object.entries(
                            Object.assign({}, ...yaxisObjectsArray)
                          ).map(([key, value]) => [
                            key,
                            {
                              ...value,
                              title: {
                                text: value?.title?.text,
                                font: { color: "var(--rr-text-main)" },
                              },
                              tickfont: { color: "var(--rr-text-muted)" },
                              linecolor: "var(--rr-border)",
                              gridcolor: "rgba(148, 163, 184, 0.14)",
                              zerolinecolor: "rgba(148, 163, 184, 0.2)",
                            },
                          ])
                        )
                        : {}),
                      showlegend: true,
                      font: {
                        size: 13,
                        color: "var(--rr-text-main)",
                      },
                      legend: {
                        xanchor: "center",
                        x: 0.5,
                        orientation: "h",
                        y: -0.25,
                        font: { color: "var(--rr-text-main)" },
                      },
                      margin: {
                        t: 70,
                        r: 80,
                        b: 100,
                        l: 70,
                      },
                      hoverlabel: {
                        bgcolor: "var(--rr-bg-soft)",
                        bordercolor: "var(--rr-border)",
                        font: { color: "var(--rr-text-main)" },
                      },
                    }}
                    config={{
                      responsive: true,
                      displayModeBar: true,
                    }}
                    style={{ width: "100%", minHeight: "520px" }}
                  />
                </div>
              ) : (
                <div className="lba-empty-state">
                  <div className="dot-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div className="mt-3 fw-semibold lba-muted-text">
                    There are no records to display.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
      .lba-page {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--rr-text-main);
      }

      .lba-section-card,
      .lba-inner-card,
      .lba-chart-card,
      .lba-empty-state {
        border: 1px solid var(--rr-border);
        background: linear-gradient(
          180deg,
          var(--rr-bg-panel) 0%,
          var(--rr-bg-soft) 100%
        );
        box-shadow: var(--rr-shadow);
        border-radius: 16px;
      }

      .lba-section-card {
        padding: 20px;
      }

      .lba-inner-card {
        padding: 16px;
      }

      .lba-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 12px;
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
        padding: 4px 12px;
        margin-bottom: 8px;
        border-radius: 9999px;
        background: rgba(13, 124, 102, 0.08);
        border: 1px solid var(--rr-border);
        color: #0D7C66;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }

      .lba-title {
        color: var(--rr-text-main);
        font-size: 17px;
        font-weight: 700;
      }

      .lba-subtitle {
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.65;
        max-width: 820px;
        font-weight: 400;
      }

      .lba-label {
        display: inline-block;
        margin-bottom: 8px;
        color: var(--rr-text-main);
        font-size: 13px;
        font-weight: 600;
      }

      .lba-input {
        min-height: 44px;
        border-radius: 8px;
        border: 1px solid var(--rr-border);
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
        box-shadow: none !important;
        font-size: 13px;
      }

      .lba-input:focus {
        border-color: #93c5fd;
        box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.12) !important;
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
      }

      .lba-input option {
        background: var(--rr-bg-soft);
        color: var(--rr-text-main);
      }

      .lba-primary-btn,
      .lba-outline-btn {
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.25s ease;
      }

      .lba-primary-btn {
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        box-shadow: 0 4px 12px rgba(13, 124, 102, 0.20);
      }

      .lba-outline-btn {
        color: #0D7C66;
        background: transparent;
        border: 1px solid rgba(13, 124, 102, 0.28);
      }

      .lba-primary-btn:hover,
      .lba-outline-btn:hover {
        transform: translateY(-1px);
      }

      .lba-chart-shell {
        margin-top: 18px;
      }

      .lba-chart-card {
        padding: 16px;
        overflow: hidden;
        border-radius: 12px;
      }

      .lba-plot-wrap {
        width: 100%;
        min-height: 520px;
      }

      .plotbrandanalysis {
        width: 100% !important;
      }

      .lba-empty-state {
        padding: 36px 24px;
        text-align: center;
        color: var(--rr-text-muted);
        font-weight: 700;
      }

      .lba-muted-text {
        color: var(--rr-text-muted);
      }

      .dot-loader {
        display: flex;
        gap: 8px;
        justify-content: center;
      }

      .dot-loader div {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #0D7C66;
        animation: lbaBounce 1.2s infinite ease-in-out;
      }

      .dot-loader div:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot-loader div:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes lbaBounce {
        0%, 80%, 100% {
          transform: scale(0.7);
          opacity: 0.6;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @media (max-width: 992px) {
        .lba-toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .lba-toolbar-right {
          width: 100%;
        }

        .lba-primary-btn {
          width: 100%;
        }
      }

      @media (max-width: 768px) {
        .lba-section-card,
        .lba-inner-card,
        .lba-chart-card,
        .lba-empty-state,
        .lba-toolbar {
          border-radius: 12px;
        }

        .lba-section-card {
          padding: 16px;
        }

        .lba-toolbar {
          padding: 16px;
        }

        .lba-title {
          font-size: 15px;
        }

        .lba-outline-btn {
          width: 100%;
        }

        .lba-plot-wrap {
          min-height: 460px;
        }
      }
    `}</style>
    </>
  );
}

export default LineBarChartBrandAnalysis