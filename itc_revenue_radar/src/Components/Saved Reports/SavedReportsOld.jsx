import React, { useEffect, useState } from 'react'
import Navbar3 from '../Navbars/Navbar3'
import SubNavbar from '../Navbars/SubNavbar'
import FooterPages from '../Footer/FooterPages'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import Select, { components } from "react-select";
import { useDispatch } from "react-redux";
import getNotification from "../../Redux/Action/action.js";
import axios from "axios";
import UserService from '../../services/UserService.js';
import ModelPerformanceChart from '../Model Performance/ModelPerformanceChart.jsx';
import LineChartBrandAnalysis from '../Brand Analysis/LineBarChartBrandAnalysis.jsx';

import LineChartMarketAnalysis from '../Market Analysis/LineChartMarketAnalysis.jsx';
import BarChartMarketAnalysis from '../Market Analysis/BarChartMarketAnalysis.jsx';
import LineBarChartBrandAnalysis from '../Brand Analysis/LineBarChartBrandAnalysis.jsx';
import StackBarChart from '../Brand Analysis/StackBarChart.jsx';
import LineChartOptimizer from "../Optimizer/LineChartOptimizer";
import UbLbTable from "../Optimizer/UbLbTable";
import AfterOptimizationTable from "../Optimizer/AfterOptimizationTable";
import SingleBarChart4 from "../Simulator/SingleBarChart4";
import SingleBarChart5 from "../Simulator/SingleBarChart5";
import SingleBarChart6 from "../Simulator/SingleBarChart6";
import SingleBarChart1 from "../Simulator/SingleBarChart1";
import SingleBarChart2 from "../Simulator/SingleBarChart2";
import SingleBarChart3 from "../Simulator/SingleBarChart3";
import PieCharts from "../Simulator/PieCharts";
import SingleBarChart7 from "../Simulator/SingleBarChart7";
import SingleBarChart2op from "../Optimizer/SingleBarChart2op";
import SingleBarChart5op from "../Optimizer/SingleBarChart5op";
import SingleBarChart4op from "../Optimizer/SingleBarChart4op";
import SingleBarChart7op from "../Optimizer/SingleBarChart7op";
import SingleBarChart6op from "../Optimizer/SingleBarChart6op";
import PieChartop from "../Optimizer/PieChartop";
import SingleBarChart1op from "../Optimizer/SingleBarChart1op";
import AfterOptimizationTableAtta from '../Optimizer Atta/AfterOptimizationTableAtta.jsx'
import PieChartopAtta from '../Optimizer Atta/PieChartopAtta.jsx'
import SingleBarChart1opAtta from '../Optimizer Atta/SingleBarChart1opAtta.jsx'
import SingleBarChart2opAtta from '../Optimizer Atta/SingleBarChart2opAtta.jsx'
import SingleBarChart5opAtta from '../Optimizer Atta/SingleBarChart5opAtta.jsx'
import SingleBarChart4opAtta from '../Optimizer Atta/SingleBarChart4opAtta.jsx'
import SingleBarChart7opAtta from '../Optimizer Atta/SingleBarChart7opAtta.jsx'
import SingleBarChart6opAtta from '../Optimizer Atta/SingleBarChart6opAtta.jsx'

const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
const { REACT_APP_UPLOAD_DATA2 } = process.env;
//const { REACT_APP_UPLOAD_DATA } = process.env;

function SavedReports() {
  const [selectedbrand, setselectedbrand] = useState("")
  const [corevalue, setcorevalue] = useState("")
  const [distributionvalue, setdistributionvalue] = useState("")
  const [distributionvaluecontri, setdistributionvaluecontri] = useState("")

  const [isValue, setisValue] = useState(false)
  const [totalBudget, settotalBudget] = useState(0)
  const [selectedobjective, setselectedobjective] = useState("");
  const [fromrangeonplots, setfromrangeonplots] = useState("")
  const [summedupvalues, setsummedupvalues] = useState([])
  const [uniquemonths, setuniquemonths] = useState([])
  const [planneddataset, setplanneddataset] = useState([])
  const [optimizeddatasetmedia, setoptimizeddatasetmedia] = useState([])
  const [optimizeddatasetincremental, setoptimizeddatasetincremental] = useState([])
  const [optimizeddatasetincrement, setoptimizeddatasetincrement] = useState([])
  const [first2chartsdata, setfirst2chartsdata] = useState([])
  const [fulldataset2, setfulldataset2] = useState([])
  const [salestabledata, setsalestabledata] = useState([])
  const [torangeonplots, settorangeonplots] = useState('')
  const [selectedmonth, setselectedmonth] = useState('')
  const [filteredplotdata1, setfilteredplotdata1] = useState([])
  const [plotdata1, setplotdata1] = useState([])
  const [plotdata2, setplotdata2] = useState([])

  let [counter, setcounter] = useState(0);
  const [selectedyear, setselectedyear] = useState("")
  const [selectedscenarioname, setselectedscenarioname] = useState("")
  const [selectedscenarionametimestamp, setselectedscenarionametimestamp] = useState("")
  const [masterscenarioname, setmasterscenarioname] = useState('')
  const [masterdetails, setmasterdetails] = useState()
  const [modifybtn, setmodifybtn] = useState(false)
  const [options, setoptions] = useState({})
  const [savedreportstable, setsavedreportstable] = useState([])
  const [filteredsavedreportstable, setfilteredsavedreportstable] = useState([])
  const [displaynames, setdisplaynames] = useState({});
  const [displaynames2, setdisplaynames2] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandoptions1, setbrandoptions1] = useState([]);
  const [marketoptions, setmarketoptions] = useState([]);
  const [resultscreenmaster, setresultscreenmaster] = useState(false)
  const [market, setmarket] = useState([]);
  const [loader, setloader] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [loader4, setloader4] = useState(false);
  const [resultscreen, setresultscreen] = useState(false);
  const [selectedbrand1, setselectedbrand1] = useState("");
  const [variableslist, setvariableslist] = useState([]);
  const [variable, setvariable] = useState([]);
  const [selectedvariable, setselectedvariable] = useState("");
  const [optimizeddatasetcontripercentage, setoptimizeddatasetcontripercentage] = useState([])
  const [plotdataweekly, setplotdataweekly] = useState({});
  const [plotdatamonthly, setplotdatamonthly] = useState({});
  const [statisticsdata1, setstatisticsdata1] = useState([]);
  const [corelationdata, setcorelationdata] = useState([]);
  const [reportName, setreportName] = useState("");
  const [scenariooptions, setscenariooptions] = useState([])
  const [openindex, setopenindex] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yearoptions, setyearoptions] = useState([])
  const [brandoptions2, setbrandoptions2] = useState([])
  const [selectedbrand2, setselectedbrand2] = useState([])
  const entriesPerPage = 15;
  let indexno = 1
  const dispatch = useDispatch()

  useEffect(() => {
    handlevariablesfetchfybrand()
  }, [])
  useEffect(() => {
    handlefetchmarket()
  }, [selectedbrand2])
  useEffect(() => {
    handlescenariosfetch()
  }, [market])
  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };
  const handlevariablesfetchfybrand = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();

        const config = {
          method: "get",
          url: `${REACT_APP_UPLOAD_DATA}/app/get_brand_fy`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {

          // setmarketoptions(
          //   getResponse.data.markets
          // );
          setyearoptions([
            ...(getResponse.data?.fy || []), // Use optional chaining to handle undefined/null values safely
            // Add the new fiscal year
          ]);

          setbrandoptions2(
            getResponse.data.brands?.filter(it => !ExceptionVariables?.brandoptionshide2?.includes(it?.brand))?.sort((a, b) => a.brand.localeCompare(b.brand))
          );
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
  const handlefetchmarket = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand1 || selectedbrand2)
        const config = {
          method: "post",
          url: selectedbrand2 === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_markets` : `${REACT_APP_UPLOAD_DATA}/app/get_markets`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {

          setmarketoptions(
            getResponse.data.markets
          );

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

  const handlescenariosfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand1)
        sendData.append("market", market)
        sendData.append("fy", selectedyear)
        const config = {
          method: "post",
          url: selectedbrand1 === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_monthly_scenario_name` : `${REACT_APP_UPLOAD_DATA}/api/get_scenario_names`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {
          setscenariooptions(getResponse.data)
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
  const handleCheckboxChange = (index, row) => {
    // If the clicked checkbox is the same as the currently selected one, uncheck it
    if (openindex[index] === true) {
      let arr = []
      setopenindex(arr)
    }
    else {
      if (selectedobjective && selectedobjective !== "Select") {
        let arr3 = []
        arr3[index] = true;
        setopenindex(arr3)
        selectedbrand2 === "ATTA" ? handleoptimizeatta(index, row) : handleoptimize(index, row);
      }
      else {
        dispatch(getNotification({
          message: "Please select objective!",
          type: "danger"
        }))
      }
    }
    // Call the analysis function

  };
  useEffect(() => {
    const currentDate = new Date();
    const startDate1 = new Date(currentDate.setMonth(currentDate.getMonth() - 6))
      .toISOString()
      .split("T")[0]; // Format as YYYY-MM-DD
    setStartDate(startDate1);
    const currentDate1 = new Date();
    const endDate1 = currentDate1.toISOString().split("T")[0];


    setEndDate(endDate1)
    handlevariablesfetch()

  }, []);
  const removeTfromtimestamp = (time) => {
    return time.split("T").join(" ")
  }
  const handleoptimize = async (index, row) => {



    if (UserService.isLoggedIn()) {
      try {
        if (true) {
          try {
            setloader4(true)
            const FormData1 = require("form-data");
            const sendData1 = new FormData1();
            let config1;
            // let currenttime=getCurrentFormattedTime()
            const requestData1 = {
              scenario_name: row.scenerio_name,
              scenario_timestamp: removeTfromtimestamp(row?.created_at),
              user_id: "admin",

              market: row?.market,
              brand: row?.brand,

              total_budget: totalBudget,
              mode: selectedobjective

            };

            const sendData2 = new FormData();
            sendData2.append("scenario_name", row.scenerio_name);
            sendData2.append("scenario_timestamp", row?.created_at);
            sendData2.append("user_id", "admin");
            sendData2.append("market", row?.market);
            sendData2.append("model_id", 1);
            sendData2.append("brand", row?.brand);
            sendData2.append("f_year", row?.fy);
            sendData2.append('mode', selectedobjective)

            config1 = {
              method: "post",
              url: row.scenerio_name?.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/api/annual_optimize` : row.scenerio_name?.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/api/qtr_optimize` : row.scenerio_name?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/api/hy_optimize` : `${REACT_APP_UPLOAD_DATA}/api/optimize`,

              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: requestData1,
              timeout: 15 * 60 * 1000,
            };
            const config2 = {
              method: "post",
              url: row.scenerio_name?.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/api/annual_predict` : row.scenerio_name?.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/api/qtr_predict` : row.scenerio_name?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/api/hy_predict` : `${REACT_APP_UPLOAD_DATA}/api/predict`,


              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            };
            // const config3= {
            //   method: "post",
            //   url: `${REACT_APP_UPLOAD_DATA}/api/basescenario_predict`,
            //   headers: {
            //     Accept: "text/plain",
            //     "Content-Type": "application/json",
            //   },
            //   data: sendData2,
            // };
            // const getResponse3=await axios(config3)
            const getResponse2 = await axios(config2);
            const getResponse1 = await axios(config1);


            if (getResponse1?.data?.optimized_data?.length > 0) {

              setfulldataset2(getResponse2?.data?.data)
              setsalestabledata(getResponse1?.data?.optimized_sales)
              setplanneddataset(getResponse2?.data?.data)
              if (selectedscenarioname.startsWith("Q_") || selectedscenarioname.startsWith("HY_")) {

                setfirst2chartsdata(getResponse1?.data?.all_variable_monthly_contribution_value || [])
              }
              else {
                setfirst2chartsdata(getResponse1?.data?.all_variable_monthly_contribution)

              }
              setoptimizeddatasetcontripercentage(getResponse1?.data?.all_variable_monthly_contribution)
              if (selectedscenarioname.startsWith("Q_") || selectedscenarioname.startsWith("HY_")) {

                setoptimizeddatasetmedia(getResponse1?.data?.df_monthly_media_contributions?.sort((a, b) => a.frequency.localeCompare(b.frequency)))
              }
              else {
                setoptimizeddatasetmedia(getResponse1?.data?.df_monthly_media_contributions)
              }
              setoptimizeddatasetincrement(getResponse1?.data?.df_monthly_inc_contributions)


              let arr2 = []

              settorangeonplots(getResponse2?.data?.data?.plot1[getResponse2?.data?.data?.plot1.length - 1]?.month_year?.split("-").reverse()?.join("-"))

              let current_month_year = `${new Date().getFullYear()}-${(String(new Date().getMonth() + 1).padStart(2, "0"))}`;
              if (getResponse2?.data?.data?.plot1[0]?.month_year >= current_month_year) {
                setfromrangeonplots(getResponse2?.data?.data?.plot1[0]?.month_year?.split("-").reverse()?.join("-"))
              } else {

                const [year, month] = endDate.split("-");
                const date = new Date(year, month); // Month is zero-based in JS Date
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

                setfromrangeonplots(formattedDate?.split("-")?.reverse()?.join("-"))
              }


              setsummedupvalues(getResponse1?.data?.aggregated_results)
              setmodifybtn(false)
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth() - 3; // getMonth() returns 0-indexed month
              const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
              const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

              // Filter the data to include only entries starting from the next month
              const datefiltereddatscenariopredictions = getResponse2?.data?.data?.plot1.filter(item => {
                const [year, month] = item?.month_year.split('-').map(Number); // Split "YYYY-MM" into year and month

                // Check if the month-year should have predicted_sales as null
                if (year > nextYear || (year === nextYear && month >= nextMonth)) {
                  return item; // Keep the item unchanged
                }
              });
              const categories = getResponse2?.data?.data?.plot1?.map((item) =>
                item?.month_year
              )
              const optimizedSalesData = categories?.map((category) => {
                const matchingItem = getResponse1?.data?.optimized_sales?.find(
                  (item) => item.month_year === category
                );
                return matchingItem ? matchingItem.attribute_value?.toFixed(0) : null;
              });


              setmodifybtn(false)
              setloader(false)
              // setresultscreen2(true)
              setdisplaynames({
                ...displaynames,
                scenario: selectedscenarioname,
                timestamp: selectedscenarionametimestamp,
                market: market,
                fy: selectedyear,
                brand: selectedbrand2,
                objective: selectedobjective,
                totalBudget: totalBudget
              })
              let arr = getResponse1?.data?.optimized_data[0]?.month_year || getResponse1?.data?.optimized_data[0]?.frequency ? Array.from(new Set(getResponse1?.data?.optimized_data.map((it) => it?.month_year || it?.frequency))) : []
              arr.push("All")
              setplotdata2(getResponse1?.data?.optimized_data)
              setplotdata1(getResponse1?.data?.optimized_data?.filter((it) => it.variable === "sales"))

              // setfilteredplotdata1(getResponse1?.data?.optimized_data?.filter((it)=>it.month_year===(Array.from(new Set(getResponse1?.data?.optimized_data.map((it)=>it.month_year)))[0])))
              setfilteredplotdata1(getResponse1?.data?.aggregated_results)
              getResponse1?.data?.uob_planned_sales && setcorevalue(getResponse1?.data?.uob_planned_sales)
              setselectedmonth("All")
              setuniquemonths(arr)
              getResponse1?.data?.eob_distribution ? setdistributionvalue([...getResponse1?.data?.eob_distribution]) : setdistributionvalue([])
              getResponse1?.data?.eob_contribution_distribution ? setdistributionvaluecontri(getResponse1?.data?.eob_contribution_distribution) : setdistributionvaluecontri([])
            }
            else {
              let arr3 = []
              arr3[index] = false;
              setopenindex(arr3)
              dispatch(
                getNotification({
                  message: "There are no matching records to display!",
                  type: "danger",
                })
              );
            }
          }
          catch (err) {
            console.log("Server Error", err);
            // setresultscreen2(false)
            if (err.response && err.response.status === 500) {
              dispatch(
                getNotification({
                  message: "Server is Down! Please try again after sometime",
                  type: "default",
                })
              );
            }
            else if (err.code === "ECONNABORTED") {
              dispatch(
                getNotification({
                  message: "Connection Timed out!",
                  type: "default",
                })
              );
            }
            else if (err.response && err.response.status === 400) {
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
        }
        else {
          dispatch(getNotification(
            {
              message: "Please select all entries!!",
              type: "danger"
            }
          ))
        }
      }
      catch (err) {
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
    }
    else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
    setloader4(false)
  }
  const handleoptimizeatta = async (index, row) => {


    setmodifybtn(false)
    if (UserService.isLoggedIn()) {


      try {
        setloader4(true)
        const FormData1 = require("form-data");
        const sendData1 = new FormData1();

        let config1;
        let currenttime = getCurrentFormattedTime()
        const requestData1 = {
          scenario_name: row.scenerio_name,
          scenario_timestamp: removeTfromtimestamp(row?.created_at),
          user_id: "admin",

          market: row?.market,
          brand: row?.brand,

          total_budget: totalBudget,
          mode: selectedobjective

        };

        const sendData2 = new FormData();
        sendData2.append("scenario_name", row.scenerio_name);
        sendData2.append("scenario_timestamp", row?.created_at);
        sendData2.append("user_id", "admin");
        sendData2.append("market", row?.market);
        sendData2.append("model_id", 1);
        sendData2.append("brand", row?.brand);
        sendData2.append("f_year", row?.fy);
        sendData2.append('mode', selectedobjective)
        config1 = {
          method: "post",
          url: row.scenerio_name?.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_annual_optimize` : row.scenerio_name?.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_optimize` : `${REACT_APP_UPLOAD_DATA}/app/atta_optimize`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: requestData1,
          timeout: 10 * 60 * 1000,
        };
        const config2 = {
          method: "post",
          url: row.scenerio_name?.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_predict` : row.scenerio_name?.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_quartely_scenario_predict` : `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_predict`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData2,
        };
        // const config3= {
        //   method: "post",
        //   url: `${REACT_APP_UPLOAD_DATA}/api/basescenario_predict`,
        //   headers: {
        //     Accept: "text/plain",
        //     "Content-Type": "application/json",
        //   },
        //   data: sendData2,
        // };
        // const getResponse3=await axios(config3)
        const getResponse2 = await axios(config2);
        const getResponse1 = await axios(config1);

        console.log(getResponse1, getResponse2)
        if (getResponse1?.data?.optimized_data?.length > 0) {
          setfulldataset2(getResponse2?.data?.data)
          setsalestabledata(getResponse1?.data?.optimized_sales)
          setplanneddataset(getResponse2?.data?.data)
          setoptimizeddatasetmedia(getResponse1?.data?.df_monthly_media_contributions)

          setoptimizeddatasetincrement(getResponse1?.data?.df_monthly_inc_contributions)
          setoptimizeddatasetincremental(getResponse1?.data?.df_monthly_inc_contributions)
          setfirst2chartsdata(getResponse1?.data?.all_variable_monthly_contribution)
          let arr2 = []

          settorangeonplots(getResponse2?.data?.data?.plot1[getResponse2?.data?.data?.plot1.length - 1]?.month_year?.split("-").reverse()?.join("-"))

          let current_month_year = `${new Date().getFullYear()}-${(String(new Date().getMonth() + 1).padStart(2, "0"))}`;
          if (getResponse2?.data?.data?.plot1[0]?.month_year >= current_month_year) {
            setfromrangeonplots(getResponse2?.data?.data?.plot1[0]?.month_year?.split("-").reverse()?.join("-"))
          } else {

            const [year, month] = endDate.split("-");
            const date = new Date(year, month); // Month is zero-based in JS Date
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 2).padStart(2, "0")}`;

            setfromrangeonplots(formattedDate?.split("-")?.reverse()?.join("-"))
          }


          setsummedupvalues(getResponse1?.data?.aggregated_results)
          setmodifybtn(false)
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() - 3; // getMonth() returns 0-indexed month
          const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
          const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

          // Filter the data to include only entries starting from the next month
          const datefiltereddatscenariopredictions = getResponse2?.data?.data?.plot1.filter(item => {
            const [year, month] = item?.month_year.split('-').map(Number); // Split "YYYY-MM" into year and month

            // Check if the month-year should have predicted_sales as null
            if (year > nextYear || (year === nextYear && month >= nextMonth)) {
              return item; // Keep the item unchanged
            }
          });
          const categories = getResponse2?.data?.data?.plot1?.map((item) =>
            item?.month_year
          )
          const optimizedSalesData = categories?.map((category) => {
            const matchingItem = getResponse1?.data?.optimized_sales?.find(
              (item) => item.month_year === category
            );
            return matchingItem ? matchingItem.attribute_value?.toFixed(0) : null;
          });


          setmodifybtn(false)
          setloader(false)

          setdisplaynames({
            ...displaynames,
            scenario: selectedscenarioname,
            timestamp: selectedscenarionametimestamp,
            market: market,
            fy: selectedyear,
            brand: selectedbrand2,
            objective: selectedobjective,
            totalBudget: totalBudget
          })
          let arr = Array.from(new Set(getResponse1?.data?.optimized_data.map((it) => it.month_year)))
          arr.push("All")
          setplotdata2(getResponse1?.data?.optimized_data)
          setplotdata1(getResponse1?.data?.optimized_data?.filter((it) => it.campaign_name === "sales"))

          // setfilteredplotdata1(getResponse1?.data?.optimized_data?.filter((it)=>it.month_year===(Array.from(new Set(getResponse1?.data?.optimized_data.map((it)=>it.month_year)))[0])))
          setfilteredplotdata1(getResponse1?.data?.aggregated_results)
          setselectedmonth("All")
          setuniquemonths(arr)


        }
        else {
          dispatch(
            getNotification({
              message: "There are no matching records to display!",
              type: "danger",
            })
          );
        }
      }
      catch (err) {
        console.log("Server Error", err);

        if (err.response && err.response.status === 500) {
          dispatch(
            getNotification({
              message: "Server is Down! Please try again after sometime",
              type: "default",
            })
          );
        }
        else if (err.code === "ECONNABORTED") {
          dispatch(
            getNotification({
              message: "Connection Timed out!",
              type: "default",
            })
          );
        }
        else if (err.response && err.response.status === 400) {
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


    }



    else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
    setloader4(false)
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
          // setStartDate(reverseDate(getResponse.data.dates[0].min[0].start_date));
          // setEndDate(reverseDate(getResponse.data.dates[0].max[0].end_date));
          setbrandoptions1(
            getResponse.data.brands?.filter(it => !ExceptionVariables?.brandoptionshide?.includes(it?.brand))?.map((it) => {
              return { value: it.brand, label: it.brand };
            })
          );
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
        });
      }, 1000);
    }
  };

  const handlereportsfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        setloader(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("date_from", startDate);
        sendData.append("date_till", endDate);
        sendData.append("brand", selectedbrand1)
        sendData.append("user_created_by", UserService.getUsername())
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/getReport`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        console.log(getResponse.data.reports)
        if (getResponse.data !== "Invalid User!") {
          setopenindex([])
          counter = 0
          indexno = 1
          setdisplaynames({
            ...displaynames,
            start_date: startDate,
            end_date: endDate,
            selectedbrand1: selectedbrand1,


          })
          setresultscreen(true)

          setfilteredsavedreportstable(getResponse?.data?.reports)
          setsavedreportstable(getResponse?.data?.reports)
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
              message: err?.response?.data,
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
    setloader(false)
  };


  const handlefetchbudget = async (row, objective) => {
    if (UserService.isLoggedIn()) {
      try {

        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", row?.brand)
        sendData.append("scenario_name", row?.scenerio_name)
        selectedbrand2 === "ATTA" ? sendData.append("market", row?.market)
          : sendData.append("final_market", row?.market)
        sendData.append("scenario_timestamp", row?.created_at)

        const config = {
          method: "post",
          url: selectedbrand2 === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_budget` : `${REACT_APP_UPLOAD_DATA}/api/get_budget`,

          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };

        const sendData2 = new FormData();
        sendData2.append("brand", row?.brand)
        sendData2.append("scenario_name", row?.scenerio_name)
        sendData2.append("final_market", row?.market)

        sendData2.append("scenario_timestamp", row?.created_at)
        const config2 = {
          method: "post",
          url: row?.scenerio_name?.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/api/get_annual_obj_budget` : `${REACT_APP_UPLOAD_DATA}/api/get_obj_budget`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData2,
        };
        if (objective === "Optimize Spends to Maximize Sales" || objective === "Maintain Sales and Minimize Spends") {
          const getResponse2 = await axios(config2);
        }
        const getResponse = await axios(config);



        if (getResponse.data !== "Invalid User!") {

          settotalBudget(getResponse.data[0].budget)

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
  };
  function getCurrentFormattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const handlemodifybudget = async (budgetfromcell, row) => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        const currenttime = getCurrentFormattedTime()

        const requestData = {
          dataset: [
            {
              scenario_name: row?.scenerio_name,
              created_dt: currenttime,
              user_id: "admin",
              brand: row?.brand,
              final_market: row?.market,
              budget: budgetfromcell
            }
          ]


          // budget:totalBudget,
        };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/api/modify_budget`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = await axios(config);
        console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {

          settotalBudget(budgetfromcell)

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
  };
  const handlesearch = (value) => {
    if (value?.length > 2) {
      setfilteredsavedreportstable(savedreportstable.filter((item) =>
        item.report_name?.toLowerCase().includes(value.toLowerCase())
      ))

    }
    else {
      setfilteredsavedreportstable(savedreportstable)
    }
  }
  const toggleDatanext = () => {
    const nextIndex = currentIndex + entriesPerPage;
    setCurrentIndex(nextIndex);

  };
  const handlefetchmasterscenario = async () => {
    if (UserService.isLoggedIn()) {
      try {
        setloader(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("fy", selectedyear)
        sendData.append("brand_market", `${selectedbrand2}_${market}`)

        // sendData.append("scenario_timestamp",selectedscenarionametimestamp)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/api/get_master_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };

        const FormData5 = require("form-data");
        const sendData5 = new FormData5();
        sendData5.append("fy", selectedyear)
        sendData5.append("brand_market", `${selectedbrand2}_${market}`)

        const config5 = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_master_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData5,
        }
        let type = ""
        if (selectedscenarioname?.startsWith("M_")) {
          type = "M"
        }
        else if (selectedscenarioname?.startsWith("Y_")) {
          type = "Y"
        }
        else if (selectedscenarioname?.startsWith("Q_")) {
          type = "Q"
        }
        else {
          type = "HY"
        }


        // let arr = getResponse5?.data?.data
        // let arr2 = getResponse5?.data?.data.filter((it) => type === it?.frequency)
        // // console.log(arr)

        // setsavedmasterscenarioname(getResponse5?.data?.data.filter((it) =>it.fy===selectedyear && type === it?.frequency)[0]?.scenerio_name)



        const getResponse = selectedbrand2 === "ATTA" ? await axios(config5) : await axios(config);



        if (getResponse.data !== "Invalid User!") {
          //console.log(masterscenarioname.filter((it)=>"M_APTG_23".charAt(0)===it?.frequency))
          // settotalBudget(getResponse.data[0].budget)
          //setmasterscenarioname(getResponse?.data?.data)
          selectedbrand2 === "ATTA" ? setmasterdetails(getResponse?.data?.data?.filter(it => it.fy === selectedyear)) :
            setmasterdetails(getResponse?.data?.data?.filter(it => it.fy === selectedyear))
          setresultscreenmaster(true)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
    setloader(false)
  };
  const toggleDataprev = () => {
    const prevIndex = currentIndex - entriesPerPage;
    console.log(prevIndex)
    if (prevIndex < entriesPerPage) {
      // Reset to start if we reach the end
      setCurrentIndex(prevIndex);
    } else {
      setCurrentIndex(prevIndex);
    }
  };
  return (
    <>
      <Navbar3 />
      <div className="bgpages">
        <div className=' mx-5 py-3'>
          <div className='greentheme '>{`Dashboard >> Saved Reports`}</div>
          <div className='p-2 bg-white greentheme my-3 d-flex justify-content-between' style={{ fontSize: "20px" }}>
            <b>Saved Reports</b>
            {resultscreenmaster && <button className="btn btn-danger  mx-1 my-auto" onClick={() => { setmodifybtn(false); setresultscreen(false); setselectedbrand1(""); setopenindex([]); counter = 0; setresultscreenmaster(false); }}>
              Reset</button>}
            {resultscreen && <div className="">

              <button className="btn btn-danger  mx-1 my-auto" 
              onClick={() => { setmodifybtn(false); setresultscreen(false); setselectedbrand1(""); setopenindex([]); counter = 0; setresultscreenmaster(false); }}>Reset</button>

              {resultscreenmaster && <button className="btn btn-danger  mx-1 my-auto" onClick={() => { setmodifybtn(false); setresultscreen(false); setselectedbrand1(""); setopenindex([]); counter = 0; setresultscreenmaster(false); }}>
                Reset</button>}
              <button className="btn btn-dark mx-1 my-auto" onClick={() => setmodifybtn(!modifybtn)}>Modify</button>


            </div>
            }
          </div>

          {modifybtn &&
            <div className='card p-3'>
              <div className=' d-flex justify-content-between  my-3 '>
                <div className="">
                  <label htmlFor="" >
                    Start Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"

                    className="form-control input-lg"
                    id="StartDate"
                    value={startDate}
                    defaultValue={new Date()}
                    onChange={(e) => {

                      if (endDate) {
                        if (e.target.value <= endDate) {

                          setStartDate(e.target.value);
                        } else {
                          alert("Entered start date is after end date");
                        }
                      } else {
                        setStartDate(e.target.value);
                      }
                    }}
                    placeholder=" Start Date"
                  />

                </div>

                <div className="  ">
                  <label htmlFor="">
                    End Date<span className="text-danger">*</span>
                  </label>
                  <input

                    type="date"
                    className=" form-control "
                    id="EndDate"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => {
                      if (e.target.value >= startDate) {
                        setEndDate(e.target.value);
                      } else {
                        alert("Please enter End date after start date");
                      }
                    }}
                  />

                </div>
                <div className="">
                  <label>Brand:<span className="text-danger">*</span></label>
                  <Select
                    placeholder="Select Brand"
                    options={brandoptions1}
                    value={selectedbrand1 ? { label: selectedbrand1, value: selectedbrand1 } : null}
                    onChange={(value) => {

                      setselectedbrand1(value.value);
                      setselectedvariable("")
                      setmarket([])
                    }}
                  />





                </div>
                <div class="submitfrmtbtn mb-2" type="button" onClick={() => {

                  handlereportsfetch();
                }}>
                  <span>Submit <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                </div>
              </div></div>
          }

          {resultscreen
            &&
            <div className=" bg-white p-3 my-3"  >
              <span className=" greentheme" style={{ fontSize: "17px" }}><b>User Selections</b>

              </span>
              <div className="d-flex justify-content-between my-2">
                <div className="mx-3">
                  <label>Start Date:{" "}</label>
                  <label className="mx-1">{displaynames.start_date}</label>
                </div>
                <div className="mx-3">
                  <label>End Date:{" "}</label>
                  <label className="mx-1">{displaynames.end_date}</label>
                </div>
                <div className="mx-3">
                  <label>Brands:{" "}</label>
                  <label className="mx-1">{displaynames.selectedbrand1}</label>
                </div>


              </div>



            </div>}



          {resultscreen ?

            savedreportstable?.length > 0 ?
              loader ? "Loading..." :
                <>
                  <div className='d-flex flex-row-reverse '>
                    <div class="input-group input-group-sm  ">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Search</span>
                      </div>
                      <input type="text" placeholder='Type atleast 3 characters to search' class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={(e) => { handlesearch(e.target.value) }} />
                    </div>
                  </div>

                  <table className="table table-sm my-3  table-bordered table-responsive-lg" >
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th>Report Name</th>

                        <th>Brand</th>
                        <th>Markets</th>
                        <th>Variable</th>
                        <th>Type</th>
                        <th>More details</th>

                      </tr>
                    </thead>
                    <tbody>
                      {filteredsavedreportstable?.slice(counter * entriesPerPage, (counter + 1) * entriesPerPage)?.map((row, index) => (
                        <>
                          <tr key={index + 1}>
                            <td>{counter * entriesPerPage + index + 1}</td>
                            <td>{row?.report_name}</td>

                            <td>{row?.brand}</td>
                            <td>       {row.markets?.length > 1
                              ? row.markets.map((brand, index) =>
                                `${brand}${index !== row.markets.length - 1 ? ',' : ''}`
                              )
                              : row.markets.map((brand) => `${brand}`)
                            }

                            </td>
                            <td>{Array.isArray(row?.variable) ? row.variable?.length > 1
                              ? row.variable.map((brand, index) =>
                                `${brand}${index !== row.variable.length - 1 ? ',' : ''}`
                              )
                              : row.variable.map((brand) => `${brand}`) :
                              row?.variable}</td>
                            <td>{row?.screen}</td>

                            <td>
                              <span onClick={() => handleCheckboxChange(index, row)} type="button"
                              >
                                {openindex[index] === true ? "Hide" : "View Report"}
                              </span>

                            </td>
                          </tr>
                          {openindex[index] === true &&
                            <tr class=" "   >
                              <td colSpan="8" className="text-center" >


                                {row.screen === "M_A" && (loader2 ? "Loading..." :
                                  displaynames?.variable === "Sales_Volume" || displaynames?.variable === "Sales_Value" ?
                                    <LineChartMarketAnalysis plotdataweekly={plotdataweekly} plotdatamonthly={plotdatamonthly} displaynames={displaynames2} /> :
                                    <BarChartMarketAnalysis plotdataweekly={plotdataweekly} plotdatamonthly={plotdatamonthly} displaynames={displaynames2} />
                                )}
                                {row.screen === "B_A" && (loader2 ? "Loading..." :


                                  displaynames?.variable?.includes(ExceptionVariables.additionstogetvariablesapi[0].attribute_name) ||
                                    displaynames?.variable?.includes(ExceptionVariables.additionstogetvariablesapi[1].attribute_name)
                                    ? (
                                      <StackBarChart
                                        plotdataweekly={plotdataweekly}
                                        plotdatamonthly={plotdatamonthly}
                                        displaynames={displaynames}
                                      />
                                    ) :
                                    <LineBarChartBrandAnalysis plotdataweekly={plotdataweekly} plotdatamonthly={plotdatamonthly} displaynames={displaynames2} />
                                )}

                              </td>
                            </tr>}
                        </>
                      ))}

                    </tbody>

                  </table>
                  {savedreportstable?.length > 0 &&
                    <div className="d-flex justify-content-between">
                      <button className={counter === 0 ? "btn btn-secondary" : "btngreentheme p-2"} onClick={() => setcounter(counter - 1)} disabled={counter === 0}>Previous</button>
                      <button
                        className={savedreportstable?.length / entriesPerPage <= (counter + 1) ? "btn btn-secondary" : "btngreentheme p-2"} disabled={savedreportstable?.length / entriesPerPage <= (counter + 1)}
                        onClick={() => { setcounter(counter + 1) }}> Next</button>
                    </div>}

                </> : <div>There are no records to display!!</div>
            :
            loader ? "Loading..." : ""
            // !resultscreenmaster && <div className='my-3'>
            // Market Analysis & Brand Analysis Reports
            //  <div className="card p-3">

            //  <div className=' d-flex justify-content-between'>
            //  <div className="">
            //                   <label htmlFor="" >
            //                     Start Date<span className="text-danger">*</span>
            //                   </label>
            //                   <input
            //                     type="date"

            //                     className="form-control input-lg"
            //                     id="StartDate"
            //                     value={startDate}
            //                     defaultValue={new Date()}
            //                     onChange={(e) => {

            //                       if (endDate) {
            //                         if (e.target.value <= endDate) {

            //                           setStartDate(e.target.value);
            //                         } else {
            //                           alert("Entered start date is after end date");
            //                         }
            //                       } else {
            //                         setStartDate(e.target.value);
            //                       }
            //                     }}
            //                     placeholder=" Start Date"
            //                   />

            //                 </div>

            //                 <div className="  ">
            //                   <label htmlFor="">
            //                     End Date<span className="text-danger">*</span>
            //                   </label>
            //                   <input

            //                     type="date"
            //                     className=" form-control "
            //                     id="EndDate"
            //                     placeholder="End Date"
            //                     value={endDate}
            //                     onChange={(e) => {
            //                       if (e.target.value >= startDate) {
            //                         setEndDate(e.target.value);
            //                       } else {
            //                         alert("Please enter End date after start date");
            //                       }
            //                     }}
            //                   />

            //                 </div>
            //                 <div className="">
            //                   <label>Brand:<span className="text-danger">*</span></label>
            //                   <Select
            //                     placeholder="Select Brand"
            //                     options={brandoptions1}
            //                     value={selectedbrand1 ? { label: selectedbrand1, value: selectedbrand1 } : null}
            //                     onChange={(value) => {

            //                       setselectedbrand1(value.value);
            // setselectedvariable("")
            // setmarket([])
            //                     }}
            //                   />





            //                 </div>
            //                 <div class="submitfrmtbtn mb-2" type="button" onClick={() => {

            // handlereportsfetch();
            // }}>
            //   <span>Submit <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span></div>

            //  </div>
            //            </div>



            //             </div>   
          }
          {resultscreenmaster ?

            masterdetails?.length > 0 ?
              loader ? "Loading..." :
                <>


                  <table className="table table-sm my-3  table-bordered table-responsive-lg" >
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th>FY</th>
                        <th>Brand</th>
                        <th>Market</th>

                        <th>Type</th>
                        <th>Master Scenario</th>
                        <th>Objective</th>
                        <th>Budget</th>
                        <th>More details</th>

                      </tr>
                    </thead>
                    <tbody>
                      {masterdetails?.slice(counter * entriesPerPage, (counter + 1) * entriesPerPage)?.map((row, index) => (
                        <>
                          <tr key={index + 1}>
                            <td>{counter * entriesPerPage + index + 1}</td>
                            <td>{row?.fy}</td>

                            <td>{row?.brand}</td>
                            <td>{row?.market}</td>
                            <td>{row?.frequency}</td>
                            <td>{row?.scenerio_name}</td>
                            <td>
                              <select className="" value={selectedobjective} onChange={(e) => {
                                setselectedobjective(e.target.value)
                                handlefetchbudget(row, e.target.value)
                                let arr = []
                                setopenindex(arr)
                                //handleCheckboxChange(index, row)


                              }}>
                                <option>Select</option>
                                <option>Optimize Spends to Maximize Sales</option>
                                <option>Maintain Sales and Minimize Spends</option>
                                {/* <option>Achieve Percentage growth with optimized spends</option> */}

                              </select>
                            </td>
                            <td className=''>
                              {
                                (selectedobjective === "Maintain Sales and Minimize Spends" || selectedobjective === "Optimize Spends to Maximize Sales") ?
                                  <div>Rs {totalBudget?.toLocaleString("en-IN")}</div> :
                                  <input className="w-50 " value={totalBudget} onChange={(e) => { settotalBudget(e.target.value); handlemodifybudget(e.target.value, row) }} />

                              }
                            </td>
                            <td>
                              <span onClick={() => handleCheckboxChange(index, row)} type="button"
                              >
                                {openindex[index] === true ? "Hide" : "View Optimized Results"}
                              </span>

                            </td>
                          </tr>
                          {openindex[index] === true &&
                            <tr class=" "   >
                              <td colSpan="9" className="text-center" >

                                {loader4 ?
                                  <div>Loading...</div> :
                                  <div>
                                    <div className=" text-light bg-secondary p-2 mt-3" id="optimizeddata">Optimized Data</div>
                                    {/* <button className="btngreentheme p-2 " onClick={()=>setisValue(!isValue)}>{isValue?"By Volume":"By Value"}</button> */}
                                    {plotdata1?.length > 0 && displaynames.scenario.startsWith("M_") && <div className="card my-3 p-2 container">
                                      <LineChartOptimizer fulldataset1={plotdata1} fulldataset2={fulldataset2} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} endDate={endDate} />
                                    </div>}
                                    <div className="row my-3">
                                      {planneddataset?.plot2?.length > 0 &&
                                        <div className="card col-sm mx-1 p-3" id="" >

                                          <PieCharts isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} fulldataset={planneddataset} type={"Planned Scenario"} displaynames={displaynames} />

                                        </div>
                                      }
                                      {optimizeddatasetcontripercentage?.length > 0 || first2chartsdata?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <PieChartopAtta isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} first2chartsdata={first2chartsdata} type={"Optimized"} />
                                          :

                                          <PieChartop isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} optimizeddatasetcontripercentage={optimizeddatasetcontripercentage} type={"Optimized"} />

                                        }

                                      </div>}

                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot3?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >

                                        <SingleBarChart1 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(Math.max(...[
                                            planneddataset?.plot3[0].total_core / 1000,
                                            planneddataset?.plot3[1].total_incremental / 1000,
                                            planneddataset?.plot3[2].total_media / 1000,
                                            ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                          ]) / 100) * 100}
                                          maxValuedynamicValue={Math.ceil(Math.max(...[
                                            planneddataset?.plot3[0].total_core_sales / 100000,
                                            planneddataset?.plot3[1].total_incremental_sales / 100000,
                                            planneddataset?.plot3[2].total_media_sales / 100000,
                                            ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                          ]) / 100) * 100
                                          } />



                                      </div>}
                                      {first2chartsdata?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart1opAtta first2chartsdata={first2chartsdata} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(Math.max(...[
                                              planneddataset?.plot3[0].total_core / 1000,
                                              planneddataset?.plot3[1].total_incremental / 1000,
                                              planneddataset?.plot3[2].total_media / 1000,
                                              ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                            ]) / 100) * 100}
                                            maxValuedynamicValue={Math.ceil(Math.max(...[
                                              planneddataset?.plot3[0].total_core_sales / 100000,
                                              planneddataset?.plot3[1].total_incremental_sales / 100000,
                                              planneddataset?.plot3[2].total_media_sales / 100000,
                                              ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                            ]) / 100) * 100
                                            }

                                          /> :
                                          <SingleBarChart1op first2chartsdata={first2chartsdata} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(Math.max(...[
                                              planneddataset?.plot3[0].total_core / 1000,
                                              planneddataset?.plot3[1].total_incremental / 1000,
                                              planneddataset?.plot3[2].total_media / 1000,
                                              ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                            ]) / 100) * 100}
                                            maxValuedynamicValue={Math.ceil(Math.max(...[
                                              planneddataset?.plot3[0].total_core_sales / 100000,
                                              planneddataset?.plot3[1].total_incremental_sales / 100000,
                                              planneddataset?.plot3[2].total_media_sales / 100000,
                                              ...first2chartsdata?.map((it) => Number(it.optimized_contribution / 1000))
                                            ]) / 100) * 100
                                            }
                                          />}

                                      </div>}
                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot4?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >

                                        <SingleBarChart2 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...planneddataset?.plot4.map((it) => it.contribution), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                            ) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...planneddataset?.plot4.map((it) => it.contribution_sales_value), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                            )
                                          )} />

                                      </div>}
                                      {optimizeddatasetmedia?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart2opAtta optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(...planneddataset?.plot4.map((it) => it.contribution), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                              ) / 100
                                            ) * 100}
                                            maxValuedynamicValue={Math.ceil(
                                              Math.max(...planneddataset?.plot4.map((it) => it.contribution_sales_value), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                              )
                                            )} /> :
                                          <SingleBarChart2op optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(...planneddataset?.plot4.map((it) => it.contribution), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                              ) / 100
                                            ) * 100}
                                            maxValuedynamicValue={Math.ceil(
                                              Math.max(...planneddataset?.plot4.map((it) => it.contribution_sales_value), ...optimizeddatasetmedia?.map((it) => { return Number(it?.value_contribution) })
                                              )
                                            )} />}

                                      </div>}

                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot10?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >

                                        <SingleBarChart5 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...planneddataset?.plot10.map((it) => it.contribution), ...optimizeddatasetincrement?.map((it) => { return Number(it?.value_contribution) })

                                            ) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...planneddataset?.plot10.map((it) => it.contribution_sales_value / 100000,
                                              ...optimizeddatasetincrement?.map((it) => { return Number(it?.contribution_value / 100000) }))

                                            )
                                          )} />


                                      </div>}
                                      {optimizeddatasetincrement?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart5opAtta optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(...planneddataset?.plot10.map((it) => it.contribution), ...optimizeddatasetincrement?.map((it) => { return Number(it?.value_contribution) })

                                              ) / 100
                                            ) * 100}
                                            maxValuedynamicValue={Math.ceil(
                                              Math.max(...planneddataset?.plot10.map((it) => it.contribution_sales_value / 100000,
                                                ...optimizeddatasetincrement?.map((it) => { return Number(it?.contribution_value / 100000) }))

                                              )
                                            )} /> :
                                          <SingleBarChart5op optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(...planneddataset?.plot10.map((it) => it.contribution), ...optimizeddatasetincrement?.map((it) => { return Number(it?.value_contribution) })

                                              ) / 100
                                            ) * 100}
                                            maxValuedynamicValue={Math.ceil(
                                              Math.max(...planneddataset?.plot10.map((it) => it.contribution_sales_value / 100000,
                                                ...optimizeddatasetincrement?.map((it) => { return Number(it?.contribution_value / 100000) }))

                                              )
                                            )} />}
                                      </div>}
                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot9?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        <SingleBarChart4 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...planneddataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...optimizeddatasetmedia?.map((it) => { return Number(it?.roi) })
                                            ))
                                          } />

                                      </div>}
                                      {optimizeddatasetmedia?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart4opAtta optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={
                                              Math.ceil(Math.max(
                                                ...planneddataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...optimizeddatasetmedia?.map((it) => { return Number(it?.roi) })
                                              ))
                                            } />
                                          :
                                          <SingleBarChart4op optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={
                                              Math.ceil(Math.max(
                                                ...planneddataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...optimizeddatasetmedia?.map((it) => { return Number(it?.roi) })
                                              ))
                                            } />}

                                      </div>}

                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot12?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >

                                        <SingleBarChart7 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...planneddataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...
                                            optimizeddatasetincrement?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable_name))?.map((it) => { return Number(it?.roi) })
                                            ))
                                          } />


                                      </div>}
                                      {optimizeddatasetincrement?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart7opAtta optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={
                                              Math.ceil(Math.max(
                                                ...planneddataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...
                                              optimizeddatasetincrement?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable_name))?.map((it) => { return Number(it?.roi) })
                                              ))
                                            } />
                                          :
                                          <SingleBarChart7op optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={
                                              Math.ceil(Math.max(
                                                ...planneddataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...
                                              optimizeddatasetincrement?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable_name))?.map((it) => { return Number(it?.roi) })
                                              ))
                                            } />}

                                      </div>}

                                    </div>
                                    <div className="row my-3">
                                      {planneddataset?.plot11?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >

                                        <SingleBarChart6 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(
                                              ...
                                              planneddataset?.plot11?.map(it => Number(it?.effectiveness))
                                              ,
                                              ...optimizeddatasetmedia?.map(it => Number(it?.effectiveness))

                                            ) / 10
                                          ) * 10} />


                                      </div>}
                                      {optimizeddatasetmedia?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                                        {displaynames.brand === "ATTA" ?
                                          <SingleBarChart6opAtta optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(
                                                ...
                                                planneddataset?.plot11?.map(it => Number(it?.effectiveness)) ?? []
                                                ,
                                                ...
                                                optimizeddatasetmedia?.map(it => Number(it?.effectiveness)) ?? []

                                              ) / 10
                                            ) * 10} /> :
                                          <SingleBarChart6op optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                            maxValuedynamicVolume={Math.ceil(
                                              Math.max(
                                                ...
                                                planneddataset?.plot11?.map(it => Number(it?.effectiveness)) ?? []
                                                ,
                                                ...
                                                optimizeddatasetmedia?.map(it => Number(it?.effectiveness)) ?? []

                                              ) / 10
                                            ) * 10} />}


                                      </div>}

                                    </div>



                                    <div className="my-1 card p-1">Selected Objective: {displaynames.objective}</div>
                                    <div className="my-3">
                                      <span>Month Wise Filter:</span>
                                      <select className="mx-2"
                                        value={selectedmonth} onChange={(e) => {
                                          setselectedmonth(e.target.value)
                                          if (e.target.value === "All") {

                                            setfilteredplotdata1(summedupvalues)
                                          }
                                          else {
                                            if (plotdata2[0].frequency) {
                                              setfilteredplotdata1(plotdata2?.filter((it) => it?.frequency === e.target.value?.trim()))
                                            }
                                            else {
                                              setfilteredplotdata1(plotdata2?.filter((it) => it?.month_year === e.target.value?.trim()))
                                            }
                                          }
                                        }}>

                                        {uniquemonths?.map((item) => {
                                          return <option>{item}</option>
                                        })}
                                      </select>
                                    </div>

                                    {displaynames.brand === "ATTA" ?
                                      <AfterOptimizationTableAtta filteredplotdata1={filteredplotdata1} />
                                      :
                                      <AfterOptimizationTable filteredplotdata1={filteredplotdata1} corevalue={corevalue} distributionvalue={distributionvalue} distributionvaluecontri={distributionvaluecontri} />
                                    }
                                  </div>}


                              </td>
                            </tr>}
                        </>
                      ))}

                    </tbody>

                  </table>


                </> : <div>There are no records to display!!</div>
            :
            loader ? "..." :
              !resultscreen && <div>
                Master Scenarios Details
                <div className="card p-3">

                  <div className="d-flex justify-content-between">
                    <div >
                      <label>FY:<span className="text-danger">*</span></label>
                      <select className="form-select"
                        placeholder="Select FY"

                        onChange={(e) => {

                          setselectedyear(e.target.value);
                          setselectedbrand2("")
                          setmarket("")
                          setselectedscenarioname("")

                        }}
                        value={selectedyear}
                      >
                        <option>Select</option>
                        {yearoptions?.map((item) => {
                          return <option key={item.fy}>{item.fy}</option>
                        })}
                      </select>
                    </div>
                    <div >

                      <label >Brand:<span className="text-danger">*</span></label>

                      <select
                        value={selectedbrand2}
                        className="form-select"
                        onChange={(e) => { setselectedbrand2(e.target.value); setmarket("Select"); setselectedscenarioname("Select"); }}
                      >
                        <option>Select</option>
                        {brandoptions2?.map((option) => {
                          return <option>{option.brand}</option>;
                        })}
                      </select>
                    </div>
                    <div >
                      <label>Market:<span className="text-danger">*</span></label>
                      <select className="form-select"
                        placeholder="Select market"
                        // options={marketoptions}
                        onChange={(e) => {
                          setmarket(e.target.value);
                          setselectedscenarioname("Select")

                        }}
                        value={market}
                      >
                        <option>Select</option>
                        {marketoptions?.map((item) => {
                          return <option>{item.final_market}</option>
                        })}
                      </select>





                    </div>

                    {<div class="submitfrmtbtn mb-2" type="button" onClick={() => {
                      // fetchdatasettable()
                      handlefetchmasterscenario()
                    }}><span>Fetch Master Scenarios <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                    </div>}



                  </div>
                </div>



              </div>
          }
        </div>
      </div>

      <div>
        <FooterPages />
      </div>
    </>
  )
}

export default SavedReports