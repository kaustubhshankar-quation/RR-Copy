import React, { useState } from 'react'
import Plot from "react-plotly.js";


function LineBarChartBrandAnalysisAtta({ plotdatamonthly, plotdataweekly, displaynames }) {
  console.log(plotdatamonthly)
  const [ifbar, setifbar] = useState([])
  const [selectedIndexifbar, setselectedIndexifbar] = useState(0)
  const [plotdata1, setplotdata1] = useState({});
  const [ifweekly, setifweekly] = useState(false)
  const uniqueunits = Array.from(new Set(plotdatamonthly?.map((variable) => variable.units)))

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
    console.log(dateString)
    const [month, year] = dateString.split("-");

    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // Short form of month
  };
  const processplotdata = (plotresponse) => {
    const colors = [
      "green", "red", "blue", "purple", "cyan", "magenta", "yellow", "lime", "pink", "teal",
      "indigo", "brown", "grey", "violet", "olive", "navy", "maroon", "gold", "darkred",
      "darkblue", "darkorange", "darkcyan", "darkmagenta", "darkyellow", "darklime", "darkpink",
      "darkteal", "darkviolet",
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

    const uniqueSortedXAxis = getUniqueSortedDates(
      plotresponse.flatMap(item =>

        item?.monthly_value.map((it) =>
          formatDate(it.month_year?.split("-")?.reverse().join("-"))

        )
      ),
      (date) => date
    );

    plotresponse.forEach((item, index, marketwise) => {

      const yValues = alignDataWithXAxis(
        uniqueSortedXAxis,
        ifweekly ? item?.weekly_values : item?.monthly_value,
        ifweekly
          ? (it) => getStartOfWeek(it?.week_format)
          : (it) =>
            formatDate(it.month_year?.split("-")?.reverse().join("-")),
        (it) => it?.value
      );

      plot_data.push({
        x: uniqueSortedXAxis,
        y: yValues,
        name: `${item.attribute_name}`,
        showlegend: true,
        type: ifbar[index] ? "bar" : "scatter",
        marker: { color: colors[index] },
        yaxis: unitToYAxis[item.units], // Dynamically assign yaxis based on unit
        hovertemplate: `<b>${item.attribute_name}</b><br>Date: %{x}<br>Value: %{y} (${item?.units})`,
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
    <div className='card px-3 py-3 mt-4'>
      {!displaynames?.variable?.some(obj => obj.includes("Aggregated")) && (
        <div className="row mt-3 mb-2 g-3">
          {/* Left section: dropdown */}
          <div className="col-lg-6 col-md-12 d-flex flex-wrap align-items-center gap-2">
            <strong>
              <label className="fw-semibold me-2">
                Change plot type for Variables:
              </label>
            </strong>
            <select
              className="form-select flex-grow-1"
              onChange={(e) => setselectedIndexifbar(e.target.value)}
            >
              {plotdatamonthly?.map((it, index) => (
                <option key={index} value={index}>
                  {it.attribute_name}
                </option>
              ))}
            </select>
          </div>

          {/* Right section: toggle button */}
          {selectedIndexifbar !== null && (
            <div className="col-lg-6 col-md-12 d-flex justify-content-lg-start justify-content-center">
              <button
                className="btngreentheme px-3 py-2 w-auto"
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
      )}

      {/* Plot Section */}
      <div className="plot-container mt-3">
        <div className="d-flex justify-content-center">
          {plotdatamonthly.length > 0 ? (
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
                  text: `${displaynames?.selectedbrand} - ${displaynames?.market} - ${displaynames?.grammage}`,
                  x: 0.5,
                  xanchor: "center",
                  font: { size: 16, family: "Arial, sans-serif" },
                },
                barmode: "group",
                margin: { t: 60, l: 50, r: 50, b: 80 },
                autosize: true,
                xaxis: {
                  domain: [0, 1 - (uniqueunits?.length - 1) * 0.05],
                  title: ifweekly ? "Week/Year" : "Month-Year",
                  showgrid: false,
                  tickangle: -45,
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
                ...(yaxisObjectsArray
                  ? Object.assign({}, ...yaxisObjectsArray)
                  : {}),
                showlegend: true,
                font: { size: 12 },
                legend: {
                  x: 0.5,
                  xanchor: "center",
                  orientation: "h",
                  y: -0.3,
                },
              }}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              config={{ responsive: true }}
            />
          ) : (
            <div className="text-center fw-semibold text-muted p-4">
              There are no records to display!!
            </div>
          )}
        </div>
      </div>

      {/* Add some scoped styling */}
      <style>
        {`
      .plot-container {
        width: 100%;
        max-width: 100%;
        min-height: 400px;
        overflow-x: auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 1rem;
      }
      .btngreentheme {
        background: #28a745;
        border: none;
        color: #fff;
        border-radius: 6px;
        transition: 0.2s ease-in-out;
      }
      .btngreentheme:hover {
        background: #218838;
      }
    `}
      </style>
    </div>

  )
}

export default LineBarChartBrandAnalysisAtta