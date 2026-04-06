import React, { useEffect, useState } from "react";
import 'spiketip-tooltip/spiketip.min.css'
import { Link, useOutletContext } from "react-router-dom";
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
import { downloadPdf, uploadPDF } from "../HelperFunction/helperFunction.js";
import StackBarChart from "./StackBarChart.jsx";
import LineChartBrandAnalysis from "./LineBarChartBrandAnalysis.jsx";
import '../Brand Analysis/brand.css'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import LineBarChartBrandAnalysis from "./LineBarChartBrandAnalysis.jsx";
import maskedBrandOption from '../JSON Files/MaskedBrandOption.json'
import LineChartMarketAnalysis from "../Market Analysis/LineChartMarketAnalysis.jsx";
import { toast } from "react-toastify";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
// const { REACT_APP_UPLOAD_DATA } = process.env;

function BrandAnalysis() {

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
  const [baVariablesRecived, setBAVariablesRecieved] = useState(false);
  const [reportLoader, setreportLoader] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [resultscreen, setresultscreen] = useState(false);
  const [selectedbrand, setselectedbrand] = useState("");
  const [variableslist, setvariableslist] = useState([]);
  const [variable, setvariable] = useState([]);
  const [selectedvariable, setselectedvariable] = useState([]);
  const [plotdataweekly, setplotdataweekly] = useState({});
  const [plotdatamonthly, setplotdatamonthly] = useState({});
  const [statisticsdata1, setstatisticsdata1] = useState([]);
  const [corelationdata, setcorelationdata] = useState([]);
  const dispatch = useDispatch();
  const [reportName, setreportName] = useState("");
  const [variablesoptions, setvariablesoptions] = useState([])
  const [uniquetypes, setuniquetypes] = useState([])

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/brandanalysis`,
        });
      }, 1000);
    }
  };
  const handlefetchvariables = async () => {
    if (UserService.isLoggedIn()) {
      setBAVariablesRecieved(false)
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        const requestData = {
          brand: selectedbrand,
          market: market,

        }

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/app/get_variables_BA`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: requestData,
        };
        const getResponse = market?.length > 0 ? await axios(config) : [];

        if (getResponse.data !== "Invalid User!") {

          let arr = getResponse?.data?.vars_data?.filter(
            (item) => !ExceptionVariables?.zeroOrOneVariables?.includes(item.attribute_name)
          );
          arr.sort((a, b) => a.attribute_name.localeCompare(b.attribute_name));
          arr.push(...ExceptionVariables?.additionstogetvariablesapi)


          setvariablesoptions(arr)
          setuniquetypes(Array.from(new Set(arr?.map((item => {
            return item.type
          })))))
          setBAVariablesRecieved(true)

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
              return { value: it.brand, label: maskedBrandOption.maskedBrandOption[it.brand] };
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

  const handlecheckboxesselection = (e, item) => {
    if (e.target.checked) {
      if (e.target.value === ExceptionVariables.additionstogetvariablesapi[0].attribute_name || e.target.value === ExceptionVariables.additionstogetvariablesapi[1].attribute_name
        || e.target.value === ExceptionVariables.additionstogetvariablesapi[2].attribute_name
        //  || e.target.value === ExceptionVariables.additionstogetvariablesapi[3].attribute_name ||
        // e.target.value === ExceptionVariables.additionstogetvariablesapi[4].attribute_name ||
        // e.target.value === ExceptionVariables.additionstogetvariablesapi[5].attribute_name
      ) {
        selectedvariable?.map((variable) => {
          document.getElementById(variable).checked = false
        })
        const arr = []
        arr.push(item.attribute_name)
        setselectedvariable(arr);
      }
      else {
        if (selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[0].attribute_name) || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[1].attribute_name) ||
          selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[2].attribute_name)
          // || selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[3].attribute_name) ||
          //     selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[4].attribute_name) ||
          //     selectedvariable?.includes(ExceptionVariables.additionstogetvariablesapi[5].attribute_name)
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

          else {
            arr1 = selectedvariable
          }

          arr1 = arr1.filter(it => !arr2.includes(it));
          if (arr1.length === 0) {
            dispatch(getNotification({
              message: "Please select atleast one variable other than totals!",
              type: "danger"
            }))
            return
          }
          setloader(true);
          const requestData = {
            start_date: startDate,
            end_date: endDate,
            variables: arr1,
            brand: selectedbrand,
            market: market,
            variable_type: arr2
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

          if (getResponse1.status === 200 && getResponse1.data?.market_data?.length > 0) {

            if (getResponse1.data[0] !== "Invalid User!") {
              let arr1 = [...getResponse1.data?.market_data]
              arr1 = arr1.map((it) => {
                return {
                  ...it,
                  variables: [...it.variables, ...it.variable_types]
                }
              })

              console.log(arr1)

              let arr2 = [...getResponse2.data?.market_data]
              arr2 = arr2.map((it) => {
                return {
                  ...it,
                  variables: [...it.variables, ...it.variable_types]
                }
              })

              setplotdataweekly(arr1)
              setplotdatamonthly(arr2)


              setresultscreen(true);
              setdisplaynames({
                ...displaynames,
                startDate: startDate,
                endDate: endDate,
                selectedbrand: selectedbrand,
                variable: selectedvariable,
                market: market,

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const { theme } = useOutletContext();
  const isDark = theme === 'dark';
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "50px",
      borderRadius: "16px",
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
      borderColor: state.isFocused ? "#3b82f6" : isDark ? "#243041" : "#e2e8f0",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(59, 130, 246, 0.18)"
        : isDark
          ? "0 18px 38px rgba(0, 0, 0, 0.32)"
          : "0 14px 34px rgba(15, 23, 42, 0.08)",
      "&:hover": {
        borderColor: "#60a5fa",
      },
    }),

    singleValue: (base) => ({
      ...base,
      color: isDark ? "#f8fafc" : "#0f172a",
    }),

    placeholder: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
    }),

    input: (base) => ({
      ...base,
      color: isDark ? "#f8fafc" : "#0f172a",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
      border: `1px solid ${isDark ? "#243041" : "#e2e8f0"}`,
      borderRadius: "16px",
      overflow: "hidden",
      zIndex: 9999,
      boxShadow: isDark
        ? "0 20px 40px rgba(0,0,0,0.45)"
        : "0 20px 40px rgba(15,23,42,0.12)",
    }),

    menuPortal: (base) => ({
      ...base,
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
        ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)"
        : state.isFocused
          ? isDark
            ? "rgba(59, 130, 246, 0.18)"
            : "rgba(59, 130, 246, 0.12)"
          : "transparent",
      color: state.isSelected
        ? "#ffffff"
        : isDark
          ? "#f8fafc"
          : "#0f172a",
      fontWeight: state.isSelected ? 600 : 500,
      cursor: "pointer",
    }),

    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark ? "#243041" : "#e2e8f0",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      "&:hover": {
        color: isDark ? "#f8fafc" : "#0f172a",
      },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      "&:hover": {
        color: isDark ? "#f8fafc" : "#0f172a",
      },
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
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
        market: displaynames?.market?.[0] || "",
        data: plotdataweekly || [],
        user_created_by: UserService.getUsername(),
        created_on: new Date().toISOString().split("T")[0],
        report_type: "Brand_Analysis",
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
                    className="ba-secondary-btn"
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
                    className={`ba-primary-btn ${reportLoader ? "ba-btn-disabled" : ""}`}
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

      <div className="ba-page" style={{ userSelect: "none" }}>
        <div className="container-fluid px-3 px-md-4 py-3">
          <div className="ba-header-card">
            <div className="ba-header-left">
              <div className="ba-breadcrumb">Dashboard / Brand Analysis</div>
              <h2 className="ba-page-title">Brand Analysis</h2>
              <p className="ba-page-subtitle mb-0">
                Analyze brand performance across selected date ranges, compare
                variables across markets, and generate downloadable reports from a
                single workspace.
              </p>
            </div>

            {resultscreen && (
              <div className="ba-header-actions">
                <button
                  className="ba-secondary-btn"
                  style={{ minWidth: "120px" }}
                  onClick={() => {
                    setmodifybtn(false);
                    setresultscreen(false);
                    setselectedvariable([]);
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
                  className="ba-outline-btn"
                  style={{ minWidth: "120px" }}
                  onClick={() => setmodifybtn(!modifybtn)}
                  disabled={loading}
                >
                  {modifybtn ? "Close" : "Modify"}
                </button>

                  {loading ? (
                    <button className="ba-disabled-btn" disabled>
                      Preparing your Report...
                    </button>
                  ) : downloadUrl ? (
                    <button
                      className="ba-outline-btn"
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
                      className="ba-primary-btn"
                      // onClick={() => { setShowReportModal(true) }}
                      onClick={()=>{toast.warning('The Feature will be live from 0 April,2026.')}}
                      data-target="#exampleModal1"
                    >
                      Generate Report
                    </button>
                  )}
                </div>
            )}
              </div>

          {modifybtn && (
              <div className="ba-section-card">
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label htmlFor="StartDateModify" className="ba-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control ba-input"
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
                      placeholder="Start Date"
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label htmlFor="EndDateModify" className="ba-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control ba-input"
                      id="EndDateModify"
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

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="ba-label">
                      Brand <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="ba-select"
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
                        setselectedvariable([]);
                        setmarket([]);
                      }}
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="ba-label">
                      Market <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="ba-select"
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
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={customSelectStyles}
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-center justify-content-lg-end">
                  <div
                    className="ba-submit-cta"
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

                {market?.length > 0 && baVariablesRecived && (
                  <div className="ba-inner-card mt-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      <h6 className="fw-bold mb-0">Select Marketing Inputs</h6>
                      <span className="ba-muted-text small">
                        Choose the variables you want to analyze for the selected
                        market
                      </span>
                    </div>

                    <div className="accordion ba-accordion" id="accordionExample2Modify">
                      {uniquetypes?.map((item, index) => (
                        <div className="accordion-item ba-accordion-item mb-2" key={index}>
                          <h2
                            className="accordion-header"
                            id={`headingModify${index}`}
                          >
                            <button
                              className="accordion-button collapsed ba-accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapseModify${index}`}
                              aria-expanded="false"
                              aria-controls={`collapseModify${index}`}
                            >
                              <b>{item ? item : "All"}</b>
                            </button>
                          </h2>
                          <div
                            id={`collapseModify${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`headingModify${index}`}
                            data-bs-parent="#accordionExample2Modify"
                          >
                            <div className="accordion-body">
                              <div className="row g-2">
                                {variablesoptions?.map(
                                  (it, idx) =>
                                    it?.type === item && (
                                      <div
                                        key={idx}
                                        className="col-12 col-sm-6 col-md-4"
                                      >
                                        <label className="ba-check-card">
                                          <input
                                            className="form-check-input"
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
                                          <span className="ml-2">{it.attribute_name}</span>
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
            )}

            <div className="my-3">
              {loader ? (
                <div
                  className="row d-flex justify-content-center align-items-center"
                  style={{ height: "75vh" }}
                >
                  <LoaderCustom text="Fetching Brand Analysis Report...." />
                </div>
              ) : resultscreen ? (
                <div className="ba-section-card">
                  <div id="pdfConvertible" className="w-100">
                    {resultscreen && displaynames.selectedbrand?.length > 0 && (
                      <div className="ba-inner-card">
                        <div className="row g-3">
                          <div className="col-12 col-md-4">
                            <div className="ba-meta-card">
                              <strong>Start Date</strong>
                              <div className="ba-meta-value">
                                {displaynames.startDate}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-4">
                            <div className="ba-meta-card">
                              <strong>End Date</strong>
                              <div className="ba-meta-value">
                                {displaynames.endDate}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-4">
                            <div className="ba-meta-card">
                              <strong>Brand</strong>
                              <div className="ba-meta-value">
                                {maskedBrandOption.maskedBrandOption[selectedbrand]}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-7">
                            <div className="ba-meta-card">
                              <strong>Market</strong>
                              <div
                                className="ba-meta-value"
                                style={{ wordBreak: "break-word" }}
                              >
                                {displaynames.market?.length > 1
                                  ? displaynames.market.join(", ")
                                  : displaynames.market[0]}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-5">
                            <div className="ba-meta-card">
                              <strong>Variables</strong>
                              <div
                                className="ba-meta-value"
                                style={{ wordBreak: "break-word" }}
                              >
                                {displaynames.variable?.join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {resultscreen && displaynames.selectedbrand?.length > 0 && (
                      <div className="mt-4">
                        {displaynames?.variable?.includes("Sales_Volume") ||
                          displaynames?.variable?.includes("Sales_Value") ? (
                          <StackBarChart
                            plotdataweekly={plotdataweekly}
                            plotdatamonthly={plotdatamonthly}
                            displaynames={displaynames}
                            theme={theme}
                          />
                        ) : (
                          <LineBarChartBrandAnalysis
                            plotdataweekly={plotdataweekly}
                            plotdatamonthly={plotdatamonthly}
                            displaynames={displaynames}
                            theme={theme}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {brandoptions?.length > 0 ? (
                    <div className="ba-section-card">
                      <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-3">
                          <label htmlFor="StartDate" className="ba-label">
                            Start Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            disabled={resultscreen}
                            className="form-control ba-input"
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

                        <div className="col-12 col-md-6 col-lg-3">
                          <label htmlFor="EndDate" className="ba-label">
                            End Date <span className="text-danger">*</span>
                          </label>
                          <input
                            disabled={resultscreen}
                            type="date"
                            className="form-control ba-input"
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

                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="ba-label">
                            Brand <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="ba-select"
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
                              setselectedvariable([]);
                              setmarket([]);
                              setselectedbrand(value.value);
                            }}
                            menuPlacement="auto"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={customSelectStyles}
                          />
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="ba-label">
                            Market <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="ba-select"
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
                            menuPlacement="auto"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={customSelectStyles}
                          />
                        </div>
                      </div>

                      {market?.length > 0 && (
                        <div className="ba-inner-card mt-4">
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <h6 className="fw-bold mb-0">Select Marketing Inputs</h6>
                            <span className="ba-muted-text small">
                              Choose the variables you want to analyze for the selected market
                            </span>
                          </div>

                          <div className="accordion ba-accordion" id="accordionExample2">
                            {uniquetypes?.map((item, index) => (
                              <div
                                className="accordion-item ba-accordion-item mb-2"
                                key={index}
                              >
                                <h2
                                  className="accordion-header"
                                  id={`heading${index}`}
                                >
                                  <button
                                    className="accordion-button collapsed ba-accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${index}`}
                                  >
                                    <b>{item ? item : "All"}</b>
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
                                              className="col-12 col-sm-6 col-md-4"
                                            >
                                              <label className="ba-check-card">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id={it.attribute_name}
                                                  value={it.attribute_name}
                                                  checked={
                                                    selectedvariable.length > 0 &&
                                                    selectedvariable?.includes(
                                                      it.attribute_name
                                                    )
                                                  }
                                                  onChange={(e) =>
                                                    handlecheckboxesselection(e, it)
                                                  }
                                                />
                                                <span>{it.attribute_name}</span>
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

                          <div className="mt-3 d-flex justify-content-center">
                            <div
                              className="ba-submit-cta"
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
                      )}
                    </div>
                  ) : (
                    <div className="ba-empty-state my-4">
                      <div className="dot-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <div className="mt-2 fw-semibold ba-muted-text">
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
      .ba-page {
        color: var(--rr-text-main);
      }

      .ba-header-card,
      .ba-section-card,
      .ba-mini-card,
      .ba-inner-card,
      .ba-empty-state {
        border: 1px solid var(--rr-border);
        background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
        box-shadow: var(--rr-shadow);
        border-radius: 22px;
      }

      .ba-header-card {
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
        border-radius: 22px;
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
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #2563eb;
        background: rgba(37, 99, 235, 0.1);
        border: 1px solid rgba(37, 99, 235, 0.16);
        margin-bottom: 8px;
      }

      .ba-modal-subtitle {
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.5;
      }

      .ba-modal-input {
        min-height: 50px;
      }

      .ba-btn-close {
        width: 42px;
        height: 42px;
        border-radius: 12px;
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
        border-color: rgba(37, 99, 235, 0.3);
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.14);
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
          border-radius: 20px 20px 16px 16px;
        }

        .ba-modal-header,
        .ba-modal-body,
        .ba-modal-footer {
          padding-left: 16px;
          padding-right: 16px;
        }
      }

      .ba-btn-disabled,
      .ba-primary-btn:disabled,
      .ba-secondary-btn:disabled,
      .ba-btn-close:disabled,
      .ba-input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .ba-primary-btn:disabled {
        transform: none !important;
        box-shadow: none !important;
      }

      .ba-secondary-btn:disabled {
        transform: none !important;
        box-shadow: none !important;
      }

      .ba-btn-close:disabled {
        pointer-events: none;
      }

      .ba-input:disabled {
        background: var(--rr-bg-soft, #f8fafc);
      }

      .ba-header-left {
        min-width: 0;
      }

      .ba-breadcrumb {
        font-size: 12px;
        font-weight: 700;
        color: var(--rr-text-muted);
        margin-bottom: 8px;
      }

      .ba-page-title {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 800;
        color: var(--rr-text-main);
      }

      .ba-page-subtitle {
        margin-top: 8px;
        max-width: 920px;
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.7;
        font-weight: 500;
      }

      .ba-header-actions {
        display: flex;
        gap: 10px;
        flex-wrap: nowrap;
        flex-shrink: 0;
        align-items: center;
      }

      .ba-header-actions button {
        white-space: nowrap;
      }

      .ba-section-card {
        padding: 20px;
        margin-bottom: 18px;
      }

      .ba-inner-card {
        padding: 18px;
      }

      .ba-mini-card {
        padding: 16px;
        height: 100%;
      }

      .ba-label {
        display: inline-block;
        margin-bottom: 8px;
        color: var(--rr-text-main);
        font-size: 13px;
        font-weight: 700;
      }

      .ba-primary-btn,
      .ba-secondary-btn,
      .ba-outline-btn,
      .ba-disabled-btn {
        border: none;
        border-radius: 12px;
        padding: 11px 16px;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.25s ease;
      }

      .ba-primary-btn {
        color: #ffffff;
        background: #2563eb;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
      }

      .ba-secondary-btn {
        color: var(--rr-text-main);
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .ba-outline-btn {
        color: #2563eb;
        background: transparent;
        border: 1px solid rgba(37, 99, 235, 0.28);
      }

      .ba-disabled-btn {
        color: #475569;
        background: #cbd5e1;
        cursor: not-allowed;
      }

      .ba-primary-btn:hover,
      .ba-secondary-btn:hover,
      .ba-outline-btn:hover {
        transform: translateY(-1px);
      }

      .ba-submit-cta {
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

      .ba-submit-cta:hover {
        transform: translateY(-2px) scale(1.02);
      }

      .ba-submit-cta span {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .ba-meta-card {
        border: 1px solid var(--rr-border);
        border-radius: 16px;
        padding: 12px;
        background: var(--rr-bg-soft);
        height: 100%;
      }

      .ba-meta-value {
        color: var(--rr-text-muted);
        font-size: 12px;
        margin-top: 4px;
        word-break: break-word;
      }

      .ba-input {
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

      .ba-input:focus {
        border-color: #93c5fd;
        box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.12) !important;
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
      }

      .ba-input::placeholder {
        color: var(--rr-text-muted);
      }

      /* for typed date text */
      .ba-input[type="date"] {
        color-scheme: dark;
      }

      /* light theme override */
      .light-theme .ba-input[type="date"] {
        color-scheme: light;
      }

      /* dark theme override */
      .dark-theme .ba-input[type="date"] {
        color-scheme: dark;
      }

      /* calendar icon */
      .ba-input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: var(--rr-calendar-icon-filter, invert(1));
        opacity: 0.9;
      }

      /* optional: keep date text readable in webkit */
      .ba-input[type="date"]::-webkit-datetime-edit,
      .ba-input[type="date"]::-webkit-datetime-edit-text,
      .ba-input[type="date"]::-webkit-datetime-edit-month-field,
      .ba-input[type="date"]::-webkit-datetime-edit-day-field,
      .ba-input[type="date"]::-webkit-datetime-edit-year-field {
        color: var(--rr-text-main) !important;
      }

      /* =========================
        REACT SELECT THEME FIX
        ========================= */

    .ba-select__control {
      min-height: 50px !important;
      border-radius: 16px !important;
      border: 1px solid var(--rr-border) !important;
      background: var(--rr-bg-soft) !important;
      box-shadow: var(--rr-shadow) !important;
      transition: all 0.22s ease !important;
    }

    .ba-select__control:hover {
      border-color: #60a5fa !important;
    }

    .ba-select__control--is-focused {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18) !important;
    }

    .ba-select__single-value {
      color: var(--rr-text-main) !important;
    }

    .ba-select__placeholder {
      color: var(--rr-text-muted) !important;
    }

    .ba-select__input-container,
    .ba-select__input input {
      color: var(--rr-text-main) !important;
    }

    .ba-select__indicator-separator {
      background-color: var(--rr-border) !important;
    }

    .ba-select__dropdown-indicator,
    .ba-select__clear-indicator {
      color: var(--rr-text-muted) !important;
    }

    .ba-select__dropdown-indicator:hover,
    .ba-select__clear-indicator:hover {
      color: var(--rr-text-main) !important;
    }

    /* dropdown */
    .ba-select__menu {
      margin-top: 8px !important;
      border-radius: 16px !important;
      border: 1px solid var(--rr-border) !important;
      background: rgba(3, 25, 72) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35) !important;
      overflow: hidden !important;
      z-index: 9999 !important;
      opacity: 1 !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      color:#fff !important;
    }

    .ba-select__menu-list {
      padding: 8px !important;
      max-height: 260px !important;
      background: var(--rr-bg-soft) !important;
      opacity: 1 !important;
    }

    .ba-select__option {
      padding: 12px 14px !important;
      border-radius: 12px !important;
      color: var(--rr-text-main) !important;
      transition: all 0.18s ease !important;
    }

    .ba-select__option--is-focused {
      background: rgba(59, 130, 246, 0.14) !important;
      color: var(--rr-text-main) !important;
    }

    .ba-select__option--is-selected {
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%) !important;
      color: #ffffff !important;
      font-weight: 600 !important;
    }

    .ba-select__option:active {
      background: rgb(247, 247, 247) !important;
      color: var(--rr-text-main) !important;
    }

    .ba-select__menu-notice,
    .ba-select__no-options-message,
    .ba-select__loading-message {
      color: var(--rr-text-main) !important;
      background: var(--rr-bg-soft) !important;
    }

    .ba-select__menu-portal {
      z-index: 9999 !important;
    }

      .ba-accordion-item {
        overflow: hidden;
        border: 1px solid var(--rr-border) !important;
        border-radius: 16px !important;
        background: var(--rr-bg-soft) !important;
      }

      .ba-accordion-button {
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
        box-shadow: none !important;
        font-weight: 700;
      }

      .ba-accordion-button:not(.collapsed) {
        background: rgba(37, 99, 235, 0.08) !important;
        color: var(--rr-text-main) !important;
      }

      .ba-accordion-button::after {
        filter: var(--rr-accordion-icon-filter, none);
      }

      .ba-check-card {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 46px;
        padding: 10px 12px;
        border: 1px solid var(--rr-border);
        border-radius: 14px;
        background: var(--rr-bg-soft);
        color: var(--rr-text-main);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .ba-check-card:hover {
        border-color: rgba(37, 99, 235, 0.35);
        transform: translateY(-1px);
      }

      .ba-check-card input {
      position:relative;
        accent-color: #2563eb;
      }

      .ba-modal-content {
        background: linear-gradient(180deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%);
        color: var(--rr-text-main);
        border: 1px solid var(--rr-border);
        box-shadow: var(--rr-shadow);
        border-radius: 20px;
      }

      .ba-modal-header,
      .ba-modal-footer {
        border-color: var(--rr-border) !important;
      }

      .ba-btn-close {
        color: var(--rr-text-main);
        background: transparent;
        border: none;
        font-size: 24px;
        line-height: 1;
      }

      .ba-muted-text {
        color: var(--rr-text-muted);
      }

      .ba-empty-state {
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
        animation: baBounce 1.2s infinite ease-in-out;
      }

      .dot-loader div:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot-loader div:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes baBounce {
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
        .ba-header-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .ba-header-actions {
          width: 100%;
          flex-wrap: nowrap;
        }

        .ba-header-actions button {
          flex: 1;
          white-space: nowrap;
          font-size: 12px;
          padding: 6px 10px;
        }
      }

      @media (max-width: 768px) {
        .ba-header-card,
        .ba-section-card,
        .ba-mini-card,
        .ba-inner-card,
        .ba-empty-state {
          border-radius: 18px;
        }

        .ba-header-card {
          padding: 18px;
        }

        .ba-page-title {
          font-size: 1.4rem;
        }

        .ba-primary-btn,
        .ba-secondary-btn,
        .ba-outline-btn,
        .ba-disabled-btn {
          width: 100%;
        }

        .ba-submit-cta {
          width: 100%;
        }
      }
    `}</style>
      </>
      );
}

      export default BrandAnalysis;
