import React from 'react';
import ExceptionVariables from '../JSON Files/ExceptionVariables';
import Chart from 'react-apexcharts';

function SingleBarChart5Atta({ fulldataset, type, isValue, range, maxValuedynamicVolume, maxValuedynamicValue }) {
  let maxValue = isValue ? maxValuedynamicValue : maxValuedynamicVolume;
  let hidevar = ExceptionVariables.hiddenroichart;
  const filtered = fulldataset?.plot10?.filter(varObj => !hidevar?.includes(varObj?.variable));

  // Determine if the data contains 'frequency'
  const isStacked = filtered?.some(item => item.frequency);
  
  if(isStacked){
    maxValue=3*maxValue
      }
  let categories, series;

  if (isStacked) {
    // Extract unique frequencies and variables
    let uniqueFrequencies = Array.from(new Set(filtered.map(item => item?.frequency)));
    let uniqueVariables = Array.from(new Set(filtered.map(item => item?.variable)));

    // Group data by variable (stacked chart case)
    series = uniqueVariables.map(variable => {
      return {
        name: variable,
        data: uniqueFrequencies.map(frequency => {
          let dataPoint = filtered.find(item => item.variable === variable && item.frequency === frequency);
          return dataPoint ? (isValue ? Number(dataPoint.contribution_sales_value / 100000).toFixed(2) : Number(dataPoint.contribution).toFixed(0)) : 0;
        })
      };
    });
    categories = uniqueFrequencies;
  } else {
    // Extract unique variables (non-stacked case)
    let uniqueVariables = Array.from(new Set(filtered.map(item => item?.variable)));
    
    // Group data normally
    series = [{
      name: "Contribution",
      data: uniqueVariables.map(variable => {
        let dataPoint = filtered.find(item => item.variable === variable);
        return dataPoint ? (isValue ? Number(dataPoint.contribution_sales_value / 100000).toFixed(2) : Number(dataPoint.contribution).toFixed(0)) : 0;
      })
    }];
    categories = uniqueVariables;
  }

  const options = {
    chart: {
      id: `Download-Contribution Chart for Incremental Variables`,
      type: 'bar',
      stacked: isStacked, // Enable stacking only if frequency is present
      toolbar: {
        show: true,
      },
    },
    grid: {
      show: false
    },
    title: {
      text: `Contribution ${isValue ? "Value" : "Volume"} (${type}) for Incremental Variables`,
      align: 'center',
      style: {
        fontWeight: "100",
      }
    },
   colors : ["#1e81b0", "#f4d03f", "#27ae60" ,
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
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: isStacked?false:true,
      offsetY: -15,
      style: {
        fontSize: '10px',
        colors: ['black'],
      },
      formatter: function (val) {
        return (val?.toLocaleString("en-IN"));
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: isStacked ? 'Frequency' : 'Variables',
        style: {
          fontWeight: "100"
        },
      },
      labels: {
        rotate: -40,
        rotateAlways: true,
        style: {
          fontWeight: "100",
          fontSize: "0.62em"
        },
        offsetY: -6,
      },
    },
    yaxis: {
      title: {
        text: `Contribution ${isValue ? "Value (Lacs)" : "Volume (Kgs)"} `,
        floating: true,
        style: {
          fontWeight: "100"
        },
      },
      axisBorder: {
        show: true // Ensures Y-axis line is visible
      },
      min: 0,
      max: Math.ceil(maxValue),
      labels: {
        style: {
          fontWeight: "100"
        },
        formatter: function (val) {
          return val?.toFixed(0);
        },
      },
    },
    legend: {
      show: isStacked,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    annotations: {
      yaxis: [{
        y: 0,
        borderColor: '#939598',
        label: {
          text: '',
          style: {
            color: '#939598',
            background: '#000'
          }
        }
      }]
    },
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

export default SingleBarChart5Atta;
