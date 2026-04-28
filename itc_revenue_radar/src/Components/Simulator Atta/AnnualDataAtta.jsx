import React, { useState,useEffect } from 'react'
import Chart from "react-apexcharts";
import { useDispatch } from 'react-redux';
import axios from "axios";
import getNotification from "../../Redux/Action/action.js";
import UserService from '../../services/UserService.js';
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

function AnnualData({fulldataset1,fulldataset2,isValue,displaynames,range}) {
    useEffect(() => {
      // handledatemenu();
      handlevariablesfetch();
      // handlevariablesmenu();
    }, []);
   
   const [endDate, setendDate] = useState("");
const  dispatch=useDispatch()
const reverseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
}
  const handlevariablesfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
      const FormData = require("form-data");
      const sendData = new FormData();
      const config = {
          method: "get",
          url: `${REACT_APP_UPLOAD_DATA}/app/fetchvars`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        if (getResponse.data !== "Invalid User!") {
          if (getResponse.data !== "Invalid User!") {
            if(fulldataset2?.plot6 && fulldataset2?.plot6.length>0){
              setendDate(fulldataset2?.plot6[fulldataset2?.plot6?.length-1]?.month_year)
            }
         else{
          setendDate(fulldataset2?.plot1[0]?.month_year)
         }}
          // setendDate(reverseDate(getResponse.data.dates[0].max[0].end_date));
          // setvariablesoptions(
          //   getResponse.data.variables?.map((it) => {
          //     return { value: it.attribute_name, label: it.attribute_name };
          //   })
          // );
                }
      } catch (err) {
        console.log("Server Error", err);
        if (err.response && err.response.status === 500) {
          dispatch(
            getNotification({
              message: "Server is Down! Please try again after sometime",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 400) {
          dispatch(
            getNotification({
              message: "Input is not in prescribed format",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 422) {
          dispatch(
            getNotification({
              message: "Input is not in prescribed format",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 404) {
          dispatch(
            getNotification({
              message: "Page not Found",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 401) {
          dispatch(
            getNotification({
              message: "Session expired! Please log in again",
              type: "default",
            })
          );
        } else {
          dispatch(
            getNotification({
              message: "Server is Down! Please try again after sometime",
              type: "default",
            })
          );
        }
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/simulator`,
        });
      }, 1000);
    }
  };

// Process and filter the dataset
const filteredDataplot1 = fulldataset1?.plot1.map(item => {
  // Extract year and month from the dataset's "month_year" field
  const [year, month] = item?.month_year.split('-').map(Number);

  // Check if the year-month is beyond the start date

      return item; // Keep the item unchanged
  
});

// Filtered Dataplot2
const filteredDataplot2 = fulldataset1?.plot1.map(item => {
  // Extract year and month with a fallback for invalid data
  const [year, month] = item?.month_year && item?.month_year !== "0" && item?.month_year.includes('-')
      ? item.month_year.split('-').map(Number)
      : [null, null];

  // Check if the year-month is beyond the start date
 
      return item; // Keep the item unchanged
 
});

// Predicted Sales Volume for Selected Months
const predictedsalesvolumebasescenarioselectedmonths = 
  fulldataset2?.plot1?.reduce((total, item) => {
      const [year, month] = item?.month_year?.split('-').map(Number);

      // Only add predicted sales if the date is within the target range
    
          return total + (Number(item?.predicted_sales) || 0);


    
  }, 0) / 1000;

// Predicted Sales Value for Selected Months
const predictedsalesvaluebasescenarioselectedmonths = 
  fulldataset2?.plot1?.reduce((total, item) => {
      const [year, month] = item?.month_year?.split('-').map(Number);

      // Only add total sales value if the date is within the target range
     
          return total + (Number(item?.predicted_value_sales) || 0);
 

   
  }, 0) / 100000;


  const plotdata = isValue
  ?
   [
      {
        name: "Predicted Sales Value (Base Scenario)",
        data: fulldataset2?.plot1?.map((item) => item?.predicted_value_sales / 100000),
        show: true,
      },
    
     
      {
        name: "Scenario Predicted Sales Value",
        data: filteredDataplot2?.map((item, index) =>
          item.predicted_value_sales !== null ? item?.predicted_value_sales / 100000?.toFixed(2) : null
        ),
      },
      ...(fulldataset2?.plot8?.length
        ? [
            {
              name: "Actual Sales Value",
              data: fulldataset2?.plot8
                ?.slice(0, fulldataset2?.plot8?.length )
                ?.map((item) => item?.actuals / 100000),
              show: true,
            },
          ]
        : []),
    ]
  : [
      {
        name: "Predicted Volume (Base Scenario)",
        data: fulldataset2?.plot1?.map((item) => item?.predicted_sales / 1000),
        show: true,
      },
    
       
      {
        name: "Scenario Predicted Volume",
        data: filteredDataplot1?.map((item, index) =>
          item.predicted_sales !== null ? item?.predicted_sales / 1000?.toFixed(2) : null
        ),
      },
      ...(fulldataset2?.plot6?.length?
    [  {
        name: "Actual Volume",
        data: fulldataset2?.plot6
          ?.slice(0, fulldataset2?.plot6?.length)
          ?.map((item) => item?.actuals / 1000),
        show: true,
       
      }]:[])
    ];

  return (
    <div className='p-2'>
      <div className="mx-5">
        <div  className='mb-2'> 
        <small>Time Period: {range}</small>
        </div>
                              Total Predicted Sales {isValue?"Value":"Volume"} ({displaynames?.scenario?.match("Reference")?"Reference":"Base"} Scenario):
                              {" "}
                             {isValue?
                             <span>
                             {Number(predictedsalesvaluebasescenarioselectedmonths?.toFixed(2))?.toLocaleString("en-IN")}{" "}
                             Lacs
                             </span>:
                             <span>
                            { Number(predictedsalesvolumebasescenarioselectedmonths.toFixed(2))?.toLocaleString("en-IN")}{" "}
                            Tonnes
                             </span>}
                             </div>
                            <div className="mx-5">
                              Total Predicted Sales {isValue?"Value":"Volume"} ({displaynames.scenario}):
                            {isValue?  <span>
                              {Number(((plotdata[1]?.data.reduce((prev, next) =>
                                prev + Number(next), 0
                              )) )?.toFixed(2))?.toLocaleString("en-IN")}{" "} Lacs
                            </span>:<span>{Number(((plotdata[1]?.data.reduce((prev, next) =>
                                prev + Number(next), 0
                              )) )?.toFixed(2))?.toLocaleString("en-IN")}{" "}
                              Tonnes</span>}
                            
                            </div>
  
  </div>
  )
}

export default AnnualData