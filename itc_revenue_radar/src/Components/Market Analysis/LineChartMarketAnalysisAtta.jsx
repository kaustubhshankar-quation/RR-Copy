import React, { useState } from 'react'
import Plot from "react-plotly.js";

function LineChartMarketAnalysisAtta({ plotdatamonthly, plotdataweekly, displaynames }) {
  console.log(plotdatamonthly)
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
              type: "scatter",
              mode: "lines",
              marker: { color: colors[index] },

              // yaxis: isHighValueSeries ? "y2" : "y", // Assign to the appropriate axis
            },
            {
              x: item?.weekly_values?.map((it) => getStartOfWeek(it.week_format)),
              y: linear(item?.weekly_values?.map((it) => it.week_format), item?.weekly_values?.map((it) => it.value)),
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
      plotresponse?.map((item, index) => {

        const isHighValueSeries = item?.monthly_value?.some((it) => it.value > 10000000); // Threshold for high values
        plot_data2.push(
          {
            x: item?.monthly_value?.map((it) => formatDate(it.month_year?.split("-")?.reverse().join("-"))),
            y: item?.monthly_value?.map((it) => it.value),
            name: `${item.market}-${item.key}`,
            showlegend: true,
            type: "scatter",
            mode: "lines",
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
    <>
      <div className="chart-wrapper my-3">
        {plotdatamonthly.length > 0 ? (
          <Plot
            className="plotbrandanalysis w-100 h-100"
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
                font: { size: 16, family: "Arial, sans-serif", color: "#333" },
                x: 0.5,
                xanchor: "center",
              },
              autosize: true,
              margin: { l: 60, r: 30, t: 50, b: 80 },
              xaxis: {
                title: ifweekly ? "Week / Year" : "Month - Year",
                showgrid: false,
                tickangle: -45,
                tickvals:
                  ifweekly && processplotdata(plotdataweekly)[0]?.x?.length > 18
                    ? processplotdata(plotdataweekly)[0]?.x?.filter(
                      (_, index) => index % 6 === 0
                    )
                    : undefined, // show every 6th point if too many
                showline: true,
                zeroline: true,
                linecolor: "#444",
                linewidth: 1,
              },
              yaxis: {
                title: {
                  text: `${displaynames?.type ? displaynames?.type : ""}`,
                  font: { size: 14, family: "Arial, sans-serif", color: "#444" },
                },
                automargin: true,
                showline: true,
                zeroline: true,
                zerolinewidth: 1,
                linecolor: "#444",
                linewidth: 1,
              },
              showlegend: true,
              legend: {
                x: 0.5,
                y: -0.3,
                xanchor: "center",
                orientation: "h",
                font: { size: 12 },
              },
              font: { size: 12 },
            }}
            config={{
              responsive: true,
              displayModeBar: false, // hides extra toolbar for clean UI
            }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="text-center text-muted my-3">
            <strong>There are no records to display!!</strong>
          </div>
        )}
      </div>

      <style jsx>{`
    .chart-wrapper {
      width: 100%;
      min-height: 400px;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 768px) {
      .plotbrandanalysis {
        font-size: 10px;
      }
    }
  `}</style>
    </>

  )
}

export default LineChartMarketAnalysisAtta