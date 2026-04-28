import React from 'react';
import Chart from "react-apexcharts";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'

function SingleBarChart7opAtta({ optimizeddatasetincrement, type, isValue, range, maxValuedynamicVolume }) {
  let maxValue = maxValuedynamicVolume;
  
  // Check if frequency exists in the dataset to determine stacking
  const isStacked = optimizeddatasetincrement?.some(item => item?.frequency);
  let hidevar=ExceptionVariables.hiddenroichart;
const filtered = optimizeddatasetincrement?.filter(varObj => !hidevar?.includes(varObj?.campaign_name) )
  if(isStacked){
    maxValue=3*maxValue
      }
  // Transform data for stacked chart if frequency exists
  let categories = [];
  let series = [];

  if (isStacked) {
    let groupedData = {};

    filtered?.forEach(item => {
      if (!groupedData[item.campaign_name]) {
        groupedData[item.campaign_name] = {};
      }
      groupedData[item.campaign_name][item.frequency] = 
        Number(item.roi?.toFixed(3)) || 0;
    });

    categories = [...new Set(filtered?.map(item => item.frequency))];
    const variableTypes = Object.keys(groupedData);
    
    series = variableTypes.map(variable => ({
      name: variable,
      data: categories.map(freq => groupedData[variable][freq] || 0),
    }));
  } else {
    // Non-stacked chart
    categories = filtered?.map(item => item.campaign_name);
    series = [{
      name: "ROI",
      data: filtered?.map(it => Number(it?.roi?.toFixed(3)) || 0),
    }];
  }

  const options = {
    chart: {
      id: `Download-ROI for Incremental Variables`,
      type: "bar",
      stacked: isStacked, // Stack if frequency exists
      toolbar: { show: true },
    },
    grid: { show: false },
    title: {
      text: `ROI for Incremental Variables (${type})`,
      align: 'center',
      style: { fontWeight: "100" },
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
    plotOptions: {
      bar: { dataLabels: { position: "top" } },
    },
    dataLabels: {
      enabled: isStacked?false:true,
      offsetY: -15,
      style: { fontSize: 10, colors: ["black"] },
      formatter: val => val.toFixed(3),
    },
    xaxis: {
      categories,
      title: { text: '', style: { fontWeight: "100" } },
      labels: {
        rotate: -35,
        rotateAlways: true,
        style: { fontWeight: "100", fontSize: "0.7em" },
      },
    },
    yaxis: {
      opposite: false,
      axisBorder: { show: true },
      labels: {
        style: { fontWeight: "100" },
        formatter: val => val,
      },
      min: 0,
      max: Math.ceil(maxValue),
      title: {
        text: "ROI",
        showAlways: true,
        floating: true,
        style: { fontWeight: "100" },
      },
    },
    annotations: {
      yaxis: [{
        y: 0,
        borderColor: '#939598',
        label: {
          text: '',
          style: { color: '#939598', background: '#000' },
        },
      }],
    },
    legend: { show: isStacked }, // Show legend only if stacked
  };

  return (
    <>
      <div>
        <small className=''>Time Period: {range}</small>
      </div>
      <Chart
        align="center"
        options={options}
        series={series}
        type="bar"
        height={400}
        width={'95%'}
      />
    </>
  );
}

export default SingleBarChart7opAtta;
