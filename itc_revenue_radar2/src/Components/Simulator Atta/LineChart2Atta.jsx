import React from 'react'
import Chart from "react-apexcharts";

function LineChart2({fulldataset,type,isValue}) {

const options={
    chart: {
      id: `Download-Effectiveness`,
      type: "line",

      toolbar: {
        show: true,
      },
    },
    grid: {
      show: false
    },
    title: {
      text: `Effectiveness (${type})`,
      align: 'center',
      style: {
        fontWeight: "100",

      }
    },

    colors: ['#1e81b0'],
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top", // Ensures data labels are on top of the bars
        },
      },
    },
    dataLabels: {
        enabled: true,
        offsetY: -15, 
        style: {
          fontSize: 10, 
          colors: ["black"], 
        },
        background: {
          enabled: false, // Disables the background
        },
      },
    xaxis: {
      categories: fulldataset?.plot9?.filter((it)=>{return it.variable_type!==0 && it.fy==="2024-25"})?.map((item) => { return item?.variable }),
      title: {
        text: '',
        style: {
          fontWeight: "100"
        },
      },

      labels: {
        style: {
          fontWeight: "100",
          fontSize: "0.5em"
        },


        formatter: function (val) {
          return val
        }
      },
    },
    yaxis: [
      {
        seriesName: 'Effectiveness',
        opposite: false,
        axisBorder: {
          show: true // Ensures Y-axis line is visible
        },

        labels: {
          style: {
            fontWeight: "100"

          },
          formatter: function (val) {
            return val
          }
        },
        title: {
          text: "Effectiveness ",
          showAlways: true,
          floating: true,
          style: {
            fontWeight: "100"
          },

        },

      },
      ,
      // {
      //   seriesName: 'Predicted Sales',
      //   opposite: true,
      //   title: {
      //     text: "Predicted Sales",
      //     showAlways: true,
      //     floating: true, 
      //      style:{
      //     color:"#FFC107"
      //   },

      //   },


      // },
    ],
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
  }

const plotdata=
[{ name: "Effectiveness", data: fulldataset?.plot9?.filter((it)=>{return it.variable_type!==0 && it.fy==="2024-25"})?.map((it) => { return Number(it?.effectiveness?.toFixed(2))}) },

]
  return (
    <Chart
    align="center"
    options={options}
    series={plotdata}
    type="line"
    height={400}
    width={'90%'}
  />
  )
}

export default LineChart2