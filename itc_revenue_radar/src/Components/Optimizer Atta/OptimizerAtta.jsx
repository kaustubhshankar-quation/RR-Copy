import React from "react";
import { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import Loader from "react-js-loader";
import { useDispatch } from "react-redux";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import Plot from "react-plotly.js";
import getNotification from "../../Redux/Action/action";
import axios from "axios";
import FooterPages from "../Footer/FooterPages";
import Chart from "react-apexcharts";
import Navbar3 from "../Navbars/Navbar3";
import SubNavbar from "../Navbars/SubNavbar";
import LoaderCustom from "../LoaderCustom";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'

import LineChartOptimizer from "./LineChartOptimizer";
import UbLbTable from "./UbLbTable";
import AfterOptimizationTableAtta from "./AfterOptimizationTableAtta";
import SingleBarChart4 from "../Simulator/SingleBarChart4";
import SingleBarChart5 from "../Simulator/SingleBarChart5";
import SingleBarChart6 from "../Simulator/SingleBarChart6";
import SingleBarChart1 from "../Simulator/SingleBarChart1";
import SingleBarChart2 from "../Simulator/SingleBarChart2";
import SingleBarChart3 from "../Simulator/SingleBarChart3";
import PieCharts from "../Simulator/PieCharts";
import SingleBarChart7 from "../Simulator/SingleBarChart7";
import SingleBarChart2opAtta from "./SingleBarChart2opAtta";
import SingleBarChart5opAtta from "./SingleBarChart5opAtta";
import SingleBarChart4opAtta from "./SingleBarChart4opAtta";
import SingleBarChart7opAtta from "./SingleBarChart7opAtta";
import SingleBarChart6opAtta from "./SingleBarChart6opAtta";
import PieChartopAtta from "./PieChartopAtta";
import SingleBarChart1opAtta from "./SingleBarChart1opAtta";

import VariableTableYearlyAtta from "../Simulator Atta/VariableTableYearlyAtta";
import VariableTableAtta from "../Simulator Atta/VariableTableAtta";
const { REACT_APP_REDIRECT_URI } = process.env;
//const { REACT_APP_UPLOAD_DATA } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
function OptimizerAtta() {
   const [savedmasterscenarioname,setsavedmasterscenarioname]=useState("")
  const [percentagegrowthrqd,setpercentagegrowthrqd]=useState(0)
  const [salesno,setsalesno]=useState(0)
  const [salesnooriginalobj3,setsalesnooriginalobj3]=useState(0)
  const [budgetconstraintrequired,setbudgetconstraintrequired]=useState(false)
    const [isprocessing,setisprocessing]=useState(false)
    const [fromrangeonplots,setfromrangeonplots]=useState("")
   const [isValue,setisValue]=useState(false)
  const dispatch = useDispatch();
  const [originaldatasetforcolorcoding,setoriginaldatasetforcolorcoding]=useState([])
  const [summedupvalues, setsummedupvalues] = useState([])
  const [uniquemonths, setuniquemonths] = useState([])
    const [planneddataset, setplanneddataset] = useState([])
    const [optimizeddatasetmedia, setoptimizeddatasetmedia] = useState([])
    const [optimizeddatasetincremental, setoptimizeddatasetincremental] = useState([])
    const [optimizeddatasetincrement, setoptimizeddatasetincrement] = useState([])
    const [first2chartsdata, setfirst2chartsdata] = useState([])
  const [selectedmonth,setselectedmonth]=useState("")
  const [yearoptions, setyearoptions] = useState([])
  const [marketoptions, setmarketoptions] = useState([])
  const [modifybtn, setmodifybtn] = useState(false)
  const [scenariooptions, setscenariooptions] = useState([]);
  const [salestabledata, setsalestabledata] = useState([]);
  const [scenarionewoldscreen, setscenarionewoldscreen] = useState("select");
  const [market, setmarket] = useState("");
  const [loader, setloader] = useState(false);
  const [loader5, setloader5] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [loader4, setloader4] = useState(false);

  const [viewscenariodatatable2, setviewscenariodatatable2] = useState(false)
  const [viewscenariodatatable, setviewscenariodatatable] = useState(false)
  const [newscenariofile, setnewscenariofile] = useState("")
  const [brandoptions, setbrandoptions] = useState([]);
  const [fulldataset2, setfulldataset2] = useState([]);
  const [upperboundlowerboundscreen, setupperboundlowerboundscreen] = useState(false)
  const [totalBudget, settotalBudget] = useState(0)
  const [displaynames, setdisplaynames] = useState({});
  const [displaynames2, setdisplaynames2] = useState({});
  const [edit, setedit] = useState([]);
  const [edit2, setedit2] = useState([]);
  const [selectedzone, setselectedzone] = useState("National")
  const [selectedbrand, setselectedbrand] = useState("ATTA");
  const [selectedscenarioname, setselectedscenarioname] = useState("");
  const [selectedscenarioid, setselectedscenarioid] = useState("");
  const [selectedscenarionametimestamp, setselectedscenarionametimestamp] = useState("");
  const [selectedyear, setselectedyear] = useState("2021-22");
  const [resultscreen, setresultscreen] = useState(false);
  const [resultscreen2, setresultscreen2] = useState(false);
  const [resultscreen3, setresultscreen3] = useState(true);
  const [newscenarionamegiven, setnewscenarionamegiven] = useState("");
  const [sampledataset, setsampledataset] = useState([]);
  const [selectedobjective, setselectedobjective] = useState("");
  const [originalset2, setoriginalset2] = useState([]);

  const [originalset, setoriginalset] = useState([]);
  const [sampledataset2, setsampledataset2] = useState([]);
  const [originalsetublboriginal, setoriginalsetublboriginal] = useState([]);



  const [plotdata1, setplotdata1] = useState([]);
  const [filteredplotdata1, setfilteredplotdata1] = useState([]);
  const [plotdata2, setplotdata2] = useState([]);
const [endDate,setEndDate]=useState("")

const [torangeonplots,settorangeonplots]=useState("")

  const sectionRef = useRef(null);
  useEffect(() => {
    handlevariablesfetchfybrand()
    handlefetchmarket()
    handlevariablesfetch()
    
  }, []);
  // useEffect(() => {
    
  // }, [selectedbrand])
  useEffect(() => {
    handlescenariosfetch()
  }, [market])

  const today1 = new Date();
  const currentYear = today1.getFullYear();
  const currentMonth = today1.getMonth();
 
   let unblockeddate;
   if (currentMonth >= 3) {
    unblockeddate = new Date(currentYear, currentMonth, 1);
  } else {
    const currentmonth15thdate = new Date(today1.getFullYear(), today1.getMonth(), 1);
    const isBefore15th = new Date() < currentmonth15thdate;
     unblockeddate = isBefore15th?new Date(today1.getFullYear(), today1.getMonth()-2, 1):new Date(today1.getFullYear(), today1.getMonth()-2, 1);
    }
  
  const MonthBeforeUnlockMonth = `${unblockeddate.getFullYear()}-${String(unblockeddate.getMonth() + 1).padStart(2, "0")}`;
  const MonthBeforeUnlockMonthreverse = MonthBeforeUnlockMonth.split("-").reverse().join("-");
  const handlevariablesfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        setisprocessing(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        const config = {
          method: "get",
          url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/app/atta_get_date`:`${REACT_APP_UPLOAD_DATA}/app/fetchvars`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse =selectedbrand ? await axios(config) :[];
        if (getResponse.status===200) {

          let inputDate=""
          // selectedbrand==="ATTA"?setStartDate(getResponse.data.start_date?.split("T")[0]):setStartDate(getResponse.data.dates[0].min[0].start_date);
          if(selectedbrand==="ATTA"){
inputDate=getResponse.data.end_date?.split("T")[0]
          }
          else{
inputDate=getResponse.data.dates[0].max[0].end_date
          }

          const [day, month, year] = inputDate.split("-")?.reverse().map(Number);
          const date = new Date(year, month , day); // Month is zero-based in JS Date
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() ).padStart(2, "0")}`;
          setEndDate(formattedDate)
console.log(formattedDate)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setisprocessing(false)
  };
  
  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' }); 
  };
  const fetchlowerupperboundtabledata = () => {
    if (selectedscenarioname && selectedscenarioname !== "Select") {
      setupperboundlowerboundscreen(true)

    }
    else {
      setupperboundlowerboundscreen(false)
    }

  }
    const handlemodifymasterscenarios = async () => {
      if (UserService.isLoggedIn()) {
        try {
  
          setloader5(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          const currenttime = getCurrentFormattedTime()
  
  
          const requestData = {
            fy: selectedyear,
            brand: selectedbrand,
            final_market: market,
            scenario_name: displaynames?.scenario,
            frequency: displaynames?.scenario?.startsWith("M_") ? "M" : displaynames?.scenario.startsWith("Y_") ? "Y" : displaynames?.scenario.startsWith("Q_") ? "Q" : "HY",
            scenario_created_timestamp: displaynames.timestamp,
            updated_by: "admin",
            brand_market_frequency: `${selectedbrand}_${market}_${displaynames?.scenario?.startsWith("M_") ? "M" : displaynames?.scenario.startsWith("Y_") ? "Y" : displaynames?.scenario.startsWith("Q_") ? "Q" : "HY"}`
          };
          const requestData2 = {
            "scenario_name": `${displaynames?.scenario?.startsWith("M_") ? "M" : displaynames?.scenario.startsWith("Y_") ? "Y" : displaynames?.scenario.startsWith("Q_") ? "Q" : "HY"}_Base_NewBase_Scenario`,
            "scenario_timestamp": "2025-01-12 15:54:05",
            "user_id": "admin",
            "model_id": 1,
            "fy": displaynames?.fy,
            "dataset": originalset
            // frequency:row?.scenario?.startsWith("M_")?"M":row?.scenario.startsWith("Y_")?"Y":row?.scenario.startsWith("Q_")?"Q":"HY",
            // scenario_created_timestamp:row.timestamp,
            // updated_by:"admin",
            // brand_market_frequency:`${selectedbrand}_${market}_${row?.scenario?.startsWith("M_")?"M":row?.scenario.startsWith("Y_")?"Y":row?.scenario.startsWith("Q_")?"Q":"HY"}`
  
          };
          const config2 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/api/atta_save_master_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
              // "req-header":UserService.getToken()
            },
            data: requestData2,
          };
  
          const config = {
            method: "post",
            url: displaynames?.scenario?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : displaynames?.scenario.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : displaynames?.scenario.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
              // "req-header":UserService.getToken()
            },
            data: requestData,
          };
          const getResponse = await axios(config);
          // const getResponse2 = await axios(config2);
          if (getResponse.data) {
  
            setsavedmasterscenarioname(getResponse.data.scenario_name)
            //setnewbasescenarioname(getResponse)
            //settotalBudget(budgetfromcell)
  
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
            redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
          });
        }, 1000);
      }
      setloader5(false)
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
  const updatescenario = async (update) => {
    if (UserService.isLoggedIn()) {
      try {
        setisprocessing(true)
        const updatedDataset = [...sampledataset];

        let arr = [];
        setedit(arr);
        const currenttime = getCurrentFormattedTime()
        const requestData2 = {
          scenario_name: displaynames2.scenario,
          user_id: "admin",
          scenario_timestamp: currenttime,
          fy:selectedyear,
          model_id: 1,


        };
        const requestData = {
          scenario_name: displaynames2.scenario,
          scenario_timestamp: currenttime,
          user_id: "admin",
          model_id: 1,
          dataset: originalset,
          fy:selectedyear,
          market:market
        };
        let config={}
let config2={}

        if(sampledataset[0]?.month_data?.length===1){
       config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_update_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };
          config2 = {
            method: "post",
            url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly`:`${REACT_APP_UPLOAD_DATA}/api/save_annual_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData2
          };
        }
        if(sampledataset[0]?.month_data?.length===2){
          config = {
               method: "post",
               url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_update_scenario`,
               headers: {
                 Accept: "text/plain",
                 "Content-Type": "application/json",
               },
               data: requestData
             };
             config2 = {
               method: "post",
               url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly`:`${REACT_APP_UPLOAD_DATA}/api/save_annual_scenario`,
               headers: {
                 Accept: "text/plain",
                 "Content-Type": "application/json",
               },
               data: requestData2
             };
           }
           else if(sampledataset[0]?.month_data?.length===4){
            config = {
                 method: "post",
                 url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_update_scenario`,
                 headers: {
                   Accept: "text/plain",
                   "Content-Type": "application/json",
                 },
                 data: requestData
               };
               config2 = {
                 method: "post",
                 url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly`:`${REACT_APP_UPLOAD_DATA}/api/save_qtr_scenario`,
                 headers: {
                   Accept: "text/plain",
                   "Content-Type": "application/json",
                 },
                 data: requestData2
               };
             }
        else{
       
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_update_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };
      
        }
      
       // const getResponse2 = await axios(config2);
        const getResponse = await axios(config);
        

        if (getResponse.status === 200) {
        console.log(getResponse?.data?.data)
          handlescenariosfetch()
          setresultscreen2(false)
          setmodifybtn(false)
          document.getElementById("closemodal").click()
          setdisplaynames({ ...displaynames, scenario: getResponse?.data?.data, timestamp: currenttime });
          setscenarionewoldscreen('old')
          setselectedscenarioname(`${getResponse?.data?.data}`)
          setselectedscenarionametimestamp(currenttime)
          setdisplaynames2({
            ...displaynames2,
            scenario: `${getResponse?.data?.data}`,
            market: market,
            timestamp: currenttime
          })
          dispatch(
            getNotification({
              message: `Scenario has been saved successfully with name ${getResponse.data?.data}`,
              type: "success",
            })
          );
        }
      }
      catch (err) {
        console.log("Server Error", err);
        if (err.response && err.response.status === 500) {
          if (err.response.data.detail === `scenario name: ${newscenarionamegiven} already present in the DB, please try again with new scenario name`) {
            dispatch(
              getNotification({
                message: "Please provide unique scenario name",
                type: "default",
              })
            );
          }
          else {
            dispatch(
              getNotification({
                message: "There is some server error.Please try again later!",
                type: "default",
              })
            );
          }
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

    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }

    setisprocessing(false)



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
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {

          // setmarketoptions(
          //   getResponse.data.markets
          // );
          setyearoptions(getResponse.data.fy)
          setbrandoptions(
            getResponse.data.brands?.filter(it=>!ExceptionVariables?.brandoptionshide?.includes(it?.brand))
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };
  const handlefetchmarket = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_markets`,
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };

  const handlefetchbudget = async (objective) => {
    if (UserService.isLoggedIn()) {
      try {
        console.log(objective)
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        sendData.append("scenario_name", selectedscenarioname)
        sendData.append("market", market)
        sendData.append("scenario_timestamp",removeTfromtimestamp(selectedscenarionametimestamp))
        const config2 = {
          method: "post",
          url: selectedscenarioname?.startsWith("Y_")?`${REACT_APP_UPLOAD_DATA}/app/atta_get_obj_annual_budget`:`${REACT_APP_UPLOAD_DATA}/app/atta_get_obj_budget
 `,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_budget`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };

      
        if(objective==="Optimize Spends to Maximize Sales" || objective==="Maintain Sales and Minimize Spends"){ 
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };
  const handlemodifybudget = async (budgetfromcell) => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        const currenttime = getCurrentFormattedTime()
          
        const requestData = {
          dataset:[
          {  scenario_name: selectedscenarioname,
            scenario_timestamp: currenttime,
            
            brand:selectedbrand,
           market:market,   
           budget: budgetfromcell}
          ]
          
       
          // budget:totalBudget,
                };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_modify_budget`,
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
              message: "Budget entered is out of range!",
              type: "default",
            })
      
          )
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };
  const handlefetchtotalsalesnoforobjective3 = async (objective) => {
    setloader2(true)
    if (UserService.isLoggedIn()) {   
      if (selectedyear && selectedyear !== "Select" && market && market !== "Select" && selectedscenarioname && selectedscenarioname !== "Select" && selectedbrand && selectedbrand !== "Select") {
        try {      
          setisprocessing(true)
         // setmodifybtn(false)
          
       
          const FormData = require("form-data");
          const sendData = new FormData();
          sendData.append("scenario_name", selectedscenarioname);
          sendData.append("scenario_timestamp", selectedscenarionametimestamp);
          sendData.append("user_id", "admin");
          sendData.append("brand", selectedbrand);
          sendData.append("model_id", 1);
          sendData.append("market", market);
          sendData.append("f_year", selectedyear);
    
         
        
     
          let config1={}
          let config2={}
if(selectedscenarioname?.startsWith("Y_")){
  config1 = {
    method: "post",
    url:`${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_predict`,
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    data: sendData,
  };
 
}
else if(selectedscenarioname?.startsWith("Q_")){
  config1 = {
    method: "post",
    url:`${REACT_APP_UPLOAD_DATA}/app/atta_quartely_scenario_predict`,
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    data: sendData,
  };
 
}
else if(selectedscenarioname?.startsWith("HY_")){
  config1 = {
    method: "post",
    url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_scenario_predict`,
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    data: sendData,
  };

}
else{
           config1 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_predict`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: sendData,
          };}
          const getResponse1 = await axios(config1);
          //const getResponse2 = await axios(config2);
 
          if (getResponse1.data.data) {
 if (getResponse1?.data?.data?.plot1?.length > 0) {
console.log(getResponse1.data.data)
              setsalesno(getResponse1.data.data.total_sales_opt?.total_sales)
              setsalesnooriginalobj3(getResponse1.data.data.total_sales_opt?.total_sales)
 }
             
         
              
                        
           

            }
            else {

              dispatch(
                getNotification({
                  message: "There is no data for selected options",
                  type: "default",
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
        dispatch(
          getNotification({
            message: "Please fill all entries",
            type: "default",
          })
        );
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setisprocessing(false)
    setloader2(false)
  };
  
  const handlemodifytotalsalesobj3 = async (budgetfromcell) => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        const currenttime = getCurrentFormattedTime()
          
        const requestData = {
          dataset:[
          {  scenario_name: selectedscenarioname,
            created_dt: currenttime,
          
            brand:selectedbrand,
            "total_sales": salesnooriginalobj3,
            "expected_sales":salesnooriginalobj3*(budgetfromcell/100+1),
           market:market,   
           }
          ]
          
       
          // budget:totalBudget,
                };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_modify_total_sales_opt`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = await axios(config);
       // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {

      // settotalBudget(budgetfromcell)

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };
  const handlescenariosfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        sendData.append("market", market)
        sendData.append("fy", selectedyear)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_monthly_scenario_name`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = (market !== "Select" && market !== "") ? await axios(config) : [];
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {
          setscenariooptions(getResponse.data?.filter((scenario)=>scenario.scenario_name!=="Base Scenario")?.sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt))?.map((it)=>{
            return {
              label:it.scenario_name,
              value:it.scenario_name,
              created_dt:it.created_dt
            }
          }))
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
  };

  const scrollToSection = (sectionname) => {
    // Replace 'section2' with the id of the section you want to scroll to

    if (document.getElementById(sectionname)) {
      document
        .getElementById(sectionname)
        .scrollIntoView({ behavior: "smooth" });
    } else {
      dispatch(
        getNotification({
          message: "Please proceed with first analysis ",
          type: "Default",
        })
      );
    }
  };
  const fetchdatasettable = async (ifscenariogiven) => {
    
    if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select") {
        try {
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
           sendData.append("scenario_name", selectedscenarioname);
           sendData.append("scenario_timestamp",selectedscenarionametimestamp );
           sendData.append("user_id", "admin");
          sendData.append("market", market);
          sendData.append("brand", selectedbrand)
          sendData.append("fy", selectedyear)
          if (selectedscenarioname === "Base Scenario"  ) {
            if(false){
              config = {
                method: "post",
                url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_annualbasegetscenariodata`:`${REACT_APP_UPLOAD_DATA}/api/annualbasegetscenariodata`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };
            }
            else{
              config = {
                method: "post",
                url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_basegetscenariodata`:`${REACT_APP_UPLOAD_DATA}/api/basegetscenariodata`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };
  
            }
  
             
            }
           
            else{
              if(selectedscenarioname?.startsWith("Y_")){
                config = {
                  method: "post",
                  url:  `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_data`,
                  headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                  },
                  data: sendData,
                };
              }
              else if(selectedscenarioname?.startsWith("Q_")){
            
                config= {
                  method: "post",
                  url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_scenario_data`,
                  headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                  },
                  data: sendData,
                }
              }
              else{
                config = {
                  method: "post",
                  url:  `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_scenario_data`,
                  headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                  },
                  data: sendData,
                };
              }
            
            }

          // Now you can use `config` without any errors
          const getResponse = await axios(config);

          if (getResponse.status === 200) {

            if (getResponse?.data?.data?.length > 0 ) {
              setviewscenariodatatable(true)
              setresultscreen(true)
              ifscenariogiven && setselectedscenarioname(ifscenariogiven)
              setdisplaynames2({
                ...displaynames2,
                brand: selectedbrand,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear,
                timestamp:selectedscenarionametimestamp

              })
        
           
              const digitalAttributes = getResponse?.data?.data
              .filter(item => item.type === "Media" && !item.attribute_name.startsWith("Aashirvaad"))
              .sort((a, b) => {
                // First, sort by media_type
                      
                // If media_type is the same, sort by attribute_name (descending order)
                if (a.attribute_name > b.attribute_name) return -1;
                if (a.attribute_name < b.attribute_name) return 1;
              
                // If attribute_name is the same, sort by subtotal (descending order)
                return b.subtotal - a.subtotal;
              });

              const tvAttributes = getResponse?.data?.data
              .filter(item => item.attribute_name.startsWith("Aashirvaad"))
              .sort((a, b) => b.subtotal - a.subtotal);
          
              // If variable_type is the same, sort by subtotal (descending order)
           

              const otherAttributes = getResponse?.data?.data
  ?.filter(item => !item.attribute_name.startsWith("Aashirvaad") && item.type !== "Media")
  ?.reduce((acc, item) => {
    const group = acc[item.attribute_name] || [];
    group.push(item);
    acc[item.attribute_name] = group;
    return acc;
  }, {}) // Grouping by attribute_name
;


const sortedAttributes = Object.keys(otherAttributes)
  .map(attribute_name => ({
    attribute_name,
    items: otherAttributes[attribute_name]     .sort((a, b) => {
                    const customOrder = ExceptionVariables.customOrder2;
                
                    // Ensure "Distribution" is always on top
                   
                
                    const getIndex = (variableType) => {
                        return customOrder.findIndex(order => variableType.includes(order));
                    };
                
                    let indexA = getIndex(a.prodhierarchy);
                    let indexB = getIndex(b.prodhierarchy);
                
                    // Move elements not found in customOrder to the end
                    if (indexA === -1) indexA = Infinity;
                    if (indexB === -1) indexB = Infinity;
                
                    return indexA - indexB;
                })
             
  }))
  .flatMap(({ items }) => items);
          
                
              const arrangeddataset = [ ...sortedAttributes,...digitalAttributes,...tvAttributes]    
              setsampledataset(arrangeddataset)
              setoriginalset(arrangeddataset);
              setoriginaldatasetforcolorcoding(arrangeddataset)
       
       

            }

            else {
              //console.log(scenariooptions[0].scenario_name)
              //  if (displaynames) {
              //    setselectedbrand(displaynames.brand || brandoptions[0].brand)
              //    setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
              //    setselectedzone(displaynames.zone || 'National')
              //    setselectedyear(displaynames.year || '2021-22')
              //    setselectedscenarioid(displaynames.id || scenariooptions[0].id)
              //  }
              // else{
              //   setselectedscenarioname(scenariooptions[0].scenario_name)
              //   setselectedscenarioid(scenariooptions[0].id)
              //   setselectedbrand(brandoptions[0]?.brand)
              //   setselectedzone('National')
              //   setselectedyear("2021-22")
              // }

              dispatch(
                getNotification({
                  message: `There is no valid data to display for selected brand and scenario combination`,
                  type: "default",
                })

              );
              //handleMouseEnter()
              setresultscreen2(false)
            }


          }
        } catch (err) {
          console.log("Server Error", err);
          // if (displaynames) {
          //   setselectedbrand(displaynames.brand || brandoptions[0].brand)
          //   setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
          //   setselectedyear(displaynames.fy || '2024-25')
          //   setmarket(displaynames.market || "Select")
          // }

          // else{
          //       setselectedscenarioname(scenariooptions[0].scenario_name)
          //       setselectedscenarioid(scenariooptions[0].id)
          //       setselectedbrand(brandoptions[0]?.brand)
          //       setselectedzone('National')
          //       setselectedyear('2021-22')
          // }
          //handleMouseEnter()
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
        dispatch(
          getNotification({
            message: "Please select market to view scenario data!!",
            type: "danger",
          })
        );
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setloader2(false);

    setTimeout(() => {
      scrollToSection("attributetable")

    }, 1000);


  };
  const fetchdatasettable2 = async () => {
    // console.log(selectedyear,market,selectedscenarioname,selectedbrand)
    if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select") {
        try {
          setisprocessing(true)
          setloader5(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
           sendData.append("scenario_name",  selectedscenarioname);
           sendData.append("scenario_timestamp",selectedscenarionametimestamp );
           sendData.append("user_id", "admin");
          sendData.append("market", market);
          sendData.append("brand", selectedbrand)
          sendData.append("fy", selectedyear)


              if(selectedscenarioname?.startsWith("Y_")){
                config= {
                   method: "post",
                   url:  `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_data`,
                   headers: {
                     Accept: "text/plain",
                     "Content-Type": "application/json",
                   },
                   data: sendData,
                 }}
                 else if(selectedscenarioname?.startsWith("Q_")){
            
                  config= {
                    method: "post",
                    url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_scenario_data`,
                    headers: {
                      Accept: "text/plain",
                      "Content-Type": "application/json",
                    },
                    data: sendData,
                  }
                }
              else if(selectedscenarioname?.startsWith("HY_")){
                config= {
                   method: "post",
                   url: selectedbrand === "ATTA"
                     ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`
                     : `${REACT_APP_UPLOAD_DATA}/api/get_qtr_scenario_data`,
                   headers: {
                     Accept: "text/plain",
                     "Content-Type": "application/json",
                   },
                   data: sendData,
                 }
               }
               else{
                config= {
                  method: "post",
                  url: selectedbrand === "ATTA"
                    ? `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_scenario_data`
                    : `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
                  headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                  },
                  data: sendData,
                }
               }
         
        const  getResponse = await axios(config)   

          if (getResponse.status === 200) {

            if (getResponse?.data?.data?.length > 0      ) {
            
              //setcreatefrombaseoruploadfileswitch(false)
              setdisplaynames2({
                ...displaynames2,
                brand: selectedbrand,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear,
                timestamp:selectedscenarionametimestamp

              })
        
          
                        const digitalAttributes = getResponse?.data?.data
                        .filter(item => item.type === "Media" && !item.attribute_name.startsWith("Aashirvaad"))
                        .sort((a, b) => {
                          // First, sort by media_type
                                
                          // If media_type is the same, sort by attribute_name (descending order)
                          if (a.attribute_name > b.attribute_name) return -1;
                          if (a.attribute_name < b.attribute_name) return 1;
                        
                          // If attribute_name is the same, sort by subtotal (descending order)
                          return b.subtotal - a.subtotal;
                        });
          
                        const tvAttributes = getResponse?.data?.data
                        .filter(item => item.attribute_name.startsWith("Aashirvaad"))
                        .sort((a, b) => b.subtotal - a.subtotal);
                    
                        // If variable_type is the same, sort by subtotal (descending order)
                     
          
                        const otherAttributes = getResponse?.data?.data
            ?.filter(item => !item.attribute_name.startsWith("Aashirvaad") && item.type !== "Media")
            ?.reduce((acc, item) => {
              const group = acc[item.attribute_name] || [];
              group.push(item);
              acc[item.attribute_name] = group;
              return acc;
            }, {}) // Grouping by attribute_name
          ;
          
          
          const sortedAttributes = Object.keys(otherAttributes)
            .map(attribute_name => ({
              attribute_name,
              items: otherAttributes[attribute_name]     .sort((a, b) => {
                              const customOrder = ExceptionVariables.customOrder2;
                          
                              // Ensure "Distribution" is always on top
                             
                          
                              const getIndex = (variableType) => {
                                  return customOrder.findIndex(order => variableType.includes(order));
                              };
                          
                              let indexA = getIndex(a.prodhierarchy);
                              let indexB = getIndex(b.prodhierarchy);
                          
                              // Move elements not found in customOrder to the end
                              if (indexA === -1) indexA = Infinity;
                              if (indexB === -1) indexB = Infinity;
                          
                              return indexA - indexB;
                          })
                       
            }))
            .flatMap(({ items }) => items);
                const arrangeddataset = [ ...sortedAttributes,...digitalAttributes,...tvAttributes]    
              setsampledataset(arrangeddataset)
              setoriginalset(arrangeddataset);
              setoriginaldatasetforcolorcoding(arrangeddataset)
       
              setviewscenariodatatable2(true)
     
              setTimeout(() => {
                scrollToSection("attributetable2")
              }, 500)
            }

            else {
              //console.log(scenariooptions[0].scenario_name)
              //  if (displaynames) {
              //    setselectedbrand(displaynames.brand || brandoptions[0].brand)
              //    setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
              //    setselectedzone(displaynames.zone || 'National')
              //    setselectedyear(displaynames.year || '2021-22')
              //    setselectedscenarioid(displaynames.id || scenariooptions[0].id)
              //  }
              // else{
              //   setselectedscenarioname(scenariooptions[0].scenario_name)
              //   setselectedscenarioid(scenariooptions[0].id)
              //   setselectedbrand(brandoptions[0]?.brand)
              //   setselectedzone('National')
              //   setselectedyear("2021-22")
              // }

              dispatch(
                getNotification({
                  message: `There is no valid data to display for selected brand and scenario combination`,
                  type: "default",
                })

              );
              //handleMouseEnter()
              setresultscreen2(false)
            }


          }
        } catch (err) {
          console.log("Server Error", err);
          // if (displaynames) {
          //   setselectedbrand(displaynames.brand || brandoptions[0].brand)
          //   setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
          //   setselectedyear(displaynames.fy || '2024-25')
          //   setmarket(displaynames.market || "Select")
          // }

          // else{
          //       setselectedscenarioname(scenariooptions[0].scenario_name)
          //       setselectedscenarioid(scenariooptions[0].id)
          //       setselectedbrand(brandoptions[0]?.brand)
          //       setselectedzone('National')
          //       setselectedyear('2021-22')
          // }
          //handleMouseEnter()
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
        dispatch(
          getNotification({
            message: "Please select market to view scenario data!!",
            type: "danger",
          })
        );
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setloader5(false);

    setisprocessing(false)
  };
  const fetchublbtable = async (ifscenariogiven) => {
    setupperboundlowerboundscreen(false)  
      if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select") {
        try {
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          // sendData.append("scenario_name",ifscenariogiven?ifscenariogiven:selectedscenarioname);
          // sendData.append("user_id", "admin");
          // sendData.append("market", market);
          console.log(selectedscenarioname)
          sendData.append("brand", selectedbrand)
         sendData.append("scenario_name",ifscenariogiven)
         sendData.append("final_market",market)
          if (ifscenariogiven === "Base Scenario" || selectedscenarioname === "Base Scenario") {
            // sendData.append("fin_year", selectedyear);

            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_constraints`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            };
          } else {

            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_constraints`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            };
          }

          const getResponse = await axios(config);
      
          if (getResponse.status === 200) {

            if (getResponse?.data?.length > 0) {
            
       
              setoriginalset2(
                getResponse?.data?.map((it) => ({
                  ...it,
                  lower_limit: it.lower_limit?.toFixed(1),
                  upper_limit: it.upper_limit?.toFixed(1),
              
                }))
              );
              setsampledataset2(   getResponse?.data?.map((it) => ({
                ...it,
                lower_limit: it.lower_limit?.toFixed(1),
                upper_limit: it.upper_limit?.toFixed(1),
    
              })))
              setoriginalsetublboriginal(   getResponse?.data?.map((it) => ({
                ...it,
                lower_limit: it.lower_limit?.toFixed(1),
                upper_limit: it.upper_limit?.toFixed(1),
    
              })))
              //setsampledataset2(getResponse.data)
              setupperboundlowerboundscreen(true)  
            
            }

            else {
                   
              //console.log(scenariooptions[0].scenario_name)
              //  if (displaynames) {
              //    setselectedbrand(displaynames.brand || brandoptions[0].brand)
              //    setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
              //    setselectedzone(displaynames.zone || 'National')
              //    setselectedyear(displaynames.year || '2021-22')
              //    setselectedscenarioid(displaynames.id || scenariooptions[0].id)
              //  }
              // else{
              //   setselectedscenarioname(scenariooptions[0].scenario_name)
              //   setselectedscenarioid(scenariooptions[0].id)
              //   setselectedbrand(brandoptions[0]?.brand)
              //   setselectedzone('National')
              //   setselectedyear("2021-22")
              // }

              dispatch(
                getNotification({
                  message: `There is no valid data to display for selected brand and scenario combination`,
                  type: "default",
                })

              );
              //handleMouseEnter()
              setresultscreen2(false)
            }


          }
        } catch (err) {
          console.log("Server Error", err);
          // if (displaynames) {
          //   setselectedbrand(displaynames.brand || brandoptions[0].brand)
          //   setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
          //   setselectedyear(displaynames.fy || '2024-25')
          //   setmarket(displaynames.market || "Select")
          // }

          // else{
          //       setselectedscenarioname(scenariooptions[0].scenario_name)
          //       setselectedscenarioid(scenariooptions[0].id)
          //       setselectedbrand(brandoptions[0]?.brand)
          //       setselectedzone('National')
          //       setselectedyear('2021-22')
          // }
          //handleMouseEnter()
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
        dispatch(
          getNotification({
            message: "Please select market to view scenario data!!",
            type: "danger",
          })
        );
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setloader2(false);




  };
  const changesampledataset = (changedValue) => {

    setsampledataset(changedValue)
  }
  const changeoriginalset = (changedValue) => {
    setoriginalset(changedValue)
  }
  const modifyublbtable = async (ifscenariogiven) => {
    if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select") {
        try {
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          const currenttime = getCurrentFormattedTime()
          
        const requestData = {
          scenario_name: selectedscenarioname,
          scenario_timestamp: currenttime,
         market:
         market,
          brand:selectedbrand,
          
          dataset: originalset2,
          budget:totalBudget,
          
        };
          

            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_modify_constraints`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: requestData,
            };
    

          // Now you can use `config` without any errors
          const getResponse = await axios(config);
          //console.log(getResponse)
          if (getResponse.status === 200) {
            dispatch(
              getNotification({
                message: "Bounds updated!!",
                type: "success",
              })
           

            )


          }
        } catch (err) {
          console.log("Server Error", err);
          // if (displaynames) {
          //   setselectedbrand(displaynames.brand || brandoptions[0].brand)
          //   setselectedscenarioname(displaynames.scenarioname || scenariooptions[0].scenario_name)
          //   setselectedyear(displaynames.fy || '2024-25')
          //   setmarket(displaynames.market || "Select")
          // }

          // else{
          //       setselectedscenarioname(scenariooptions[0].scenario_name)
          //       setselectedscenarioid(scenariooptions[0].id)
          //       setselectedbrand(brandoptions[0]?.brand)
          //       setselectedzone('National')
          //       setselectedyear('2021-22')
          // }
          //handleMouseEnter()
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
        dispatch(
          getNotification({
            message: "Please select market to view scenario data!!",
            type: "danger",
          })
        );
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setloader2(false);




  };
 

  const removeTfromtimestamp=(time)=>{

 return time.split("T").join(" ")
  }
  const handleoptimize = async () => {
    modifyublbtable()
    setviewscenariodatatable(false)
    setmodifybtn(false)
    if (UserService.isLoggedIn()) {
    try{
      if(selectedscenarioname && selectedscenarioname!=="Select" && selectedyear && selectedyear !== "Select" && market && market !== "Select" && selectedscenarioname && selectedscenarioname !== "Select" && selectedbrand && selectedbrand !== "Select" && selectedobjective && selectedobjective !== "Select" ){
        try {
          setloader(true)
          const FormData1 = require("form-data");
          const sendData1 = new FormData1();

          const FormData5 = require("form-data");
          const sendData5 = new FormData5();
          sendData5.append("fy", selectedyear)
          sendData5.append("brand_market", `${selectedbrand}_${market}`)

          const config5= {
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
          const getResponse5 = await axios(config5)
      
          let arr = getResponse5?.data?.data
          let arr2 = getResponse5?.data?.data.filter((it) => type === it?.frequency)
          // console.log(arr)
         
          setsavedmasterscenarioname(getResponse5?.data?.data.filter((it) =>it.fy===selectedyear && type === it?.frequency)[0]?.scenerio_name)

          let config1;
          let currenttime=getCurrentFormattedTime()
          const requestData1 = {
            scenario_name: selectedscenarioname,
            scenario_timestamp: removeTfromtimestamp(selectedscenarionametimestamp),
            user_id: "admin",
           
            market: market,
            brand: selectedbrand,
            //dataset1: getResponse1.data,
           
            total_budget: totalBudget,
            mode:selectedobjective

          };
  
          const sendData2 = new FormData();
          sendData2.append("scenario_name", selectedscenarioname);
          sendData2.append("scenario_timestamp", selectedscenarionametimestamp);
          sendData2.append("user_id", "admin");
          sendData2.append("market", market);
          sendData2.append("model_id", 1);
          sendData2.append("brand", selectedbrand);
          sendData2.append("f_year", selectedyear);
          sendData2.append('mode',selectedobjective)
          config1 = {
            method: "post",
            url: selectedscenarioname?.startsWith("Y_")?`${REACT_APP_UPLOAD_DATA}/app/atta_annual_optimize`:selectedscenarioname?.startsWith("Q_")?`${REACT_APP_UPLOAD_DATA}/app/atta_optimize`:`${REACT_APP_UPLOAD_DATA}/app/atta_optimize`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData1,
            timeout: 10 * 60 * 1000,
          };
          const config2 = {
              method: "post",
              url: selectedscenarioname?.startsWith("Y_")?`${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_predict`:selectedscenarioname?.startsWith("Q_")?`${REACT_APP_UPLOAD_DATA}/app/atta_quartely_scenario_predict`:`${REACT_APP_UPLOAD_DATA}/app/atta_monthly_predict`,
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
            
console.log(getResponse1,getResponse2)
        if (getResponse1?.data?.optimized_data?.length > 0) {
          setfulldataset2(getResponse2?.data?.data)
          setsalestabledata(getResponse1?.data?.optimized_sales)
          setplanneddataset(getResponse2?.data?.data)
          setoptimizeddatasetmedia(getResponse1?.data?.df_monthly_media_contributions)
       
          setoptimizeddatasetincrement(getResponse1?.data?.df_monthly_inc_contributions)
          setoptimizeddatasetincremental(getResponse1?.data?.df_monthly_inc_contributions)
          setfirst2chartsdata(getResponse1?.data?.all_variable_monthly_contribution)
          let arr2=[]
       
            settorangeonplots(getResponse2?.data?.data?.plot1[getResponse2?.data?.data?.plot1.length-1]?.month_year?.split("-").reverse()?.join("-"))
  
            let current_month_year=`${new Date().getFullYear()}-${(String(new Date().getMonth()+1).padStart(2,"0"))}`;
            if(getResponse2?.data?.data?.plot1[0]?.month_year>=current_month_year){
              setfromrangeonplots(getResponse2?.data?.data?.plot1[0]?.month_year?.split("-").reverse()?.join("-"))
            }else{
            
              const [year,month] = endDate.split("-");
              const date = new Date(year, month); // Month is zero-based in JS Date
              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() +2).padStart(2, "0")}`;
             
     setfromrangeonplots(formattedDate?.split("-")?.reverse()?.join("-"))
            }
           

            setsummedupvalues(getResponse1?.data?.aggregated_results)
            setmodifybtn(false)
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth() -3; // getMonth() returns 0-indexed month
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
              const categories=getResponse2?.data?.data?.plot1?.map((item) =>
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
        setresultscreen2(true)
        setdisplaynames({
          ...displaynames,
          scenario: selectedscenarioname,
          timestamp:selectedscenarionametimestamp,
          market: market,
          fy: selectedyear,
          brand: selectedbrand,
          objective: selectedobjective,
          totalBudget: totalBudget
        })
        let arr= Array.from(new Set(getResponse1?.data?.optimized_data.map((it)=>it.month_year)))
        arr.push("All")
        setplotdata2(getResponse1?.data?.optimized_data)
        setplotdata1(getResponse1?.data?.optimized_data?.filter((it)=>it.campaign_name==="sales"))
      
        // setfilteredplotdata1(getResponse1?.data?.optimized_data?.filter((it)=>it.month_year===(Array.from(new Set(getResponse1?.data?.optimized_data.map((it)=>it.month_year)))[0])))
        setfilteredplotdata1(getResponse1?.data?.aggregated_results)
        setselectedmonth("All")
        setuniquemonths(arr)

//   setoptions2(
      //     {
      //       labels: ['Core','Media', 'Incremental'],
      //       title: {
      //         text: '',
      //         align: 'center',
      //         style: {
      //           fontWeight: "100",
      //           color: "#43474B"
      //         }
      //       },

      //       plotOptions: {
      //         pie: {
      //           donut: {
      //             size: '20%',
      //           },
      //         },

      //       },
      //       colors: ['#1e81b0', '#f4d03f','#27ae60'],
      //       chart: {
      //         id: `Download-Pie chart`,
      //         type: "pie",
      //         toolbar: {
      //           show: true,
      //         },
      //       },

      //       dataLabels: {
      //         enabled: true,
      //         style: {
      //           fontSize: "10px"
      //         },
      //         formatter: function (val) {
      //           return (val).toFixed(1)
      //         },

      //       },


      //     });

      // setplotdata2([
      //       { name: 'Core', data: getResponse2?.data?.data?.plot2[0]?.total_core_percent },
      //       { name: 'Media', data: getResponse2?.data?.data?.plot2[1]?.total_media_percent},
      //       { name: 'Incremental', data: getResponse2?.data?.data?.plot2[2]?.total_incremental_percent},
      //     ]);
      //     setoptions3(
      //       {
      //         labels: ['Core','Media', 'Incremental'],
      //         title: {
      //           text: '',
      //           align: 'center',
      //           style: {
      //             fontWeight: "100",
      //             color: "#43474B"
      //           }
      //         },
  
      //         plotOptions: {
      //           pie: {
      //             donut: {
      //               size: '20%',
      //             },
      //           },
  
      //         },
      //         colors: ['#1e81b0', '#f4d03f','#27ae60'],
      //         chart: {
      //           id: `Download-Pie chart`,
      //           type: "pie",
      //           toolbar: {
      //             show: true,
      //           },
      //         },
  
      //         dataLabels: {
      //           enabled: true,
      //           style: {
      //             fontSize: "10px"
      //           },
      //           formatter: function (val) {
      //             return (val).toFixed(1)
      //           },
  
      //         },
  
  
      //       });
  
      //   setplotdata3([
      //     { name: 'Core', data: getResponse2?.data?.data?.plot2[0]?.total_core_percent },
      //     { name: 'Media', data: getResponse2?.data?.data?.plot2[1]?.total_media_percent},
      //     { name: 'Incremental', data: getResponse2?.data?.data?.plot2[2]?.total_incremental_percent},
      //   ])
      //   setoptions4(
      //           {
      //             chart: {
      //               id: `Download-Contribution Volume by Variable Type`,
      //               type: "bar",

      //               toolbar: {
      //                 show: true,
      //               },
      //             },
      //             grid: {
      //               show: false
      //             },
      //             title: {
      //               text: ' Contribution Volume (Planned)',
      //               align: 'center',
      //               style: {
      //                 fontWeight: "100",
      //                 color: "#43474B"
      //               },
      //             },
                
      //             colors: ['#0A4742'],
      //             plotOptions: {
      //               bar: {
      //                 dataLabels: {
      //                   position: "top", // Ensures data labels are on top of the bars
      //                 },
      //               },
      //             },
      //             dataLabels: {
      //               enabled: true,
      //               offsetY: -15, // Adjusts the position closer to the top of the bar
      //               style: {
      //                 fontSize: 10, // Adjust font size for readability
      //                 colors: ["black"], // Sets the label color to black
      //               },
      //               formatter: function (val) {
      //                 return (val / 1000).toFixed(0)
      //               },

      //             },
                

      //             xaxis: {
      //               categories: getResponse2?.data?.data?.plot3.map((item, index) => {
      //                 return item?.type

      //               }),
      //               axisBorder: {
      //                 show: true // Ensures X-axis line is visible
      //               },
      //               title: {
      //                 text: '',
      //                 style: { fontWeight: "100" }
      //               },

      //               labels: {
      //                 style: {
      //                   fontWeight: "100",
      //                   fontSize: "11px"
      //                 },


      //                 formatter: function (val) {
      //                   return val
      //                 }
      //               },
      //             },
      //             yaxis: [
      //               {
      //                 seriesName: 'Contribution Volume',
      //                 opposite: false,
      //                 axisBorder: {
      //                   show: true // Ensures Y-axis line is visible
      //                 },

      //                 labels: {
      //                   style: {
      //                     fontWeight: "100",
      //                     fontSize: '9px !important'

      //                   },
      //                   formatter: function (val) {
      //                     return val / 1000
      //                   }
      //                 },
      //                 title: {
      //                   text: "Contribution Qty (Thousand) ",
      //                   showAlways: true,
      //                   floating: true,
      //                   style: {
      //                     fontWeight: "100"
      //                   },

      //                 },
      //               },
      //               ,


      //             ],

      //             annotations: {
      //               yaxis: [{
      //                 y: 0, // Place the annotation at zero
      //                 borderColor: '#939598',
      //                 label: {
      //                   text: '',
      //                   style: {
      //                     color: '#939598',
      //                     background: '#000'
      //                   }
      //                 }
      //               }]
      //             }
      //           });

      //   setplotdata4([
      //           {
      //             name: "Contribution Qty", data: [
      //               getResponse2.data?.data?.plot3[0].total_core,
      //              getResponse2.data?.data?.plot3[1].total_media,
                
      //             getResponse2.data?.data?.plot3[2].total_incremental,
      //             ]
      //           },

      //         ])
      //   setoptions5(
      //           {
      //             chart: {
      //               id: `Download-Contribution Volume by Variable Type`,
      //               type: "bar",

      //               toolbar: {
      //                 show: true,
      //               },
      //             },
      //             grid: {
      //               show: false
      //             },
      //             title: {
      //               text: ' Contribution Volume (Optimized)',
      //               align: 'center',
      //               style: {
      //                 fontWeight: "100",
      //                 color: "#43474B"
      //               },
      //             },
                
      //             colors: ['#0A4742'],
      //             plotOptions: {
      //               bar: {
      //                 dataLabels: {
      //                   position: "top", // Ensures data labels are on top of the bars
      //                 },
      //               },
      //             },
      //             dataLabels: {
      //               enabled: true,
      //               offsetY: -15, // Adjusts the position closer to the top of the bar
      //               style: {
      //                 fontSize: 10, // Adjust font size for readability
      //                 colors: ["black"], // Sets the label color to black
      //               },
      //               formatter: function (val) {
      //                 return (val / 1000).toFixed(0)
      //               },

      //             },
                

      //             xaxis: {
      //               categories: getResponse2?.data?.data?.plot3.map((item, index) => {
      //                 return item?.type

      //               })?.reverse(),
      //               axisBorder: {
      //                 show: true // Ensures X-axis line is visible
      //               },
      //               title: {
      //                 text: '',
      //                 style: { fontWeight: "100" }
      //               },

      //               labels: {
      //                 style: {
      //                   fontWeight: "100",
      //                   fontSize: "11px"
      //                 },


      //                 formatter: function (val) {
      //                   return val
      //                 }
      //               },
      //             },
      //             yaxis: [
      //               {
      //                 seriesName: 'Contribution Volume',
      //                 opposite: false,
      //                 axisBorder: {
      //                   show: true // Ensures Y-axis line is visible
      //                 },

      //                 labels: {
      //                   style: {
      //                     fontWeight: "100",
      //                     fontSize: '9px !important'

      //                   },
      //                   formatter: function (val) {
      //                     return val / 1000
      //                   }
      //                 },
      //                 title: {
      //                   text: "Contribution Qty (Thousand) ",
      //                   showAlways: true,
      //                   floating: true,
      //                   style: {
      //                     fontWeight: "100"
      //                   },

      //                 },
      //               },
      //               ,


      //             ],

      //             annotations: {
      //               yaxis: [{
      //                 y: 0, // Place the annotation at zero
      //                 borderColor: '#939598',
      //                 label: {
      //                   text: '',
      //                   style: {
      //                     color: '#939598',
      //                     background: '#000'
      //                   }
      //                 }
      //               }]
      //             }
      //           });

      //   setplotdata5([
      //           {
      //             name: "Contribution Qty", data: [
      //               getResponse2.data?.data?.plot3[0].total_core,
      //              getResponse2.data?.data?.plot3[1].total_media,
                
      //             getResponse2.data?.data?.plot3[2].total_incremental,
      //             ]
      //           },

      //         ])
      //   setoptions6(
      //           {
      //             chart: {
      //               id: `Download-Contribution by Media Variables`,
      //               type: "bar",

      //               toolbar: {
      //                 show: true,
      //               },
      //             },
      //             grid: {
      //               show: false
      //             },
      //             title: {
      //               text: 'Contribution Qty for Media Variables(Planned)',
      //               align: 'center',
      //               style: {
      //                 fontWeight: "100",

      //               }
      //             },

      //             colors: ['#F79548'],
      //             plotOptions: {
      //               bar: {
      //                 dataLabels: {
      //                   position: "top", // Ensures data labels are on top of the bars
      //                 },
      //               },
      //             },
      //             dataLabels: {
      //               enabled: true,
      //               offsetY: -15, // Adjusts the position closer to the top of the bar
      //               style: {
      //                 fontSize: 10, // Adjust font size for readability
      //                 colors: ["black"], // Sets the label color to black
      //               },},
      //             xaxis: {
      //               categories: getResponse2.data?.data?.plot4.map((item) => { return item?.media_variable }),
      //               title: {
      //                 text: '',
      //                 style: {
      //                   fontWeight: "100"
      //                 },
      //               },

      //               labels: {
      //                 style: {
      //                   fontWeight: "100",
      //                   fontSize: "11px"
      //                 },


      //                 formatter: function (val) {
      //                   return val
      //                 }
      //               },
      //             },
      //             yaxis: [
      //               {
      //                 seriesName: 'Contribution',
      //                 opposite: false,
      //                 axisBorder: {
      //                   show: true // Ensures Y-axis line is visible
      //                 },

      //                 labels: {
      //                   style: {
      //                     fontWeight: "100"

      //                   },
      //                   formatter: function (val) {
      //                     return val
      //                   }
      //                 },
      //                 title: {
      //                   text: "Contribution QTY ",
      //                   showAlways: true,
      //                   floating: true,
      //                   style: {
      //                     fontWeight: "100"
      //                   },

      //                 },

      //               },
      //               ,
      //               // {
      //               //   seriesName: 'Predicted Sales',
      //               //   opposite: true,
      //               //   title: {
      //               //     text: "Predicted Sales",
      //               //     showAlways: true,
      //               //     floating: true, 
      //               //      style:{
      //               //     color:"#FFC107"
      //               //   },

      //               //   },


      //               // },
      //             ],
      //             annotations: {
      //               yaxis: [{
      //                 y: 0, // Place the annotation at zero
      //                 borderColor: '#939598',
      //                 label: {
      //                   text: '',
      //                   style: {
      //                     color: '#939598',
      //                     background: '#000'
      //                   }
      //                 }
      //               }]
      //             }
      //           });
      //   setplotdata6([{ name: "Contribution Percentage", data: getResponse2.data?.data?.plot4.map((it) => { return Number(it?.contribution.toFixed(0)) }) },

      //         ])
      //   setoptions7(
      //           {
      //             chart: {
      //               id: `Download-Contribution by Media Variables`,
      //               type: "bar",

      //               toolbar: {
      //                 show: true,
      //               },
      //             },
      //             grid: {
      //               show: false
      //             },
      //             title: {
      //               text: `Contribution Qty for Media Variables (Optimized)`,
      //               align: 'center',
      //               style: {
      //                 fontWeight: "100",

      //               }
      //             },

      //             colors: ['#F79548'],
      //             plotOptions: {
      //               bar: {
      //                 dataLabels: {
      //                   position: "top", // Ensures data labels are on top of the bars
      //                 },
      //               },
      //             },
      //             dataLabels: {
      //               enabled: true,
      //               offsetY: -15, // Adjusts the position closer to the top of the bar
      //               style: {
      //                 fontSize: 10, // Adjust font size for readability
      //                 colors: ["black"], // Sets the label color to black
      //               },},
      //             xaxis: {
      //               categories: getResponse2.data?.data?.plot4.map((item) => { return item?.media_variable }),
      //               title: {
      //                 text: '',
      //                 style: {
      //                   fontWeight: "100"
      //                 },
      //               },

      //               labels: {
      //                 style: {
      //                   fontWeight: "100",
      //                   fontSize: "11px"
      //                 },


      //                 formatter: function (val) {
      //                   return val
      //                 }
      //               },
      //             },
      //             yaxis: [
      //               {
      //                 seriesName: 'Contribution',
      //                 opposite: false,
      //                 axisBorder: {
      //                   show: true // Ensures Y-axis line is visible
      //                 },

      //                 labels: {
      //                   style: {
      //                     fontWeight: "100"

      //                   },
      //                   formatter: function (val) {
      //                     return val
      //                   }
      //                 },
      //                 title: {
      //                   text: `Contribution QTY`,
      //                   showAlways: true,
      //                   floating: true,
      //                   style: {
      //                     fontWeight: "100"
      //                   },

      //                 },

      //               },
                    
      //               // {
      //               //   seriesName: 'Predicted Sales',
      //               //   opposite: true,
      //               //   title: {
      //               //     text: "Predicted Sales",
      //               //     showAlways: true,
      //               //     floating: true, 
      //               //      style:{
      //               //     color:"#FFC107"
      //               //   },

      //               //   },


      //               // },
      //             ],
      //             annotations: {
      //               yaxis: [{
      //                 y: 0, // Place the annotation at zero
      //                 borderColor: '#939598',
      //                 label: {
      //                   text: '',
      //                   style: {
      //                     color: '#939598',
      //                     background: '#000'
      //                   }
      //                 }
      //               }]
      //             }
      //           });
      //         setplotdata7([{ name: "Contribution", data: getResponse2.data?.data?.plot4.map((it) => { return Number(it?.contribution.toFixed(0)) }) },

      //         ])
      //     
 
      setTimeout(() => {
        scrollToSection("optimizeddata") 
        }, 1000);     
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
          setresultscreen2(false)
          if (err.response && err.response.status === 500) {
            dispatch(
              getNotification({
                message: "Server is Down! Please try again after sometime",
                type: "default",
              })
            );
          }
          else if(err.code === "ECONNABORTED"){
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
      else{
dispatch(getNotification(
  {message:"Please select all entries!!",
    type:"danger"
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }
    setloader(false)
  }

  const savescenario = async (update) => {
    if (UserService.isLoggedIn()) {
      try {

        const updatedDataset = [...sampledataset];
        //console.log(updatedDataset[0].frozen)
        updatedDataset.map((item) => {
          if (item.frozen === 0) {
            if (item.allow_decimal !== 0) {
              item.subtotal = item.month_data.reduce((acc, value) => acc + parseInt(value.attribute_value), 0); // Use parseInt for integer values
            }
          } else {
            item.subtotal = item.month_data.reduce((acc, value) => acc + parseFloat(value.attribute_value), 0); // Use parseFloat for decimal values
          }


        })

        setoriginalset(updatedDataset);
        let arr = [];
        setedit(arr);
        //console.log(formatDate())
        const currentime = getCurrentFormattedTime()
        const requestData = {
          scenario_name: newscenarionamegiven,
          scenario_timestamp: currentime,
          user_id: "admin",
          model_id: 1,
          dataset: originalset,
        };

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/api/savescenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: requestData
        };
        const getResponse = await axios(config);

        if (getResponse.status === 200) {

          document.getElementById("closemodal").click()
          handlescenariosfetch()
          setselectedscenarioname(newscenarionamegiven)
          setselectedscenarionametimestamp(currentime)
          setdisplaynames2({
            ...displaynames2,
            scenario: newscenarionamegiven,
            market: market,
            timestamp: currentime
          })
          dispatch(
            getNotification({
              message: "Scenario has been saved successfully",
              type: "success",
            })
          );
        }


      }
      catch (err) {
        console.log("Server Error", err);
        if (err.response && err.response.status === 500) {
          if (err.response.data.detail === `scenario name: ${newscenarionamegiven} already present in the DB, please try again with new scenario name`) {
            dispatch(
              getNotification({
                message: "Please provide unique scenario name",
                type: "default",
              })
            );
          }
          else {
            dispatch(
              getNotification({
                message: "There is some server error.Please try again later!",
                type: "default",
              })
            );
          }
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

    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attaoptimizer`,
        });
      }, 1000);
    }

    setloader(false)



  };

  // const table2edit=(variableIndex)=>{
  //   const updatedDataset = [...originalset2];
  //   // updatedDataset[variableIndex].total_limit = updatedDataset[
  //   //   variableIndex
  //   // ].upper_limit +updatedDataset[
  //   //   variableIndex
  //   // ].lower_limit
  //   setoriginalset2(updatedDataset);
  // }
  const table2edit = (e, variableIndex, type) => {
    const updatedDataset = [...originalset2];
    const enteredvalue = e.target.value;

    if (type === "lb") {

      if (e.target.value > updatedDataset[variableIndex].upper_limit) {
        updatedDataset[variableIndex].lower_limit = enteredvalue;

        // dispatch(
        //   getNotification({
        //     message: "Entered Lower Bound is greater than upper bound! ",
        //     type: "default",
        //   }))
      }
      else { updatedDataset[variableIndex].lower_limit = enteredvalue; }
    }

    else if (type === "ub") {
      if (e.target.value < updatedDataset[variableIndex].lower_limit) {
        updatedDataset[variableIndex].upper_limit = enteredvalue;
        // dispatch(
        //   getNotification({
        //     message: "Entered Upper Bound is less than lower bound!",
        //     type: "default",
        //   }))
      }
      else { updatedDataset[variableIndex].upper_limit = enteredvalue; }

    }

    else { updatedDataset[variableIndex].total_limit = enteredvalue; }
    //updatedDataset[variableIndex].total_limit=updatedDataset[variableIndex].lower_limit+updatedDataset[variableIndex].upper_limit || 0;
    setoriginalset2(updatedDataset)
  }
  const handlesampledataset2change=(ublbsample)=>{
    setsampledataset2(ublbsample)
  }
  const handleoriginaldataset2change=(ublboriginal)=>{
    setoriginalset2(ublboriginal)
  }
  return (
    <>
      <div
        class="modal "
        id="exampleModal1"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div className="modal-content">
            <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
              <h6 class="modal-title" id="exampleModalLabel">
                Save Scenario
              </h6>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                id="closemodal"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label className="">Please enter Scenario Name: </label>
              <input
                type="text"
                id="scenarionamebox"
                className="form-control"
                value={newscenarionamegiven}
                onChange={(e) => setnewscenarionamegiven(e.target.value)}
              />

              <br />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary btn-sm p-1"
                data-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                class="mt-2 btngreentheme btn-sm"
                onClick={() => {
                  if (newscenarionamegiven === "" || newscenarionamegiven === "Base Scenario") {
                    document.getElementById("scenarionamebox").focus();
                  } else {
                    savescenario();

                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar3 />
      <SubNavbar />
      <div className="bgpages">
        <div className=' mx-5 py-3'>
          <div className='greentheme '>{`Dashboard >> Optimized Spends`}</div>

          <div className='p-2 bg-white greentheme my-3 d-flex justify-content-between' style={{ fontSize: "20px" }}>
            <b>Optimized Spends</b>
            {resultscreen2 && <div><button className="btn btn-danger  mx-1 my-auto" onClick={() => {
              setselectedscenarioname(""); setselectedyear(""); setresultscreen(false); setresultscreen2(false); setmarket(""); setselectedbrand("ATTA"); setscenarionewoldscreen("Select"); setoriginalset([]); setsampledataset([]); setmodifybtn(false)
              setselectedobjective(""); settotalBudget(0);
              setsampledataset2([]); setoriginalset2([]);
              setresultscreen2(false)
              setupperboundlowerboundscreen(false)
            }}>Reset</button>
              <button className="btn btn-dark " onClick={() => setmodifybtn(!modifybtn)}>Modify</button></div>}
          </div>
          {modifybtn && <>

            <div className="card p-5 my-2 ">

              <div className="d-flex justify-content-between  "  >

                <div className="my-2">
                  <label>FY:<span className="text-danger">*</span></label>
                  <select className="form-select"
                    placeholder="Select FY"

                    onChange={(e) => {
                      setselectedbrand("ATTA")
                      setselectedyear(e.target.value);
setupperboundlowerboundscreen(false)
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

                {/* <div className="my-2">
                  <label>Brand:<span className="text-danger">*</span></label>

                  <select

                    value={selectedbrand}
                    className="form-select "
                    onChange={(e) => { setselectedbrand(e.target.value); setmarket("Select"); setselectedscenarioname("Select"); setviewscenariodatatable(false) }}
                  >
                    <option>Select</option>
                    {brandoptions?.map((option) => {
                      return <option>{option.brand}</option>;
                    })}

                  </select>
                </div> */}
                <div className="my-2">
                  <label>Market:<span className="text-danger">*</span></label>
                  <select className="form-select"
                    placeholder="Select market"
                    onChange={(e) => {
                      setmarket(e.target.value);
                      setselectedscenarioname("Select")
                      setviewscenariodatatable(false)
                      setresultscreen2(false)
                      setmodifybtn(false)
                    }}
                    value={market}
                  >
                    <option>Select</option>
                    {marketoptions?.map((item) => {
                      return <option>{item?.final_market}</option>
                    })}
                  </select>





                </div>
                <div className="my-2">
                  <label>Scenario:<span className="text-danger">*</span></label>
                  <Select 
                              placeholder="Select Scenario Name"
                              options={scenariooptions}
                              value={selectedscenarioname ? { label: selectedscenarioname, value: selectedscenarioname } : null}
                              onChange={(value) => {
                                setoriginalset2([])
                                setsampledataset2([])
                                settotalBudget(0)
                                setselectedobjective("Select")
                                setviewscenariodatatable(false)
                                setselectedscenarioname(value.value);
                                //let arr = scenariooptions.filter((it) => { return e.target.value === it.scenario_name })
                                setselectedscenarionametimestamp(value?.created_dt);
                                setmodifybtn(false)
                                setresultscreen2(false)
                                if( value ){
                                  fetchublbtable(value.value)
                                  
                                 }
                                 else{
                                  setupperboundlowerboundscreen(false)
                                 }
                              
                                        }}
                            className="selectboxwidth"/>
          
                  {/* <select
                    className="form-select"
                    value={selectedscenarioname}
                    onChange={(e) => {
                      setoriginalset2([])
                      setsampledataset2([])
                     settotalBudget(0)
                      setselectedobjective("Select")
                      setviewscenariodatatable(false)
                      setselectedscenarioname(e.target.value);
                      let arr = scenariooptions?.filter((it) => { return e.target.value === it.scenario_name })
                      setselectedscenarionametimestamp(arr[0]?.created_dt);
                      
                     if( e.target.value==="Select" ){
                      setupperboundlowerboundscreen(false)
                     }
                     else{
                      fetchublbtable(e.target.value)
                     }
                   
                    }}
                  >
                    <option>Select</option>
                    {scenariooptions?.filter(scenario=>scenario.scenario_name!=="Base Scenario")?.map((option) => {
                      return (
                        <option

                        >
                          {option.scenario_name}
                        </option>
                      );
                    })}
                  </select> */}
                  {loader5 && <div>Loading...</div>}
                  {selectedscenarioname && selectedscenarioname !== "Select" &&
                    <button className=" btngreentheme my-2 p-2" onClick={() => {
                      if (viewscenariodatatable2) {
                        setviewscenariodatatable2(false)
                      }
                      else { fetchdatasettable2(); }
                    }}>
                      {!viewscenariodatatable2 ? "View Scenario Data" : "Hide"}
                    </button>}
                </div>
                <div>

                </div>

              </div>
{/* <div className="d-flex flex-row-reverse">
<button className="btngreentheme p-2 my-1" onClick={()=>modifyublbtable()}>Update Table</button>

</div>             */}
{upperboundlowerboundscreen && <>
<UbLbTable sampledataset2={sampledataset2} originalset2={originalset2} handleoriginaldataset2change={handleoriginaldataset2change} handlesampledataset2change={handlesampledataset2change} originalsetublboriginal={originalsetublboriginal}/>
          
<div className="  ">
                      <div className=" col-sm">
                        <span className="" >  Objective</span>
                        <select className="  form-select rounded my-2 p-2" value={selectedobjective} onChange={(e) => { 
                          setselectedobjective(e.target.value) 
                          handlefetchbudget(e.target.value)
                          setsalesno(0)
                          setpercentagegrowthrqd(0)
                          setbudgetconstraintrequired(false)
                          e.target.value==="Achieve Percentage growth with optimized spends" && handlefetchtotalsalesnoforobjective3()
                                           
                        }}>
                    <option>Select</option>
                    <option>Optimize Spends to Maximize Sales</option>
                    <option>Maintain Sales and Minimize Spends</option>
                    { !selectedscenarioname?.startsWith("M") && <option>Achieve Percentage growth with optimized spends</option>}

                  
                  </select>
                      </div>
                      {selectedobjective!=="Achieve Percentage growth with optimized spends" && 
                      <div className="col-sm"><span>
                      Overall Marketing Budget:
                    </span>
                    {
                      (selectedobjective==="Maintain Sales and Minimize Spends" || selectedobjective==="Optimize Spends to Maximize Sales")?
                      <div>Rs {totalBudget?.toLocaleString("en-IN")}</div>:
                      <input  className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) =>{settotalBudget(e.target.value);handlemodifybudget(e.target.value) }}/>
                    
                    }
                  {}
                      {/* //  handlemodifybudget(e.target.value)}  */}

                      {/* <input className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) => settotalBudget(e.target.value)} /> */}
                    </div>}
                    {selectedobjective==="Achieve Percentage growth with optimized spends" && 
                    (loader2?<div className="mx-3">Loading...</div>:
                     <>
                      <div className="row my-3">
                        <div className="col-sm">

                      Target Percentage Growth( % ):
                      <input
                    className="p-1 my-auto mx-2"
             type="number"
                    placeholder="% increase/decrease"
                    value={percentagegrowthrqd}
                    min={0}
                    onChange={(e) => {
                      if(e.target.value>=0){
                        setpercentagegrowthrqd(e.target.value)
                        handlemodifytotalsalesobj3(e.target.value)}
                      
                      else{
                        setpercentagegrowthrqd(0)}
                    }}
                    style={{ fontSize: "0.7rem" }}
                  />
                    </div>
                    <div className="col-sm">
                    <div>Total Sales:  {(salesnooriginalobj3*(percentagegrowthrqd/100+1)/1000)?.toFixed(2)} Tonnes </div>
                      </div>
                   <span>
                
                    
                      </span>
                  
                      {/* //  handlemodifybudget(e.target.value)}  */}

                      {/* <input className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) => settotalBudget(e.target.value)} /> */}
                    </div>
                    {/* <div className="d-flex">
                      <div className="mx-1">Want to specify the budget constraint?</div>
<div className="mx-2"><input type="radio" checked={budgetconstraintrequired} name="budgetconstraintrequired" value="Yes" onClick={(e)=>setbudgetconstraintrequired(true)}></input><label className="mx-1">Yes</label></div>
<div className="mx-2"><input type="radio" checked={!budgetconstraintrequired} name="budgetconstraintrequired" value="No" onClick={(e)=>setbudgetconstraintrequired(false)}></input><label className="mx-1">No</label></div>
                      </div> */}
                      {budgetconstraintrequired &&  <div className="d-flex"><span className="my-auto mx-2">Rs</span>  <input  className="form-control rounded my-2 p-2 w-50"  value={totalBudget ? Number(totalBudget).toLocaleString("en-IN") : 0}
                      onChange={(e) =>{
                      const rawValue = e.target.value.replace(/,/g, "") || 0;
                      
  if (!isNaN(rawValue) && rawValue!=="" ) {
    
    handlemodifybudget(rawValue);
  }
                     }}/></div>
                    } 
                      
                      </>)}

                      <div class="submitfrmtbtn mb-2"  >
                        <span disabled={isprocessing} 
                           style={{ cursor: isprocessing ? "not-allowed" : "pointer" }} 
                           onClick={() => {
                        // fetchdatasettable()
                        handleoptimize()
                      }}>Optimize <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span></div>
                    </div>
              </>}
            </div>
            {viewscenariodatatable2 && <div className="my-2 " id="attributetable2">
              <div className="d-flex flex-row-reverse ">
                {/*                     
                    <button className="btngreentheme my-2 p-2 mx-1"  data-toggle={false && "modal"}
                            data-target="#exampleModal1"    onClick={handleButtonClick}>
                      Import
                      </button>
                      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUploadoldscenario}
      />
                      <button className="btngreentheme my-2 p-2 mx-1"  data-toggle={false && "modal"}
                            data-target="#exampleModal1" onClick={()=>{handleexportoldscenarios()}}>
                      Export
                      </button> */}
                <button className="btngreentheme my-2 p-2 mx-1" data-toggle={displaynames2.scenario === "Base Scenario" && "modal"}
                  data-target="#exampleModal1" onClick={() => { displaynames2.scenario !== "Base Scenario" && updatescenario() }}>
                  {displaynames2.scenario === "Base Scenario" ? "Save Scenario" : "Update Scenario"}
                </button>
              </div>
              {sampledataset[0]?.month_data?.length===1 ?
                <VariableTableYearlyAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding}/>
:
                <VariableTableAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} endDate={endDate}/>
                }
            </div>}
          </>}
          <div className="" >
            {loader ? (
              <div
                className="row d-flex  justify-content-center align-items-center "
                style={{ height: "60vh" }}
              >
                <LoaderCustom text="Optimizing..." />
              </div>
            ) : resultscreen2 ?
              <>
                <div className="card p-3 ">

                  <div className="d-flex justify-content-between"  >

                    <div className="">
                      <label>FY:<span className="text-danger">*</span></label>
                      <span>{displaynames.fy}</span>
                    </div>

                    <div className="">
                      <label>Brand:<span className="text-danger">*</span></label>

                      <span>{displaynames.brand}</span>
                    </div>
                    <div className="">
                      <label>Market:<span className="text-danger">*</span></label>
                      <span>{displaynames.market}</span>
                    </div>
                    <div className="">
                      <label>Scenario:<span className="text-danger">*</span></label>
                      <span>{displaynames.scenario}</span>
                    </div>
                    <div className="">
                               <button onClick={()=>{if(displaynames.scenario===savedmasterscenarioname){}
        else{
          handlemodifymasterscenarios(displaynames)
        }
        } }
        className={displaynames.scenario===savedmasterscenarioname?"btn text-success mx-1":"btn btn-sm btn-secondary mx-1"}>
          {displaynames.scenario===savedmasterscenarioname?<b>Master</b>:"Set as Master"}
          
        </button> 
                                </div>
                  </div>
                </div>
                <div className=" text-light bg-secondary p-2 mt-3" id="optimizeddata">Optimized Data</div>
                {/* <button className="btngreentheme p-2 " onClick={()=>setisValue(!isValue)}>{isValue?"By Volume":"By Value"}</button> */}
                {plotdata1?.length>0  && !displaynames.scenario.startsWith("Y_") &&      <div className="card my-3 p-2 container">
              <LineChartOptimizer fulldataset1={plotdata1} fulldataset2={fulldataset2} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} endDate={endDate}/>
              </div>}
              <div className="row my-3">
                          {planneddataset?.plot2?.length > 0 && 
                                    <div className="card col-sm mx-1 p-3" id="" >
    
                              <PieCharts isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} fulldataset={planneddataset} type={"Planned Scenario"} displaynames={displaynames}/>
                         
                            </div>
                          }
                    {first2chartsdata?.length > 0 &&        <div className="card col-sm mx-1 p-3" id="" >
                             
                               
                                
                                <PieChartopAtta isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} first2chartsdata={first2chartsdata} type={"Optimized"}/>
                               
                              

                            </div>}

                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot3?.length > 0 &&           <div className="card col-sm mx-1 p-3" id="" >
                              
                               <SingleBarChart1 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} 
                                  maxValuedynamicVolume={Math.ceil(Math.max(...[
                                planneddataset?.plot3[0].total_core / 1000,
                                planneddataset?.plot3[1].total_incremental / 1000,
                                planneddataset?.plot3[2].total_media / 1000,
                              ...first2chartsdata?.map((it)=>Number(it.optimized_contribution/1000))
                              ])/100)*100}
                               maxValuedynamicValue={Math.ceil(Math.max(...[
                                planneddataset?.plot3[0].total_core_sales / 100000,
                                planneddataset?.plot3[1].total_incremental_sales / 100000,
                                planneddataset?.plot3[2].total_media_sales / 100000,
                                ...first2chartsdata?.map((it)=>Number(it.optimized_contribution/1000))
                              ]) /100)*100
                                }/>

                                

                            </div>}
                            {first2chartsdata?.length > 0 &&   <div className="card col-sm mx-1 p-3" id="" >
                              
                                  <SingleBarChart1opAtta first2chartsdata={first2chartsdata} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                           maxValuedynamicVolume={Math.ceil(Math.max(...[
                            planneddataset?.plot3[0].total_core / 1000,
                            planneddataset?.plot3[1].total_incremental / 1000,
                            planneddataset?.plot3[2].total_media / 1000,
                          ...first2chartsdata?.map((it)=>Number(it.optimized_contribution/1000))
                          ])/100)*100}
                           maxValuedynamicValue={Math.ceil(Math.max(...[
                            planneddataset?.plot3[0].total_core_sales / 100000,
                            planneddataset?.plot3[1].total_incremental_sales / 100000,
                            planneddataset?.plot3[2].total_media_sales / 100000,
                            ...first2chartsdata?.map((it)=>Number(it.optimized_contribution/1000))
                          ]) /100)*100
                            }     
                            />

                            </div>}
                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot4?.length > 0 &&          <div className="card col-sm mx-1 p-3" id="" >
                           
                                <SingleBarChart2 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                    maxValuedynamicVolume={Math.ceil(
                                      Math.max(...planneddataset?.plot4.map((it) => it.contribution),...optimizeddatasetmedia?.map((it) => { return Number(it?.optimized_contribution) })  
                                      ) / 100
                                    ) * 100   } 
                                    maxValuedynamicValue={Math.ceil(
                                      Math.max(...planneddataset?.plot4.map((it) => it.contribution_sales_value/100000)     ,...optimizeddatasetmedia?.map((it) => { return Number(it?.optimized_contribution) }) 
                                      ) / 100
                                    ) * 100 }/>
                                
                            </div>}
                            {optimizeddatasetmedia?.length > 0 &&           <div className="card col-sm mx-1 p-3" id="" >
                           
                                <SingleBarChart2opAtta  optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                maxValuedynamicVolume={Math.ceil(
                                  Math.max(...planneddataset?.plot4.map((it) => it.contribution),...optimizeddatasetmedia?.map((it) => { return Number(it?.optimized_contribution) })  
                                  ) / 100
                                ) * 100   } 
                                maxValuedynamicValue={Math.ceil(
                                  Math.max(...planneddataset?.plot4.map((it) => it.contribution_sales_value/100000),...optimizeddatasetmedia?.map((it) => { return Number(it?.optimized_contribution) }) 
                                  ) / 100
                                ) * 100 }/>
                                
                            </div>}

                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot10?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart5 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={Math.ceil(
                                  Math.max(...planneddataset?.plot10.map((it) => it.contribution),...optimizeddatasetincrement?.map((it) => { return Number(it?.optimized_contribution) }) 
                                   
                                  ) / 100
                                ) * 100   } 
                                maxValuedynamicValue={Math.ceil(
                                  Math.max(...planneddataset?.plot10.map((it) => it.contribution_sales_value/100000,
                                  ...optimizeddatasetincrement?.map((it) => { return Number(it?.optimized_contribution/100000) }) )
                                   
                                  ) / 100
                                ) * 100 }/>
                                
                             
                            </div>}
                            {optimizeddatasetincrement?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart5opAtta optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={Math.ceil(
                                  Math.max(...planneddataset?.plot10.map((it) => it.contribution),...optimizeddatasetincrement?.map((it) => { return Number(it?.optimized_contribution) }) 
                                   
                                  ) / 100
                                ) * 100   } 
                                maxValuedynamicValue={Math.ceil(
                                  Math.max(...planneddataset?.plot10.map((it) => it.contribution_sales_value/100000,
                                  ...optimizeddatasetincrement?.map((it) => { return Number(it?.optimized_contribution/100000) }) )
                                   
                                  ) / 100
                                ) * 100 }/>
                           </div> }
                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot9?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                                <SingleBarChart4 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...planneddataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)}),...optimizeddatasetmedia?.map((it) => { return Number(it?.roi)})
                                  ))
                                }/>
                          
                            </div>}
                            {optimizeddatasetmedia?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart4opAtta optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...planneddataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)}),...optimizeddatasetmedia?.map((it) => { return Number(it?.roi)})
                                  ))
                                }/>
                          
  
                         </div> }

                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot12?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart7 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                       maxValuedynamicVolume={
                                        Math.ceil(Math.max(
                                          ...planneddataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)}),...
                                          optimizeddatasetincrement?.map((it) => { return Number(it?.roi)})
                                        ))
                                      }/>
                                
                             
                            </div>}
                            {optimizeddatasetincrement?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart7opAtta optimizeddatasetincrement={optimizeddatasetincrement} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...planneddataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)}),...
                                    optimizeddatasetincrement?.map((it) => { return Number(it?.roi)})
                                  ))
                                }/>
                          
  
                         </div> }

                          </div>
                          <div className="row my-3">
                          {planneddataset?.plot11?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                       
                                <SingleBarChart6 fulldataset={planneddataset} type={"Planned Scenario"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                maxValuedynamicVolume={Math.ceil(
                                  Math.max(
                                    ...
                                      planneddataset?.plot11?.map(it => Number(it?.effectiveness)) 
                                    ,
                                    ... optimizeddatasetmedia?.map(it => Number(it?.effectiveness)) 
                                    
                                  ) / 10
                                ) * 10}/>
                                
                             
                            </div>}
                            {optimizeddatasetmedia?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart6opAtta optimizeddatasetmedia={optimizeddatasetmedia} type={"Optimized"} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={Math.ceil(
                                  Math.max(
                                    ...
                                      planneddataset?.plot11?.map(it => Number(it?.effectiveness)) ?? []
                                    ,
                                    ...
                                      optimizeddatasetmedia?.map(it => Number(it?.effectiveness)) ?? []
                                    
                                  ) / 10
                                ) * 10}/>
                          
  
                         </div> }

                          </div>
                      
                      
                     
                      
                          <div className="my-1 card p-1">Selected Objective: {displaynames.objective}</div>     
                         
<div className="my-3">
  <span>Month Wise Filter:</span>
  <select className="mx-2" 
  value={selectedmonth} onChange={(e)=>{
    setselectedmonth(e.target.value)
      if(e.target.value==="All"){
    
      setfilteredplotdata1(summedupvalues)
    }
    else{
      if(plotdata2[0].frequency){
        setfilteredplotdata1(plotdata2?.filter((it)=>it?.frequency===e.target.value?.trim()))
      }
      else{
        setfilteredplotdata1(plotdata2?.filter((it)=>it?.month_year ===e.target.value?.trim()))
      }
      }
  }}>

{uniquemonths?.map((item)=>{
  return <option>{item}</option>
})}
  </select>
</div>

<AfterOptimizationTableAtta filteredplotdata1={filteredplotdata1}/>
                
    
     
                {/* <div className="row my-3">
                          <div className="card col-sm mx-1 p-3" id="" >
                            <div className="mx-2">Contribution Percentage (Planned)</div>
                                  {plotdata2.length > 0 && (
                              <Chart
                                className="my-auto"
                                align="center"
                                type="donut"
                                height={300}
                                options={options2}
                                series={plotdata2.map((item) => item.data)}
                              />
                            )}
                            </div> 
                             <div className="card col-sm mx-1 p-3" id="" >
                             <div className="mx-2">Contribution Percentage (Optimized)</div>
                           {plotdata3.length > 0 && (
                              <Chart
                                className="my-auto"
                                align="center"
                                type="donut"
                                height={300}
                                options={options3}
                                series={plotdata3.map((item) => item.data)}
                              />
                            )}

                          </div>
                          
                       </div>
                       <div className="row my-3">
                          <div className="card col-sm mx-1 p-3" id="" >
                          {plotdata4.length>0 &&
                          <Chart
                              align="center"
                              options={options4}
                              series={plotdata4}
                              type="bar"
                              height={400}
                              width={'90%'}
                            />}

                          </div>
                          <div className="card col-sm mx-1 p-3" id="" >
                          {plotdata5.length>0 &&
                   <Chart
                       align="center"
                       options={options5}
                       series={plotdata5}
                       type="bar"
                       height={400}
                       width={'90%'}
                     />}

                   </div>
                          </div>
                       <div className="row my-3">
                          <div className="card col-sm mx-1 p-3" id="" >
                          {plotdata6.length>0 &&
 <Chart
                              align="center"
                              options={options6}
                              series={plotdata6}
                              type="bar"
                              height={400}
                              width={'90%'}
                            />}
                        </div>
                        <div className="card col-sm mx-1 p-3" id="" >
                        {plotdata7.length>0 && 
  <Chart
                               align="center"
                               options={options7}
                               series={plotdata7}
                               type="bar"
                               height={400}
                               width={'90%'}
                             />}
                         </div>

</div>           */}
                
                <div className="">
                  <div className="" id="">
                    {resultscreen2 &&
                      <div className=" my-2">
                        <div id="collapseTwo" className="accordion-collapse show" aria-labelledby="headingTwo" >
                          <div className="accordion-body">
                            {
                              loader ?
                                <div
                                  className="d-flex  justify-content-center align-items-center "
                                  style={{ height: "10vh" }}
                                >
                                  <Loader
                                    type="box-rectangular"
                                    bgColor={"#0A4742"}
                                    title={"Fetching data..."}
                                    color={"#0A4742"}
                                    size={75}
                                  /></div> :

                                <div>

                                </div>}
                          </div>
                        </div>


                      </div>}
                  </div>
                </div>

              </> :

              <>
                {brandoptions?.length > 0 ?
                  <>
                    <div className="card p-3">
                      <div>Brand: ATTA</div>
                      <div className="d-flex justify-content-between p-2">

                        <div className="my-2">
                          <label>FY:<span className="text-danger">*</span></label>
                          <select className="form-select"
                            placeholder="Select FY"

                            onChange={(e) => {
                              setselectedbrand("ATTA")
                              setselectedyear(e.target.value);
        setupperboundlowerboundscreen(false)
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
                        {/* <div className="my-2">

                          <label >Brand:<span className="text-danger">*</span></label>

                          <select
                            value={selectedbrand}
                            className="form-select"
                            onChange={(e) => { setselectedbrand(e.target.value); setmarket("Select"); setselectedscenarioname("Select"); setviewscenariodatatable(false) }}

                          >
                            <option>Select</option>
                            {brandoptions?.map((option) => {
                              return <option>{option.brand}</option>;
                            })}
                          </select>
                        </div> */}

                        <div className="my-2">
                          <label>Market:<span className="text-danger">*</span></label>
                          <select className="form-select"
                            placeholder="Select market"
                            // options={marketoptions}
                            onChange={(e) => {
                              setmarket(e.target.value);
                              setselectedscenarioname("Select")
                              setviewscenariodatatable(false)
                            }}
                            value={market}
                          >
                            <option>Select</option>
                            {marketoptions?.map((item) => {
                              return <option>{item.final_market}</option>
                            })}
                          </select>





                        </div>
                        <div className="my-2">
                          <label>Scenario:<span className="text-danger">*</span></label>
                          <Select 
                           
                              placeholder="Select Scenario Name"
                              options={scenariooptions}
                              value={selectedscenarioname ? { label: selectedscenarioname, value: selectedscenarioname } : null}
                              onChange={(value) => {
                                setoriginalset2([])
                                setsampledataset2([])
                               settotalBudget(0)
                                setselectedobjective("Select")
                                setviewscenariodatatable(false)
                                setselectedscenarioname(value.value);
                               // let arr = scenariooptions?.filter((it) => { return e.target.value === it.scenario_name })
                                setselectedscenarionametimestamp(value?.created_dt);

                                                              
                                if( value ){
                                  fetchublbtable(value.value)
                                  
                                 }
                                 else{
                                  setupperboundlowerboundscreen(false)
                                 }
                              
                                        }}
                                        className="selectboxwidth"/>
                          {/* <select
                            value={selectedscenarioname}
                            className="form-select "
                            onChange={(e) => {
                              setoriginalset2([])
                              setsampledataset2([])
                       settotalBudget(0)
                              setselectedobjective("Select")
                              setviewscenariodatatable(false)
                              setselectedscenarioname(e.target.value);
                              let arr = scenariooptions.filter((it) => { return e.target.value === it.scenario_name })
                              setselectedscenarionametimestamp(arr[0]?.created_dt);
                              
                              if( e.target.value==="Select" ){
                                setupperboundlowerboundscreen(false)
                               }
                               else{
                                fetchublbtable(e.target.value)
                               }

                            }}
                          >
                            <option>Select</option>

                            {scenariooptions?.filter(scenario=>scenario.scenario_name!=="Base Scenario")?.map((option) => {
                              return (
                                <option
                                  value={option.scenario_name}
                                >
                                  {option.scenario_name}
                                </option>
                              );
                            })}
                          </select> */}
                          {loader2 && <div>Loading...</div>}
                          {(selectedscenarioname !== "" && selectedscenarioname !== "Select") &&
                            <button className=" btngreentheme my-2 p-2" onClick={() => {
                              if (viewscenariodatatable) {
                                setviewscenariodatatable(false)
                              }
                              else { fetchdatasettable(); }
                            }}>
                              {!viewscenariodatatable ? "View Scenario Data" : "Hide"}
                            </button>}

                        </div>
                      </div>
                     
                    </div>


                  </>

                  : "Loading..."}

                {!viewscenariodatatable ?
                  ""
                  :

                  <div className=" " id="attributetable">
                    <div className="d-flex flex-row-reverse ">

                      {/* <button className="btngreentheme my-2 p-2 mx-1"  data-toggle={false && "modal"}
                            data-target="#exampleModal1"    onClick={handleButtonClick}>
                      Import
                      </button>
                      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUploadoldscenario}
      />
                      <button className="btngreentheme my-2 p-2 mx-1"  data-toggle={false && "modal"}
                            data-target="#exampleModal1" onClick={()=>{handleexportoldscenarios()}}>
                      Export
                      </button> */}
                      <button className="btngreentheme my-2 p-2 mx-1" data-toggle={displaynames2.scenario === "Base Scenario" && "modal"}
                        data-target="#exampleModal1" onClick={() => { displaynames2.scenario !== "Base Scenario" && updatescenario() }}>
                        {displaynames2.scenario === "Base Scenario" ? "Save Scenario" : "Update Scenario"}
                      </button>
                    </div>
                    {loader4 ? "Loading..." :
 sampledataset[0]?.month_data?.length===1?
                <VariableTableYearlyAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding}/>
:
                <VariableTableAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} endDate={endDate}/>
                
                    }

                  </div>}
                {upperboundlowerboundscreen &&
                  <div className="container my-4">
                    {/* <button className="btngreentheme p-2 my-1" onClick={()=>modifyublbtable()}>Update Table</button> */}
                   <UbLbTable sampledataset2={sampledataset2} originalset2={originalset2} handleoriginaldataset2change={handleoriginaldataset2change} handlesampledataset2change={handlesampledataset2change} originalsetublboriginal={originalsetublboriginal}/>
                   <div className=" p-3 card ">
                      <div className=" col-sm">
                        <span className="" >  Objective</span>
                        <select className="  form-select rounded my-2 p-2" value={selectedobjective} onChange={(e) => { 
                          setselectedobjective(e.target.value) 
                          handlefetchbudget(e.target.value)
                          setsalesno(0)
                          setpercentagegrowthrqd(0)
                          setbudgetconstraintrequired(false)
                          e.target.value==="Achieve Percentage growth with optimized spends" && handlefetchtotalsalesnoforobjective3()
                                           
                        }}>
                    <option>Select</option>
                    <option>Optimize Spends to Maximize Sales</option>
                    <option>Maintain Sales and Minimize Spends</option>
                    { !selectedscenarioname?.startsWith("M") && <option>Achieve Percentage growth with optimized spends</option>}

                  
                  </select>
                      </div>
                      {selectedobjective!=="Achieve Percentage growth with optimized spends" && 
                      <div className="col-sm"><span>
                      Overall Marketing Budget:
                    </span>
                    {
                      (selectedobjective==="Maintain Sales and Minimize Spends" || selectedobjective==="Optimize Spends to Maximize Sales")?
                      <div>Rs {totalBudget?.toLocaleString("en-IN")}</div>:
                      <input  className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) =>{settotalBudget(e.target.value);handlemodifybudget(e.target.value) }}/>
                    
                    }
                  {}
                      {/* //  handlemodifybudget(e.target.value)}  */}

                      {/* <input className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) => settotalBudget(e.target.value)} /> */}
                    </div>}
                    {selectedobjective==="Achieve Percentage growth with optimized spends" && 
                    (loader2?<div className="mx-3">Loading...</div>:
                     <>
                      <div className="row my-3">
                        <div className="col-sm">

                      Target Percentage Growth( % ):
                      <input
                    className="p-1 my-auto mx-2"
             type="number"
                    placeholder="% increase/decrease"
                    value={percentagegrowthrqd}
                    min={0}
                    onChange={(e) => {
                      if(e.target.value>=0){
                        setpercentagegrowthrqd(e.target.value)
                        handlemodifytotalsalesobj3(e.target.value)}
                      
                      else{
                        setpercentagegrowthrqd(0)}
                    }}
                    style={{ fontSize: "0.7rem" }}
                  />
                    </div>
                    <div className="col-sm">
                    <div>Total Sales:  {(salesnooriginalobj3*(percentagegrowthrqd/100+1)/1000)?.toFixed(2)} Tonnes </div>
                      </div>
                   <span>
                
                    
                      </span>
                  
                      {/* //  handlemodifybudget(e.target.value)}  */}

                      {/* <input className="form-control rounded my-2 p-2 w-50" value={totalBudget} onChange={(e) => settotalBudget(e.target.value)} /> */}
                    </div>
                    {/* <div className="d-flex">
                      <div className="mx-1">Want to specify the budget constraint?</div>
<div className="mx-2"><input type="radio" checked={budgetconstraintrequired} name="budgetconstraintrequired" value="Yes" onClick={(e)=>setbudgetconstraintrequired(true)}></input><label className="mx-1">Yes</label></div>
<div className="mx-2"><input type="radio" checked={!budgetconstraintrequired} name="budgetconstraintrequired" value="No" onClick={(e)=>setbudgetconstraintrequired(false)}></input><label className="mx-1">No</label></div>
                      </div> */}
                      {budgetconstraintrequired &&  <div className="d-flex"><span className="my-auto mx-2">Rs</span>  <input  className="form-control rounded my-2 p-2 w-50"  value={totalBudget ? Number(totalBudget).toLocaleString("en-IN") : 0}
                      onChange={(e) =>{
                      const rawValue = e.target.value.replace(/,/g, "") || 0;
                      
  if (!isNaN(rawValue) && rawValue!=="" ) {
    
    handlemodifybudget(rawValue);
  }
                     }}/></div>
                    } 
                      </>)}

                      <div class="submitfrmtbtn mb-2"  >
                        <span disabled={isprocessing} 
                           style={{ cursor: isprocessing ? "not-allowed" : "pointer" }} 
                           onClick={() => {
                        // fetchdatasettable()
                        handleoptimize()
                      }}>Optimize <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span></div>
                    </div>
                  </div>
                }
              </>
            }
          </div>
        </div>
      </div>
      <div className='' >
        <FooterPages />
      </div>
    </>
  );
}

export default OptimizerAtta;
