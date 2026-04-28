import React, { useEffect, useState } from "react";
import 'spiketip-tooltip/spiketip.min.css'
import { Link } from "react-router-dom";
import UserService from "../../services/UserService.js";
import AuthService from "../../services/AuthService.js";
import Select, { components } from "react-select";
import axios from "axios";
import { useDispatch } from "react-redux";
import getNotification from "../../Redux/Action/action.js";
import Plot from "react-plotly.js";
import Loader from "react-js-loader";
import FooterPages from '../Footer/FooterPages.jsx'
import Chart from "react-apexcharts";
import Navbar3 from "../Navbars/Navbar3.jsx";
import SubNavbar from "../Navbars/SubNavbar.jsx";
import LoaderCustom from "../LoaderCustom.jsx";

import StackBarChart from "./StackBarChart.jsx";

import '../Brand Analysis/brand.css'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import LineBarChartBrandAnalysisAtta from "./LineBarChartBrandAnalysisAtta.jsx";
import StackBarChartAtta from "./StackBarChartAtta.jsx";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
// const { REACT_APP_UPLOAD_DATA } = process.env;

function BrandAnalysisAtta() {
  const [variantoptions, setvariantoptions] = useState([]);
  const [selectedvariant, setselectedvariant] = useState("");
  const [grammageoptions, setgrammageoptions] = useState([])
  const [selectedgrammage, setselectedgrammage] = useState("")
  const selectAllOption = { label: "Select All", value: "selectAll" };
  const [modifybtn, setmodifybtn] = useState(false)
  const [options, setoptions] = useState({})
  const [salesdata, setsalesdata] = useState([])
  const [displaynames, setdisplaynames] = useState({});
  const [currentScreen, setcurrentScreen] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandoptions, setbrandoptions] = useState([]);
  const [marketoptions, setmarketoptions] = useState([]);
  const [market, setmarket] = useState([]);
  const [loader, setloader] = useState(false);
  const [resultscreen, setresultscreen] = useState(false);
  const [selectedbrand, setselectedbrand] = useState("ATTA");
  const [variableslist, setvariableslist] = useState([]);
  const [variable, setvariable] = useState([]);
  const [selectedvariable, setselectedvariable] = useState([]);
  const [plotdataweekly, setplotdataweekly] = useState({});
  const [plotdatamonthly, setplotdatamonthly] = useState({});
  const [statisticsdata1, setstatisticsdata1] = useState([]);
  const [corelationdata, setcorelationdata] = useState([]);
  const dispatch = useDispatch();
  const [reportName, setreportName] = useState("");
  const [subvariablesoptions, setsubvariablesoptions] = useState([])
  const [variablesoptions, setvariablesoptions] = useState([])
  const [uniquetypes, setuniquetypes] = useState([])
  const [selectedsubvariables1, setselectedsubvariables1] = useState([])
  const [selectedsubvariables2, setselectedsubvariables2] = useState([])
  const [selectedsubvariables3, setselectedsubvariables3] = useState([])
  useEffect(() => {

    handlefetchmarket();
    handledatesfetch();

  }, []);

  useEffect(() => {
    handlefetchvariant()
  }, [market])
  useEffect(() => {
    handlefetchkeys()
  }, [selectedvariant])
  useEffect(() => {
    handlefetchvariables()
  }, [selectedgrammage])
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
            [
              // Add Select All option
              ...getResponse.data.markets?.map((it) => ({
                value: it.final_market,
                label: it.final_market,
              })),
            ]
          );
        }
      } catch (err) {

      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attabrandanalysis`,
        });
      }, 1000);
    }
  };
  const handlefetchvariables = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();

        const requestData = {
          start_date: `${startDate} 00:00:00.000`,
          end_date: `${endDate} 00:00:00.000`,
          market: market[0],
          variant: selectedvariant,
          key: selectedgrammage


        }

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/b_a/atta_get_variables`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = await axios(config);
        // console.log(getResponse)
        if (getResponse.status === 200) {
          let arr = getResponse?.data?.filter(
            (item) => !ExceptionVariables?.zeroOrOneVariables?.includes(item.attribute_name)
          );
          arr.sort((a, b) => a.attribute_name.localeCompare(b.attribute_name));
          arr.push(...ExceptionVariables?.additionstogetvariablesapiatta)

          console.log(arr)

          setvariablesoptions(arr)
          setuniquetypes(Array.from(new Set(arr?.map((item => {
            return item.type
          })))))
        }
      } catch (err) {

      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attamarketanalysis`,
        });
      }, 1000);
    }
  };
  const handlefetchvariant = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("market", market)
        const requestData = {
          "market": market[0]
        }
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/b_a/atta_get_variant`,
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
          setvariantoptions(getResponse.data?.map((it) => {
            return { label: it, value: it }
          }))
        }
      } catch (err) {

      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attamarketanalysis`,
        });
      }, 1000);
    }
  };
  const handlefetchkeys = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        const requestData = {
          start_date: `${startDate} 00:00:00.000`,
          end_date: `${endDate} 00:00:00.000`,
          market: market[0],
          variant: selectedvariant
        }


        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/b_a/atta_get_key`,
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
          setgrammageoptions(getResponse.data?.map((it) => {
            return { label: it, value: it }
          }))
        }
      } catch (err) {

      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/attamarketanalysis`,
        });
      }, 1000);
    }
  };
  const reverseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

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

  const handledatesfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        const config = {
          method: "get",
          url: `${REACT_APP_UPLOAD_DATA}/app/b_a/atta_get_date`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        if (getResponse.data !== "Invalid User!") {
          setStartDate(getResponse.data.start_date?.split("T")[0]);
          setEndDate(getResponse.data.end_date?.split("T")[0]);


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


  const handlecheckboxesselection = (e, item) => {
    if (e.target.checked) {
      if (e.target.value === ExceptionVariables.additionstogetvariablesapiatta[0].attribute_name || e.target.value === ExceptionVariables.additionstogetvariablesapiatta[1].attribute_name
        || e.target.value === ExceptionVariables.additionstogetvariablesapiatta[2].attribute_name
        //  || e.target.value === ExceptionVariables.additionstogetvariablesapiatta[3].attribute_name ||
        // e.target.value === ExceptionVariables.additionstogetvariablesapiatta[4].attribute_name ||
        // e.target.value === ExceptionVariables.additionstogetvariablesapiatta[5].attribute_name
      ) {
        selectedvariable?.map((variable) => {
          document.getElementById(variable).checked = false
        })
        const arr = []
        arr.push(item.attribute_name)
        setselectedvariable(arr);
      }
      else {
        if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[0].attribute_name) || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[1].attribute_name) ||
          selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[2].attribute_name)
          // || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[3].attribute_name) ||
          //     selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[4].attribute_name) ||
          //     selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[5].attribute_name)
        ) {
          e.target.checked = false;
          dispatch(getNotification({ message: "Aggregated variable already selected!!", type: "danger" }))
        }
        else {
          if (false) {
            dispatch(getNotification({ message: "Only 6 variable allowed at one time!!", type: "danger" }))
            e.target.checked = false;
          }
          else {
            const arr = [...selectedvariable]
            arr.push(item.attribute_name)
            setselectedvariable(arr);
          }
        }
      }

    }

    else {
      let arr = [...selectedvariable]
      arr = arr.filter(variable => variable !== item.attribute_name);
      setselectedvariable(arr);
    }


  };
  const handlebrandanalysis = async () => {
    if (UserService.isLoggedIn()) {
      if (selectedbrand && startDate && endDate && market?.length > 0 && selectedvariable?.length > 0) {
        try {
          let arr1 = []
          let arr2 = []
          console.log(selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[0].attribute_name))
          if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[0].attribute_name)) {
            arr1 = variablesoptions?.filter((it) =>
              it.attribute_name.startsWith("Aashirvaad")

            )?.map((it) => it.attribute_name)

          }
          else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[1].attribute_name)) {
            arr1 = ExceptionVariables.tp_Aggregated_Variables_inr
          }
          else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[2].attribute_name)) {
            arr1 = ExceptionVariables.cp_Aggregated_Variables_inr_atta
          }
          // else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[3].attribute_name) 
          //   || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[4].attribute_name) 
          // || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[5].attribute_name)) {
          //   selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[3].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapiatta[3].attribute_name)
          //   selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[4].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapiatta[4].attribute_name)
          //   selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapiatta[5].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapiatta[5].attribute_name)
          //   arr1 = selectedvariable
          // }

          else {
            arr1 = selectedvariable
          }

          //           arr1 = arr1.filter(it => !arr2.includes(it));
          if (arr1.length === 0) {
            dispatch(getNotification({
              message: "There are no variables present in selected category!",
              type: "danger"
            }))
            return
          }
          setloader(true);
          const requestData =
          {
            start_date: `${startDate} 00:00:00.000`,
            end_date: `${endDate} 00:00:00.000`,
            "market": market[0],
            "variant": selectedvariant,
            "key": selectedgrammage,
            "variable": arr1
          }


          const config1 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/b_a/get_brand_analysis`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          // const config2 = {
          //   method: "post",
          //   url: `${REACT_APP_UPLOAD_DATA}/app/monthly_brandanalysis`,
          //   headers: {
          //     Accept: "application/json",
          //     "Content-Type": "application/json",
          //   },
          //   data: requestData,
          // };
          const getResponse1 = await axios(config1);
          // const getResponse2 = await axios(config2);

          if (getResponse1.status === 200 && getResponse1.data?.length > 0) {

            if (getResponse1.data[0] !== "Invalid User!") {
              let arr1 = [...getResponse1.data]
              //  arr1=arr1.map((it)=>{
              //   return {...it,
              //   variables:[...it.variables,...it.variable_types]}
              //  })

              //  let arr2=[...getResponse2.data?.market_data]
              //  arr2=arr2.map((it)=>{
              //   return {...it,
              //   variables:[...it.variables,...it.variable_types]}
              //  })

              //setplotdataweekly(arr1)
              setplotdatamonthly(arr1)


              setresultscreen(true);
              setdisplaynames({
                ...displaynames,
                startDate: startDate,
                endDate: endDate,
                selectedbrand: selectedbrand,
                variable: selectedvariable,
                market: market,
                variant: selectedvariant,
                grammage: selectedgrammage

              })
            }
            else if (getResponse1.data[0] === "Invalid User!") {
              UserService.doLogin({
                redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
              });
            }
          }
        } catch (err) {
          //handleMouseEnter();
          setresultscreen(false)
          setmodifybtn(false)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
        });
      }, 1000);
    }
    setloader(false);
  };

  const fetchstatisticsdata = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const requestData = {
          // jwttoken: UserService.getToken(),
          start_date: startDate,
          end_date: endDate,
          variables: [variable],
          brand: selectedbrand,
        };

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/statistics`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: requestData,
        };
        const getResponse = await axios(config);

        // setplot1list(Array.from(getResponse.data));
        if (getResponse.status === 200) {
          if (getResponse.data === "No Records Found." || getResponse.data === "42883: function round(real, integer) does not exist\n\nPOSITION: 25") {
            dispatch(
              getNotification({
                message: "There are no statistics record",
                type: "default",
              })
            );
          } else {

            setstatisticsdata1(getResponse.data);
          }

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
  const handlesavereport = async () => {
    if (UserService.isLoggedIn()) {
      if (reportName && variable && selectedbrand && startDate && endDate) {
        try {
          setloader(true);

          const requestData = {
            report_name: reportName,
            start_date: displaynames.startDate,
            end_date: displaynames.endDate,
            brand: displaynames.selectedbrand,
            market: displaynames.market[0],
            variables: displaynames.variable,
            user_created_by: UserService.getUsername(),
            created_on: new Date().toISOString().split("T")[0],
            screen: "B_A"
          };
          const config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/saveBAReport`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const getResponse = await axios(config);

          // setplot1list(Array.from(getResponse.data));
          if (getResponse.status === 200) {
            document.getElementById("closemodal").click()
            dispatch(
              getNotification({
                message: `${getResponse?.data}`,
                type: "success",
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
            document.getElementById("closemodal").click()
            dispatch(
              getNotification({
                message: err.response.data,
                type: "danger",
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
        });
      }, 1000);
    }
    setloader(false);
  };
  const fetchcorelationdata = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const requestData = {
          // jwttoken: UserService.getToken(),
          start_date: startDate,
          end_date: endDate,
          variables: selectedvariable,
          brand: selectedbrand,
        };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/correlation`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: requestData,
        };
        const getResponse = await axios(config);
        // setplot1list(Array.from(getResponse.data));
        if (getResponse.status === 200) {
          if (getResponse.data === "No Records Found.") {
            dispatch(
              getNotification({
                message: "There are not statistics record",
                type: "default",
              })
            );
          } else {
            setcorelationdata(getResponse.data.matrix);
          }
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
  function matchHeights() {
    // Get the elements
    var element1 = document.getElementById('sidenav');
    var element2 = document.getElementById('mainscreen');

    var maxHeight = Math.max(element1.offsetHeight, element2.offsetHeight);


    // Set the height of both elements

    element1.style.height = maxHeight + 25 + 'px';
    element2.style.height = maxHeight + 'px';
    // console.log(element1.style.height,element2.style.height)
  }
  return (
    <>
      {/* save report modal */}

      <div
        class="modal "
        id="exampleModal1"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div className="modal-content" >
            <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
              <h6 class="modal-title" id="exampleModalLabel">
                Save Report
              </h6>
              <button
                type="button"
                class="close"
                id="closemodal"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label>Please enter report Name: </label>
              <input
                type="text"
                id="reportnamebox"
                className="form-control"
                value={reportName}
                onChange={(e) => setreportName(e.target.value)}
              />

              <br />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                onClick={() => {
                  if (reportName === "") {
                    document.getElementById("reportnamebox").focus();
                  } else {
                    handlesavereport();
                  }
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar3 />

      <div className="bgpages" style={{ userSelect: "none" }}>
        <div className=' mx-5'>
          <div className='breadcrumb '>{`Dashboard >> Brand Analysis`}</div>
          <div className='pageheading d-flex justify-content-between align-items-center my-2 px-3 py-2' style={{ fontSize: "20px" }}>
            <b className="my-auto">Brand Analysis</b>
            {resultscreen &&
              <div className="">
                <button className="btn btn-orange  mx-1 mb-1" onClick={() => { setmodifybtn(false); setresultscreen(false); setselectedvariable([]); setmarket([]); setselectedbrand(""); setvariablesoptions([]); setmarketoptions([]); }}>Reset</button>
                <button className="btn btn-info fw-semibold" style={{ color: 'black' }} onClick={() => setmodifybtn(!modifybtn)}>
                  {modifybtn ? 'Close' : 'Modify'}
                </button>
              </div>
            }
          </div>
          {/* Modify Button when Clicked */}
          {modifybtn && (
            <div className="card shadow border-0 rounded-4 p-4 my-4">
              <div className="container-fluid">
                {/* Filters row */}
                <div className="row g-4">
                  {/* Start Date */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <label htmlFor="StartDate" className="form-label fw-semibold">
                      <strong>Start Date <span className="text-danger">*</span></strong>
                    </label>
                    <input
                      type="date"
                      className="form-control shadow-sm rounded-pill"
                      id="StartDate"
                      value={startDate}
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
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <label htmlFor="EndDate" className="form-label fw-semibold">
                      <strong>End Date <span className="text-danger">*</span></strong>
                    </label>
                    <input
                      type="date"
                      className="form-control shadow-sm rounded-pill"
                      id="EndDate"
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

                  {/* Brand Select */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <label className="form-label fw-semibold">
                      <strong>Brand: <span className="text-danger">*</span></strong>
                    </label>
                    <Select
                      className="w-100 shadow-sm rounded-pill"
                      placeholder="Select Brand"
                      options={brandoptions}
                      value={
                        selectedbrand
                          ? { label: selectedbrand, value: selectedbrand }
                          : null
                      }
                      onChange={(value) => {
                        setselectedbrand(value.value);
                        setselectedvariable([]);
                        setmarket([]);
                      }}
                    />
                  </div>

                  {/* Market Select */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <label className="form-label fw-semibold">
                      <strong>Market: <span className="text-danger">*</span></strong>
                    </label>
                    <Select
                      className="w-100 shadow-sm rounded-pill"
                      placeholder="Select Market"
                      options={marketoptions}
                      value={
                        market?.length > 0
                          ? market.map((it) => ({ label: it, value: it }))
                          : null
                      }
                      onChange={(value) => {
                        setmarket([value.value]);
                        let arr = [...selectedvariable];
                        arr.forEach((it) => {
                          const element = document.getElementById(it);
                          if (element) element.checked = false;
                        });
                        setselectedvariable([]);
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
                    <button
                      id="subm"
                      className="btn btn-primary w-100 rounded-pill shadow-sm fw-semibold"
                      onClick={handlebrandanalysis}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Accordion Section */}
                {market?.length > 0 && (
                  <div className="mt-5">
                    <h6 className="fw-bold mb-3 text-primary">
                      Select Marketing Inputs:
                    </h6>
                    <div className="accordion" id="accordionExample2">
                      {uniquetypes?.map((item, index) => (
                        <div className="accordion-item border-0 shadow-sm rounded-3 mb-3" key={index}>
                          <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                              className="accordion-button collapsed fw-semibold"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                              aria-expanded="false"
                              aria-controls={`collapse${index}`}
                            >
                              <i className="bi bi-funnel me-2 text-secondary"></i>
                              {item ? item : "All"}
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="accordion-body">
                              <div className="row g-2">
                                {variablesoptions?.map(
                                  (it, idx) =>
                                    it?.type === item && (
                                      <div
                                        key={idx}
                                        className="col-12 col-sm-6 col-md-4 d-flex align-items-center"
                                      >
                                        <input
                                          className="form-check-input me-2"
                                          type="checkbox"
                                          id={it.attribute_name}
                                          value={it.attribute_name}
                                          checked={selectedvariable?.includes(
                                            it.attribute_name
                                          )}
                                          onChange={(e) =>
                                            handlecheckboxesselection(e, it)
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={it.attribute_name}
                                        >
                                          {it.attribute_name}
                                        </label>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className=" my-3 ">
            <div className=" " >
              {loader ? (
                <div
                  className="row d-flex  justify-content-center align-items-center "
                  style={{ height: "75vh" }}
                >
                  <LoaderCustom text="Fetching Brand Analysis Report...." />
                </div>
              ) : resultscreen ?
                <div>
                  {resultscreen && displaynames.selectedbrand?.length > 0
                    // && displaynames.variableslist?.length>0
                    &&
                    <div className="bg-white p-2">
                      <span className="text-success" style={{ fontSize: "17px" }}>
                        <b>User Selections</b>
                      </span>

                      {/* Top row selections */}
                      <div className="row my-2">
                        <div className="col-md-3 col-sm-6 col-12 mb-2">
                          <strong><label>Start Date: </label></strong>
                          <label className="mx-1">{displaynames.startDate}</label>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12 mb-2">
                          <strong><label>End Date: </label></strong>
                          <label className="mx-1">{displaynames.endDate}</label>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12 mb-2">
                          <strong><label>Market: </label></strong>
                          <label className="mx-1">{displaynames?.market}</label>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12 mb-2">
                          <strong><label>Variant: </label></strong>
                          <label className="mx-1">{displaynames?.variant}</label>
                        </div>
                      </div>

                      {/* Grammage & Variables */}
                      <div className="row">
                        <div className="col-sm-2 col-12 mb-2">
                          <strong><label>Grammage: </label></strong>
                          <label className="mx-1 inputs">{displaynames.grammage}</label>
                        </div>

                        <div className="col-sm-10 col-12">
                          <strong><span>Variables: </span></strong>
                          <div
                            className="d-flex flex-wrap gap-2 mt-1"
                            style={{ maxWidth: "100%", wordWrap: "break-word" }}
                          >
                            {displaynames.variable?.map((brand, index) => (
                              <span
                                key={index}
                                className="badge bg-light text-dark px-2 py-1"
                                style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                              >
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  }

                  {
                    (
                      displaynames?.variable?.includes(ExceptionVariables.additionstogetvariablesapiatta[0].attribute_name) ||
                      displaynames?.variable?.includes(ExceptionVariables.additionstogetvariablesapiatta[1].attribute_name) ||
                      displaynames?.variable?.includes(ExceptionVariables.additionstogetvariablesapiatta[2].attribute_name)
                    ) ? (
                      <StackBarChartAtta
                        plotdataweekly={plotdataweekly}
                        plotdatamonthly={plotdatamonthly}
                        displaynames={displaynames}
                      />
                    ) :
                      <LineBarChartBrandAnalysisAtta plotdataweekly={plotdataweekly} plotdatamonthly={plotdatamonthly} displaynames={displaynames} />
                  }

                </div>
                :
                <>
                  <div className="card shadow-sm border-0 rounded-3 p-4">
                    {/* Header */}
                    <div className="mb-3">
                      <h6 className="fw-bold">
                        <strong>Brand: <span className="text-success">ATTA</span></strong>
                      </h6>
                    </div>

                    {/* Date & Market Row */}
                    <div className="row g-3">
                      {/* Start Date */}
                      <div className="col-12 col-md-4">
                        <label htmlFor="StartDate" className="form-label fw-semibold">
                          <strong>Start Date <span className="text-danger">*</span></strong>
                        </label>
                        <input
                          type="date"
                          disabled={resultscreen}
                          className="form-control"
                          id="StartDate"
                          value={startDate}
                          onChange={(e) => {
                            if (endDate) {
                              if (e.target.value <= endDate) setStartDate(e.target.value);
                              else alert("Entered start date is after end date");
                            } else {
                              setStartDate(e.target.value);
                            }
                          }}
                        />
                      </div>

                      {/* End Date */}
                      <div className="col-12 col-md-4">
                        <label htmlFor="EndDate" className="form-label fw-semibold">
                          <strong>End Date <span className="text-danger">*</span></strong>
                        </label>
                        <input
                          type="date"
                          disabled={resultscreen}
                          className="form-control"
                          id="EndDate"
                          value={endDate}
                          onChange={(e) => {
                            if (e.target.value >= startDate) setEndDate(e.target.value);
                            else alert("Please enter End date after start date");
                          }}
                        />
                      </div>

                      {/* Market Select */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          <strong>Market: <span className="text-danger">*</span></strong>
                        </label>
                        <Select
                          className="w-100"
                          placeholder="Select Market"
                          options={marketoptions}
                          value={
                            market?.length > 0
                              ? market.map((it) => ({ label: it, value: it }))
                              : null
                          }
                          onChange={(value) => {
                            setmarket([value.value]);
                            let arr = [...selectedvariable];
                            arr.forEach((it) => {
                              const element = document.getElementById(it);
                              if (element) element.checked = false;
                            });
                            setvariablesoptions([]);
                            setselectedvariable([]);
                            setvariantoptions([]);
                            setgrammageoptions([]);
                            setselectedvariant("");
                            setselectedgrammage("");
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Hierarchy Section */}
                    {variantoptions?.length > 0 && (
                      <div className="row g-3 mt-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            <strong>Prod Hierarchy: <span className="text-danger">*</span></strong>
                          </label>
                          <Select
                            placeholder="Select Prod Hierarchy"
                            options={variantoptions}
                            value={
                              selectedvariant
                                ? { label: selectedvariant, value: selectedvariant }
                                : null
                            }
                            onChange={(value) => {
                              setselectedvariant(value.value);
                              setselectedgrammage("");
                              setselectedvariable([]);
                              setgrammageoptions([]);
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            <strong>Grammage: <span className="text-danger">*</span></strong>
                          </label>
                          <Select
                            placeholder="Select Grammage"
                            options={grammageoptions}
                            value={
                              selectedgrammage
                                ? { label: selectedgrammage, value: selectedgrammage }
                                : null
                            }
                            onChange={(value) => {
                              setselectedgrammage(value.value);
                              setselectedvariable([]);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Marketing Inputs */}
                    {variablesoptions?.length > 0 && selectedgrammage && (
                      <div className="mt-4">
                        <strong> <h6 className="fw-bold mb-2">Select Marketing Inputs:</h6></strong>
                        <div className="accordion" id="accordionExample2">
                          {uniquetypes?.map((item, index) => (
                            <div className="accordion-item mb-2" key={index}>
                              <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse${index}`}
                                  aria-expanded="false"
                                  aria-controls={`collapse${index}`}
                                >
                                  <b>{item || "All"}</b>
                                </button>
                              </h2>
                              <div
                                id={`collapse${index}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${index}`}
                                data-bs-parent="#accordionExample2"
                              >
                                <div className="accordion-body">
                                  <div className="row g-2">
                                    {variablesoptions?.map(
                                      (it, idx) =>
                                        it?.type === item && (
                                          <div
                                            key={idx}
                                            className="col-12 col-sm-6 col-md-4 d-flex align-items-center"
                                          >
                                            <input
                                              className="form-check-input me-2"
                                              type="checkbox"
                                              id={it.attribute_name}
                                              value={it.attribute_name}
                                              checked={selectedvariable?.includes(
                                                it.attribute_name
                                              )}
                                              onChange={(e) =>
                                                handlecheckboxesselection(e, it)
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={it.attribute_name}
                                            >
                                              {it.attribute_name}
                                            </label>
                                          </div>
                                        )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center mt-4">
                      <div class="submitfrmtbtn mb-2" type="button" onClick={() => { handlebrandanalysis(); }}>
                        <span>Submit <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                      </div>
                    </div>
                  </div>
                </>

              }

            </div>
          </div>
        </div>
      </div>

      <div className='' >
        <FooterPages />
      </div>








































    </>
  );
}

export default BrandAnalysisAtta;
