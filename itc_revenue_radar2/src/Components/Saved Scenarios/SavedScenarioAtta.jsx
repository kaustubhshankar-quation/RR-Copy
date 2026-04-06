import React from "react";
import { useState, useEffect, useRef } from "react";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import Loader from "react-js-loader";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import { useDispatch } from "react-redux";
import UserService from "../../services/UserService"; import AuthService from "../../services/AuthService";
import getNotification from "../../Redux/Action/action";
import axios from "axios";
import FooterPages from "../Footer/FooterPages";
import Chart from "react-apexcharts";
import Navbar3 from "../Navbars/Navbar3";
import SubNavbar from "../Navbars/SubNavbar";
import PieChartsAtta from "../Simulator Atta/PieChartsAtta";
import SingleBarChart1Atta from "../Simulator Atta/SingleBarChart1Atta";
import SingleBarChart2Atta from "../Simulator Atta/SingleBarChart2Atta";
import SingleBarChart3Atta from "../Simulator Atta/SingleBarChart3Atta";
import LineChart1Atta from "../Simulator Atta/LineChart1Atta";

import LineChart2Atta from "../Simulator Atta/LineChart2Atta";
import SingleBarChart4Atta from "../Simulator Atta/SingleBarChart4Atta";
import SingleBarChart5Atta from "../Simulator Atta/SingleBarChart5Atta";
import SingleBarChart6Atta from "../Simulator Atta/SingleBarChart6Atta";
import SingleBarChart7Atta from "../Simulator Atta/SingleBarChart7Atta";
import AnnualDataAtta from "../Simulator Atta/AnnualDataAtta";
import SingleBarChart8Atta from "../Simulator Atta/SingleBarChart8Atta";
import VariableTableYearlyAtta from "../Simulator Atta/VariableTableYearlyAtta";
import VariableTableAtta from "../Simulator Atta/VariableTableAtta";

const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
const { REACT_APP_UPLOAD_DATA2 } = process.env;
const XLSX = require("xlsx");
function SavedScenariosAtta() {
  const [referencescenarioname,setreferencescenarioname]=useState([])
  const [masterscenarioname,setmasterscenarioname]=useState([])
  const [masterscenariotimestamp,setmasterscenariotimestamp]=useState("")
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const dispatch = useDispatch();
  const [createfrombaseoruploadfileswitch, setcreatefrombaseoruploadfileswitch] = useState(false)
  const [fulldataset, setfulldataset] = useState({})
  const [fulldataset2, setfulldataset2] = useState({})
   const [timetype, settimetype] = useState("")
  const [mape, setmape] = useState(0)
  const [isValue,setisValue]=useState(false)
  const [startDate,setStartDate]=useState('')
  const [endDate,setEndDate]=useState("")
  const [predictedsalesvaluelastfy, setpredictedsalesvaluelastfy] = useState(0)
  const [originaldatasetforcolorcoding,setoriginaldatasetforcolorcoding]=useState([])
  const [yearoptions, setyearoptions] = useState([])
  const [modifybtn, setmodifybtn] = useState(false)
  const [fromrangeonplots,setfromrangeonplots]=useState("")
  const [marketoptions, setmarketoptions] = useState([])
  const [uploadfile, setuploadfile] = useState("")
  const [market, setmarket] = useState("");
  const [options1, setoptions1] = useState({})
  const [plotdata1, setplotdata1] = useState([]);
  const [loader, setloader] = useState(false);
  const [loader1, setloader1] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [loader3, setloader3] = useState(false);
  const [loader4, setloader4] = useState(false);
  const [loader5, setloader5] = useState(false);
  const [scenariooptions, setscenariooptions] = useState([]);
  const [scenarionewoldscreen, setscenarionewoldscreen] = useState("Select")
  const [viewscenariobtn, setviewscenariobtn] = useState(false)
  const [viewscenariodatatable, setviewscenariodatatable] = useState(false)
  const [viewscenariodatatable2, setviewscenariodatatable2] = useState(false)
  const [newscenariofile, setnewscenariofile] = useState("")
  const [isHovered, setIsHovered] = useState(true);
const [torangeonplots,settorangeonplots]=useState("")
  const [brandoptions, setbrandoptions] = useState([
  ]);
  const [displaynames, setdisplaynames] = useState({});
  const [displaynames2, setdisplaynames2] = useState({});
 
  const [edit, setedit] = useState([]);
  const [selectedzone, setselectedzone] = useState("National")
  const [selectedbrand, setselectedbrand] = useState("ATTA");
  const [selectedscenarioname, setselectedscenarioname] = useState("");
  const [selectedscenarioid, setselectedscenarioid] = useState("");
  const [selectedscenarionametimestamp, setselectedscenarionametimestamp] =
    useState("");
  const [selectedyear, setselectedyear] = useState("");
  const [resultscreen, setresultscreen] = useState(false);
  const [resultscreen2, setresultscreen2] = useState(false);
  const [newscenarionamegiven, setnewscenarionamegiven] = useState("");
  const [originalset, setoriginalset] = useState([]);
  const [sampledataset, setsampledataset] = useState(
    []);
  
  const sectionRef = useRef(null);
  const [monthlist, setmonthlist] = useState(["April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "March"])
  useEffect(() => {
    handlevariablesfetchfybrand()
  }, []);
  useEffect(() => {
    handlefetchmarket()
  }, [selectedbrand])
 
  const today1 = new Date();
  const currentYear = today1.getFullYear();
  const currentMonth = today1.getMonth();
  
  let unblockeddate;
  

  if (currentMonth === 3) {

    unblockeddate = new Date(currentYear, currentMonth, 1);
  } else if (currentMonth >= 4) {

    unblockeddate = new Date(currentYear, currentMonth - 1, 1);
  } else {
  
    unblockeddate = new Date(currentYear - 1, 10, 1); 
  }
   
  const MonthBeforeUnlockMonth = `${unblockeddate.getFullYear()}-${String(unblockeddate.getMonth() + 1).padStart(2, "0")}`;
  const MonthBeforeUnlockMonthreverse = MonthBeforeUnlockMonth.split("-").reverse().join("-");
  
  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' }); 
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
          setyearoptions([
            ...(getResponse.data?.fy || []), // Use optional chaining to handle undefined/null values safely
           // Add the new fiscal year
          ]);
         
          setbrandoptions(
            getResponse.data.brands?.filter(it=>!ExceptionVariables?.brandoptionshide?.includes(it?.brand))?.sort((a,b)=>a.brand.localeCompare(b.brand))
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
        sendData.append("brand", selectedbrand)
        const config = {
          method: "post",
          url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/app/atta_get_markets`:`${REACT_APP_UPLOAD_DATA}/app/get_markets`,
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
        sendData.append("brand", selectedbrand)
        sendData.append("market", market)
        sendData.append("fy", selectedyear)
        const config = {
          method: "post",
          url:`${REACT_APP_UPLOAD_DATA}/app/atta_get_monthly_scenario_name`,
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
          setscenariooptions(getResponse.data?.filter(it=>it.scenario_name!=="Base Scenario"))
          setresultscreen(true)
          handlefetchnewbasescenario()
          handlefetchmasterscenario()
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
  const downloadSampleFile = async () => {
    if (timetype) {
      const fileUrl = `assets/Files/Sample${timetype}.xlsx`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `samplefile${timetype}.xlsx`); // Set the name of the file for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
    }
    else {
      dispatch(getNotification({
        message: "Please select tenure type!!",
        type: "danger"
      }))
    }
  }
  const scrollToTop = () => {
    if (sectionRef.current) {
      const yOffset = -50; // Adjust this value based on your preference
      const elementTop = sectionRef.current.offsetTop;
      const offsetPosition = elementTop + yOffset;

      window.scrollBy(500, 500);
      // window.scroll({
      //   top: offsetPosition,
      //   behavior: 'smooth',
      // });
    }
  };
 
  const fetchdatasettable = async (row) => {
    if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select" && selectedyear && selectedyear!=="Select") {
        try {
        
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          sendData.append("scenario_name", row.scenario_name);
          sendData.append("scenario_timestamp",row.created_dt );
          sendData.append("user_id", "admin");
          sendData.append("final_market", market);
          sendData.append("brand", selectedbrand)
          sendData.append("fy", selectedyear)
          let getResponse = []
          let successfulResponse=[]
     
        
            if(selectedscenarioname?.startsWith("Y_")){
              config= {
                 method: "post",
                 url:  `${REACT_APP_UPLOAD_DATA}/api/get_annual_scenario_data`,
                 headers: {
                   Accept: "text/plain",
                   "Content-Type": "application/json",
                 },
                 data: sendData,
               }
             }
            else if(selectedscenarioname?.startsWith("Q_")){
             config= {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/api/get_qtr_scenario_data`,
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
                 url:  `${REACT_APP_UPLOAD_DATA}/api/get_hy_scenario_data`,
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
                url:  `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              }
             }
        
        
        getResponse = await axios(config)    
       



            if (getResponse?.data?.length > 0 && getResponse?.data[0] !== "No Records Found" && getResponse?.data[0].Error !== "Invalid User!"
            ) {
        
              setviewscenariodatatable(true)
              setresultscreen(true)
              //ifscenariogiven && setselectedscenarioname(ifscenariogiven)
              setdisplaynames2({
                ...displaynames2,
                brand: selectedbrand,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear
              })
              setsampledataset(getResponse?.data)
              setoriginalset(getResponse?.data);
              setoriginaldatasetforcolorcoding(getResponse?.data)
            }

            else {
      
              dispatch(
                getNotification({
                  message: `There is no valid data to display for selected brand and scenario combination`,
                  type: "default",
                })

              );
           
              setresultscreen2(false)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/simulator`,
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
          setloader5(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          sendData.append("scenario_name", selectedscenarioname);
            sendData.append("scenario_timestamp",selectedscenarionametimestamp);
          sendData.append("user_id", "admin");
          sendData.append("final_market", market);
          sendData.append("brand", selectedbrand)
          if (selectedscenarioname === "Base Scenario"  ) {
            if(timetype==="Y"){
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
              if(selectedyear==="2025-26"){
                config = {
                  method: "post",
                  url:selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`: `${REACT_APP_UPLOAD_DATA}/api/get_annual_scenario_data`,
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
                  url:selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodata`: `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
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

            if (getResponse?.data?.length > 0 && getResponse?.data[0] !== "No Records Found" && getResponse?.data[0].Error !== "Invalid User!"
            ) {
              setcreatefrombaseoruploadfileswitch(false)
              setdisplaynames2({
                ...displaynames2,
                brand: selectedbrand,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear

              })
              setsampledataset(getResponse?.data)
              setoriginalset(getResponse?.data);
              setviewscenariodatatable2(true)
              setoriginaldatasetforcolorcoding(getResponse?.data)

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/simulator`,
        });
      }, 1000);
    }
    setloader5(false);




  };
 const handlesimulate = async (row) => {
    if (UserService.isLoggedIn()) {
      // console.log(selectedyear,market,selectedscenarioname,selectedbrand)
      if (true) {
        try {
          setmodifybtn(false)
          setloader2(true);
          setviewscenariodatatable(false)
          const FormData = require("form-data");
          const sendData = new FormData();
          sendData.append("scenario_name", row.scenario_name);
          sendData.append("scenario_timestamp", row.created_dt);
          sendData.append("user_id", "admin");
          sendData.append("brand", selectedbrand);
          sendData.append("model_id", 1);
          sendData.append("market", market);
          sendData.append("f_year", selectedyear);

          const sendData2 = new FormData();
          
          const FormData5 = require("form-data");
               const sendData5 = new FormData5();
               sendData5.append("fy", selectedyear)
               sendData5.append("brand_market", `${selectedbrand}_${market}`)
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
               const getResponse5 = await axios(config5)
               let arr = getResponse5?.data?.data.filter((it) => type === it?.frequency)
               // console.log(arr)
               //setsavedreferencescenarioname(getResponse5?.data?.data.filter((it) => type === it?.frequency)[0]?.scenerio_name)
     
     
               if (row.scenario_name?.match("Master")) {
                 // sendData2.append("scenario_name", 'Base Scenario');
                 // sendData2.append("scenario_timestamp",'2025-01-12 15:54:05');
                 sendData2.append("scenario_name", arr[0]?.scenerio_name);
                 sendData2.append("scenario_timestamp", arr[0]?.created_at);
                 sendData2.append("user_id", "admin");
                 sendData2.append("market", arr[0]?.market);
                 sendData2.append("model_id", 1);
                 sendData2.append("brand",arr[0]?.brand);
                 sendData2.append("f_year", arr[0]?.fy)
     
               }
               else {
                 sendData2.append("scenario_name", 'Base Scenario');
                 sendData2.append("scenario_timestamp", '2025-01-12 15:54:05');
                 sendData2.append("user_id", "admin");
                 sendData2.append("market", market);
                 sendData2.append("model_id", 1);
                 sendData2.append("brand", selectedbrand);
                 sendData2.append("f_year", selectedyear)
               }  
          
       let config1={}
       let config2={}
if(row.scenario_name?.startsWith("Y_")){
config1 = {
 method: "post",
 url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData,
};
config2 = {
 method: "post",
 url:row.scenario_name?.match("Master")?`${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_predict`:`${REACT_APP_UPLOAD_DATA}/app/atta_annual_base_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData2,
};
}
else if(row.scenario_name?.startsWith("Q_")){
config1 = {
 method: "post",
 url: `${REACT_APP_UPLOAD_DATA}/app/atta_quartely_scenario_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData,
};
config2 = {
 method: "post",
 url:row.scenario_name?.match("Master")? `${REACT_APP_UPLOAD_DATA}/app/atta_quartely_scenario_predict`:`${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_base_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData2,
};
}
else if(row.scenario_name?.startsWith("HY_")){
config1 = {
 method: "post",
 url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_scenario_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData,
};
config2 = {
 method: "post",
 url:row.scenario_name?.match("Master")?`${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_scenario_predict`:`${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_base_predict`,
 headers: {
   Accept: "text/plain",
   "Content-Type": "application/json",
 },
 data: sendData2,
};
}
else{
        config1 = {
         method: "post",
         url: selectedbrand==="ATTA"?`${REACT_APP_UPLOAD_DATA}/app/atta_monthly_predict`:`${REACT_APP_UPLOAD_DATA}/api/predict`,
         headers: {
           Accept: "text/plain",
           "Content-Type": "application/json",
         },
         data: sendData,
       };
        config2 = {
         method: "post",
         url:row.scenario_name?.match("Master")?`${REACT_APP_UPLOAD_DATA}/app/atta_master_monthly_predict`:`${REACT_APP_UPLOAD_DATA}/app/atta_monthly_base_predict`,
         headers: {
           Accept: "text/plain",
           "Content-Type": "application/json",
         },
         data: sendData2,
       };}
       const getResponse2 = await axios(config2);
       const getResponse1 = await axios(config1);
      
          if (getResponse1.data.data) {
 if (getResponse1?.data?.data?.plot1?.length > 0) {
 
setfulldataset(getResponse1?.data?.data)
setfulldataset2(getResponse2?.data?.data)

settorangeonplots(getResponse1?.data?.data?.plot1[getResponse1?.data?.data?.plot1.length-1]?.month_year?.split("-").reverse()?.join("-"))
let current_month_year=`${new Date().getFullYear()}-${(String(new Date().getMonth()+1).padStart(2,"0"))}`;
if(getResponse1?.data?.data?.plot1[0]?.month_year>current_month_year || selectedscenarioname?.startsWith("Y_")){
  setfromrangeonplots(getResponse1?.data?.data?.plot1[0]?.month_year?.split("-").reverse()?.join("-"))
}else{
  console.log(endDate)
  const [year,month] = endDate.split("-");
          const date = new Date(year, month); // Month is zero-based in JS Date
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() +1).padStart(2, "0")}`;
         console.log(formattedDate)
 setfromrangeonplots(formattedDate?.split("-")?.reverse()?.join("-"))
}

              setmodifybtn(false)

              setdisplaynames({
                ...displaynames,
                scenario: row.scenario_name,
                market: market,
                fy: selectedyear,
                brand: selectedbrand
              }
              )
              setresultscreen2(true);
          
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth() - 3; // getMonth() returns 0-indexed month
              const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
              const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
              
                        
              setTimeout(() => {
                scrollToSection('simulateddata')
              }, 1000)

            }
            else {

              dispatch(
                getNotification({
                  message: "There is no data for selected options",
                  type: "default",
                })
              );
            }

            // setTimeout(() => {
            //   document.getElementById("SimulatorInputs").click()
            // }, 1000)
            scrollToTop();

            //settablegraphdataset(getResponse.data);


            //(getResponse.data)
          }
          else {
            dispatch(
              getNotification({
                message: "There is no data for selected options",
                type: "default",
              })
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/simulator`,
        });
      }, 1000);
    }
    setloader2(false)

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
 
 
 

  

  const [modelcallibrationoptions, setmodelcallibrationoptions] = useState([
    {label:"test",value:"test"}
  ]);

 



  const [openindex,setopenindex]=useState([])
    useEffect(() => {
   
    handlevariablesfetchfybrand()
    handlevariablesfetch();
  }, []);
 
  useEffect(() => {
    handlefetchmarket()
  }, [selectedbrand])


 
  const handlefetchnewbasescenario = async (type) => {
    if (UserService.isLoggedIn()) {
      try {
    
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("fy", selectedyear)
        sendData.append("brand_market",`${selectedbrand}_${market}`)
      
        // sendData.append("scenario_timestamp",selectedscenarionametimestamp)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_new_base_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };

           
        const getResponse = await axios(config);
       
   //  console.log(getResponse)
      
        if (getResponse.status===200 && getResponse?.data?.data.length>0) {
          // let selectedyrsplit = selectedyear?.split("-")
          // let arr = getResponse?.data?.data?.filter((it) => Number(it?.fy?.split("-")[0]) + 1 === Number(selectedyrsplit[0]) && Number(it?.fy?.split("-")[1]) + 1 === Number(selectedyrsplit[1]))
          // if(arr.length>0){
          // setnewbasedetailscreatenew(arr[0])}
          // else{
          
          //    setnewbasedetailscreatenew({})
          // }
          setreferencescenarioname(getResponse?.data?.data)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasavedscenarios`,
        });
      }, 1000);
    }
   
  };
  const handlefetchmasterscenario = async (type) => {
    if (UserService.isLoggedIn()) {
      try {
    
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("fy", selectedyear)
        sendData.append("brand_market",`${selectedbrand}_${market}`)
      
        // sendData.append("scenario_timestamp",selectedscenarionametimestamp)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_master_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };

           
        const getResponse = await axios(config);
       
   //  console.log(getResponse)
      
        if (getResponse.status===200 && getResponse?.data?.data.length>0) {
          // let selectedyrsplit = selectedyear?.split("-")
          // let arr = getResponse?.data?.data?.filter((it) => Number(it?.fy?.split("-")[0]) + 1 === Number(selectedyrsplit[0]) && Number(it?.fy?.split("-")[1]) + 1 === Number(selectedyrsplit[1]))
          // if(arr.length>0){
          // setnewbasedetailscreatenew(arr[0])}
          // else{
          
          //    setnewbasedetailscreatenew({})
          // }
          setmasterscenarioname(getResponse?.data?.data)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasavedscenarios`,
        });
      }, 1000);
    }
   
  };
  const handlemodifynewbasescenarios = async (row) => {
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
          scenario_name: row?.scenario_name,
          frequency: row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY",
          scenario_created_timestamp: row?.created_dt,
          updated_by: "admin",
          brand_market_frequency: `${selectedbrand}_${market}_${row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY"}`
        };
        const requestData2 = {
          "scenario_name": `${row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY"}_Base_Master_Scenario`,
          "scenario_timestamp": "2025-01-12 15:54:05",
          "user_id": "admin",
          "model_id": 1,
          "fy": selectedyear,
          "dataset": originalset
          // frequency:row?.scenario?.startsWith("M_")?"M":row?.scenario.startsWith("Y_")?"Y":row?.scenario.startsWith("Q_")?"Q":"HY",
          // scenario_created_timestamp:row.timestamp,
          // updated_by:"admin",
          // brand_market_frequency:`${selectedbrand}_${market}_${row?.scenario?.startsWith("M_")?"M":row?.scenario.startsWith("Y_")?"Y":row?.scenario.startsWith("Q_")?"Q":"HY"}`

        };
        const config2 = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/api/atta_save_newbase_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData2,
        };

        const config = {
          method: "post",
          url: row?.scenario_name?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : row?.scenario_name.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : row?.scenario_name.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_new_base_scenario`,
                    // url: row?.scenario_name.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = await axios(config);
     
         
           
                
      

        if (getResponse.data) {

handlefetchnewbasescenario()
handlefetchmasterscenario()
// handlefetchmasterscenario()
//setreferencescenarioname(getResponse)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedscenarios`,
        });
      }, 1000);
    }
    setloader5(false)
  };
  const handlemodifymasterscenarios = async (row) => {
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
          scenario_name: row?.scenario_name,
          frequency: row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY",
          scenario_created_timestamp: row?.created_dt,
          updated_by: "admin",
          brand_market_frequency: `${selectedbrand}_${market}_${row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY"}`
        };
        const requestData2 = {
          "scenario_name": `${row?.scenario_name?.startsWith("M_") ? "M" : row?.scenario_name.startsWith("Y_") ? "Y" : row?.scenario_name.startsWith("Q_") ? "Q" : "HY"}_Base_Master_Scenario`,
          "scenario_timestamp": "2025-01-12 15:54:05",
          "user_id": "admin",
          "model_id": 1,
          "fy": selectedyear,
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
          url: row?.scenario_name?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario`,
                    // url: row?.scenario_name.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : row?.scenario_name.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_master_scenario`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = await axios(config);
     
         
           
                
      

        if (getResponse.data) {

handlefetchnewbasescenario()
handlefetchmasterscenario()
// handlefetchmasterscenario()
//setreferencescenarioname(getResponse)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasavedscenarios`,
        });
      }, 1000);
    }
    setloader5(false)
  };
  const handledeletescenarios = async (row) => {
    if (UserService.isLoggedIn()) {
      try {
        setloader5(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        const currenttime = getCurrentFormattedTime()
          
        const FormData2 = require("form-data");
        const sendData2 = new FormData2();
        
        sendData2.append("scenario_name", row.scenario_name);
        sendData2.append("scenario_timestamp",row.created_dt );
      
        let config2={}
          if(row.scenario_name?.startsWith("Y_")){
            config2= {
               method: "post",
               url:  `${REACT_APP_UPLOAD_DATA}/app/atta_delete_scenario`,
               headers: {
                 Accept: "text/plain",
                 "Content-Type": "application/json",
               },
               data: sendData2,
             }
           }
          else if(row.scenario_name?.startsWith("Q_")){
           config2= {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_delete_scenario`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            }
          }
          else if(row.scenario_name?.startsWith("HY_")){
            config2= {
               method: "post",
               url:  `${REACT_APP_UPLOAD_DATA}/app/atta_delete_scenario`,
               headers: {
                 Accept: "text/plain",
                 "Content-Type": "application/json",
               },
               data: sendData2,
             }
           }
           else{
            config2= {
              method: "post",
              url:  `${REACT_APP_UPLOAD_DATA}/app/atta_delete_scenario
 `,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            }
           }
        
               const getResponse2 = await axios(config2);
      

        if (getResponse2.status===200) {

handlescenariosfetch()
//setreferencescenarioname(getResponse)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedscenarios`,
        });
      }, 1000);
    }
    setloader5(false)
  };
  const handleCheckboxChange = (index, row) => {
    // If the clicked checkbox is the same as the currently selected one, uncheck it
   if(openindex[index]===true){
    let arr=[]
    setopenindex(arr)
   }
   else{
    
    handlesimulate(row); 

      let arr=[]
    arr[index]=true;
  setopenindex(arr)
   
   }
       // Call the analysis function
    
  };
  
 


 
 
  const handlevariablesfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
      const FormData = require("form-data");
      const sendData = new FormData();
      const config = {
          method: "get",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_date`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        if (getResponse.data !== "Invalid User!") {
         // setStartDate(getResponse.data.dates[0].min[0].start_date);
      
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
 


  return (
    <>
      <Navbar3 />
      <SubNavbar />
      <div className="bgpages">
        <div className=' mx-4 py-3'>
          <div className='greentheme '>{`Dashboard >> Saved Scenarios`}</div>
          <div className='p-2 bg-white greentheme my-3 d-flex justify-content-between' style={{ fontSize: "20px" }}>

            <b> Saved Scenarios(Atta)</b>
          {resultscreen && <div><button className="btn btn-danger  mx-1 my-auto" onClick={() => { setselectedscenarioname("");setresultscreen(false);  setmarket(""); setselectedbrand("ATTA"); setmodifybtn(false);setopenindex([])}}>Reset</button>
                        <button className="btn btn-dark " onClick={() => setmodifybtn(!modifybtn)}>Modify</button></div>
                        }</div>
           {modifybtn &&
            <>
              <div className="card p-3">

                <div className="d-flex justify-content-between  "  >

                  <div className="my-2">
                    <label>FY:<span className="text-danger">*</span></label>
                    <select className="form-select"
                      placeholder="Select FY"

                      onChange={(e) => {

                        setselectedyear(e.target.value);
                        setselectedbrand("ATTA")
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
                      onChange={(e) => { setselectedbrand(e.target.value); setmarket("Select"); setselectedscenarioname("Select"); setviewscenariodatatable(false);setviewscenariodatatable2(false)
                        setmodifybtn(false)
                        setresultscreen2(false)
                        setresultscreen(false)
                       }}
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
                        setviewscenariodatatable2(false)
                        setmodifybtn(false)
                        setresultscreen2(false)
                        setresultscreen(false)
                      }}
                      value={market}
                    >
                      <option>Select</option>
                      {marketoptions?.map((item) => {
                        return <option>{item?.final_market}</option>
                      })}
                    </select>





                  </div>
                 
                  {selectedscenarioname!=="Base Scenario" && 
                  <div>
                  <button
                    id="subm"
                    className="btn btn-dark  mt-4"
                    onClick={() => {
                      //scrollToSection("heightmainscreen");
                      handlescenariosfetch()
                    }}
                  >
             Fetch Scenarios
                  </button>
                </div>}
                </div>





              </div>


          
            </>}
       {resultscreen ?
    loader ? (
      <div
        className="row d-flex  justify-content-center align-items-center "
        style={{ height: "75vh" }}
      >
        <Loader
          type="box-rectangular"
          bgColor={"#0A4742"}
          title={"Processing Plots..."}
          color={"#0A4742"}
          size={75}
        />
      </div>):     <div className=" ">
       
     
 
  {scenariooptions?.length>0 ?
    <table className="text-center table table-sm my-4 table-striped shadow table-bordered table-responsive-md col-sm-12 mx-auto" style={{ fontSize: "12px" }}>

  <thead>
    <tr>
      <th>S. No.</th>
      <th>FY</th>
      <th>Brand</th>
      <th>Market</th>
   
      <th>Scenario Name</th>
      <th>Date Created</th>
      <th>Select for More Details</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  {(() => {
  const masters = scenariooptions?.filter((row) =>
    referencescenarioname.some(
      (master) => row.scenario_name === master.scenerio_name
    )
  );

  const others = scenariooptions?.filter((row) =>
    !referencescenarioname.some(
      (master) => row.scenario_name === master.scenerio_name
    )
  );

  // Sort the other rows by created_dt in descending order
  const sortedOthers = others.sort(
    (a, b) => new Date(b.created_dt) - new Date(a.created_dt)
  );

  // Combine masters and sorted others
  const combined = [...masters, ...sortedOthers];

  return combined.map((row, index) => (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{selectedyear}</td>
        <td>{selectedbrand}</td>
        <td>{market}</td>
        <td>{row?.scenario_name}</td>
        <td>{row?.created_dt?.split("T")[0]}</td>
        <td>
          <span
            onClick={() => {
              setfulldataset({});
              setfulldataset2({});
              handleCheckboxChange(index, row);
            }}
          >
            <button className="btn btn-sm p-0">
              {openindex[index] === true ? "Hide" : "More Details"}
            </button>
          </span>
        </td>
        <td>
        {/* {loader5 ? (
            "Loading..."
          ) : (
            <button
              onClick={() => {
                if (
                  row?.scenario_name ===
                  masterscenarioname.filter(
                    (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
                  )[0]?.scenerio_name
                ) {
                } else {
                  handlemodifymasterscenarios(row);
                }
              }}
              className={
                row?.scenario_name ===
                masterscenarioname.filter(
                  (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
                )[0]?.scenerio_name
                  ? "btn btn-sm text-success mx-1 "
                  : "btn btn-sm btn-secondary mx-1"
              }
            >
              {row?.scenario_name ===
              masterscenarioname.filter(
                (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
              )[0]?.scenerio_name
                ? <b>Master</b>
                : "Set as Master"}
            </button>
          )} */}
          {loader5 ? (
            "Loading..."
          ) : (
            row.scenario_name.startsWith("M_") && <button
              onClick={() => {
                if (
                  row?.scenario_name ===
                  referencescenarioname.filter(
                    (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
                  )[0]?.scenerio_name.replace(`NEW_BASE_FY_${selectedyear.replace("-","_")}-`,"")
                ) {
                } else {
                  handlemodifynewbasescenarios(row);
                }
              }}
              className={
                row?.scenario_name ===
                referencescenarioname.filter(
                  (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
                )[0]?.scenerio_name.replace(`NEW_BASE_FY_${selectedyear.replace("-","_")}-`,"")
                  ? "btn btn-sm text-success mx-1 "
                  : "btn btn-sm btn-secondary mx-1"
              }
            >
              {row?.scenario_name ===
              referencescenarioname.filter(
                (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
              )[0]?.scenerio_name.replace(`NEW_BASE_FY_${selectedyear.replace("-","_")}-`,"")
                ? <b>Reference</b>
                : "Set as Reference"}
            </button>
          )}
           {row?.scenario_name ===
              referencescenarioname.filter(
                (it) => row?.scenario_name.charAt(0) === it?.frequency.charAt(0)
              )[0]?.scenerio_name.replace(`NEW_BASE_FY_${selectedyear.replace("-","_")}-`,"") ?
              "":
          <button className="btn btn-sm" onClick={()=>{handledeletescenarios(row)}}>
            <i
              className="fas fa-trash-alt "
              style={{ color: "grey", fontSize: "16px" }}
            ></i>
          </button>}
        </td>
      </tr>
      {openindex[index] === true && (
        <tr>
          <td colSpan="10" className="p-3">
            {loader2
              ? "Loading..."
              : fulldataset?.plot1.length > 0 ? (
                  <div>
                
            
<div className="d-flex flex-row-reverse my-2">
<button className="btngreentheme p-2 " onClick={()=>setisValue(!isValue)}>{isValue?"By Volume":"By Value"}</button>
</div>
                          <div className="card " id="simulateddata">

                          { displaynames?.scenario.startsWith("M_") ?fulldataset?.plot1?.length>0 && fulldataset2?.plot1?.length >0  &&
                            <LineChart1Atta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue} 
                            range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}/>:
                            <AnnualDataAtta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}/>
                           }
                            </div>
                          <div className="row my-3">
                          {fulldataset2?.plot2?.length > 0 && 
                                    <div className="card col-sm mx-1 p-3" id="" >

                          
                              
                              <PieChartsAtta isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} displaynames={displaynames}/>
                         
                            </div>
                          }
                    {fulldataset?.plot2?.length > 0 &&        <div className="card col-sm mx-1 p-3" id="" >
                             
                               
                                
                                <PieChartsAtta isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} fulldataset={fulldataset} type={displaynames.scenario}/>
                               
                              

                            </div>}

                          </div>
                          <div className="row my-3">
                          {fulldataset2?.plot3?.length > 0 &&           <div className="card col-sm mx-1 p-3" id="" >
                              
                               <SingleBarChart1Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} 
                               maxValuedynamicVolume={Math.ceil(Math.max(...[
                                fulldataset?.plot3[0].total_core / 1000,
                                fulldataset?.plot3[1].total_incremental / 1000,
                                fulldataset?.plot3[2].total_media / 1000,
                                fulldataset2?.plot3[0].total_core / 1000,
                                fulldataset2?.plot3[1].total_incremental / 1000,
                                fulldataset2?.plot3[2].total_media / 1000,
                              ])/100)*100}
                               maxValuedynamicValue={Math.ceil(Math.max(...[
                                fulldataset?.plot3[0].total_core_sales / 100000,
                                fulldataset?.plot3[1].total_incremental_sales / 100000,
                                fulldataset?.plot3[2].total_media_sales / 100000,
                                fulldataset2?.plot3[0].total_core_sales / 100000,
                                fulldataset2?.plot3[1].total_incremental_sales / 100000,
                                fulldataset2?.plot3[2].total_media_sales / 100000,
                              ]) /100)*100
                                }/>
                                

                            </div>}
                            {fulldataset?.plot3?.length > 0 &&   <div className="card col-sm mx-1 p-3" id="" >
                              
                                  <SingleBarChart1Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={Math.ceil(Math.max(...[
                                  fulldataset?.plot3[0].total_core / 1000,
                                  fulldataset?.plot3[1].total_incremental / 1000,
                                  fulldataset?.plot3[2].total_media / 1000,
                                  fulldataset2?.plot3[0].total_core / 1000,
                                  fulldataset2?.plot3[1].total_incremental / 1000,
                                  fulldataset2?.plot3[2].total_media / 1000,
                                ])/100)*100}
                                 maxValuedynamicValue={Math.ceil(Math.max(...[
                                  fulldataset?.plot3[0].total_core_sales / 100000,
                                  fulldataset?.plot3[1].total_incremental_sales / 100000,
                                  fulldataset?.plot3[2].total_media_sales / 100000,
                                  fulldataset2?.plot3[0].total_core_sales / 100000,
                                  fulldataset2?.plot3[1].total_incremental_sales / 100000,
                                  fulldataset2?.plot3[2].total_media_sales / 100000,
                                ]) /100)*100
                                  }/>

                            </div>}
                          </div>
                          <div className="row my-3">
                          {fulldataset2?.plot4?.length > 0 &&          <div className="card col-sm mx-1 p-3" id="" >
                           
                                <SingleBarChart2Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={Math.ceil(
                                      Math.max(...fulldataset?.plot4.map((it) => it.contribution),...fulldataset2?.plot4.map((it) => it.contribution)
                                       
                                      ) / 100
                                    ) * 100   } 
                                    maxValuedynamicValue={Math.ceil(
                                      Math.max(...fulldataset?.plot4.map((it) => it.contribution_sales_value/100000,...fulldataset2?.plot4.map((it) => it.contribution_sales_value/100000))
                                       
                                      ) / 100
                                    ) * 100 }/>
                                
                            </div>}
                            {fulldataset?.plot4?.length > 0 &&           <div className="card col-sm mx-1 p-3" id="" >
                           
                                <SingleBarChart2Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={Math.ceil(
                                  Math.max(...fulldataset?.plot4.map((it) => it.contribution),...fulldataset2?.plot4.map((it) => it.contribution)
                                   
                                  ) / 100
                                ) * 100   } 
                                maxValuedynamicValue={Math.ceil(
                                  Math.max(...fulldataset?.plot4.map((it) => it.contribution_sales_value/100000,...fulldataset2?.plot4.map((it) => it.contribution_sales_value/100000))
                                   
                                  ) / 100
                                ) * 100 }/>
                                
                            </div>}

                          </div>
                       
                          <div className="row my-3">
                          {fulldataset2?.plot10?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart5Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                   maxValuedynamicVolume={Math.ceil(
                              Math.max(...fulldataset?.plot10.map((it) => it.contribution),...fulldataset2?.plot10.map((it) => it.contribution)
                               
                              ) / 100
                            ) * 100   } 
                            maxValuedynamicValue={Math.ceil(
                              Math.max(...fulldataset?.plot10.map((it) => it.contribution_sales_value/100000),...fulldataset2?.plot10.map((it) => it.contribution_sales_value/100000)
                               
                              ) / 100
                            ) * 100 }/>
                                
                             
                            </div>}
                            {fulldataset?.plot10?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart5Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                    maxValuedynamicVolume={Math.ceil(
                              Math.max(...fulldataset?.plot10.map((it) => it.contribution),...fulldataset2?.plot10.map((it) => it.contribution)
                               
                              ) / 100
                            ) * 100   } 
                            maxValuedynamicValue={Math.ceil(
                              Math.max(...fulldataset?.plot10.map((it) => it.contribution_sales_value/100000),...fulldataset2?.plot10.map((it) => it.contribution_sales_value/100000)
                               
                              ) / 100
                            ) * 100 }/>
                          
  
                         </div> }

                          </div>
                          
                          <div className="row my-3">
                          {fulldataset2?.plot5?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart4Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)}),...fulldataset2?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)})
                            ))
                          }
                            />
                                
                             
                            </div>}
                            {fulldataset?.plot5?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart4Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                       maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)}),...fulldataset2?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi)})
                            ))
                          }/>
                          
  
                         </div> }

                          </div>      
                          <div className="row my-3">
                          {fulldataset2?.plot13?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart8Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...fulldataset?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi)}), ...fulldataset2?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi)})
                                  )/10)*10
                                }/>
                                
                             
                            </div>}
                            {fulldataset?.plot13?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart8Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...fulldataset?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi)}), ...fulldataset2?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi)})
                                  )/10)*10
                                }/>
                          
  
                         </div> }
                         </div>                   
                          <div className="row my-3">
                          {fulldataset2?.plot12?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart7Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)}),...fulldataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)})
                            ))
                          }/>
                                
                             
                            </div>}
                            {fulldataset?.plot12?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart7Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                        maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)}),...fulldataset?.plot12?.map((it) => { return Number(it?.attribute_value_per_roi)})
                            ))
                          }/>
                          
  
                         </div> }

                          </div> 
                          
                          
                          <div className="row my-3">
                          {fulldataset2?.plot11?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart6Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot11?.map((it) => { return Number(it?.effectiveness)}),...fulldataset2?.plot11?.map((it) => { return Number(it?.effectiveness)})
                            )/10)*10
                          }/>
                                
                             
                            </div>}
                            {fulldataset?.plot11?.length > 0  && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart6Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                       maxValuedynamicVolume={
                            Math.ceil(Math.max(
                              ...fulldataset?.plot11?.map((it) => { return Number(it?.effectiveness)}),...fulldataset2?.plot11?.map((it) => { return Number(it?.effectiveness)})
                            )/10)*10
                          }/>
                          
  
                         </div> }

                          </div>  
                          <div className="row my-3">
                          {fulldataset2?.plot9?.length > 0  &&   <div className="card col-sm mx-1 p-3" id="" >
                          
                                <SingleBarChart3Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Master") ? "Master" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                  maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...fulldataset?.plot9?.map((it) => { return Number(it?.effectiveness)}), ...fulldataset2?.plot9?.map((it) => { return Number(it?.effectiveness)})
                                  )/10)*10
                                }/>
                                
                             
                            </div>}
                            {fulldataset?.plot9?.length > 0 && <div className="card col-sm mx-1 p-3" id="" >
                            
                                <SingleBarChart3Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                 maxValuedynamicVolume={
                                  Math.ceil(Math.max(
                                    ...fulldataset?.plot9?.map((it) => { return Number(it?.effectiveness)}), ...fulldataset2?.plot9?.map((it) => { return Number(it?.effectiveness)})
                                  )/10)*10
                                }/>
                          
  
                         </div> }

                         </div> 
                      
                       
                          
                         
                       
                        
                        
                        
                        

      
    </div>
              
                ) : (
                  <div>There was some problem generating charts!</div>
                )}
          </td>
        </tr>
      )}
    </>
  ));
})()}

 
   
 </tbody>
 
</table>:<div>There are no records to display!!</div>
                        }
         
  
            
            
         

       



         </div>:
           loader ? (
            <div
              className="row d-flex  justify-content-center align-items-center "
              style={{ height: "75vh" }}
            >
              <Loader
                type="box-rectangular"
                bgColor={"#0A4742"}
                title={"Processing Plots..."}
                color={"#0A4742"}
                size={75}
              />
            </div>):
       <>
    <div className="" >
                {brandoptions?.length > 0
                  ?
                  <div className="card px-5 py-4">
                    <div className="  " >

                      <div className="d-flex justify-content-between">
                        <div >
                          <label>FY:<span className="text-danger">*</span></label>
                          <select className="form-select"
                            placeholder="Select FY"

                            onChange={(e) => {
                              setviewscenariodatatable(false)
                              setselectedyear(e.target.value);
                              setselectedbrand("ATTA")
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
                        {/* <div >

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
                        <div >
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
                        
         { <div class="submitfrmtbtn mb-2" type="button" onClick={() => {
                        // fetchdatasettable()
                        handlescenariosfetch()
                      }}><span>Fetch Scenarios <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                      </div>}               



                      </div>
                      <div>

                        
                      </div>
                      <div className="">


                        <div>

                          {scenarionewoldscreen === "new" &&
                            <>
                             <div className="d-flex justify-items-between my-3">
                                  <div className="form-check mx-2 my-auto">
                                    <input
                                      className="form-check-input"
                                      onClick={() =>{ settimetype("Y")
                                        setviewscenariodatatable(false)
                                      }}
                                      type="radio"
                                      name="flexRadioDefault"
                                      id="flexRadioDefault1"

                                    />
                                    <label
                                      className="form-check-label selected"
                                      for="flexRadioDefault2"
                                    >
                                      Yearly
                                    </label>{" "}
                                  </div>


                                  <div className="form-check mx-2 my-auto">
                                    <input
                                      className="form-check-input"

                                      type="radio"
                                      name="flexRadioDefault"
                                      id="flexRadioDefault2"
                                      onClick={() =>{ settimetype("HY")
                                        setviewscenariodatatable(false)
                                      }}
                                    />
                                    <label className="form-check-label" for="flexRadioDefault2">
                                      Half-Yearly
                                    </label>{" "}
                                  </div>
                                  <div className="form-check mx-2 my-auto">
                                    <input
                                      className="form-check-input"

                                      type="radio"
                                      name="flexRadioDefault"
                                      id="flexRadioDefault1"
                                      onClick={() => settimetype("Q")}
                                    />
                                    <label className="form-check-label" for="flexRadioDefault1">
                                      Quarterly
                                    </label>
                                  </div>
                                  <div className="form-check mx-2 my-auto">
                                    <input
                                      className="form-check-input"

                                      type="radio"
                                      name="flexRadioDefault"
                                      id="flexRadioDefault2"
                                      onClick={() =>{ settimetype("M")
                                        setviewscenariodatatable(false)
                                      }}
                                    />
                                    <label className="form-check-label" for="flexRadioDefault2">
                                      Monthly
                                    </label>{" "}
                                  </div>
                               

                                </div>
                              <div className="d-flex my-4">

                                {scenarionewoldscreen === "new" && timetype &&
                                  <button className=" btn btn-dark mx-2" onClick={() => {
                                    if (viewscenariodatatable) {
                                      setviewscenariodatatable(false)
                                    }
                                    else{
                                  
                              fetchdatasettable("Base Scenario")
                                    }
                               
                                  }}>
                                    {!viewscenariodatatable  ? "Create from Base Scenario Data" : "Hide"}
                                  </button>}
{timetype && <>                               <span className="my-auto " style={{ fontSize: "20px" }}>/</span>
<button className=" btn btn-dark mx-2" onClick={() => setcreatefrombaseoruploadfileswitch(!createfrombaseoruploadfileswitch)}>Import from Excel</button></>}
                              </div>
                              {createfrombaseoruploadfileswitch && <div className="my-3">
                              
                                <div className="">


                                  <div className='row'>
                                    <div class="col-md-5 col-sm-5 col-xs-12">
                                      <div class="form-group1">
                                        <label for="email">Import File <span className="text-danger">*</span></label>
                                        <div class="choosefile">
                                          <input type="file" accept=".xlsx" onChange={(e) => setuploadfile(e.target.files[0])} class="p-2 form-control my-auto" id="email" placeholder="No File Choosen" />
                                          {/* <span class="input-group-addon" >Choose File</span>  */}
                                        </div>
                                      </div>
                                      <div class="choosefilediv">
                                        <ul>
                                          <li type="button" onClick={() => { downloadSampleFile() }}><iconify-icon icon="material-symbols:download"></iconify-icon> Download Sample File</li>
                                          <li>(File Type: Excel & CSV)</li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div class="col-md-2 col-sm-2 col-xs-12">
                                      <div class="form-group1">
                                        <div type="button" class="uploadbtn" ><a >Upload</a></div>
                                      </div>
                                    </div>
                                    <div class="col-md-2 col-sm-2 col-xs-12">
                                      <div class="form-group1">
                                        <div type="button" class="resetbtn"><a onClick={() => { setresultscreen(false); setresultscreen2(false) ;setselectedbrand("ATTA");setmarket("")}}>Reset</a></div>
                                      </div>
                                    </div>
                                  </div>

                                </div>

                              </div>}
                            </>}</div>

                        <div>

                        </div></div>

                      <div>

                      </div>
                      {/* {scenarionewoldscreen === 'old' && <div className="d-flex flex-row-reverse">
                        <button className="btngreentheme  p-2 mx-1" onClick={handleButtonClick2}>
                          Import File
                        </button>
                        <input
                          type="file"
                          accept={".xlsx"}
                          ref={fileInputRef2}
                          style={{ display: "none" }}
                          onChange={handleFileUploadoldscenario2}
                        />
                      </div>} */}
                      {scenarionewoldscreen === "old" && selectedscenarioname!=="Base Scenario" && <div class="submitfrmtbtn mb-2" type="button" onClick={() => {
                        // fetchdatasettable()
                        handlesimulate()
                      }}><span>Simulate <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                      </div>}


                    </div>



                  </div> : "Loading..."}
              </div>
           </>}
          
          <div></div>
         </div>
          </div>






    <div className='' >
      <FooterPages />
    </div>
  </>
    
  )
}

export default SavedScenariosAtta