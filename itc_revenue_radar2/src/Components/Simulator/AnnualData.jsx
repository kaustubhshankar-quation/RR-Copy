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
        <div className={`annual-kpi-card ${isDark ? 'annual-kpi-card--base-dark' : 'annual-kpi-card--base-light'}`}>
          <div className="annual-kpi-accent annual-kpi-accent--base" />
          <div className="annual-kpi-header">
            <div>
              <div className={`annual-kpi-title ${isDark ? 'annual-kpi-title--base-dark' : 'annual-kpi-title--base-light'}`}>
                {displaynames?.scenario?.match("Reference") ? "REFERENCE SCENARIO" : "BASE SCENARIO"}
              </div>
              <div className={`annual-kpi-subtitle ${isDark ? 'annual-kpi-subtitle--dark' : 'annual-kpi-subtitle--light'}`}>
                Total Predicted Sales {isValue ? "Value" : "Volume"}
              </div>
            </div>
            <span className={`annual-kpi-badge ${isDark ? 'annual-kpi-badge--base-dark' : 'annual-kpi-badge--base-light'}`}>
              {range}
            </span>
          </div>
          <div className="annual-kpi-value-row">
            <span className={`annual-kpi-value ${isDark ? 'annual-kpi-value--base-dark' : 'annual-kpi-value--base-light'}`}>
              {isValue
                ? Number(predictedsalesvaluebasescenarioselectedmonths?.toFixed(2))?.toLocaleString("en-IN")
                : Number(predictedsalesvolumebasescenarioselectedmonths.toFixed(2))?.toLocaleString("en-IN")}
            </span>
            <span className={`annual-kpi-unit ${isDark ? 'annual-kpi-unit--dark' : 'annual-kpi-unit--light'}`}>
              {isValue ? "Lacs" : "Tonnes"}
            </span>
          </div>
        </div>
        </div>

        {/* Scenario KPI Card */}
        <div className="col-lg-6 col-12">
        <div className={`annual-kpi-card ${isDark ? 'annual-kpi-card--scenario-dark' : 'annual-kpi-card--scenario-light'}`}>
          <div className="annual-kpi-accent annual-kpi-accent--scenario" />
          <div className="annual-kpi-header">
            <div>
              <div className={`annual-kpi-title ${isDark ? 'annual-kpi-title--scenario-dark' : 'annual-kpi-title--scenario-light'}`}>
                {displaynames.scenario}
              </div>
              <div className={`annual-kpi-subtitle ${isDark ? 'annual-kpi-subtitle--dark' : 'annual-kpi-subtitle--light'}`}>
                Total Predicted Sales {isValue ? "Value" : "Volume"}
              </div>
            </div>
            <span className={`annual-kpi-badge ${isDark ? 'annual-kpi-badge--scenario-dark' : 'annual-kpi-badge--scenario-light'}`}>
              {range}
            </span>
          </div>
          <div className="annual-kpi-value-row">
            <span className={`annual-kpi-value ${isDark ? 'annual-kpi-value--scenario-dark' : 'annual-kpi-value--scenario-light'}`}>
              {isValue
                ? Number(((plotdata[1]?.data.reduce((prev, next) => prev + Number(next), 0)))?.toFixed(2))?.toLocaleString("en-IN")
                : Number(((plotdata[1]?.data.reduce((prev, next) => prev + Number(next), 0)))?.toFixed(2))?.toLocaleString("en-IN")}
            </span>
            <span className={`annual-kpi-unit ${isDark ? 'annual-kpi-unit--dark' : 'annual-kpi-unit--light'}`}>
              {isValue ? "Lacs" : "Tonnes"}
            </span>
          </div>
        </div>
        </div>

    <style>{`
      .annual-kpi-card {
        min-width: 0;
        border-radius: 12px;
        padding: 20px 24px;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .annual-kpi-card--base-dark {
        background: linear-gradient(145deg, #0f1b2e, #162236);
        border: 1px solid #2a3a5c;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      .annual-kpi-card--base-light {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(99, 102, 241, 0.06);
      }

      .annual-kpi-card--scenario-dark {
        background: linear-gradient(145deg, #0b2420, #0f2e28);
        border: 1px solid #1a5c4a;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      .annual-kpi-card--scenario-light {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(16, 185, 129, 0.06);
      }

      .annual-kpi-accent {
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
      }
      .annual-kpi-accent--base {
        background: #2563eb;
        border-radius: 12px 0 0 12px;
      }
      .annual-kpi-accent--scenario {
        background: #10b981;
        border-radius: 12px 0 0 12px;
      }

      .annual-kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        padding-left: 8px;
      }

      .annual-kpi-title {
        font-size: 16px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .annual-kpi-title--base-dark { color: #60a5fa; }
      .annual-kpi-title--base-light { color: #1d4ed8; }
      .annual-kpi-title--scenario-dark { color: #34d399; }
      .annual-kpi-title--scenario-light { color: #047857; }

      .annual-kpi-subtitle {
        font-size: 13px;
        font-weight: 600;
      }
      .annual-kpi-subtitle--dark { color: #94a3b8; }
      .annual-kpi-subtitle--light { color: #64748b; }

      .annual-kpi-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }
      .annual-kpi-badge--base-dark {
        background: linear-gradient(135deg, #1e3a5f, #172554);
        color: #60a5fa;
        border: 1px solid #1e40af;
      }
      .annual-kpi-badge--base-light {
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
        color: #2563eb;
        border: 1px solid #93c5fd;
      }
      .annual-kpi-badge--scenario-dark {
        background: linear-gradient(135deg, #1a3a4a, #0d2833);
        color: #4fc3f7;
        border: 1px solid #1a5c6a;
      }
      .annual-kpi-badge--scenario-light {
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        color: #047857;
        border: 1px solid #6ee7b7;
      }

      .annual-kpi-value-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
        padding-left: 8px;
      }

      .annual-kpi-value {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1;
      }
      .annual-kpi-value--base-dark { color: #93c5fd; }
      .annual-kpi-value--base-light { color: #1a56db; }
      .annual-kpi-value--scenario-dark { color: #6ee7b7; }
      .annual-kpi-value--scenario-light { color: #065f46; }

      .annual-kpi-unit {
        font-size: 13px;
        font-weight: 500;
      }
      .annual-kpi-unit--dark { color: #94a3b8; }
      .annual-kpi-unit--light { color: #64748b; }
    `}</style>
    </>
  )
}

export default AnnualData