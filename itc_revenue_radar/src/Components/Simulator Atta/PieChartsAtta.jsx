import React from "react";
import Chart from "react-apexcharts";

function PieCharts({ fulldataset, isValue, type,range }) {
 
  const plotdata = isValue
    ? [
        { name: "Core", data: Number(fulldataset?.plot2[0]?.total_core_sales_percent?.toFixed(2)) },
        { name: "Increment", data: Number(fulldataset?.plot2[1]?.total_incremental_sales_percent?.toFixed(2)) },
        { name: "Media", data: Number(fulldataset?.plot2[2]?.total_media_sales_percent?.toFixed(2)) },
      ]
    : [
        { name: "Core", data: Number(fulldataset?.plot2[0]?.total_core_percent?.toFixed(2)) },
        { name: "Increment", data: Number(fulldataset?.plot2[1]?.total_incremental_percent?.toFixed(2)) },
        { name: "Media", data: Number(fulldataset?.plot2[2]?.total_media_percent?.toFixed(2)) },
      ];

  const total = plotdata.reduce((sum, item) => sum + item.data, 0);
  const series = plotdata.map((item) => (item.data / total) * 100);

  const options = {
    labels: fulldataset?.plot2?.map((it)=>it.type),
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
      textAnchor: 'middle',
    
      style: {
        fontSize: "11px", 
        colors: ["white"], 
      },
      formatter: function (val, opts) {
        const labels = fulldataset?.plot2?.map((it)=>it.type);
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
        <small className=''>Time Period: {range}</small>
        </div>
      <Chart className="my-auto" align="center" type="donut" height={300} options={options} series={series} />
    </div>
  );
}

export default PieCharts;
