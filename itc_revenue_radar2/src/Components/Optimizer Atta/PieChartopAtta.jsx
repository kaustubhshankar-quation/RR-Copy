import React from "react";
import Chart from "react-apexcharts";

function PieChartopAtta({ first2chartsdata, range,type }) {
  // Preprocess the dataset to group by type and calculate percentage contributions
  const plotdata = first2chartsdata.map((item) => ({
    name: item.type,
    data: item.percentage_contribution,
  }));

  const total = plotdata.reduce((sum, item) => sum + item.data, 0);
  const series = plotdata.map((item) => item.data);

  const options = {
    labels: plotdata.map((item) => item.name),
    title: {
      text: `Contribution Percentage (${type})`,
      align: "center",
      style: {
        fontWeight: "100",
        color: "#43474B",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
       
          minAngleToShowLabel: 0,  
          // offset: function(val, opts) {
          //   const value = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
          //   console.log('Data value:', value); // Debugging
          //   return value < 2 ? 30 : 0; // Apply offset based on value at data point
          // },
          offset: 27,
             
          style: {
            fontSize: "12px",
            colors: ["#000"], 
          },
         
        },
        donut: {
          size: "30%",  // Donut size, adjust as needed
        },
      },
    },
    colors: ["#1e81b0", "#f4d03f", "#27ae60"],
    chart: {
      id: "Download-Pie chart",
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -50, // Adjusts the position closer to the top of the bar
      style: {
        fontSize: 11, 
        colors: ["white"], // Sets the label color to black
      },
      formatter: function (val, opts) {
        const labels = ["Core", "Incremental", "Media"];
        const label = labels[opts.seriesIndex];
    
        // Adjust spacing for "Media" by adding spaces
        if (label === "Media") {
          return `\xa0\xa0\xa0\xa0${val.toFixed(2)}`; // Adds spacing before value
        }
        if(label==="Incremental"){
          return `${val.toFixed(2)}\xa0\xa0\xa0\xa0`;
        }
        return val.toFixed(2);
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)}`;
        },
      },
    },
  };

  return (
    <div>
      <div>
        <small className="">Time Period: {range}</small>
      </div>
      <Chart
        className="my-auto"
        align="center"
        type="donut"
        height={300}
        options={options}
        series={series}
      />
    </div>
  );
}

export default PieChartopAtta;
