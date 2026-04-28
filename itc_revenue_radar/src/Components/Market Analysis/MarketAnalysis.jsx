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
  const [variable, setvariable] = useState([]);
  const [selectedvariable, setselectedvariable] = useState("");
  const [plotdataweekly, setplotdataweekly] = useState({});
  const [plotdatamonthly, setplotdatamonthly] = useState({});
  const dispatch = useDispatch();
  const [reportName, setreportName] = useState("");
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
        if (getResponse.data !== "Invalid User!") {
          const markets = getResponse.data.markets;
          if (UserService.hasRole(["SALES"])) {
            // let finalmarkets = markets?.filter(it => it.final_market === "EAST");
            setmarketoptions(
              [
                // Add Select All option
                ...markets?.map((it) => ({
                  value: it.final_market,
                  label: it.final_market,
                })),
              ]
            )
          }
          else {
            setmarketoptions(
              [
                // Add Select All option
                ...markets?.map((it) => ({
                  value: it.final_market,
                  label: it.final_market,
                })),
              ]
            );
          }

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

          const filteredBrands = getResponse.data.brands
            ?.filter(it => !ExceptionVariables?.brandoptionshide?.includes(it?.brand))
            ?.map(it => ({
              value: it.brand,
              label: maskedBrandOption.maskedBrandOption[it.brand.trim().toUpperCase()]
            }));

          let finalBrands = filteredBrands;

          // Role-based filtering
          if (UserService.hasRole(["BBMNGR"])) {
            finalBrands = filteredBrands?.filter(it => it.value === "BAD BANGLES");
          }
          else if (UserService.hasRole(["OODMNGR"])) {
            finalBrands = filteredBrands?.filter(it => it.value === "OODLES");
          }
          else if (UserService.hasRole(["SALES"])) {
            finalBrands = filteredBrands?.filter(it => it.value === "OODLES");
          }
          else if (UserService.hasRole(["MUMNGR"])) {
            finalBrands = filteredBrands?.filter(it => it.value === "MILD URGENCY");
          }
          else if (UserService.hasRole(["CBMNGR"])) {
            finalBrands = filteredBrands?.filter(it => it.value === "CHERRY BRIGHT");
          }

          // Set once
          setbrandoptions(finalBrands);

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
                startDate: startDate.split('-').reverse().join('-'),
                endDate: endDate.split('-').reverse().join('-'),
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


  const [loading, setLoading] = useState(false);
  const { theme } = useOutletContext();
  const isDark = theme === 'dark';
  const [reportLoader, setreportLoader] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const customMultiSelectStyles = {
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#2C3E50" : "#ffffff",
      border: `1px solid ${isDark ? "#4A6274" : "#e2e8f0"}`,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: isDark ? "#2C3E50" : "#ffffff",
      padding: "4px",
      maxHeight: "260px",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "8px",
      padding: "10px 14px",
      background: state.isSelected
        ? isDark ? "rgba(23, 162, 184, 0.15)" : "rgba(13, 124, 102, 0.15)"
        : state.isFocused
          ? isDark ? "rgba(23, 162, 184, 0.08)" : "rgba(13, 124, 102, 0.08)"
          : "transparent",
      color: state.isSelected ? (isDark ? "#17A2B8" : "#0D7C66") : isDark ? "#F8F9FA" : "#0f172a",
      fontWeight: state.isSelected ? 600 : 400,
    }),
    multiValue: (base) => ({
      ...base,
      background: isDark ? "rgba(23, 162, 184, 0.10)" : "rgba(13, 124, 102, 0.10)",
      borderRadius: "8px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? "#17A2B8" : "#0D7C66",
      fontWeight: 600,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "#ADB5BD" : "#64748b",
      "&:hover": {
        background: "rgba(220, 53, 69, 0.15)",
        color: "#DC3545",
      },
    }),
  };

  const handlegeneratereport = async () => {
    setreportLoader(true)
    if (!UserService.isLoggedIn()) {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard/brandanalysis`,
        });
      }, 1000);
      return;
    }

    if (!reportName) {
      dispatch(
        getNotification({
          message: "Please fill Report Name",
          type: "warning",
        })
      );
      return;
    }

    if (!reportName || !variable || !selectedbrand || !startDate || !endDate) {
      dispatch(
        getNotification({
          message: "Please fill all entries",
          type: "warning",
        })
      );
      return;
    }

    try {
      const requestData = {
        report_name: reportName,
        start_date: displaynames?.startDate,
        end_date: displaynames?.endDate,
        brand: displaynames?.selectedbrand,
        market: displaynames?.market || [],
        data: plotdataweekly || [],
        user_created_by: UserService.getUsername(),
        created_on: new Date().toISOString().split("T")[0],
        report_type: "Market_Analysis",
      };

      const response = await axios.post(
        `${REACT_APP_UPLOAD_DATA}/app/generate_report`,
        requestData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setreportName("");
        setreportLoader(false);
        setShowReportModal(false)
        dispatch(
          getNotification({
            message:
              response?.data?.message ||
              "Report generation started. We will notify you once it is ready.",
            type:
              response?.data?.message === "Same report is already in Queue."
                ? "warning"
                : "success",
          })
        )
      }
    } catch (err) {
      console.log("Server Error", err);

      if (err.response?.status === 500) {
        dispatch(
          getNotification({
            message: "Server is Down! Please try again after sometime",
            type: "default",
          })
        );
      } else if (err.response?.status === 400) {
        dispatch(
          getNotification({
            message: err.response?.data?.detail || err.response?.data || "Bad Request",
            type: "danger",
          })
        );
      } else if (err.response?.status === 422) {
        dispatch(
          getNotification({
            message: "Input is not in prescribed format",
            type: "default",
          })
        );
      } else if (err.response?.status === 404) {
        dispatch(
          getNotification({
            message: "Page not Found",
            type: "default",
          })
        );
      } else if (err.response?.status === 401) {
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
    } finally {
      setreportLoader(false);
      setShowReportModal(false)
    }
  };
  return (
    <>
      {/* Save Report Modal */}
      {
        showReportModal && (
          <div
            className="ba-custom-modal-overlay"
            onClick={() => {
              if (reportLoader) return;
              // outside click should NOT close modal
              // so do nothing here
            }}
          >
            <div
              className="ba-custom-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ba-modal-content">
                <div className="modal-header ba-modal-header">
                  <div>
                    <div className="ba-modal-chip">Report</div>
                    <h6 className="modal-title fw-bold mb-1" id="exampleModalLabel">
                      Save Report
                    </h6>
                    <p className="ba-modal-subtitle mb-0">
                      Enter a name for this report and generate it.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="ba-btn-close"
                    aria-label="Close"
                    onClick={() => {
                      if (!reportLoader) {
                        setreportName("");
                        setShowReportModal(false);
                      }
                    }}
                    disabled={reportLoader}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div className="modal-body ba-modal-body">
                  <label className="ba-label mb-2">
                    Please enter report name:
                  </label>

                  <input
                    type="text"
                    id="reportnamebox"
                    className="form-control ba-input ba-modal-input"
                    value={reportName}
                    onChange={(e) => setreportName(e.target.value)}
                    disabled={reportLoader}
                    placeholder="Enter report name"
                    autoFocus
                  />
                </div>

                <div className="modal-footer ba-modal-footer">
                  <button
                    type="button"
                    className="ma-secondary-btn"
                    onClick={() => {
                      if (!reportLoader) {
                        setreportName("");
                        setShowReportModal(false);
                      }
                    }}
                    disabled={reportLoader}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className={`ma-primary-btn ${reportLoader ? "ba-btn-disabled" : ""}`}
                    onClick={() => {
                      if (reportLoader) return;

                      if (!reportName.trim()) {
                        document.getElementById("reportnamebox")?.focus();
                        return;
                      }

                      handlegeneratereport();
                    }}
                    disabled={reportLoader}
                  >
                    {reportLoader ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="ma-page">
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

                <button
                  className="ma-primary-btn"
                  onClick={() => { setShowReportModal(true) }}
                >
                  Generate Report
                </button>
              </div>
            )}
          </div>

          {modifybtn && (
            <>
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
              </div>
            </div>

            <div className="ma-section-card">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-lg-5">
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

                <div className="col-12 col-lg-4">
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

                <div className="col-12 col-lg-3 d-flex align-items-end">
                  <div
                    className="ma-submit-cta w-100"
                    type="button"
                    onClick={() => handlebrandanalysis()}
                  >
                    <span>
                      Submit{" "}
                      <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </>
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
              !modifybtn && <div id="pdfConvertible" className="w-100">
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
                  <>
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
                  </div>

                  <div className="ma-section-card">
                    <div className="row g-3 align-items-end">
                      <div className="col-12 col-lg-5">
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

                      <div className="col-12 col-lg-4">
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

                      <div className="col-12 col-lg-3 d-flex align-items-end">
                        <div
                          className="ma-submit-cta w-100"
                          type="button"
                          onClick={() => handlebrandanalysis()}
                        >
                          <span>
                            Submit{" "}
                            <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
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

      <style>{`
      .ma-page {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
        border-radius: 16px;
      }

      .ma-header-card {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
        margin-bottom: 16px;
        background: var(--rr-topbar-grad);
      }

      .ba-custom-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: baModalFadeIn 0.22s ease;
    }

    .ba-custom-modal-dialog {
      width: 100%;
      max-width: 560px;
      animation: baModalPopIn 0.24s ease;
    }

    .ba-modal-content {
      background: linear-gradient(180deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%);
      color: var(--rr-text-main);
      border: 1px solid var(--rr-border);
      box-shadow:
        0 30px 70px rgba(15, 23, 42, 0.28),
        0 12px 30px rgba(15, 23, 42, 0.14);
      border-radius: 16px;
      overflow: hidden;
    }

    .ba-modal-header,
    .ba-modal-footer {
      border-color: var(--rr-border) !important;
      padding: 18px 20px;
    }

    .ba-modal-body {
      padding: 18px 20px 10px;
    }

    .ba-modal-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #0D7C66;
      background: rgba(13, 124, 102, 0.1);
      border: 1px solid rgba(13, 124, 102, 0.16);
      margin-bottom: 8px;
    }

    .ba-modal-subtitle {
      color: var(--rr-text-muted);
      font-size: 15px;
      line-height: 1.5;
    }

    .ba-modal-input {
      min-height: 50px;
    }

    .ba-btn-close {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      border: 1px solid var(--rr-border);
      background: var(--rr-bg-soft);
      color: var(--rr-text-main);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      line-height: 1;
      transition: all 0.22s ease;
      flex-shrink: 0;
    }

    .ba-btn-close:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: rgba(13, 124, 102, 0.3);
      box-shadow: 0 4px 12px rgba(13, 124, 102, 0.14);
    }

    .ba-btn-close:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @keyframes baModalFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes baModalPopIn {
      from {
        opacity: 0;
        transform: translateY(14px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .ba-custom-modal-overlay {
        padding: 16px;
        align-items: flex-end;
      }

      .ba-custom-modal-dialog {
        max-width: 100%;
      }

      .ba-modal-content {
        border-radius: 16px 16px 12px 12px;
      }

      .ba-modal-header,
      .ba-modal-body,
      .ba-modal-footer {
        padding-left: 16px;
        padding-right: 16px;
      }
    }

      .ma-header-left {
        min-width: 0;
      }

      .ma-breadcrumb {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 11px;
        font-weight: 700;
        color: var(--rr-accent);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .ma-page-title {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--rr-text-main);
      }

      .ma-page-subtitle {
        margin-top: 8px;
        max-width: 880px;
        color: var(--rr-text-muted);
        font-size: 15px;
        line-height: 1.65;
        font-weight: 400;
      }

      .ma-header-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        flex-shrink: 0;
        align-items: center;
      }

      .ma-header-actions button {
        white-space: nowrap;
      }

      .ma-section-card {
        padding: 20px;
        margin-bottom: 16px;
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
        font-size: 15px;
        font-weight: 600;
      }

      .ma-primary-btn,
      .ma-secondary-btn,
      .ma-outline-btn,
      .ma-disabled-btn {
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 15px;
        font-weight: 700;
        transition: all 0.25s ease;
        cursor: pointer;
      }

      .ma-primary-btn {
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        box-shadow: 0 4px 12px rgba(13, 124, 102, 0.20);
      }

      .ma-secondary-btn {
        color: var(--rr-text-main);
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        box-shadow: 0 4px 12px rgba(44, 62, 80, 0.06);
      }

      .ma-outline-btn {
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(13, 124, 102, 0.20);
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
        padding: 12px 20px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        color: #FFFFFF;
        font-size: 17px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.25s ease;
        box-shadow: 0 4px 16px rgba(13, 124, 102, 0.25);
      }

      .ma-submit-cta:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 24px rgba(13, 124, 102, 0.30);
      }

      .ma-submit-cta span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .ma-submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 12px 20px;
        border: none;
        border-radius: 9999px;
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        font-size: 17px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(13, 124, 102, 0.25);
        transition: all 0.25s ease;
      }

      .ma-submit-btn span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .ma-submit-btn:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 24px rgba(13, 124, 102, 0.30);
      }

      .ma-meta-card {
        border: 1px solid var(--rr-border);
        border-radius: 12px;
        padding: 14px 16px;
        background: var(--rr-bg-soft);
        height: 100%;
      }

      .ma-meta-card strong {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--rr-text-muted);
      }

      .ma-meta-value {
        font-family: 'JetBrains Mono', 'Inter', monospace;
        font-size: 16px;
        font-weight: 600;
        color: var(--rr-text-main);
        margin-top: 4px;
        word-break: break-word;
      }

      .ma-input {
        min-height: 44px;
        border-radius: 8px;
        border: 1px solid var(--rr-border);
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
        box-shadow: none !important;
        font-size: 15px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      .ma-input:focus {
        border-color: rgba(13, 124, 102, 0.40);
        box-shadow: 0 0 0 3px rgba(13, 124, 102, 0.16) !important;
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
      min-height: 44px !important;
      border-radius: 8px !important;
      border: 1px solid var(--rr-border) !important;
      background: var(--rr-bg-soft) !important;
      box-shadow: none !important;
      font-size: 15px;
    }

    .ma-select__control:hover {
      border-color: rgba(13, 124, 102, 0.40) !important;
    }

    .ma-select__control--is-focused {
      border-color: #0D7C66 !important;
      box-shadow: 0 0 0 3px rgba(13, 124, 102, 0.16) !important;
    }

    .ma-select__single-value,
    .ma-select__input-container,
    .ma-select__placeholder,
    .ma-select__multi-value__label {
      color: var(--rr-text-main) !important;
      font-size: 15px;
    }

    .ma-select__placeholder {
      color: var(--rr-text-muted) !important;
    }

    .ma-select__input input {
      color: var(--rr-text-main) !important;
    }

    .ma-select__menu {
      background: var(--rr-bg-soft) !important;
      border: 1px solid var(--rr-border) !important;
      border-radius: 12px !important;
      overflow: hidden;
      z-index: 9999 !important;
    }

    .ma-select__menu-list {
      background: var(--rr-bg-soft) !important;
      padding: 4px !important;
      max-height: 260px !important;
    }

    .ma-select__option {
      background: var(--rr-bg-soft) !important;
      color: var(--rr-text-main) !important;
      font-size: 15px;
    }

    .ma-select__option--is-focused {
      background: rgba(13, 124, 102, 0.08) !important;
    }

    .ma-select__option--is-selected {
      background: rgba(13, 124, 102, 0.15) !important;
      color: #0D7C66 !important;
      font-weight: 600;
    }

    .ma-select__option:active {
      background: rgba(13, 124, 102, 0.18) !important;
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

    .ma-select__multi-value {
      background: rgba(13, 124, 102, 0.10) !important;
      border-radius: 8px !important;
    }

    .ma-select__multi-value__label {
      color: #0D7C66 !important;
      font-weight: 600;
    }

    .ma-select__multi-value__remove {
      color: var(--rr-text-muted) !important;
      border-radius: 0 8px 8px 0 !important;
    }

    .ma-select__multi-value__remove:hover {
      background: rgba(220, 53, 69, 0.15) !important;
      color: #DC3545 !important;
    }

    .ma-select__menu-portal {
      z-index: 9999 !important;
    }

    .dark-theme .ma-select__placeholder,
    .dark-theme .ma-select__single-value,
      .dark-theme .ma-select__input-container {
        color: var(--rr-text-main) !important;
      }

      .dark-theme .ma-select__control:hover {
        border-color: rgba(23, 162, 184, 0.40) !important;
      }

      .dark-theme .ma-select__control--is-focused {
        border-color: #17A2B8 !important;
        box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.15) !important;
      }

      .dark-theme .ma-select__option--is-focused {
        background: rgba(23, 162, 184, 0.08) !important;
      }

      .dark-theme .ma-select__option--is-selected {
        background: rgba(23, 162, 184, 0.15) !important;
        color: #17A2B8 !important;
      }

      .dark-theme .ma-select__option:active {
        background: rgba(23, 162, 184, 0.18) !important;
      }

      .dark-theme .ma-select__multi-value {
        background: rgba(23, 162, 184, 0.10) !important;
      }

      .dark-theme .ma-select__multi-value__label {
        color: #17A2B8 !important;
    .dark-theme .ba-modal-chip {
      color: #17A2B8;
      background: rgba(23, 162, 184, 0.1);
      border-color: rgba(23, 162, 184, 0.16);
    }

    .dark-theme .ba-btn-close:hover:not(:disabled) {
      border-color: rgba(23, 162, 184, 0.3);
      box-shadow: 0 4px 12px rgba(23, 162, 184, 0.14);
    }

      .ma-modal-content {
        background: linear-gradient(180deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%);
        color: var(--rr-text-main);
        border: 1px solid var(--rr-border);
        box-shadow: var(--rr-shadow);
        border-radius: 16px;
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
        background: #0D7C66;
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
          font-size: 14px;
          padding: 6px 10px;
        }
      }

      @media (max-width: 768px) {
        .ma-header-card,
        .ma-section-card,
        .ma-mini-card,
        .ma-inner-card,
        .ma-empty-state {
          border-radius: 12px;
        }

        .ma-header-card {
          padding: 16px;
        }

        .ma-page-title {
          font-size: 1.25rem;
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
