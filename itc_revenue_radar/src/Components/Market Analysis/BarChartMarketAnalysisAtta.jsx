import React, { useState } from 'react'
import Plot from "react-plotly.js";

function BarChartMarketAnalysisAtta({ plotdatamonthly, plotdataweekly, displaynames }) {

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
          const isHighValueSeries = item?.weekly_values?.some((item) => item.value > 10000000); // Threshold for high values
          plot_data1.push(
            {
              x: item?.weekly_values?.map((it) => getStartOfWeek(it?.week_format)),
              y: item?.weekly_values?.map((it) => it?.value),
              name: `${it.market}`,
              showlegend: true,
              type: "bar",
              mode: "bar",
              marker: { color: colors[index] },
              hovertemplate:
                `${item.variables}<br>Date: %{x}<br>Value: %{y} (${item?.units})`,
              // yaxis: isHighValueSeries ? "y2" : "y", // Assign to the appropriate axis
            },
            {
              x: item?.weekly_values?.map((it) => getStartOfWeek(it.week_format)),
              y: linear(item?.weekly_values?.map((it) => getStartOfWeek(it.week_format)), item?.weekly_values?.map((it) => it.value)),
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
              hovertemplate:
                `${item.variables}<br>Date: %{x}<br>Value: %{y} (${item?.units})`,
              // yaxis: isHighValueSeries ? "y2" : "y", // Match the corresponding Y-axis
            }
          );
        })

      });
      return plot_data1
    }
    else {
      plotresponse?.map((item, index) => {

        const isHighValueSeries = item?.monthly_value?.some((it) => it.value > 10000000); // Threshold for high values
        plot_data2.push(
          {
            x: item?.monthly_value?.map((it) => formatDate(it.month_year?.split("-")?.reverse().join("-"))),
            y: item?.monthly_value?.map((it) => it.value),
            name: `${item.market}-${item.key}`,
            showlegend: true,
            type: "bar",
            mode: "bar",
            marker: { color: colors[index] },
            hovertemplate: `<b>${item.variables}</b><br>Month-Year: %{x}<br>Value: %{y}(${item?.units})`,
            // yaxis: isHighValueSeries ? "y" : "y", // Assign to the appropriate axis
          },
          {
            x: item?.monthly_value?.map((it) => formatDate(it.month_year?.split("-")?.reverse().join("-"))),
            y: linear(item?.monthly_value?.map((it) => it.month_year?.split("-")?.reverse().join("-")), item?.monthly_value?.map((it) => it.value)),
            name: `${item.market}-${item.key}-Linear Trendline`,
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
  return (
    <div className='card p-3'>
      <div className="card shadow-sm border-0 rounded-3 my-3">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            {plotdatamonthly.length > 0 ? (
              <div className="w-100" style={{ maxWidth: "100%", overflowX: "auto" }}>
                <Plot
                  className="plotbrandanalysis"
                  data={[
                    ...(ifweekly
                      ? processplotdata(plotdataweekly).map(trace => ({
                        ...trace,
                        customdata: trace.x.map(weekYear => ({
                          weekYear,
                          startDate: weekYear,
                        })),
                      }))
                      : processplotdata(plotdatamonthly).map(trace => ({
                        ...trace,
                        customdata: trace.x.map(month_year => ({ month_year })),
                      }))),
                  ]}
                  layout={{
                    title: {
                      text: `<b>${displaynames?.selectedbrand} - ${displaynames?.variable}</b>`,
                      font: { size: 16, family: "Arial, sans-serif" },
                      x: 0.5,
                      xanchor: "center",
                    },
                    margin: { l: 50, r: 30, t: 60, b: 80 },
                    autosize: true,
                    xaxis: {
                      title: ifweekly ? "Week/Year" : "Month-Year",
                      showgrid: false,
                      tickangle: -90,
                      tickvals:
                        ifweekly &&
                          processplotdata(plotdataweekly)[0]?.x?.length > 18
                          ? processplotdata(plotdataweekly)[0]?.x?.filter(
                            (_, index) => index % 6 === 0
                          )
                          : undefined,
                      showline: true,
                      zeroline: true,
                      linecolor: "black",
                      linewidth: 1,
                    },
                    yaxis: {
                      title: {
                        text: `${displaynames?.type ? displaynames?.type : ""}`,
                      },
                      automargin: true,
                      showline: true,
                      zeroline: true,
                      zerolinewidth: 1,
                      linecolor: "black",
                      linewidth: 1,
                    },
                    showlegend: true,
                    font: { size: 13 },
                    legend: {
                      xanchor: "center",
                      orientation: "h",
                      y: -0.3,
                      x: 0.5,
                    },
                  }}
                  config={{ responsive: true }}
                  style={{ width: "100%", height: "100%" }}
                  useResizeHandler={true}
                />
              </div>
            ) : (
              <div className="text-center text-danger py-4">
                <i className="bi bi-info-circle me-2"></i>
                There are no records to display!!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}

export default BarChartMarketAnalysisAtta