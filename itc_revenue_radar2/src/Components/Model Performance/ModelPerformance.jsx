import React from "react";
import { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { useDispatch } from "react-redux";
import UserService from "../../services/UserService"; 
import getNotification from "../../Redux/Action/action";
import axios from "axios";
import ModelPerformanceChart from "./ModelPerformanceChart";
import SingleBarChart4 from "../Simulator/SingleBarChart4";
import SingleBarChart5 from "../Simulator/SingleBarChart5";
import SingleBarChart6 from "../Simulator/SingleBarChart6";
import ExceptionVariables from "../JSON Files/ExceptionVariables.json"
import SingleBarChart1 from "../Simulator/SingleBarChart1";
import SingleBarChart2 from "../Simulator/SingleBarChart2";
import SingleBarChart3 from "../Simulator/SingleBarChart3";
import PieCharts from "../Simulator/PieCharts";
import SingleBarChart7 from "../Simulator/SingleBarChart7";
import SingleBarChart8 from "../Simulator/SingleBarChart8";
import maskedBrandOption from '../JSON Files/MaskedBrandOption.json'
import LoaderCustom from "../LoaderCustom";

const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
const XLSX = require("xlsx");
function ModelPerformance() {
  const [isprocessing, setisprocessing] = useState(false)
  const selectAllOption = { label: "Select All", value: "selectAll" };
  const [isValue, setisValue] = useState(false)
  const dispatch = useDispatch();
  const [tablescreen, settablescreen] = useState(false)
  const [loader, setloader] = useState(false);
  const [modelcallibrationoptions, setmodelcallibrationoptions] = useState([
    { label: "test", value: "test" }
  ]);
  const [exportcontributiondata, setexportcontributiondata] = useState([])
  const [torangeonplots, settorangeonplots] = useState("")
  const [fromrangeonplots, setfromrangeonplots] = useState("")
  const [selectedmarketdataset, setselectedmarketdataset] = useState([])
  const [startDate, setStartDate] = useState("");
  const [openCollapseIndex, setOpenCollapseIndex] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [mapetable, setmapetable] = useState([]);
  const [checkedbox, setcheckedbox] = useState([])
  const [brandoptions, setbrandoptions] = useState([]);
  const [displaynames, setdisplaynames] = useState({});
  const [marketoptions, setmarketoptions] = useState([])
  const [market, setmarket] = useState([]);

  const [modifybtn, setmodifybtn] = useState(false)
  const [selectedzone, setselectedzone] = useState("National")
  const [selectedbrand, setselectedbrand] = useState("");
  const [selectedscenarioname, setselectedscenarioname] = useState("");
  const [selectedscenarioid, setselectedscenarioid] = useState("");
  const [selectedscenarionametimestamp, setselectedscenarionametimestamp] =
    useState("");
  const [selectedyear, setselectedyear] = useState("2021-22");
  const [resultscreen, setresultscreen] = useState(false);
  const [lastfymapedata, setlastfymapedata] = useState([])
  const [loader2, setloader2] = useState(false)
  const sectionRef = useRef(null);

  const [openindex, setopenindex] = useState([])
  useEffect(() => {

    handlevariablesfetchfybrand()
    //handlevariablesfetch();
  }, []);

  useEffect(() => {
    handlevariablesfetch()
    handlefetchmarket()
  }, [selectedbrand])

  const today1 = new Date();
  const currentYear = today1.getFullYear();
  const currentMonth = today1.getMonth();

  let unblockeddate;
  if (currentMonth >= 3) {
    unblockeddate = new Date(currentYear, currentMonth, 1);
  } else {
    const currentmonth15thdate = new Date(today1.getFullYear(), today1.getMonth(), 1);
    const isBefore15th = new Date() < currentmonth15thdate;
    unblockeddate = isBefore15th ? new Date(today1.getFullYear(), today1.getMonth() - 2, 1) : new Date(today1.getFullYear(), today1.getMonth() - 2, 1);
  }

  const MonthBeforeUnlockMonth = `${unblockeddate.getFullYear()}-${String(unblockeddate.getMonth() + 1).padStart(2, "0")}`;
  const MonthBeforeUnlockMonthreverse = MonthBeforeUnlockMonth.split("-").reverse().join("-");

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

        if (getResponse.data !== "Invalid User!") {


          // setbrandoptions(
          // ExceptionVariables?.brandoptions?.map((it)=>{
          // return {label:it.brand,value:it.brand}
          //            }))

          // setmarketoptions(
          //   getResponse.data.markets
          // );
          setbrandoptions(
            getResponse.data.brands?.filter(it => !ExceptionVariables?.brandoptionshide2?.includes(it?.brand))?.sort((a, b) => a.brand.localeCompare(b.brand))?.map((it) => {
              return { value: it.brand, label: maskedBrandOption.maskedBrandOption[it.brand] };
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/modelperformance`,
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
      let arr = []
      arr[index] = true;

      setopenindex(arr)
      handlemodelperformanceapicharts(row.market);
    }
    // Call the analysis function

  };

  const handlefetchmarket = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("brand", selectedbrand)
        const config = {
          method: "post",
          url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_markets` : `${REACT_APP_UPLOAD_DATA}/app/get_markets`,
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/modelperformance`,
        });
      }, 1000);
    }
  };

  const handlemodelperformanceapi = async () => {
    setloader(true)
    if (UserService.isLoggedIn()) {
      try {
        if (selectedbrand && selectedbrand !== "Select" && market !== "Select" && market
          //selectedscenarioname
        ) {
          try {
            setselectedmarketdataset([])
            setopenindex([])
            let config1 = {};
            const requestData1 = {
              brand: selectedbrand,
              market: market
            };
            const requestData2 = {

              "scenario_name": 'Base Scenario',
              "scenario_timestamp": '2024-12-12 18:20:35',
              "user_id": "admin",
              "market": market,
              "model_id": 0,
              "brand": selectedbrand
            }
            config1 = {
              method: "post",
              url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_model_performance` : `${REACT_APP_UPLOAD_DATA}/app/model_performance`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",

              },
              data: requestData1,
            };

            const getResponse1 = await axios(config1);


            if (getResponse1.data.data) {

              setfromrangeonplots(
                getResponse1?.data?.data?.market_wise_mape[0]?.predicted_sales[
                  getResponse1?.data?.data?.market_wise_mape[0]?.predicted_sales.length - 1
                ]?.month_year
                  ?.split("-")?.map((part, index) => {
                    if (index === 0) return new Date().getFullYear() > part ? part : part - 1; // Reduce the year by 1
                    if (index === 1) return "04"; // Set the month to "04"
                    return part; // Keep the day as is
                  })
                  ?.reverse()

                  ?.join("-")

              );
              settorangeonplots(
                getResponse1?.data?.data?.market_wise_mape[0]?.predicted_sales[getResponse1?.data?.data?.market_wise_mape[0]?.predicted_sales.length - 1]?.month_year?.split("-")?.reverse()?.join("-"))
              let arr1 = getResponse1?.data?.data?.fy_mape_data?.sort((a, b) => {
                const marketCompare = a.market?.localeCompare(b.market);
                if (marketCompare !== 0) return marketCompare;

                return a.fy?.localeCompare(b.fy);
              });

              let arr = getResponse1?.data?.data?.market_wise_mape


              let i = 0;
              arr = arr.map(it => {

                if (arr1[i] && arr1[i + 1]) {
                  const updatedItem = {
                    ...it,
                    lastfy: arr1[i].fy,
                    lastmape: arr1[i].mape,
                    currentfy: arr1[i + 1].fy,
                    currentmape: arr1[i + 1].mape
                  };
                  i += 2;
                  return updatedItem;
                }
                return it;
              });
              setmapetable(arr)

              setresultscreen(true);
              setloader(false);

              setdisplaynames({
                ...displaynames,
                brand: selectedbrand,
                market: market,
                scenarioname: selectedscenarioname,

              })
            }
          } catch (err) {
            console.log("Server Error", err);
            if (displaynames) {

              // setselectedscenarioid(displaynames.id || modelcallibrationoptions[1].id)
            }
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
              ); setTimeout(UserService.doLogin(), 1000)
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
              message: "Please fill all entries",
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/modelperformance`,
        });
      }, 1000);
    }
    setloader(false)
  };
  const handlemodelperformanceapicharts = async (marketrow, brandrow) => {
    setloader2(true)
    if (UserService.isLoggedIn()) {
      try {
        if (selectedbrand && selectedbrand !== "Select" && market !== "Select" && market

        ) {
          try {
            let config1 = {};

            const requestData2 = {

              "scenario_name": 'Base Scenario',
              "scenario_timestamp": '2024-12-12 18:20:35',
              "user_id": "admin",
              "market": marketrow,
              "model_id": 0,
              "brand": selectedbrand
            }

            const config2 = {
              method: "post",
              url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_model_performance_plots` : `${REACT_APP_UPLOAD_DATA}/api/model_performance_plots`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",

              },
              data: requestData2,
            };

            const getResponse2 = await axios(config2);

            if (getResponse2?.data?.data) {

              getResponse2?.data?.data?.export_contribution && setexportcontributiondata(getResponse2?.data?.data?.export_contribution)
              // settorangeonplots(getResponse2?.data?.data?.plot1[getResponse2?.data?.data?.plot1.length-1]?.month_year?.split("-").reverse()?.join("-"))
              setselectedmarketdataset(getResponse2.data.data)
              // setlastfymapedata(getResponse?.data?.data?.fy_mape_data?.sort((a,b)=>a.market?.localeCompare(b.market)))
            }
          } catch (err) {
            console.log("Server Error", err);
            if (displaynames) {
              setselectedbrand(displaynames.brand || brandoptions[0].brand)
              setselectedscenarioname(displaynames.scenarioname || modelcallibrationoptions[1]?.scenario_name)
              setselectedzone(displaynames.zone || 'National')
              setselectedyear(displaynames.year || '2021-22')
              // setselectedscenarioid(displaynames.id || modelcallibrationoptions[1].id)
            }
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
              ); setTimeout(UserService.doLogin(), 1000)
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
              message: "Please fill all entries",
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/modelperformance`,
        });
      }, 1000);
    }
    setloader2(false)
  };
  const formatDate = (dateString) => {
    const [month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };
  function formatDate2() {
    // Create a Date object using the specified date string
    const date = new Date();

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // Return the date in "YYYY-MM-DD" format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  const handlevariablesfetch = async () => {
    if (UserService.isLoggedIn()) {
      try {
        setisprocessing(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        const config = {
          method: "get",
          url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_date` : `${REACT_APP_UPLOAD_DATA}/app/fetchvars`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            // "req-header":UserService.getToken()
          },
          data: sendData,
        };
        const getResponse = selectedbrand ? await axios(config) : [];
        if (getResponse.status === 200) {

          selectedbrand === "ATTA" ? setStartDate(getResponse.data.start_date?.split("T")[0]) : setStartDate(getResponse.data.dates[0].min[0].start_date);
          selectedbrand === "ATTA" ? setEndDate(getResponse.data.end_date?.split("T")[0]) : setEndDate(getResponse.data.dates[0].max[0].end_date);

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
    setisprocessing(false)
  };


  const downloadMapeResults = () => {
    const data = [];
    console.log(mapetable)
    const headers = [];

    headers.push("Brand")
    headers.push("Market")
    headers.push("Last FY")
    headers.push("Last FY MAPE")
    headers.push("Current FY")
    headers.push("Current FY MAPE")



    data.push(headers);
    mapetable?.map((row) => {
      const brand = row.brand;
      const market = row.market;
      const lastfy = row.lastfy;
      const lastmape = `${(row.lastmape * 100).toFixed(1)}%`;
      const currentfy = row.currentfy;
      const currentmape = `${(row.currentmape * 100).toFixed(1)}%`;
      data.push([brand, market, lastfy, lastmape, currentfy, currentmape]);
    })

    //   !ExceptionVariables.hiddenvariables.some((it) => it === varItem.attribute_name)
    // )
    //   ?.forEach((item) => {
    //   // Extract the attribute name
    //   const scenario_name = displaynames2.scenario;
    //   const brand_name = item.brand;
    //   const final_market_name = item.final_market;
    //   const fy = item.fy;
    //   const attributeName = item.attribute_name;
    //   // Process month_data and extract values
    //   const monthDataValues = item.month_data.map((month) => {
    //     const value = month.attribute_value;
    //     return Array.isArray(value) && value.length === 0 ? "No matched category" : value;
    //   });

    //   // Calculate subtotal (e.g., summing numeric values)
    //   const subtotal = monthDataValues.reduce((sum, val) => {
    //     return typeof val === "number" ? sum + val : sum;
    //   }, 0);

    //   // Push the row data
    //   data.push([scenario_name, brand_name, final_market_name, fy, attributeName, ...monthDataValues, subtotal]);
    // });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet and add data to it
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, { type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Create a URL from the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedbrand}-MapeResults.xlsx`;
    link.click();


  }
  const downloadLineChartResults = () => {
    const data = [];

    const headers = [];

    //  headers.push("Brand")
    //  headers.push("Market")
    //  headers.push("Variable")


    //  data.push(headers);
    const monthHeaders = Object.keys(exportcontributiondata[0])?.map((it) => { return it })

    data.push(monthHeaders)
    exportcontributiondata?.forEach((row) => {
      const rowData = monthHeaders.map((header) => row[header]); // keep order same as headers
      data.push(rowData);
    });

    //   !ExceptionVariables.hiddenvariables.some((it) => it === varItem.attribute_name)
    // )
    //   ?.forEach((item) => {
    //   // Extract the attribute name
    //   const scenario_name = displaynames2.scenario;
    //   const brand_name = item.brand;
    //   const final_market_name = item.final_market;
    //   const fy = item.fy;
    //   const attributeName = item.attribute_name;
    //   // Process month_data and extract values
    //   const monthDataValues = item.month_data.map((month) => {
    //     const value = month.attribute_value;
    //     return Array.isArray(value) && value.length === 0 ? "No matched category" : value;
    //   });

    //   // Calculate subtotal (e.g., summing numeric values)
    //   const subtotal = monthDataValues.reduce((sum, val) => {
    //     return typeof val === "number" ? sum + val : sum;
    //   }, 0);

    //   // Push the row data
    //   data.push([scenario_name, brand_name, final_market_name, fy, attributeName, ...monthDataValues, subtotal]);
    // });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet and add data to it
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, { type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Create a URL from the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedbrand}-ContributionResults.xlsx`;
    link.click();


  }
  return (
    <>
      <div className="mp-page" style={{ userSelect: "none" }}>
        <div className="mp-header-card">
          <div className="mp-header-left">
            <div className="mp-breadcrumb">Dashboard / Model Performance</div>
            <h2 className="mp-page-title">
              Model Performance{" "}
              {endDate && !isprocessing && (
                <span className="mp-date-note">
                  (Data updated till <strong>{endDate}</strong>)
                </span>
              )}
            </h2>
            <p className="mp-page-subtitle mb-0">
              Analyze market-wise prediction accuracy, actual vs predicted trends,
              contribution patterns and effectiveness metrics.
            </p>
          </div>

          {resultscreen && (
            <div className="mp-header-actions">
              <button
                className="mp-secondary-btn"
                onClick={() => {
                  setselectedscenarioname("");
                  setresultscreen(false);
                  setmarket([]);
                  setselectedbrand("");
                  setmodifybtn(false);
                  setopenindex([]);
                  setexportcontributiondata([]);
                }}
              >
                Reset
              </button>

              <button
                className="mp-primary-btn"
                onClick={() => setmodifybtn(!modifybtn)}
              >
                {modifybtn ? "Close" : "Modify"}
              </button>
            </div>
          )}
        </div>

        {(modifybtn || !resultscreen) && (
          <div className="mp-filter-card">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6 col-12">
                <label className="mp-label">
                  Brand <span className="text-danger">*</span>
                </label>

                <Select
                  placeholder="Select Brand"
                  value={
                    maskedBrandOption.maskedBrandOption[selectedbrand]
                      ? {
                        label: maskedBrandOption.maskedBrandOption[selectedbrand],
                        value: selectedbrand,
                      }
                      : null
                  }
                  options={brandoptions}
                  onChange={(value) => {
                    setselectedbrand(value.value);
                    setmarket([]);
                    setresultscreen(false);
                    setmodifybtn(false);
                  }}
                  classNamePrefix="mp-select"
                />
              </div>

              <div className="col-lg-5 col-md-6 col-12">
                <label className="mp-label">
                  Market <span className="text-danger">*</span>
                </label>

                <Select
                  placeholder="Select market"
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
                  }}
                  classNamePrefix="mp-select"
                />
              </div>

              <div className="col-lg-3 col-md-12 col-12">
                <button className="mp-submit-btn w-100" onClick={handlemodelperformanceapi}>
                  <span>Submit <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {loader ? (
          <div
            className="row d-flex justify-content-center align-items-center"
            style={{ height: "60vh" }}
          >
            <LoaderCustom text="Fetching Performance..." />
          </div>
        ) : resultscreen ? (
          <div className="mp-results-wrap">
            {mapetable?.length > 0 ? (
              <div className="mp-section-card">
                <div className="mp-section-head">
                  <div>
                    <h4 className="mp-section-title">Market Wise MAPE Table Details</h4>
                    <p className="mp-section-subtitle mb-0">
                      Compare previous and current financial year performance market-wise.
                    </p>
                  </div>

                  <button className="mp-secondary-btn" onClick={downloadMapeResults}>
                    Download MAPE Comparison
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table mp-table align-middle">
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th>Brand</th>
                        <th>Market</th>
                        <th>Last FY</th>
                        <th>Last FY MAPE</th>
                        <th>Current FY</th>
                        <th>Current MAPE</th>
                        <th style={{ width: '120px' }}>Select for More Details</th>
                      </tr>
                    </thead>

                    <tbody>
                      {mapetable.map((row, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{maskedBrandOption.maskedBrandOption[row?.brand]}</td>
                            <td>{row?.market}</td>
                            <td>{row?.lastfy}</td>
                            <td>
                              <span
                                className={`mp-badge ${row?.lastmape <= 0.1
                                    ? "badge-good"
                                    : row?.lastmape <= 0.15
                                      ? "badge-mid"
                                      : "badge-bad"
                                  }`}
                              >
                                {(row?.lastmape * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            <td>{row?.currentfy}</td>
                            <td>
                              <span
                                className={`mp-badge ${row?.currentmape <= 0.1
                                    ? "badge-good"
                                    : row?.currentmape <= 0.15
                                      ? "badge-mid"
                                      : "badge-bad"
                                  }`}
                              >
                                {(row?.currentmape * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            <td>
                              <button
                                className={`mp-outline-btn ${openindex[index] ? "mp-outline-btn--hide" : ""}`}
                                onClick={() => {
                                  setexportcontributiondata([]);
                                  handleCheckboxChange(index, row);
                                }}
                              >
                                {openindex[index] ? "Hide" : "Details"}
                              </button>
                            </td>
                          </tr>

                          {openindex[index] && (
                            <tr>
                              <td colSpan="8" className="mp-expanded-cell">
                                {loader2 ? (
                                  <div className="mp-inline-loader">
                                    <div className="dot-flashing"></div>
                                    <p className="mp-loader-text">Fetching Details...</p>
                                  </div>
                                ) : (
                                  <>
                                    {exportcontributiondata?.length > 0 && (
                                      <div className="mp-download-row">
                                        <button
                                          className="mp-secondary-btn"
                                          onClick={downloadLineChartResults}
                                        >
                                          Download Contribution
                                        </button>
                                      </div>
                                    )}

                                    <div className="mp-chart-card">
                                      <ModelPerformanceChart data={mapetable[index]} />
                                    </div>

                                    <div className="container-fluid px-0 mt-3">
                                      <div className="row g-3">
                                        {selectedmarketdataset?.plot2?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <PieCharts
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                displaynames={displaynames}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot3?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart1
                                                fulldataset={selectedmarketdataset}
                                                maxValuedynamicVolume={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...[
                                                        selectedmarketdataset?.plot3[0]?.total_core / 1000 ?? 0,
                                                        selectedmarketdataset?.plot3[1]?.total_incremental / 1000 ?? 0,
                                                        selectedmarketdataset?.plot3[2]?.total_media / 1000 ?? 0,
                                                      ]
                                                    ) / 100
                                                  ) * 100
                                                }
                                                maxValuedynamicValue={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...[
                                                        selectedmarketdataset?.plot3[0]?.total_core_sales / 1000 ?? 0,
                                                        selectedmarketdataset?.plot3[1]?.total_incremental_sales / 1000 ?? 0,
                                                        selectedmarketdataset?.plot3[2]?.total_media_sales / 1000 ?? 0,
                                                      ]
                                                    ) / 100
                                                  ) * 100
                                                }
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot4?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart2
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={
                                                  Math.ceil(
                                                    Math.max(...selectedmarketdataset?.plot4.map((it) => it.contribution)) / 100
                                                  ) * 100
                                                }
                                                maxValuedynamicValue={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...selectedmarketdataset?.plot4.map(
                                                        (it) => it.contribution_sales_value / 100000
                                                      )
                                                    ) / 100
                                                  ) * 100
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot10?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart5
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={
                                                  Math.ceil(
                                                    Math.max(...selectedmarketdataset?.plot10.map((it) => it.contribution)) / 100
                                                  ) * 100
                                                }
                                                maxValuedynamicValue={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...selectedmarketdataset?.plot10.map(
                                                        (it) => it.contribution_sales_value / 100000
                                                      )
                                                    ) / 100
                                                  ) * 100
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot5?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart4
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={Math.ceil(
                                                  Math.max(
                                                    ...selectedmarketdataset?.plot5?.map((it) =>
                                                      Number(it?.attribute_value_per_roi)
                                                    )
                                                  )
                                                )}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot13?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart8
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={
                                                  (Math.ceil(
                                                    Math.max(
                                                      ...selectedmarketdataset?.plot13?.map((it) =>
                                                        Number(it?.attribute_value_per_roi)
                                                      )
                                                    )
                                                  ) /
                                                    10) *
                                                  10
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot12?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart7
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={Math.ceil(
                                                  Math.max(
                                                    ...selectedmarketdataset?.plot12?.map((it) =>
                                                      Number(it?.attribute_value_per_roi)
                                                    )
                                                  )
                                                )}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot11?.length > 0 && (
                                          <div className="col-lg-6 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart6
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...selectedmarketdataset?.plot11?.map((it) =>
                                                        Number(it?.effectiveness)
                                                      )
                                                    ) / 10
                                                  ) * 10
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {selectedmarketdataset?.plot9?.length > 0 && (
                                          <div className="col-lg-12 col-md-12">
                                            <div className="mp-mini-card h-100">
                                              <SingleBarChart3
                                                fulldataset={selectedmarketdataset}
                                                type={row.market}
                                                isValue={isValue}
                                                range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                                maxValuedynamicVolume={
                                                  Math.ceil(
                                                    Math.max(
                                                      ...selectedmarketdataset?.plot9?.map((it) =>
                                                        Number(it?.effectiveness)
                                                      )
                                                    ) / 10
                                                  ) * 10
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mp-empty-state">There are no records to display.</div>
            )}
          </div>
        ) : null}
      </div>

      <style>{`
      .mp-page {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--rr-text-main);
      }

      .mp-header-card,
      .mp-filter-card,
      .mp-section-card,
      .mp-chart-card,
      .mp-mini-card,
      .mp-empty-state {
        border: 1px solid var(--rr-border);
        background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
        box-shadow: var(--rr-shadow);
        border-radius: 16px;
      }

      .mp-header-card {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
        margin-bottom: 16px;
        background: var(--rr-topbar-grad);
      }

      .mp-header-left {
        min-width: 0;
      }

      .mp-breadcrumb {
        font-size: 11px;
        font-weight: 700;
        color: var(--rr-accent);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .mp-page-title {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--rr-text-main);
      }

      .mp-date-note {
        display: inline-block;
        margin-left: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: var(--rr-text-muted);
        font-weight: 500;
      }

      .mp-page-subtitle {
        margin-top: 8px;
        max-width: 880px;
        color: var(--rr-text-muted);
        font-size: 13px;
        line-height: 1.65;
        font-weight: 400;
      }

      .mp-header-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .mp-filter-card {
        padding: 20px;
        margin-bottom: 16px;
      }

      .mp-label {
        display: inline-block;
        margin-bottom: 8px;
        color: var(--rr-text-main);
        font-size: 13px;
        font-weight: 600;
      }

      .mp-primary-btn,
      .mp-submit-btn,
      .mp-secondary-btn,
      .mp-outline-btn {
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.25s ease;
        cursor: pointer;
      }

      .mp-primary-btn {
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        box-shadow: 0 4px 12px rgba(13, 124, 102, 0.20);
      }

      .mp-submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 12px 20px;
        border-radius: 9999px;
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        font-size: 15px;
        font-weight: 700;
        box-shadow: 0 4px 16px rgba(13, 124, 102, 0.25);
      }

      .mp-submit-btn span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .mp-secondary-btn {
        color: var(--rr-text-main);
        background: var(--rr-bg-soft);
        border: 1px solid var(--rr-border);
        box-shadow: 0 4px 12px rgba(44, 62, 80, 0.06);
      }

      .mp-outline-btn {
        color: #FFFFFF;
        background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(13, 124, 102, 0.20);
      }

      .mp-outline-btn--hide {
        background: linear-gradient(135deg, #17A2B8 0%, #138496 100%);
      }

      .mp-outline-btn--hide:hover {
        background: linear-gradient(135deg, #138496 0%, #0f6674 100%);
      }

      .mp-submit-btn:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 24px rgba(13, 124, 102, 0.30);
      }

      .mp-primary-btn:hover,
      .mp-secondary-btn:hover,
      .mp-outline-btn:hover {
        transform: translateY(-1px);
      }

      .mp-loader-wrap {
        min-height: 55vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mp-results-wrap {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .mp-section-card {
        padding: 20px;
      }

      .mp-section-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 16px;
      }

      .mp-section-title {
        margin: 0 0 4px;
        font-family: 'Inter', sans-serif;
        font-size: 17px;
        font-weight: 700;
        color: var(--rr-text-main);
      }

      .mp-section-subtitle {
        color: var(--rr-text-muted);
        font-size: 13px;
        font-weight: 400;
      }

      .mp-table {
        margin-bottom: 0;
      }

      .mp-table thead th {
        background: var(--rr-bg-soft);
        color: var(--rr-text-main);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border-bottom: 1px solid var(--rr-border);
        border-right: 1px solid var(--rr-border);
        padding: 12px;
        white-space: nowrap;
        text-align: center;
      }

      .mp-table thead th:last-child {
        border-right: none;
      }

      .mp-table tbody tr {
        border-bottom: 1px solid var(--rr-border);
      }

      .mp-table tbody tr:last-child {
        border-bottom: none;
      }

      .mp-table tbody td {
        vertical-align: middle;
        color: var(--rr-text-main);
        font-size: 13px;
        font-weight: 500;
        padding: 16px 12px;
        background: transparent;
        border-bottom: 1px solid var(--rr-border);
        border-right: 1px solid var(--rr-border);
        text-align: center;
      }

      .mp-table tbody td:last-child {
        border-right: none;
      }

      .mp-expanded-cell {
        background: transparent !important;
        padding: 16px !important;
      }

      .mp-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 72px;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        color: #FFFFFF;
      }

      .badge-good {
        background: linear-gradient(135deg, #198754 0%, #157347 100%);
      }

      .badge-mid {
        background: linear-gradient(135deg, #FF8C00 0%, #E67E00 100%);
      }

      .badge-bad {
        background: linear-gradient(135deg, #DC3545 0%, #B02A37 100%);
      }

      .mp-download-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 12px;
      }

      .mp-chart-card {
        padding: 16px;
        margin-bottom: 16px;
      }

      .mp-mini-card {
        padding: 16px;
        height: 100%;
      }

      .mp-empty-state {
        padding: 24px;
        text-align: center;
        color: var(--rr-text-muted);
        font-weight: 600;
      }

      .mp-inline-loader {
        min-height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }

      .dot-flashing {
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: transparent;
        border: 4px solid rgba(13, 124, 102, 0.12);
        border-top-color: #0D7C66;
        border-right-color: #17A2B8;
        animation: spinnerRotate 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        box-shadow: 0 0 20px rgba(13, 124, 102, 0.15);
      }

      .dot-flashing::before,
      .dot-flashing::after {
        content: "";
        position: absolute;
        border-radius: 50%;
      }

      .dot-flashing::before {
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        border: 3px solid transparent;
        border-top-color: #17A2B8;
        border-left-color: #0D7C66;
        animation: spinnerRotate 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
      }

      .dot-flashing::after {
        top: 12px;
        left: 12px;
        right: 12px;
        bottom: 12px;
        border: 2px solid transparent;
        border-bottom-color: #0D7C66;
        animation: spinnerRotate 0.7s linear infinite;
      }

      .mp-loader-text {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--rr-text-muted);
        letter-spacing: 0.4px;
        animation: pulseText 1.8s ease-in-out infinite;
      }

      @keyframes spinnerRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulseText {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }

      .mp-select__control {
        min-height: 44px !important;
        border-radius: 8px !important;
        border: 1px solid var(--rr-border) !important;
        background: var(--rr-bg-soft) !important;
        box-shadow: none !important;
        font-size: 13px;
      }

      .mp-select__control:hover {
        border-color: rgba(13, 124, 102, 0.40) !important;
      }

      .mp-select__control--is-focused {
        border-color: #0D7C66 !important;
        box-shadow: 0 0 0 2px rgba(13, 124, 102, 0.15) !important;
      }

      .mp-select__single-value,
      .mp-select__input-container,
      .mp-select__placeholder,
      .mp-select__multi-value__label {
        color: var(--rr-text-main) !important;
        font-size: 13px;
      }

      .mp-select__placeholder {
        color: var(--rr-text-muted) !important;
      }

      .mp-select__menu {
        background: var(--rr-bg-soft) !important;
        border: 1px solid var(--rr-border) !important;
        border-radius: 12px !important;
        overflow: hidden;
        z-index: 40 !important;
      }

      .mp-select__option {
        background: var(--rr-bg-soft) !important;
        color: var(--rr-text-main) !important;
        font-size: 13px;
      }

      .mp-select__option--is-focused {
        background: rgba(13, 124, 102, 0.08) !important;
      }

      .mp-select__option--is-selected {
        background: rgba(13, 124, 102, 0.15) !important;
        color: #0D7C66 !important;
        font-weight: 600;
      }

      .mp-select__multi-value {
        background: rgba(13, 124, 102, 0.10) !important;
        border-radius: 8px !important;
      }

      .mp-select__multi-value__label {
        color: #0D7C66 !important;
        font-weight: 600;
      }

      .mp-select__multi-value__remove:hover {
        background: rgba(220, 53, 69, 0.15) !important;
        color: #DC3545 !important;
      }

      .dark-theme .mp-select__placeholder,
      .dark-theme .mp-select__single-value,
      .dark-theme .mp-select__input-container,
      .dark-theme .mp-select__multi-value__label {
        color: var(--rr-text-main) !important;
      }

      @media (max-width: 992px) {
        .mp-header-card,
        .mp-section-head {
          flex-direction: column;
          align-items: flex-start;
        }

        .mp-header-actions {
          width: 100%;
        }

        .mp-header-actions button {
          flex: 1;
        }
      }

      @media (max-width: 768px) {
        .mp-header-card,
        .mp-filter-card,
        .mp-section-card,
        .mp-chart-card,
        .mp-mini-card,
        .mp-empty-state {
          border-radius: 12px;
        }

        .mp-header-card {
          padding: 16px;
        }

        .mp-page-title {
          font-size: 1.25rem;
        }

        .mp-date-note {
          display: block;
          margin-left: 0;
          margin-top: 4px;
        }

        .mp-section-card {
          padding: 16px;
        }

        .mp-chart-card,
        .mp-mini-card {
          padding: 12px;
        }

        .mp-primary-btn,
        .mp-submit-btn,
        .mp-secondary-btn,
        .mp-outline-btn {
          width: 100%;
        }
      }
    `}</style>
    </>
  );
}

export default ModelPerformance