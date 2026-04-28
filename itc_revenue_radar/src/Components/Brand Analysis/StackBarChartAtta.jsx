import React,{useState} from 'react';
import ReactApexChart from 'react-apexcharts';


 function StackBarChartAtta({ reviews,plotdatamonthly,plotdataweekly,displaynames }) {
  const [ifweekly,setifweekly]=useState(false)

  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' }); 
  };
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
    // Utility function to get unique and sorted dates

    const getUniqueSortedDatesmonthly = (values) => {
      return Array.from(new Set(values)).sort((a, b) => new Date(a) - new Date(b));
    };
  
   
  
    const uniqueSortedXAxismonthly = getUniqueSortedDatesmonthly(
      plotdatamonthly.flatMap((item) =>
       
          item?.monthly_value.map((it) =>
            formatDate(it.month_year?.split("-")?.reverse().join("-"))
          )
        
      )
    );
    const getUniqueSortedDatesWeekly = (values) => {
      return Array.from(new Set(values)).sort((a, b) => new Date(a) - new Date(b));
    };
    

    
   
    

  const series = plotdatamonthly?.map((variable) => ({
    name: variable.attribute_name,
    data: uniqueSortedXAxismonthly.map((month) => ({
      x: month, // Use formatted Month-Year for X-axis
      y: variable.monthly_value.find(
        (val) =>
          formatDate(val.month_year?.split("-")?.reverse().join("-")) ===
          month
      )?.value || null, // Match value with month or use null
    })),
  }));



  const options = {
    chart: {    
      id: `Download-Brand Analysis Chart`,
      height: 450,
      type: 'bar',
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded',
      },
    },
    colors: [
      '#4CAF50', '#FFC107', '#FF5722', '#03A9F4', '#E91E63',
      '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4',
      '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FFEB3B',
      '#795548', '#607D8B', '#FFB6C1', '#7CFC00', '#ADD8E6'
    ],
    stroke: {
      width: 0,
    },
    title: {
      text: '',
      align: 'center',
    },
    xaxis: {
      title: {
        text: ifweekly ? "Dates" : "Month-Year",
      },
      labels: {
        formatter: function (val, index) {
          if (ifweekly) {
            return val 
          }
          return val; 
        },
     
      },
    },
    yaxis: {
      title: {
        text: plotdatamonthly?.[0]?.units || "Values",
      },
      labels: {
        formatter: function (val) {
          return val;
        }
      }
    },
    legend: {
      position: 'bottom',
    },
  };
  
  
  return (
    <>
    {/* <div className="d-flex flex-row-reverse my-2">
    <button className="btngreentheme p-2" onClick={()=>setifweekly(!ifweekly)}>{!ifweekly?"Weekly":"Monthly"}</button>
    </div> */}
    <div className="card p-2" id="chart">
       
      <ReactApexChart options={options} series={series} type="bar" height={450} />
    </div>
    </>
  );
}
export default StackBarChartAtta;