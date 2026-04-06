import React from 'react'
import Chart from "react-apexcharts";

function SingleBarChart8Atta({fulldataset,type,isValue,range,maxValuedynamicVolume}) {
  const isStacked = fulldataset?.plot13?.some(item => item.frequency);
  let maxValue=isStacked?3*maxValuedynamicVolume:maxValuedynamicVolume
  
  
  const groupedData = {};
  if (isStacked) {
    fulldataset?.plot13?.forEach(item => {
      if (!groupedData[item.variable]) {
        groupedData[item.variable] = [];
      }
      groupedData[item.variable].push({ x: item.frequency, y: item.attribute_value_per_roi.toFixed(3) });
    });
  }

  const options={
    chart: {
      id: `Download-ROI for Media Variables`,
      type: isStacked ? "bar" : "bar",
      stacked: isStacked,
      toolbar: { show: true },
    },
    grid: { show: false },
    title: {
      text: `ROI for Media Variables (${type})`,
      align: 'center',
      style: { fontWeight: "100" }
    },
    colors : [  "#27ae60" ,"#1e81b0","#f4d03f",
      "#FF6B6B", // Bright Coral Red  
           
      "#556270", // Deep Slate Blue  
      "#C7F464", // Neon Lime  
      "#FF9F1C", // Warm Orange  
      "#2EC4B6", // Rich Cyan  
      "#E71D36", // Strong Red  
      "#011627", // Deep Navy  
        
      "#6A0572", // Strong Purple  
      "#3D348B", // Royal Blue  
        
      "#43AA8B", // Rich Teal Green  
      "#B8336A", // Bold Magenta  
      "#1B998B", // Dark Turquoise  
        
        
        
        
      "#8F2D56", // Rich Burgundy  
      "#F94144", // Vivid Red  
      "#F3722C", // Bright Orange  
      "#F8961E", // Warm Gold  
      "#90BE6D", // Fresh Green  
      "#43AA8B", // Deep Aqua  
      "#577590", // Muted Blue  
      "#F9844A", // Soft Tangerine  
      "#277DA1", // Bold Teal  
      "#9D4EDD", // Electric Purple  
      "#5A189A"  // Deep Violet  
    ],
    plotOptions: { bar: { dataLabels: { position: "top" } } },
    dataLabels: {
      enabled: isStacked?false:true,
      offsetY: -15,
      style: { fontSize: "9px", colors: ["black"] },
      formatter: (val) => val.toFixed(3),
    },
    xaxis: {
      categories: isStacked
        ? [...new Set(fulldataset?.plot13?.map(item => item.frequency))]
        : fulldataset?.plot13?.map(item => item.variable),
      title: { text: '', style: { fontWeight: "100" } },
      labels: {
        rotate: -50,
        rotateAlways: true,
        style: { fontWeight: "100", fontSize:"8px" },
        offsetY: -6,
      },
    },
    yaxis: [{
      seriesName: 'ROI',
      opposite: false,
      axisBorder: { show: true },
      labels: {
        style: { fontWeight: "100" },
        formatter: (val) => val,
      },
      min: 0,
      max: Math.ceil(maxValue),
      title: {
        text: "ROI ",
        showAlways: true,
        floating: true,
        style: { fontWeight: "100" },
      },
    }],
    annotations: {
      yaxis: [{
        y: 0,
        borderColor: '#939598',
        label: { text: '', style: { color: '#939598', background: '#000' } }
      }]
    }
  };

  const plotdata = isStacked
    ? Object.keys(groupedData).map(variable => ({
        name: variable,
        data: groupedData[variable]
      }))
    : [{
        name: "ROI",
        data: fulldataset?.plot13?.map(it => Number(it?.attribute_value_per_roi?.toFixed(3)))
      }];

  return (
    <>
      <div><small className=''>Time Period: {range}</small></div>
      <Chart
        align="center"
        options={options}
        series={plotdata}
        type="bar"
        height={400}
        width={'95%'}
      />
    </>
  )
}

export default SingleBarChart8Atta;
