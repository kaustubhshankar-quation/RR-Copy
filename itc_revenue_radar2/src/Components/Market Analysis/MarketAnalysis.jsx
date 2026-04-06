import React, { useEffect, useState } from "react";
import 'spiketip-tooltip/spiketip.min.css'
import { Link, useOutletContext } from "react-router-dom";
import UserService from "../../services/UserService.js";
import AuthService from "../../services/AuthService.js";
import Select, { components } from "react-select";
import axios from "axios";
import { useDispatch } from "react-redux";
import getNotification from "../../Redux/Action/action.js";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import maskedBrandOption from '../JSON Files/MaskedBrandOption.json'
import Plot from "react-plotly.js";
import Loader from "react-js-loader";
import FooterPages from '../Footer/FooterPages.jsx'
import Chart from "react-apexcharts";
import Navbar3 from "../Navbars/Navbar3.jsx";
import SubNavbar from "../Navbars/SubNavbar.jsx";
import LoaderCustom from "../LoaderCustom.jsx";
import { downloadPdf, uploadPDF } from "../HelperFunction/helperFunction.js";
import LineChartMarketAnalysis from "./LineChartMarketAnalysis.jsx";
import BarChartMarketAnalysis from "./BarChartMarketAnalysis.jsx";
import { toast } from "react-toastify";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
// const { REACT_APP_UPLOAD_DATA } = process.env;
function MarketAnalysis() {
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
  const [selectedbrand, setselectedbrand] = useState("");
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
    // handledatemenu();
    handlevariablesfetch();
    // handlevariablesmenu();
  }, []);
  useEffect(() => {
    handlefetchmarket()
  }, [selectedbrand])
  useEffect(() => {
    handlefetchvariables()
  }, [market])
  const handlefetchmarket = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/get_markets`,
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
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
          brand: selectedbrand,
          market: market,

        }

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/get_variables`,
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
              ...getResponse.data.vars_data?.filter(
                (item) => !ExceptionVariables?.zeroOrOneVariables?.includes(item.attribute_name)
              )?.map((it) => ({
                value: it.attribute_name,
                label: it.attribute_name,
              })),
            ]
          );
        }
      } catch (err) {

      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
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
          setStartDate(reverseDate(getResponse.data.dates[0].min[0].start_date));
          setEndDate(reverseDate(getResponse.data.dates[0].max[0].end_date));

          setbrandoptions(
            getResponse.data.brands?.filter(it => !ExceptionVariables?.brandoptionshide?.includes(it?.brand))?.map((it) => {
              return { value: it.brand, label: maskedBrandOption.maskedBrandOption[`${it.brand.trim().toUpperCase()}`] };
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
          const requestData = {
            start_date: startDate,
            end_date: endDate,
            variables: [selectedvariable],
            brand: selectedbrand,
            market: market,
            variable_type: []
          };

          const config1 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/brandanalysis`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const config2 = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/monthly_brandanalysis`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const getResponse1 = await axios(config1);
          const getResponse2 = await axios(config2);

          if (getResponse1.status === 200) {

            if (getResponse1.data[0] !== "Invalid User!") {

              setplotdataweekly(getResponse1.data?.market_data)
              setplotdatamonthly(getResponse2.data?.market_data)

              setresultscreen(true);
              setdisplaynames({
                ...displaynames,
                startDate: startDate,
                endDate: endDate,
                selectedbrand: selectedbrand,
                variable: selectedvariable,
                market: market,
                type: getResponse1.data[0]?.variables[0]?.units
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

  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const { theme } = useOutletContext();
  const isDark = theme === 'dark';
  const customMultiSelectStyles = {
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
      border: `1px solid ${isDark ? "#243041" : "#e2e8f0"}`,
      borderRadius: "16px",
      overflow: "hidden",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
      padding: "8px",
      maxHeight: "260px",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "12px",
      padding: "12px 14px",
      background: state.isSelected
        ? "linear-gradient(135deg, #2563eb 0%, #16a34a 100%)"
        : state.isFocused
          ? "rgba(37, 99, 235, 0.12)"
          : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#f8fafc" : "#0f172a",
    }),
    multiValue: (base) => ({
      ...base,
      background: "rgba(37, 99, 235, 0.12)",
      borderRadius: "10px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? "#f8fafc" : "#0f172a",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      "&:hover": {
        background: "rgba(239, 68, 68, 0.16)",
        color: "#ef4444",
      },
    }),
  };
  return (
    <>
      {/* Save Report Modal */}
      <div
        className="modal"
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content ma-modal-content">
            <div className="modal-header ma-modal-header">
              <h6 className="modal-title fw-bold" id="exampleModalLabel">
                Save Report
              </h6>
              <button
                type="button"
                className="ma-btn-close"
                id="closemodal"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <label className="ma-label mb-2">Please enter report name:</label>
              <input
                type="text"
                id="reportnamebox"
                className="form-control ma-input"
                value={reportName}
                onChange={(e) => setreportName(e.target.value)}
              />
            </div>

            <div className="modal-footer ma-modal-footer">
              <button
                type="button"
                className="ma-secondary-btn"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="ma-primary-btn"
                onClick={() => {
                  if (reportName === "") {
                    document.getElementById("reportnamebox").focus();
                  } else {
                    handlesavereport();
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ma-page">
        <div className="container-fluid px-3 px-md-4 py-3">
          <div className="ma-header-card">
            <div className="ma-header-left">
              <div className="ma-breadcrumb">Dashboard / Market Analysis</div>
              <h2 className="ma-page-title">Market Analysis</h2>
              <p className="ma-page-subtitle mb-0">
                Analyze market-level brand performance across selected date ranges,
                compare marketing inputs, and generate downloadable reports from a
                single workspace.
              </p>
            </div>

            {resultscreen && (
              <div className="ma-header-actions">
                <button
                  className="ma-secondary-btn"
                  style={{ minWidth: "120px" }}
                  onClick={() => {
                    setmodifybtn(false);
                    setresultscreen(false);
                    setselectedvariable("");
                    setmarket([]);
                    setselectedbrand("");
                    setvariablesoptions([]);
                    setmarketoptions([]);
                    setDownloadUrl("");
                  }}
                  disabled={loading}
                >
                  Reset
                </button>

                <button
                  className="ma-outline-btn"
                  style={{ minWidth: "120px" }}
                  onClick={() => setmodifybtn(!modifybtn)}
                  disabled={loading}
                >
                  {modifybtn ? "Close" : "Modify"}
                </button>

                {loading ? (
                    <button className="ma-disabled-btn" style={{ minWidth: "120px" }} disabled>
                      Preparing your Report...
                    </button>
                  ) : downloadUrl ? (
                    <button
                      className="ma-outline-btn"
                      style={{ minWidth: "120px" }}
                      onClick={() => {
                        setIsDownloading(true);
                        downloadPdf(downloadUrl, () => setIsDownloading(false));
                      }}
                      disabled={isDownloading}
                    >
                      {isDownloading ? "Dowloading...." : "Download Report"}
                    </button>
                  ) : (
                    <button
                      className="ma-primary-btn"
                      style={{ minWidth: "120px" }}
                      // onClick={() => {
                      //   const file_name = prompt(
                      //     "Enter the Report Name to Genrate the Report"
                      //   );
                      //   if (file_name) {
                      //     uploadPDF(
                      //       document.getElementById("pdfConvertible"),
                      //       file_name,
                      //       selectedbrand,
                      //       "Market_Analysis",
                      //       setLoading,
                      //       setDownloadUrl
                      //     );
                      //   } else {
                      //     alert("File Name can't be empty!!!");
                      //   }
                      // }}
                      onClick={()=>{toast.warning('The Feature will be live from 09 April,2026.')}}
                    >
                      Generate Report
                    </button>
                  )}
              </div>
            )}
          </div>

          {modifybtn && (
            <div className="ma-section-card">
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-3">
                  <label htmlFor="StartDateModify" className="ma-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control ma-input"
                    id="StartDateModify"
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

                <div className="col-12 col-md-6 col-lg-3">
                  <label htmlFor="EndDateModify" className="ma-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control ma-input"
                    id="EndDateModify"
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

                <div className="col-12 col-md-6 col-lg-3">
                  <label className="ma-label">
                    Brand <span className="text-danger">*</span>
                  </label>
                  <Select
                    classNamePrefix="ma-select"
                    placeholder="Select Brand"
                    options={brandoptions}
                    value={
                      maskedBrandOption.maskedBrandOption[selectedbrand]
                        ? {
                          label:
                            maskedBrandOption.maskedBrandOption[selectedbrand],
                          value: selectedbrand,
                        }
                        : null
                    }
                    onChange={(value) => {
                      setselectedbrand(value.value);
                      setselectedvariable("");
                      setmarket([]);
                    }}
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                <div className="mt-3 d-flex justify-content-center">
                  <div
                    className="ma-submit-cta w-100"
                    onClick={() => handlebrandanalysis()}
                  >
                    <span>
                      Submit{" "}
                      <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                    </span>
                  </div>
                </div>
              </div>

              <div className="ma-inner-card mt-4">
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="ma-label">
                      Market <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="ma-select"
                      placeholder="Select Market(s)"
                      options={marketoptions}
                      isMulti
                      value={
                        market
                          ? market.map((it) => ({ label: it, value: it }))
                          : null
                      }
                      onChange={(value) => {
                        if (!value || value.length === 0) {
                          setmarket([]);
                          setselectedvariable("");
                          return;
                        }

                        if (value.some((item) => item.value === "selectAll")) {
                          setmarket(
                            marketoptions
                              .filter((it) => it.value !== "selectAll")
                              .map((option) => option.value)
                          );
                        } else {
                          setmarket(value.map((it) => it.value));
                        }
                        setselectedvariable("");
                      }}
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      styles={customMultiSelectStyles}
                    />
                  </div>

                  <div className="col-12 col-lg-6">
                    <label className="ma-label">
                      Marketing Inputs <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="ma-select"
                      placeholder="Select Marketing Input"
                      options={variablesoptions}
                      value={
                        selectedvariable
                          ? { label: selectedvariable, value: selectedvariable }
                          : null
                      }
                      onChange={(value) => {
                        setselectedvariable(value?.value || "");
                      }}
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      styles={customMultiSelectStyles}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="my-3">
            {loader ? (
              <div
                className="row d-flex justify-content-center align-items-center"
                style={{ height: "75vh" }}
              >
                <LoaderCustom text="Fetching Market Analysis Report...." />
              </div>
            ) : resultscreen ? (
              <div id="pdfConvertible" className="w-100">
                {resultscreen && displaynames.selectedbrand?.length > 0 && (
                      <div className="ma-inner-card">
                        <div className="row g-3">
                          <div className="col-12 col-md-4">
                            <div className="ma-meta-card">
                              <strong>Start Date</strong>
                              <div className="ma-meta-value">
                                {displaynames.startDate}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-4">
                            <div className="ma-meta-card">
                              <strong>End Date</strong>
                              <div className="ma-meta-value">
                                {displaynames.endDate}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-4">
                            <div className="ma-meta-card">
                              <strong>Brand</strong>
                              <div className="ma-meta-value">
                                {maskedBrandOption.maskedBrandOption[selectedbrand]}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-7">
                            <div className="ma-meta-card">
                              <strong>Market</strong>
                              <div
                                className="ma-meta-value"
                                style={{ wordBreak: "break-word" }}
                              >
                                {displaynames.market?.length > 1
                                  ? displaynames.market.join(", ")
                                  : displaynames.market?.[0]}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-5">
                            <div className="ma-meta-card">
                              <strong>Marketing Inputs</strong>
                              <div
                                className="ma-meta-value"
                                style={{ wordBreak: "break-word" }}
                              >
                                {displaynames?.variable}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="ma-mini-card mt-4">
                      {displaynames?.variable === "Sales_Volume" ||
                        displaynames?.variable === "Sales_Value" ? (
                        <LineChartMarketAnalysis
                          plotdataweekly={plotdataweekly}
                          plotdatamonthly={plotdatamonthly}
                          displaynames={displaynames}
                        />
                      ) : (
                        <BarChartMarketAnalysis
                          plotdataweekly={plotdataweekly}
                          plotdatamonthly={plotdatamonthly}
                          displaynames={displaynames}
                        />
                      )}
                    </div>
                  </div>
            ) : (
              <>
                {brandoptions?.length > 0 ? (
                  <div className="ma-section-card">
                    <div className="row g-3">
                      <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="StartDate" className="ma-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          disabled={resultscreen}
                          className="form-control ma-input"
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

                      <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="EndDate" className="ma-label">
                          End Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          disabled={resultscreen}
                          className="form-control ma-input"
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

                      <div className="col-12 col-lg-4">
                        <label className="ma-label">
                          Brand <span className="text-danger">*</span>
                        </label>
                        <Select
                          classNamePrefix="ma-select"
                          placeholder="Select Brand"
                          options={brandoptions}
                          value={
                            maskedBrandOption.maskedBrandOption[selectedbrand]
                              ? {
                                label:
                                  maskedBrandOption.maskedBrandOption[
                                  selectedbrand
                                  ],
                                value: selectedbrand,
                              }
                              : null
                          }
                          onChange={(value) => {
                            setselectedvariable("");
                            setmarket([]);
                            setselectedbrand(value.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={customMultiSelectStyles}
                        />
                      </div>
                    </div>

                    <div className="ma-inner-card mt-4">
                      <div className="row g-3">
                        <div className="col-12 col-lg-7">
                          <label className="ma-label">
                            Market <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="ma-select"
                            placeholder="Select Market/Markets"
                            options={marketoptions}
                            isMulti
                            value={
                              market
                                ? market.map((it) => ({ label: it, value: it }))
                                : null
                            }
                            onChange={(value) => {
                              if (!value || value.length === 0) {
                                setmarket([]);
                                setselectedvariable("");
                                return;
                              }

                              if (
                                value.some((item) => item.value === "selectAll")
                              ) {
                                setmarket(
                                  marketoptions
                                    .filter((it) => it.value !== "selectAll")
                                    .map((option) => option.value)
                                );
                              } else {
                                setmarket(value.map((it) => it.value));
                              }
                              setselectedvariable("");
                            }}
                            menuPlacement="auto"
                            menuPortalTarget={document.body}
                            styles={customMultiSelectStyles}
                          />
                        </div>

                        <div className="col-12 col-lg-5">
                          <label className="ma-label">
                            Marketing Inputs <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="ma-select"
                            isDisabled={resultscreen}
                            placeholder="Select Marketing Input"
                            options={variablesoptions}
                            value={
                              selectedvariable
                                ? {
                                  label: selectedvariable,
                                  value: selectedvariable,
                                }
                                : null
                            }
                            onChange={(value) => {
                              setselectedvariable(value?.value || "");
                            }}
                            menuPlacement="auto"
                            menuPortalTarget={document.body}
                            styles={customMultiSelectStyles}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mt-4">
                        <div
                          className="ma-submit-cta"
                          type="button"
                          onClick={() => {
                            handlebrandanalysis();
                          }}
                        >
                          <span>
                            Submit{" "}
                            <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ma-empty-state my-4">
                    <div className="dot-loader">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="mt-2 fw-semibold ma-muted-text">
                      Grabbing Details...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
      .ma-page {
        color: var(--rr-text-main);
      }

      .ma-header-card,
      .ma-section-card,
      .ma-mini-card,
      .ma-inner-card,
      .ma-empty-state {
        border: 1px solid var(--rr-border);
        background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
        box-shadow: var(--rr-shadow);
        border-radius: 22px;
      }

      .ma-header-card {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        padding: 22px 24px;
        margin-bottom: 18px;
        background: var(
          --rr-topbar-grad,
          linear-gradient(135deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%)
        );
      }

      .ma-header-left {
        min-width: 0;
      }

      .ma-breadcrumb {
        font-size: 12px;
        font-weight: 700;
        color: var(--rr-text-muted);
        margin-bottom: 8px;
      }

      .ma-page-title {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 800;
        color: var(--rr-text-main);
      }

      .ma-page-subtitle {
        margin-top: 8px;
        max-width: 920px;
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.7;
        font-weight: 500;
      }

      .ma-header-actions {
        display: flex;
        gap: 10px;
        flex-wrap: nowrap;
        flex-shrink: 0;
        align-items: center;
      }

      .ma-header-actions button {
        white-space: nowrap;
      }

      .ma-section-card {
        padding: 20px;
        margin-bottom: 18px;
      }

      .ma-inner-card {
        padding: 18px;
      }

      .ma-mini-card {
        padding: 16px;
        height: 100%;
      }

      .ma-label {
        display: inline-block;
        margin-bottom: 8px;
        color: var(--rr-text-main);
        font-size: 13px;
        font-weight: 700;
      }

      .ma-primary-btn,
      .ma-secondary-btn,
      .ma-outline-btn,
      .ma-disabled-btn {
        border: none;
        border-radius: 12px;
        padding: 11px 16px;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.25s ease;
      }

      .ma-primary-btn {
        color: #ffffff;
        background: #2563eb;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
      }

      .ma-secondary-btn {
        color: var(--rr-text-main);
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .ma-outline-btn {
        color: #2563eb;
        background: transparent;
        border: 1px solid rgba(37, 99, 235, 0.28);
      }

      .ma-disabled-btn {
        color: #475569;
        background: #cbd5e1;
        cursor: not-allowed;
      }

      .ma-primary-btn:hover,
      .ma-secondary-btn:hover,
      .ma-outline-btn:hover {
        transform: translateY(-1px);
      }

      .ma-submit-cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 999px;
        background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
        color: #ffffff;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .ma-submit-cta:hover {
        transform: translateY(-2px) scale(1.02);
      }

      .ma-submit-cta span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .ma-meta-card {
        border: 1px solid var(--rr-border);
        border-radius: 16px;
        padding: 12px;
        background: var(--rr-bg-soft);
        height: 100%;
      }

      .ma-meta-value {
        color: var(--rr-text-muted);
        font-size: 12px;
        margin-top: 4px;
        word-break: break-word;
      }

      .ma-input {
        min-height: 46px;
        border-radius: 14px;
        border: 1px solid var(--rr-border);
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
        box-shadow: none !important;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      .ma-input:focus {
        border-color: #93c5fd;
        box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.12) !important;
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
      }

      .ma-input::placeholder {
        color: var(--rr-text-muted);
      }

      .ma-input[type="date"] {
        color-scheme: dark;
      }

      .light-theme .ma-input[type="date"] {
        color-scheme: light;
      }

      .dark-theme .ma-input[type="date"] {
        color-scheme: dark;
      }

      .ma-input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: var(--rr-calendar-icon-filter, invert(1));
        opacity: 0.9;
      }

      .ma-input[type="date"]::-webkit-datetime-edit,
      .ma-input[type="date"]::-webkit-datetime-edit-text,
      .ma-input[type="date"]::-webkit-datetime-edit-month-field,
      .ma-input[type="date"]::-webkit-datetime-edit-day-field,
      .ma-input[type="date"]::-webkit-datetime-edit-year-field {
        color: var(--rr-text-main) !important;
      }

    .ma-select__control {
      min-height: 50px !important;
      border-radius: 16px !important;
      border: 1px solid var(--rr-border) !important;
      background: var(--rr-bg-soft) !important;
      box-shadow: var(--rr-shadow) !important;
      transition: all 0.22s ease !important;
    }

    .ma-select__control:hover {
      border-color: #93c5fd !important;
    }

    .ma-select__control--is-focused {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18) !important;
    }

    .ma-select__single-value,
    .ma-select__input-container,
    .ma-select__placeholder,
    .ma-select__multi-value__label {
      color: var(--rr-text-main) !important;
    }

    .ma-select__input input {
      color: var(--rr-text-main) !important;
    }

    /* Dropdown */
    .ma-select__menu {
      margin-top: 8px !important;
      border-radius: 16px !important;
      border: 1px solid var(--rr-border) !important;
      background: rgb(3, 25, 72) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35) !important;
      overflow: hidden !important;
      z-index: 9999 !important;
      opacity: 1 !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      color: #fff !important;
    }

    .ma-select__menu-list {
      padding: 8px !important;
      max-height: 260px !important;
      background: var(--rr-bg-soft) !important;
      opacity: 1 !important;
    }

    .ma-select__option {
      padding: 12px 14px !important;
      border-radius: 12px !important;
      background: transparent !important;
      color: var(--rr-text-main) !important;
      transition: all 0.18s ease !important;
    }

    .ma-select__option--is-focused {
      background: rgba(37, 99, 235, 0.12) !important;
      color: var(--rr-text-main) !important;
    }

    .ma-select__option--is-selected {
      bbackground: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%) !important;
      color: #ffffff !important;
      font-weight: 600 !important;
    }

    .ma-select__option:active {
      background: rgba(37, 99, 235, 0.18) !important;
      color: var(--rr-text-main) !important;
    }

    .ma-select__indicator-separator {
      background-color: var(--rr-border) !important;
    }

    .ma-select__dropdown-indicator,
    .ma-select__clear-indicator {
      color: var(--rr-text-muted) !important;
    }

    .ma-select__dropdown-indicator:hover,
    .ma-select__clear-indicator:hover {
      color: var(--rr-text-main) !important;
    }

    .ma-select__menu-notice,
    .ma-select__no-options-message,
    .ma-select__loading-message {
      color: var(--rr-text-muted) !important;
      background: var(--rr-bg-soft) !important;
    }

    /* Multi select chips */
    .ma-select__multi-value {
      background: rgba(37, 99, 235, 0.12) !important;
      border-radius: 10px !important;
    }

    .ma-select__multi-value__label {
      color: var(--rr-text-main) !important;
    }

    .ma-select__multi-value__remove {
      color: var(--rr-text-muted) !important;
      border-radius: 0 10px 10px 0 !important;
    }

    .ma-select__multi-value__remove:hover {
      background: rgba(239, 68, 68, 0.16) !important;
      color: #ef4444 !important;
    }

    .ma-select__menu-portal {
      z-index: 9999 !important;
    }

      .ma-modal-content {
        background: linear-gradient(180deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%);
        color: var(--rr-text-main);
        border: 1px solid var(--rr-border);
        box-shadow: var(--rr-shadow);
        border-radius: 20px;
      }

      .ma-modal-header,
      .ma-modal-footer {
        border-color: var(--rr-border) !important;
      }

      .ma-btn-close {
        color: var(--rr-text-main);
        background: transparent;
        border: none;
        font-size: 24px;
        line-height: 1;
      }

      .ma-muted-text {
        color: var(--rr-text-muted);
      }

      .ma-empty-state {
        padding: 24px;
        text-align: center;
        color: var(--rr-text-muted);
        font-weight: 700;
      }

      .dot-loader {
        display: flex;
        gap: 8px;
        justify-content: center;
      }

      .dot-loader div {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #2563eb;
        animation: maBounce 1.2s infinite ease-in-out;
      }

      .dot-loader div:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot-loader div:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes maBounce {
        0%, 80%, 100% {
          transform: scale(0.7);
          opacity: 0.6;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @media (max-width: 992px) {
        .ma-header-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .ma-header-actions {
          width: 100%;
          flex-wrap: nowrap;
        }

        .ma-header-actions button {
          flex: 1;
          white-space: nowrap;
          font-size: 12px;
          padding: 6px 10px;
        }
      }

      @media (max-width: 768px) {
        .ma-header-card,
        .ma-section-card,
        .ma-mini-card,
        .ma-inner-card,
        .ma-empty-state {
          border-radius: 18px;
        }

        .ma-header-card {
          padding: 18px;
        }

        .ma-page-title {
          font-size: 1.4rem;
        }

        .ma-primary-btn,
        .ma-secondary-btn,
        .ma-outline-btn,
        .ma-disabled-btn {
          width: 100%;
        }

        .ma-submit-cta {
          width: 100%;
        }
      }
    `}</style>
    </>
  );
}

export default MarketAnalysis;
