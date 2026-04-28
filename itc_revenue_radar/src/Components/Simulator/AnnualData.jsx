import React, { useState,useEffect } from 'react'
import Chart from "react-apexcharts";
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import axios from "axios";
import getNotification from "../../Redux/Action/action.js";
import UserService from '../../services/UserService';
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

function AnnualData({fulldataset1,fulldataset2,isValue,displaynames,range}) {
    const { theme } = useOutletContext();
    const isDark = theme === 'dark';

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
const filteredDataplot2 = fulldataset1?.plot7.map(item => {
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
     
          return total + (Number(item?.total_sales_value) || 0);
 

   
  }, 0) / 100000;


  const plotdata = isValue
  ? [
      {
        name: "Predicted Sales Value (Base Scenario)",
        data: fulldataset2?.plot1?.map((item) => item?.total_sales_value / 100000),
        show: true,
      },
    
      {
        name: "Scenario Predicted Sales Value",
        data: filteredDataplot2?.map((item, index) =>
          item.total_sales_value !== null ? item?.total_sales_value / 100000?.toFixed(2) : null
        ),
      },
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
    ];


  return (
    <>
        {/* Base Scenario KPI Card */}
        <div className="col-lg-6 col-12">
        <div className="annual-kpi-card h-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="annual-kpi-label">
                {displaynames?.scenario?.match("Reference") ? "Reference Scenario" : "Base Scenario"}
              </div>
              <div className="annual-kpi-value">
                {isValue
                  ? Number(predictedsalesvaluebasescenarioselectedmonths?.toFixed(2))?.toLocaleString("en-IN")
                  : Number(predictedsalesvolumebasescenarioselectedmonths.toFixed(2))?.toLocaleString("en-IN")}
                <span className="annual-kpi-unit">{isValue ? "Lacs" : "Tonnes"}</span>
              </div>
              <div className="annual-kpi-subtext">
                Total Predicted Sales {isValue ? "Value" : "Volume"}
              </div>
            </div>
            <span className="annual-kpi-badge">{range}</span>
          </div>
        </div>
        </div>

        {/* Scenario KPI Card */}
        <div className="col-lg-6 col-12">
        <div className="annual-kpi-card annual-kpi-card--accent h-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="annual-kpi-label">
                {displaynames.scenario}
              </div>
              <div className="annual-kpi-value annual-kpi-value--accent">
                {isValue
                  ? Number(((plotdata[1]?.data.reduce((prev, next) => prev + Number(next), 0)))?.toFixed(2))?.toLocaleString("en-IN")
                  : Number(((plotdata[1]?.data.reduce((prev, next) => prev + Number(next), 0)))?.toFixed(2))?.toLocaleString("en-IN")}
                <span className="annual-kpi-unit">{isValue ? "Lacs" : "Tonnes"}</span>
              </div>
              <div className="annual-kpi-subtext">
                Total Predicted Sales {isValue ? "Value" : "Volume"}
              </div>
            </div>
            <span className="annual-kpi-badge annual-kpi-badge--accent">{range}</span>
          </div>
        </div>
        </div>

    <style>{`
      .annual-kpi-card {
        background: var(--rr-bg-panel);
        border: 1px solid var(--rr-border);
        border-left: 4px solid var(--rr-accent);
        border-radius: 16px;
        padding: 1.25rem;
        box-shadow: var(--rr-shadow);
        transition: all 0.28s ease;
        color: var(--rr-text-main);
      }

      .annual-kpi-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--rr-shadow);
      }

      .annual-kpi-card--accent {
        border-left-color: var(--rr-accent);
      }

      .annual-kpi-label {
        color: var(--rr-text-muted);
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        line-height: 1.4;
      }

      .annual-kpi-value {
        font-family: 'JetBrains Mono', 'Inter', monospace;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.25;
        margin-top: 8px;
        margin-bottom: 4px;
        color: var(--rr-text-main);
      }

      .annual-kpi-value--accent {
        color: var(--rr-accent);
      }

      .annual-kpi-unit {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: var(--rr-text-muted);
        margin-left: 6px;
      }

      .annual-kpi-subtext {
        color: var(--rr-text-muted);
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.5;
      }

      .annual-kpi-badge {
        padding: 4px 12px;
        border-radius: 9999px;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        background: var(--rr-accent-light);
        color: var(--rr-accent);
        border: 1px solid rgba(13,124,102,0.2);
      }

      .annual-kpi-badge--accent {
        background: var(--rr-accent-light);
        color: var(--rr-accent);
        border-color: rgba(13,124,102,0.2);
      }
    `}</style>
    </>
  )
}

export default AnnualData