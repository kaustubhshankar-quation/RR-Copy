import React from 'react';
import Chart from 'react-apexcharts';

function SingleBarChart1opAtta({first2chartsdata, type, isValue,range,maxValuedynamicVolume,maxValuedynamicValue}) {
 
  const isStacked = first2chartsdata?.some(item => item?.frequency);
  let maxValue = isValue ? maxValuedynamicValue : maxValuedynamicVolume;
  if(isStacked){
maxValue=3*maxValue
  }
  
  // Determine if the data contains 'frequency'


  let categories, series;

  if (isStacked) {
    // Extract unique frequencys and media variable types
    let uniqueFrequency = Array.from(new Set(first2chartsdata.map(item => item?.frequency)));
    let uniqueMediaTypes = Array.from(new Set(first2chartsdata.map(item => item?.type)));

    // Group data by media variable type (stacked chart case)
    series = uniqueMediaTypes.map(mediaType => {
      return {
        name: mediaType,
        data: uniqueFrequency.map(frequency => {
          let dataPoint = first2chartsdata.find(item => item.type === mediaType && item?.frequency === frequency);
          return dataPoint ? (isValue ? Number(dataPoint.value / 100000).toFixed(2) : Number(dataPoint.optimized_contribution/1000).toFixed(0)) : 0;
        })
      };
    });
    categories = uniqueFrequency;
  } else {
    // Extract unique media variable types (non-stacked case)
    let uniqueMediaTypes = Array.from(new Set(first2chartsdata.map(item => item?.type)));
    
    // Group data normally
    series = [{
      name: "Contribution",
      data: uniqueMediaTypes.map(mediaType => {
        let dataPoint = first2chartsdata.find(item => item.type === mediaType);
        return dataPoint ? (isValue ? Number(dataPoint.value / 100000).toFixed(2) : Number(dataPoint.optimized_contribution/1000).toFixed(0)) : 0;
      })
    }];
    categories = uniqueMediaTypes;
  }

  const options = {
    chart: {
      id: `Download-Contribution Chart `,
      type: 'bar',
      stacked: isStacked, // Enable stacking only if frequencys are present
      toolbar: {
        show: true,
      },
    },
    grid: {
      show: false
    },
    title: {
      text: `Contribution ${isValue ? "Value" : "Volume"} (${type})`,
      align: 'center',
      style: {
        fontWeight: "100",
      }
    },
    colors: ["#1e81b0", "#f4d03f", "#27ae60"],
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
        text: isStacked ? 'Frequency' : '',
        style: {
          fontWeight: "100"
        },
      },
      labels: {
        rotate: -35,
        rotateAlways: true,
        style: {
          fontWeight: "100",
          fontSize: "0.7em"
        },
      },
    },
    yaxis: {
      title: {
        text: `Contribution ${isValue ? "Value (Lacs)" : "Volume (Kg Tonnes)"}`,
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
        y: 0, // Place the annotation at zero
        borderColor: '#939598',
        label: {
          text: '',
          style: {
            color: '#939598',
            background: '#000'
          }
        }
      }]
    }
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


export default SingleBarChart1opAtta;
