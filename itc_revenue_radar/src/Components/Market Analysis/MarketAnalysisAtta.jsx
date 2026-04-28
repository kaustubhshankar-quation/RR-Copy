import React, { useEffect, useState } from "react";
import 'spiketip-tooltip/spiketip.min.css'
import { Link } from "react-router-dom";
import UserService from "../../services/UserService.js";
import AuthService from "../../services/AuthService.js";
import Select, { components } from "react-select";
import axios from "axios";
import { useDispatch } from "react-redux";
import getNotification from "../../Redux/Action/action.js";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import Plot from "react-plotly.js";
import Loader from "react-js-loader";
import FooterPages from '../Footer/FooterPages.jsx'
import Chart from "react-apexcharts";
import Navbar3 from "../Navbars/Navbar3.jsx";
import SubNavbar from "../Navbars/SubNavbar.jsx";
import LoaderCustom from "../LoaderCustom.jsx";

import LineChartMarketAnalysis from "./LineChartMarketAnalysis.jsx";
import BarChartMarketAnalysis from "./BarChartMarketAnalysis.jsx";
import BarChartMarketAnalysisAtta from "./BarChartMarketAnalysisAtta.jsx";
import LineChartMarketAnalysisAtta from "./LineChartMarketAnalysisAtta.jsx";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
// const { REACT_APP_UPLOAD_DATA } = process.env;
function MarketAnalysisAtta() {
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
  const [selectedvariable, setselectedvariable] = useState("");
  const [plotdataweekly, setplotdataweekly] = useState({});
  const [plotdatamonthly, setplotdatamonthly] = useState({});

  const [statisticsdata1, setstatisticsdata1] = useState([]);
  const [corelationdata, setcorelationdata] = useState([]);
  const dispatch = useDispatch();
  const [reportName, setreportName] = useState("");
  const [subvariablesoptions, setsubvariablesoptions] = useState([])
  const [variablesoptions, setvariablesoptions] = useState([])

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
              { value: "selectAll", label: "Select All" }, // Add Select All option
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/allmarketanalysis`,
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
          market: market,
          variant: selectedvariant,
          key: selectedgrammage


        }

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_variables`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = market?.length > 0 ? await axios(config) : [];
        // console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {
          setvariablesoptions(
            [
              // Add Select All option
              ...getResponse.data?.filter(
                (item) => !ExceptionVariables?.zeroOrOneVariables?.includes(item.attribute_name)
              )?.map((it) => ({
                value: it,
                label: it,
              })),
            ]
          );
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
          "market": market
        }
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_variant`,
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
          market: market,
          variant: selectedvariant
        }


        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_key`,
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

  const handlecheckboxesselection = (selection) => {


    if (selection?.length > 1) {
      dispatch(getNotification({ message: "Only 1 variable allowed at one time!!", type: "danger" }))
      //document.getElementById(`${arr[0]}`).checked=false;        
      // arr.shift();
    }
    else {
      const arr = []
      selection.map((it) => {
        arr.push(it.value)
      })

      setvariable(arr);
    }

  };
  const handlebrandanalysis = async () => {
    if (UserService.isLoggedIn()) {
      if (variable && selectedbrand && startDate && endDate && market.length > 0 && selectedvariable) {
        try {

          setloader(true);
          let arr1 = []
          let arr2 = []
          if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[0].attribute_name)) {
            arr1 = ExceptionVariables.tv_Aggregated_Variables_grp
          }
          else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[1].attribute_name)) {
            arr1 = ExceptionVariables.tv_Aggregated_Variables_inr
          }
          else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[2].attribute_name)) {
            arr1 = ExceptionVariables.cp_Aggregated_Variables_inr
          }
          else if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[3].attribute_name)
            || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[4].attribute_name)
            || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[5].attribute_name)) {
            selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[3].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapi[3].attribute_name)
            selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[4].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapi[4].attribute_name)
            selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[5].attribute_name) && arr2.push(ExceptionVariables.additionstogetvariablesapi[5].attribute_name)
            arr1 = selectedvariable
          }
          const requestData =
          {
            start_date: `${startDate} 00:00:00.000`,
            end_date: `${endDate} 00:00:00.000`,
            "market": market,
            "variant": selectedvariant,
            "key": selectedgrammage,
            "variable": selectedvariable
          }


          const config2 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_market_analysis`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const config1 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/monthly_brandanalysis`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          //const getResponse1 = await axios(config1);
          const getResponse2 = await axios(config2);

          if (getResponse2.status === 200) {

            if (getResponse2.data[0] !== "Invalid User!") {

              //setplotdataweekly(getResponse1.data?.market_data)
              setplotdatamonthly(getResponse2.data)

              setresultscreen(true);
              setdisplaynames({
                ...displaynames,
                startDate: startDate,
                endDate: endDate,
                selectedbrand: selectedbrand,
                variable: selectedvariable,
                market: market,
                variant: selectedvariant,
                grammage: selectedgrammage,
                type: getResponse2.data[0]?.units
              })
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
            markets: displaynames.market,
            variable: displaynames.variable,
            user_created_by: UserService.getUsername(),
            created_on: new Date().toISOString().split("T")[0],
            screen: "M_A"

          };
          const config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/saveMAReport`,
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
          variables: [selectedvariable],
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


      <div className="bgpages">
        <div className=' mx-5'>
          <div className='breadcrumb '>{`Dashboard >> Market Analysis`}</div>
          <div className='pageheading d-flex justify-content-between align-items-center my-2 px-3 py-2' style={{ fontSize: "20px" }}>
            <b className="my-auto">Market Analysis</b>
            {resultscreen && <div className="">
              <button className="btn btn-orange  mx-1  mb-1" onClick={() => { setmodifybtn(false); setresultscreen(false); setselectedvariable(""); setmarket([]); setselectedbrand(''); setvariablesoptions([]); setmarketoptions([]) }}>Reset</button>
              <button className="btn btn-info fw-semibold" style={{ color: 'black' }} onClick={() => setmodifybtn(!modifybtn)}>
                {modifybtn ? 'Close' : 'Modify'}
              </button>
            </div>}
          </div>

          {
            modifybtn &&
            <div className="card shadow-lg rounded-4 p-4 my-3 border-0">
              <div className="container-fluid">
                {/* Row 1 - Dates & Market */}
                <div className="row g-3 align-items-end">
                  {/* Start Date */}
                  <div className="col-md-3 col-sm-6">
                    <label htmlFor="StartDate" className="form-label fw-bold">
                      <strong>Start Date</strong>
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
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
                      placeholder="Start Date"
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-md-3 col-sm-6">
                    <label htmlFor="EndDate" className="form-label fw-bold">
                      <strong>End Date</strong>
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="EndDate"
                      value={endDate}
                      onChange={(e) => {
                        if (e.target.value >= startDate) {
                          setEndDate(e.target.value);
                        } else {
                          alert("Please enter End date after start date");
                        }
                      }}
                      placeholder="End Date"
                    />
                  </div>

                  {/* Market */}
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label fw-bold">
                      <strong>Market</strong>
                      <span className="text-danger">*</span>
                    </label>
                    <Select
                      placeholder="Select Market/Markets"
                      options={marketoptions}
                      isMulti
                      value={
                        market
                          ? market.map((it) => ({ label: it, value: it }))
                          : null
                      }
                      onChange={(value) => {
                        if (value.some((item) => item.value === "selectAll")) {
                          setmarket(
                            marketoptions
                              .filter((it) => it.value !== "selectAll")
                              .map((option) => option.value)
                          );
                        } else {
                          setmarket(value.map((it) => it.value));
                        }
                        setselectedgrammage("");
                        setselectedvariant("");
                        setselectedvariable("");
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-md-2 col-sm-12 text-center">
                    <button
                      id="subm"
                      className="btn btn-dark w-100"
                      onClick={handlebrandanalysis}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Row 2 - Product Hierarchy & Others */}
                <div className="row g-3 mt-3">
                  {/* Product Hierarchy */}
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label fw-bold">
                      <strong>Prod Hierarchy</strong>
                      <span className="text-danger">*</span>
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
                        setselectedvariable("");
                      }}
                    />
                  </div>

                  {/* Grammage */}
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label fw-bold">
                      <strong>Grammage Wise Variant</strong>
                      <span className="text-danger">*</span>
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
                        setselectedvariable("");
                      }}
                    />
                  </div>

                  {/* Marketing Inputs */}
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label fw-bold">
                      <strong>Marketing Inputs</strong>
                      <span className="text-danger">*</span>
                    </label>
                    <Select
                      placeholder="Select Marketing Input"
                      options={variablesoptions}
                      value={
                        selectedvariable
                          ? { label: selectedvariable, value: selectedvariable }
                          : null
                      }
                      onChange={(value) => setselectedvariable(value.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          }

          <div className=" my-3 ">
            <div className=" " >
              {
                loader ?
                  (
                    <div
                      className="row d-flex  justify-content-center align-items-center "
                      style={{ height: "75vh" }}
                    >
                      <LoaderCustom text="Fetching Market Analysis Report...." />
                    </div>
                  ) : resultscreen ?
                    <div>
                      {resultscreen && displaynames.selectedbrand?.length > 0 && (
                        <div className="bg-white p-3 my-2">
                          <span className="text-success" style={{ fontSize: "17px" }}>
                            <b>User Selections</b>
                          </span>

                          <div className="d-flex justify-content-between my-2 flex-wrap">
                            <div className="mx-3">
                              <strong>Start Date: </strong>
                              <span className="mx-1">{displaynames.startDate}</span>
                            </div>
                            <div className="mx-3">
                              <strong>End Date: </strong>
                              <span className="mx-1">{displaynames.endDate}</span>
                            </div>
                            <div className="mx-3">
                              <strong>Market: </strong>
                              <span style={{ color: "black" }} className="mx-1 d-flex flex-wrap">
                                {displaynames.market?.length > 1
                                  ? displaynames.market.map((brand, index) =>
                                    `${brand}${index !== displaynames.market.length - 1 ? ", " : ""
                                    }`
                                  )
                                  : displaynames.market.map((brand) => `${brand}`)}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between flex-wrap">
                            <div className="mx-3">
                              <strong>Variant: </strong>
                              <span className="mx-1">{displaynames.variant}</span>
                            </div>
                            <div className="mx-3">
                              <strong>Grammage Wise: </strong>
                              <span className="mx-1">{displaynames.grammage}</span>
                            </div>
                            <div className="mx-3">
                              <strong>Marketing Input: </strong>
                              <span className="mx-1 inputs" style={{ color: "black" }}>
                                {displaynames?.variable}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="chartmarket-container">
                        <div className="chartmarket">
                          {displaynames?.variable === "Sales_Volume" ||
                            displaynames?.variable === "Sales_Value" ? (
                            <LineChartMarketAnalysisAtta
                              plotdataweekly={plotdataweekly}
                              plotdatamonthly={plotdatamonthly}
                              displaynames={displaynames}
                            />
                          ) : (
                            <BarChartMarketAnalysisAtta
                              plotdataweekly={plotdataweekly}
                              plotdatamonthly={plotdatamonthly}
                              displaynames={displaynames}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    :
                    <>
                      <div className="card p-4 shadow-sm rounded-4">
                        <div className="mx-2">
                          <div className="mb-3">
                            <strong>Brand: <span className="text-success">ATTA</span></strong>
                          </div>

                          <div>
                            {true ? (
                              <div className="row g-3">
                                {/* Start Date */}
                                <div className="col-md-4 col-sm-6">
                                  <label htmlFor="StartDate" className="form-label">
                                    <strong>Start Date</strong>
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    disabled={resultscreen}
                                    className="form-control p-2 rounded-3"
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
                                    placeholder="Start Date"
                                  />
                                </div>

                                {/* End Date */}
                                <div className="col-md-4 col-sm-6">
                                  <label htmlFor="EndDate" className="form-label">
                                    <strong>End Date</strong>
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    disabled={resultscreen}
                                    type="date"
                                    className="form-control p-2 rounded-3"
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

                                {/* Market */}
                                <div className="col-md-4 col-sm-12">
                                  <label className="form-label">
                                    <strong>Market</strong>
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Select
                                    placeholder="Select Market/Markets"
                                    options={marketoptions}
                                    isMulti
                                    value={market ? market.map((it) => ({ label: it, value: it })) : null}
                                    onChange={(value) => {
                                      if (value.some((item) => item.value === "selectAll")) {
                                        setmarket(
                                          marketoptions
                                            .filter((it) => it.value !== "selectAll")
                                            .map((option) => option.value)
                                        );
                                      } else {
                                        setmarket(value.map((it) => it.value));
                                      }
                                      setselectedgrammage("");
                                      setselectedvariant("");
                                      setselectedvariable("");
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              "Loading..."
                            )}
                          </div>

                          {/* Variants Section */}
                          <div>
                            {variantoptions?.length > 0 && (
                              <>
                                <div className="row g-3 mt-2">
                                  {/* Prod Hierarchy */}
                                  <div className="col-md-4 col-sm-12">
                                    <label className="form-label">
                                      <strong>Prod Hierarchy</strong>
                                      <span className="text-danger">*</span>
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
                                        setselectedvariable("");
                                      }}
                                    />
                                  </div>

                                  {/* Grammage */}
                                  <div className="col-md-4 col-sm-12">
                                    <label className="form-label">
                                      <strong>Grammage Wise Variant</strong>
                                      <span className="text-danger">*</span>
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
                                        setselectedvariable("");
                                      }}
                                    />
                                  </div>

                                  {/* Marketing Inputs */}
                                  <div className="col-md-4 col-sm-12">
                                    <label className="form-label">
                                      <strong>Marketing Inputs</strong>
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                      isDisabled={resultscreen}
                                      placeholder="Select Marketing Input"
                                      options={variablesoptions}
                                      value={
                                        selectedvariable
                                          ? { label: selectedvariable, value: selectedvariable }
                                          : null
                                      }
                                      onChange={(value) => {
                                        setselectedvariable(value.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Submit Button */}
                                <div className="d-flex justify-content-center mt-4">
                                  <div class="submitfrmtbtn mb-2" type="button"
                                    onClick={() => { handlebrandanalysis(); }}>
                                    <span>Submit <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                                  </div>
                                </div>
                              </>
                            )}
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

export default MarketAnalysisAtta;
