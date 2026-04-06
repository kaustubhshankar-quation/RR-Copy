import React from "react";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'

import { useState, useEffect, useRef } from "react";
import table from '../JSON Files/table.json'
import Loader from "react-js-loader";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import { useDispatch } from "react-redux";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import getNotification from "../../Redux/Action/action";
import axios from "axios";
import Chart from "react-apexcharts";
import Plot from "react-plotly.js";
import FooterPages from "../Footer/FooterPages";
import Navbar3 from "../Navbars/Navbar3";
import SubNavbar from "../Navbars/SubNavbar";
import LoaderCustom from "../LoaderCustom";

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
import VariableTableYearlyAtta from "./VariableTableYearlyAtta";
import VariableTableAtta from "./VariableTableAtta";

const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;
const { REACT_APP_UPLOAD_DATA2 } = process.env;
const XLSX = require("xlsx");
function SimulatorAtta() {
  const [newbasedetailsold, setnewbasedetailsold] = useState({})
  const [isprocessing, setisprocessing] = useState(false)
  const [endDate, setEndDate] = useState("")
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const dispatch = useDispatch();
  const [createfrombaseoruploadfileswitch, setcreatefrombaseoruploadfileswitch] = useState(false)
  const [fulldataset, setfulldataset] = useState([])
  const [fulldataset2, setfulldataset2] = useState([])
  const [timetype, settimetype] = useState("")
  const [mape, setmape] = useState(0)
  const [isValue, setisValue] = useState(false)
  const [predictedsalesvaluelastfy, setpredictedsalesvaluelastfy] = useState(0)
  const [originaldatasetforcolorcoding, setoriginaldatasetforcolorcoding] = useState([])
  const [yearoptions, setyearoptions] = useState([])
  const [modifybtn, setmodifybtn] = useState(false)
  const [fromrangeonplots, setfromrangeonplots] = useState("")
  const [marketoptions, setmarketoptions] = useState([])
  const [uploadfile, setuploadfile] = useState("")
  const [market, setmarket] = useState("");
  const [options1, setoptions1] = useState({})
  const [plotdata1, setplotdata1] = useState([]);
  const [uniquescenarioname, setuniquescenarioname] = useState(false)
  const [savednewbasescenarioname, setsavednewbasescenarioname] = useState([])
  const [savedmasterscenarioname, setsavedmasterscenarioname] = useState("")
  const [newbasedetailscreatenew, setnewbasedetailscreatenew] = useState({})
  const [loader, setloader] = useState(false);
  const [loader1, setloader1] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [loader3, setloader3] = useState(false);
  const [loader4, setloader4] = useState(false);
  const [loader5, setloader5] = useState(false);
  const [scenariooptions, setscenariooptions] = useState([{ scenario_name: "Base Scenario", scenario_timestamp: "2024-10-22 14:11:01" }]);
  const [scenarionewoldscreen, setscenarionewoldscreen] = useState("Select")
  const [viewscenariobtn, setviewscenariobtn] = useState(false)
  const [viewscenariodatatable, setviewscenariodatatable] = useState(false)
  const [viewscenariodatatable2, setviewscenariodatatable2] = useState(false)
  const [newscenariofile, setnewscenariofile] = useState("")
  const [viewnewbasescenariodata, setviewnewbasescenariodata] = useState(false)
  const [isHovered, setIsHovered] = useState(true);
  const [torangeonplots, settorangeonplots] = useState("")
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
  const [uploadfileoldscenarios, setuploadfileoldscenarios] = useState("")
  const [uploadfiledata, setuploadfiledata] = useState([])

  const [tablepredictionsdataset, settablepredictionsdataset] = useState([]);
  const [tablecontributiondataset, settablecontributiondataset] = useState([]);
  const sectionRef = useRef(null);
  const [monthlist, setmonthlist] = useState(["April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "March"])
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
    unblockeddate = isBefore15th ? new Date(today1.getFullYear(), today1.getMonth() - 3, 1) : new Date(today1.getFullYear(), today1.getMonth() - 3, 1);
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

          let inputDate = ""
          // selectedbrand==="ATTA"?setStartDate(getResponse.data.start_date?.split("T")[0]):setStartDate(getResponse.data.dates[0].min[0].start_date);
          if (selectedbrand === "ATTA") {
            inputDate = getResponse.data.end_date?.split("T")[0]
          }
          else {
            inputDate = getResponse.data.dates[0].max[0].end_date
          }

          const [day, month, year] = inputDate.split("-")?.reverse().map(Number);
          const date = new Date(year, month, day); // Month is zero-based in JS Date
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setisprocessing(false)
  };
  const handlefetchnewbasescenario = async (type) => {
    if (UserService.isLoggedIn()) {
      try {
        setisprocessing(true)
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("fy", selectedyear)
        sendData.append("brand_market", `${selectedbrand}_${market}`)

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

        if (getResponse.status === 200 && getResponse?.data?.data.length > 0) {
          let selectedyrsplit = selectedyear?.split("-")
          let arr = getResponse?.data?.data?.filter((it) => Number(it?.fy?.split("-")[0]) + 1 === Number(selectedyrsplit[0]) && Number(it?.fy?.split("-")[1]) + 1 === Number(selectedyrsplit[1]))
          if (arr.length > 0) {
            setnewbasedetailscreatenew(arr[0])
          }
          else {

            setnewbasedetailscreatenew({})
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
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

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileUploadoldscenario = (event) => {

    const files = event.target.files;
    // Handle the uploaded files here
    handleimportoldscenarios(files)
  };
  const handleFileUploadoldscenario2 = (event) => {

    const files = event.target.files;
    // Handle the uploaded files here
    handleimportoldscenarios2(files)
  };
  const handleexportoldscenarios = () => {
    setisprocessing(true)
    const data = [];

    const headers = [];
    headers.push("Scenario")
    headers.push("brand")
    headers.push("final_market")
    headers.push("fy")
    headers.push(["Attribute"]);
    headers.push("Key");
    const monthHeaders = sampledataset[0].month_data?.map((it) => { return it?.month_year || it?.fy || it?.quarterly || it?.half_yearly })
    headers.push(...monthHeaders, "subtotal");
    data.push(headers);
    sampledataset?.forEach((item) => {
      // Extract the attribute name
      const scenario_name = displaynames2.scenario;
      const brand_name = displaynames2.brand;
      const final_market_name = item.final_market;
      const fy = item.fy;
      const attributeName = item.attribute_name;
      const key = item?.prodhierarchy;
      // Process month_data and extract values
      const monthDataValues = item.month_data.map((month) => {
        const value = month.attribute_value;
        return Array.isArray(value) && value.length === 0 ? "No matched category" : value;
      });
      const allNull = monthDataValues.every((val) => val === null || val === undefined);

      // Skip pushing the row if all values in monthDataValues are null or undefined
      if (allNull) return;
      // Calculate subtotal (e.g., summing numeric values)
      const subtotal = monthDataValues.reduce((sum, val) => {
        return typeof val === "number" ? sum + val : sum;
      }, 0);

      // Push the row data
      data.push([scenario_name, brand_name, final_market_name, fy, attributeName, key, ...monthDataValues, subtotal]);
    });

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
    link.download = `${displaynames2.brand}-${displaynames2.market}-${displaynames2.scenario}.xlsx`;
    link.click();
    setisprocessing(false)
  }
  const handleimportoldscenarios = (file) => {
    try {
      setisprocessing(true)
      setloader4(true)
      //console.log(file)
      const reader = new FileReader();
      reader.readAsBinaryString(file[0]);
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert Excel data to JSON format
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // First row is assumed to be headers (e.g., ["Attribute", "Month 1", "Month 2", ..., "Subtotal"])
        const headers = excelData[0];
        const rows = excelData.slice(1);
        const formattedData = excelData.slice(1).map(row => {
          const keys = excelData[0];
          // First row contains the keys
          return keys.reduce((obj, key, index) => {
            obj[key] = row[index]; // Map the key to the corresponding value in the row
            return obj;
          }, {});
        });



        const validCombination = rows.some(row =>

          row[0] === displaynames2.scenario && row[1] === displaynames2.brand && row[2] === displaynames2.market && row[3] === displaynames2.fy
        );


        if (!validCombination) {
          dispatch(getNotification({
            message: "Invalid combination of Scenario, Brand,FY and Market!",
            type: "danger"
          }));
          return;
        }

        let datasetprevious = [...sampledataset]

        if (rows[0].length - 7 !== datasetprevious[0].month_data.length) {
          dispatch(getNotification({
            message: "Time Period type does not match!!",
            type: "danger"
          }));
          return;
        }

        // Update the original JSON set


        if (datasetprevious[0]?.month_data?.length === 1) {
          datasetprevious.forEach((item) => {
            const row = rows.find((r) => r[4] === item.attribute_name && r[5] === item.prodhierarchy);

            if (row) {
              // Update the month_data values

              item.month_data.forEach((month, index) => {
                if (month.attribute_value === null) { }
                else {
                  if (row[index + 6] === undefined) {
                    month.attribute_value = null;
                  }
                  else {
                    month.attribute_value = row[index + 6];
                  }
                }




              });

            }
          });
          datasetprevious = datasetprevious?.map((variable, variableIndex) => {
            const attributeName = variable?.attribute_name;

            variable.subtotal = variable.month_data.reduce((acc, value) => {
              if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                return acc;
              }
              return acc + (parseFloat(value.attribute_value) || 0);
            }, 0);



            return variable;
          });
        }
        else if (datasetprevious[0]?.month_data?.length == 4) {
          datasetprevious.forEach((item) => {
            const row = rows.find((r) => r[4] === item.attribute_name && r[5] === item.prodhierarchy);

            if (row) {
              // Update the month_data values

              item.month_data.forEach((month, index) => {

                if (index < row.length - 1) { // Ensure index is within Excel data range
                  month.attribute_value = row[index + 6];
                }

                else {
                  month.attribute_value = row[index + 6];
                }
              });

            }
          });
          datasetprevious = datasetprevious?.map((variable, variableIndex) => {
            const attributeName = variable?.attribute_name;

            // Check for maxVariables or zeroOrOneVariables conditions
            if (
              ExceptionVariables?.maxVariables?.some((varName) => varName === attributeName) ||
              ExceptionVariables?.zeroOrOneVariables?.some((varName) => varName === attributeName)
            ) {
              variable.subtotal = Math.max(
                ...variable.month_data.map((item) => item.attribute_value)
              );
            }
            // Check for lastPriceAvailableVariables condition
            else if (
              ExceptionVariables?.lastPriceAvailableVariables?.some((varName) => varName === attributeName)
            ) {
              const latestMonthData = variable.month_data.reduce((latest, current) => {
                if (current.attribute_value !== 0 && (!latest || current.quarterly > latest.quarterly)) {
                  return current;
                }
                return latest;
              }, null);

              variable.subtotal = latestMonthData ? latestMonthData.attribute_value : 0;
            }

            // Handle other conditions
            else {
              if (variable.type === ExceptionVariables?.variabletypes[2]) {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              } else {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              }
            }

            return variable; // Ensure the modified variable is returned
          });
        }
        else if (datasetprevious[0]?.month_data?.length == 2) {
          datasetprevious.forEach((item) => {
            const row = rows.find((r) => r[4] === item.attribute_name && r[5] === item.prodhierarchy);

            if (row) {
              // Update the month_data values

              item.month_data.forEach((month, index) => {

                if (index < row.length - 1) { // Ensure index is within Excel data range
                  month.attribute_value = row[index + 6];
                }

                else {
                  month.attribute_value = row[index + 6];
                }
              });

            }
          });
          datasetprevious = datasetprevious?.map((variable, variableIndex) => {
            const attributeName = variable?.attribute_name;

            // Check for maxVariables or zeroOrOneVariables conditions
            if (
              ExceptionVariables?.maxVariables?.some((varName) => varName === attributeName) ||
              ExceptionVariables?.zeroOrOneVariables?.some((varName) => varName === attributeName)
            ) {
              variable.subtotal = Math.max(
                ...variable.month_data.map((item) => item.attribute_value)
              );
            }
            // Check for lastPriceAvailableVariables condition
            else if (
              ExceptionVariables?.lastPriceAvailableVariables?.some((varName) => varName === attributeName)
            ) {
              const latestMonthData = variable.month_data.reduce((latest, current) => {
                if (current.attribute_value !== 0 && (!latest || current.quarterly > latest.quarterly)) {
                  return current;
                }
                return latest;
              }, null);

              variable.subtotal = latestMonthData ? latestMonthData.attribute_value : 0;
            }

            // Handle other conditions
            else {
              if (variable.type === ExceptionVariables?.variabletypes[2]) {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              } else {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              }
            }

            return variable; // Ensure the modified variable is returned
          });
        }
        else {
          datasetprevious.forEach((item) => {
            const row = rows.find((r) => r[4] === item.attribute_name && r[5] === item.prodhierarchy);

            if (row) {
              // Update the month_data values

              item.month_data.forEach((month, index) => {

                if (month?.month_year && month?.month_year > endDate && index < row.length - 1) { // Ensure index is within Excel data range
                  month.attribute_value = row[index + 6] === undefined ? null : row[index + 6];
                }

                else {
                }
              });

            }
          });
          datasetprevious = datasetprevious?.map((variable, variableIndex) => {
            const attributeName = variable?.attribute_name;

            // Check for maxVariables or zeroOrOneVariables conditions
            if (
              ExceptionVariables?.maxVariables?.some((varName) => varName === attributeName) ||
              ExceptionVariables?.zeroOrOneVariables?.some((varName) => varName === attributeName)
            ) {
              variable.subtotal = Math.max(
                ...variable.month_data.map((item) => item.attribute_value)
              );
            }
            // Check for lastPriceAvailableVariables condition
            else if (
              ExceptionVariables?.lastPriceAvailableVariables?.some((varName) => varName === attributeName)
            ) {
              const latestMonthData = variable.month_data.reduce((latest, current) => {
                if (current.attribute_value !== 0 && (!latest || current.month_year > latest.month_year)) {
                  return current;
                }
                return latest;
              }, null);

              variable.subtotal = latestMonthData ? latestMonthData.attribute_value : 0;
            }

            // Handle other conditions
            else {
              if (variable.type === ExceptionVariables?.variabletypes[2]) {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              } else {
                variable.subtotal = variable.month_data.reduce((acc, value) => {
                  if (!value || value.attribute_value === null || value.attribute_value === undefined) {
                    return acc; // Skip null/undefined values
                  }
                  return acc + (parseFloat(value.attribute_value) || 0); // Ensure valid number
                }, 0);
              }
            }

            return variable; // Ensure the modified variable is returned
          });
        }


        setsampledataset(datasetprevious)
        setoriginalset(datasetprevious)
      };

    }
    catch (error) {
      console.log(error)
      dispatch(getNotification({
        message: "Please upload correct file format!",
        type: "danger"
      }))
    }
    setloader4(false)
    setisprocessing(false)

  }
  const handleimportoldscenarios2 = (file) => {
    setloader4(true)
    try {

      //console.log(file)
      const reader = new FileReader();
      reader.readAsBinaryString(file[0]);
      reader.onload = async (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert Excel data to JSON format
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // First row is assumed to be headers (e.g., ["Attribute", "Month 1", "Month 2", ..., "Subtotal"])
        const headers = excelData[0];
        const rows = excelData.slice(1);

        setselectedbrand(rows[0][1])
        setmarket(rows[0][2])
        setselectedyear(rows[0][3])
        setscenarionewoldscreen("old")
        setselectedscenarioname(rows[0][0])
        let arr = scenariooptions.filter((it) => { return rows[0][0] === it.scenario_name })
        setselectedscenarionametimestamp(arr[0]?.created_dt)

        const FormData = require("form-data");
        const sendData = new FormData();
        let config;
        sendData.append("scenario_name", rows[0][0]);
        sendData.append("user_id", "admin");
        sendData.append("final_market", rows[0][2]);
        sendData.append('brand', rows[0][1])
        if (selectedscenarioname === "Base Scenario") {
          // sendData.append("fin_year", selectedyear);

          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/api/basegetscenariodata`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: sendData,
          };
        } else {

          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: sendData,
          };
        }

        // Now you can use `config` without any errors
        const getResponse = await axios(config);
        let datasetprevious = getResponse?.data


        if (rows[0].length - 6 !== datasetprevious[0]?.month_data.length) {
          dispatch(getNotification({
            message: "Time Period type does not match!!",
            type: "danger"
          }));
          return;
        }
        datasetprevious.forEach((item) => {
          const row = rows.find((r) => r[4] === item.attribute_name); // Match by attribute name
          if (row) {

            Object.assign(item, {
              brand: row[1],
              fy: row[3],
              final_market: row[2],
            });



            item?.month_data.forEach((month, index) => {
              if (index < row.length - 1) { // Ensure index is within Excel data range
                month.attribute_value = row[index + 5]; // Skip the "Attribute" column in Excel
              }
            });
          }
        });


        setsampledataset(datasetprevious)
        setoriginalset(datasetprevious)
        setviewscenariodatatable(true)
      };

    }
    catch (error) {
      console.log(error)
      dispatch(getNotification({
        message: "Please upload correct file format!",
        type: "danger"
      }))
    }
    setloader4(false)


  }

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
            ExceptionVariables?.brandoptions.filter((it) => it.brand === "ATTA")
          )
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
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
          url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_markets` : `${REACT_APP_UPLOAD_DATA}/app/get_markets`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",

          },
          data: sendData,
        };
        const getResponse = await axios(config);

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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
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
          url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_get_monthly_scenario_name` : `${REACT_APP_UPLOAD_DATA}/api/get_scenario_names`,
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
          setscenariooptions(getResponse.data?.filter((scenario) => scenario.scenario_name !== "Base Scenario")?.sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt))?.map((it) => {
            return {
              label: it.scenario_name,
              value: it.scenario_name,
              timestamp: it.created_dt
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
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
  const fetchdatasettablenewbasescenario = async () => {
    if (UserService.isLoggedIn()) {
      if (true) {
        try {
          setisprocessing(true)
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          sendData.append("scenario_name", newbasedetailscreatenew?.scenerio_name);
          sendData.append("scenario_timestamp", newbasedetailscreatenew?.created_at);
          sendData.append("user_id", "admin");
          sendData.append("market", newbasedetailscreatenew?.market);
          sendData.append("brand", newbasedetailscreatenew?.brand)
          sendData.append("fy", newbasedetailscreatenew?.fy)
          let getResponse = []
          let successfulResponse = []



          if (timetype === "Y") {
            config = {
              method: "post",
              url:
                `${REACT_APP_UPLOAD_DATA}/app/atta_get_new_base_scenario_annual`,

              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }
          else if (timetype === "Q") {
            config = {
              method: "post",
              url:
                `${REACT_APP_UPLOAD_DATA}/app/atta_get_new_base_scenario_qt`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }
          else if (timetype === "HY") {
            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_new_base_scenario_hy`,

              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }
          else {
            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_new_base_scenario_data`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }

          //   const apiConfigs = [

          //     {
          //       method: "post",
          //       url: selectedbrand === "ATTA"
          //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`
          //         : `${REACT_APP_UPLOAD_DATA}/api/get_annual_scenario_data`,
          //       headers: {
          //         Accept: "text/plain",
          //         "Content-Type": "application/json",
          //       },
          //       data: sendData,
          //     },
          //     {
          //       method: "post",
          //       url: selectedbrand === "ATTA"
          //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`
          //         : `${REACT_APP_UPLOAD_DATA}/api/get_qtr_scenario_data`,
          //       headers: {
          //         Accept: "text/plain",
          //         "Content-Type": "application/json",
          //       },
          //       data: sendData,
          //     },
          //     {
          //       method: "post",
          //       url: selectedbrand === "ATTA"
          //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodata`
          //         : `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
          //       headers: {
          //         Accept: "text/plain",
          //         "Content-Type": "application/json",
          //       },
          //       data: sendData,
          //     },
          //     // Add more API configs here if needed
          //   ];
          //   for (let config of apiConfigs) {
          //     try {
          //        getResponse = await axios(config);
          // console.log(getResponse)
          //       if (
          //         getResponse?.data && getResponse?.data?.plot1.length > 0

          //       ) {
          //         successfulResponse = getResponse;
          //         break; // Stop further API calls
          //       }
          //     } catch (error) {
          //       console.error("Error calling API:", config.url, error.message);
          //       continue; // Try the next API
          //     }
          // }



          getResponse = await axios(config)





          if (getResponse?.data?.data?.length > 0) {
            setviewnewbasescenariodata(true)
            setviewscenariodatatable(false)

            setresultscreen(true)

            setdisplaynames2({
              ...displaynames2,
              brand: selectedbrand,
              scenario: "newbase",
              market: market,
              fy: selectedyear
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
                console.log(group)
                group.push(item);
                acc[item.attribute_name] = group;
                return acc;
              }, {})
              ;

            console.log(otherAttributes)

            const sortedAttributes = Object.keys(otherAttributes)
              .map(attribute_name => ({
                attribute_name,
                items: otherAttributes[attribute_name].sort((a, b) => {
                  const customOrder = ExceptionVariables.customOrder2;
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



            const arrangeddataset = [...sortedAttributes, ...digitalAttributes, ...tvAttributes]
            setsampledataset(arrangeddataset)
            setoriginalset(arrangeddataset);
            setoriginaldatasetforcolorcoding(arrangeddataset)


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
    setloader2(false);

    setTimeout(() => {
      scrollToSection("attributetable")

    }, 1000);
    setisprocessing(false)

  };
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
          url: displaynames?.scenario?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : displaynames?.scenario.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : displaynames?.scenario.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario`,
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setloader5(false)
  };
  const handlesetasnewbase = async () => {
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
          scenario_name: `M_NEW_BASE_FY_${displaynames.fy.replace("-", "_")}${displaynames?.scenario.replace("M_", "-")}`,
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
          url: displaynames?.scenario?.startsWith("HY_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : displaynames?.scenario.startsWith("Y_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : displaynames?.scenario.startsWith("Q_") ? `${REACT_APP_UPLOAD_DATA}/app/atta_save_newbase_scenario` : `${REACT_APP_UPLOAD_DATA}/app/atta_save_new_base_scenario`,
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
          //console.log(getResponse.data.scenario_name.replace(`NEW_BASE_FY_${displaynames.fy.replace("-","_")}-`,""))
          setsavednewbasescenarioname(displaynames?.scenario)
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setloader5(false)
  };

  const fetchdatasettable = async (ifscenariogiven) => {
    if (UserService.isLoggedIn()) {
      if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select" && selectedyear && selectedyear !== "Select") {
        try {
          setisprocessing(true)
          setloader2(true)
          const FormData = require("form-data");
          const sendData = new FormData();
          let config;
          ifscenariogiven !== "Base Scenario" && sendData.append("scenario_name", ifscenariogiven === "Base Scenario" ? "Base Scenario" : selectedscenarioname);
          ifscenariogiven !== "Base Scenario" && sendData.append("scenario_timestamp", ifscenariogiven === "Base Scenario" ? "2025-01-12 15:54:05" : selectedscenarionametimestamp);
          ifscenariogiven !== "Base Scenario" && sendData.append("user_id", "admin");
          sendData.append("market", market);
          sendData.append("brand", selectedbrand)
          sendData.append("fy", selectedyear)


          let getResponse = []
          let successfulResponse = []
          if (ifscenariogiven === "Base Scenario") {
            if (timetype === "Y") {
              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_base_scenario`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };
            }
            else if (timetype === "Q") {

              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_base_scenario_data`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };
            }
            else if (timetype === "HY") {

              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_base_scenario_data`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };
            }
            else {
              config = {
                method: "post",
                url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_base_scenario_data` : `${REACT_APP_UPLOAD_DATA}/api/basegetscenariodata`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              };

            }


          }

          else {
            if (selectedscenarioname?.startsWith("Y_")) {
              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_data`
                ,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              }
            }
            else if (selectedscenarioname?.startsWith("Q_")) {
              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_scenario_data`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              }
            }
            else if (selectedscenarioname?.startsWith("HY_")) {
              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_scenario_data`,
                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              }
            }
            else {
              config = {
                method: "post",
                url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_scenario_data`,

                headers: {
                  Accept: "text/plain",
                  "Content-Type": "application/json",
                },
                data: sendData,
              }
            }

            //   const apiConfigs = [

            //     {
            //       method: "post",
            //       url: selectedbrand === "ATTA"
            //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`
            //         : `${REACT_APP_UPLOAD_DATA}/api/get_annual_scenario_data`,
            //       headers: {
            //         Accept: "text/plain",
            //         "Content-Type": "application/json",
            //       },
            //       data: sendData,
            //     },
            //     {
            //       method: "post",
            //       url: selectedbrand === "ATTA"
            //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodatayearly`
            //         : `${REACT_APP_UPLOAD_DATA}/api/get_qtr_scenario_data`,
            //       headers: {
            //         Accept: "text/plain",
            //         "Content-Type": "application/json",
            //       },
            //       data: sendData,
            //     },
            //     {
            //       method: "post",
            //       url: selectedbrand === "ATTA"
            //         ? `${REACT_APP_UPLOAD_DATA}/api/atta_getscenariodata`
            //         : `${REACT_APP_UPLOAD_DATA}/api/getscenariodata`,
            //       headers: {
            //         Accept: "text/plain",
            //         "Content-Type": "application/json",
            //       },
            //       data: sendData,
            //     },
            //     // Add more API configs here if needed
            //   ];
            //   for (let config of apiConfigs) {
            //     try {
            //        getResponse = await axios(config);
            // console.log(getResponse)
            //       if (
            //         getResponse?.data && getResponse?.data?.plot1.length > 0

            //       ) {
            //         successfulResponse = getResponse;
            //         break; // Stop further API calls
            //       }
            //     } catch (error) {
            //       console.error("Error calling API:", config.url, error.message);
            //       continue; // Try the next API
            //     }
            // }

          }

          getResponse = await axios(config)



          //console.log(getResponse)

          if (getResponse?.data?.data?.length > 0) {
            setviewnewbasescenariodata(false)
            setviewscenariodatatable(true)
            setresultscreen(true)
            ifscenariogiven && setselectedscenarioname(ifscenariogiven)
            setdisplaynames2({
              ...displaynames2,
              brand: selectedbrand,
              scenario: ifscenariogiven ? ifscenariogiven : selectedscenarioname,
              market: market,
              fy: selectedyear
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
                // console.log(group)
                group.push(item);
                acc[item.attribute_name] = group;
                return acc;
              }, {})
              ;

            //console.log(otherAttributes)

            const sortedAttributes = Object.keys(otherAttributes)
              .map(attribute_name => ({
                attribute_name,
                items: otherAttributes[attribute_name].sort((a, b) => {
                  const customOrder = ExceptionVariables.customOrder2;
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



            const arrangeddataset = [...sortedAttributes, ...digitalAttributes, ...tvAttributes]
            setsampledataset(arrangeddataset)
            setoriginalset(arrangeddataset);
            setoriginaldatasetforcolorcoding(arrangeddataset)
            // setsampledataset(getResponse?.data?.data)
            // setoriginalset(getResponse?.data?.data);
            // setoriginaldatasetforcolorcoding(getResponse?.data?.data)
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
    setloader2(false);
    setisprocessing(false)
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
          sendData.append("scenario_name", selectedscenarioname);
          sendData.append("scenario_timestamp", selectedscenarionametimestamp);
          sendData.append("user_id", "admin");
          sendData.append("market", market);
          sendData.append("brand", selectedbrand)
          sendData.append("fy", selectedyear)


          if (selectedscenarioname?.startsWith("Y_")) {
            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_scenario_data`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }
          else if (selectedscenarioname?.startsWith("Q_")) {
            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_scenario_data`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }
          }
          else if (selectedscenarioname?.startsWith("HY_")) {
            config = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_scenario_data`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            }

          }
          else {
            config = {
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

          const getResponse = await axios(config)

          if (getResponse.status === 200) {

            if (getResponse?.data?.data?.length > 0) {

              setcreatefrombaseoruploadfileswitch(false)
              setdisplaynames2({
                ...displaynames2,
                brand: selectedbrand,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear

              })

              setviewscenariodatatable2(true)

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
                }, {})
                ;

              const sortedAttributes = Object.keys(otherAttributes)
                .map(attribute_name => ({
                  attribute_name,
                  items: otherAttributes[attribute_name].sort((a, b) => {
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

              const arrangeddataset = [...sortedAttributes, ...digitalAttributes, ...tvAttributes]
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setloader5(false);

    setisprocessing(false)
  };
  const handlesimulate = async (newname) => {
    if (UserService.isLoggedIn()) {
      //fetchdatasettable2()
      if (selectedyear && selectedyear !== "Select" && market && market !== "Select" && selectedscenarioname && selectedscenarioname !== "Select" && selectedbrand && selectedbrand !== "Select") {
        try {
          setisprocessing(true)
          setmodifybtn(false)
          setloader(true);
          setviewscenariodatatable(false)
          setviewnewbasescenariodata(false)
          const FormData = require("form-data");
          const sendData = new FormData();
          sendData.append("scenario_name", selectedscenarioname);
          sendData.append("scenario_timestamp", selectedscenarionametimestamp);
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
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_get_new_base_scenario`,
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
          setsavednewbasescenarioname(getResponse5?.data?.data.filter(base => base.fy === selectedyear)[0]?.scenerio_name.replace(`NEW_BASE_FY_${selectedyear.replace("-", "_")}-`, ""))



          if (selectedscenarioname?.match("Reference")) {
            // sendData2.append("scenario_name", 'Base Scenario');
            // sendData2.append("scenario_timestamp",'2025-01-12 15:54:05');
            sendData2.append("scenario_name", arr[0]?.scenerio_name);
            sendData2.append("scenario_timestamp", arr[0]?.created_at);
            sendData2.append("user_id", "admin");
            sendData2.append("market", arr[0]?.market);
            sendData2.append("model_id", 1);
            sendData2.append("brand", arr[0]?.brand);
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

          let config1 = {}
          let config2 = {}
          if (selectedscenarioname?.startsWith("Y_")) {
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
              url: selectedscenarioname?.match("Reference") ? `${REACT_APP_UPLOAD_DATA}/app/atta_annual_new_base_scenario_predict` : `${REACT_APP_UPLOAD_DATA}/app/atta_annual_base_predict`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            };
          }
          else if (selectedscenarioname?.startsWith("Q_")) {
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
              url: selectedscenarioname?.match("Reference") ? `${REACT_APP_UPLOAD_DATA}/app/atta_qt_new_base_predict` : `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_base_predict`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            };
          }
          else if (selectedscenarioname?.startsWith("HY_")) {
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
              url: selectedscenarioname?.match("Reference") ? `${REACT_APP_UPLOAD_DATA}/app/atta_hy_new_base_scenario_predict` : `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_base_predict`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            };
          }
          else {
            config1 = {
              method: "post",
              url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_predict`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData,
            };
            config2 = {
              method: "post",
              url: selectedscenarioname?.match("Reference") ? `${REACT_APP_UPLOAD_DATA}/app/atta_new_base_monthly_predict` : `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_base_predict`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: sendData2,
            };
          }
          const getResponse2 = await axios(config2);
          const getResponse1 = await axios(config1);
          //const getResponse4=await axios(config4)
          //console.log(getResponse1)
          if (getResponse1.data.data) {
            if (getResponse1?.data?.data?.plot1?.length > 0) {
              fetchdatasettable2()
              setfulldataset(getResponse1?.data?.data)
              setfulldataset2(getResponse2?.data?.data)

              settorangeonplots(getResponse1?.data?.data?.plot1[getResponse1?.data?.data?.plot1.length - 1]?.month_year?.split("-").reverse()?.join("-"))

              let current_month_year = `${new Date().getFullYear()}-${(String(new Date().getMonth() + 1).padStart(2, "0"))}`;
              if (getResponse1?.data?.data?.plot1[0]?.month_year >= current_month_year || selectedscenarioname?.startsWith("Y_")) {
                setfromrangeonplots(getResponse1?.data?.data?.plot1[0]?.month_year?.split("-").reverse()?.join("-"))
              } else {
                const [year, month] = endDate.split("-");
                const date = new Date(year, month); // Month is zero-based in JS Date
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

                setfromrangeonplots(formattedDate?.split("-")?.reverse()?.join("-"))
              }
              setmodifybtn(false)
              setdisplaynames({
                ...displaynames,
                scenario: selectedscenarioname,
                market: market,
                fy: selectedyear,
                brand: selectedbrand,
                timestamp: selectedscenarionametimestamp,
                dataset: originalset
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/attasimulator`,
        });
      }, 1000);
    }
    setloader(false)
    setisprocessing(false)

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
          fy: selectedyear,
          model_id: 1,


        };
        const requestData = {
          scenario_name: displaynames2.scenario,
          scenario_timestamp: currenttime,
          user_id: "admin",
          model_id: 1,
          dataset: originalset,
          fy: selectedyear,
          market: market
        };
        let config = {}
        let config2 = {}

        if (sampledataset[0]?.month_data?.length === 1) {
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
            url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly` : `${REACT_APP_UPLOAD_DATA}/api/save_annual_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData2
          };
        }
        if (sampledataset[0]?.month_data?.length === 2) {
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
            url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly` : `${REACT_APP_UPLOAD_DATA}/api/save_annual_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData2
          };
        }
        else if (sampledataset[0]?.month_data?.length === 4) {
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
            url: selectedbrand === "ATTA" ? `${REACT_APP_UPLOAD_DATA}/api/atta_savescenarioyearly` : `${REACT_APP_UPLOAD_DATA}/api/save_qtr_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData2
          };
        }
        else {

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
          // console.log(getResponse?.data?.data)
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

  const savescenario = async () => {
    if (UserService.isLoggedIn()) {
      try {

        if (scenariooptions?.length > 0 && scenariooptions?.some(option => option.value === `${timetype}_${displaynames2.market}_${newscenarionamegiven}`)) {
          setuniquescenarioname(true)
          setTimeout(() => setuniquescenarioname(false), 5000)
          return;
        }
        setisprocessing(true)
        let arr = [];
        setedit(arr);
        const currentime = getCurrentFormattedTime()
        const requestData = {
          scenario_name: `${timetype}_${displaynames2.market}_${newscenarionamegiven}`,
          scenario_timestamp: currentime,
          user_id: "admin",
          model_id: 1,
          dataset: originalset,
          fy: selectedyear
        };
        //console.log(originalset)
        let config = {}
        if (timetype === "Y") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else if (timetype === "Q") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else if (timetype === "HY") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };

        }


        const getResponse = await axios(config);

        if (getResponse.status === 200) {

          // fetchscenariooptions();
          // handlesimulate(newscenarionamegiven);
          setresultscreen2(false)
          setmodifybtn(false)
          setscenarionewoldscreen("old")
          document.getElementById("closemodal").click()
          handlescenariosfetch()
          setselectedscenarioname(`${timetype}_${displaynames2.market}_${newscenarionamegiven}`)
          setselectedscenarionametimestamp(currentime)
          setdisplaynames2({
            ...displaynames2,
            scenario: `${timetype}_${displaynames2.market}_${newscenarionamegiven}`,
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
        setnewscenarionamegiven("")

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
  const uploadnewscenariofile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Log the first selected file
      setnewscenariofile(e.target.files[0]); // Store the first file in state
      setviewscenariobtn(true)
    }
  };
  const savescenarioNewBase = async () => {
    if (UserService.isLoggedIn()) {
      try {


        let arr = [];
        setedit(arr);


        const currentime = getCurrentFormattedTime()
        const requestData = {
          scenario_name: `${timetype}_Reference_${displaynames2.market}_${newscenarionamegiven}`,
          scenario_timestamp: currentime,
          user_id: "admin",
          model_id: 1,
          dataset: originalset,
          fy: selectedyear
        };

        let config = {}
        if (timetype === "Y") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_annual_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else if (timetype === "Q") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_quarterly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else if (timetype === "HY") {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_half_yearly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };


        }
        else {
          config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/app/atta_monthly_save_scenario`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData
          };
        }

        const getResponse = await axios(config);

        if (getResponse.status === 200) {

          // fetchscenariooptions();
          // handlesimulate(newscenarionamegiven);
          setresultscreen2(false)
          setmodifybtn(false)
          setscenarionewoldscreen("old")
          document.getElementById("closemodal").click()
          document.getElementById("closemodal2").click()
          handlescenariosfetch()
          setselectedscenarioname(`${timetype}_Reference_${displaynames2.market}_${newscenarionamegiven}`)
          setselectedscenarionametimestamp(currentime)
          setdisplaynames2({
            ...displaynames2,
            scenario: `${timetype}_Reference_${displaynames2.market}_${newscenarionamegiven}`,
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
        setnewscenarionamegiven("")

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
  };
  const changesampledataset = (changedValue) => {

    setsampledataset(changedValue)
  }
  const changeoriginalset = (changedValue) => {
    setoriginalset(changedValue)
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
          <div className="modal-content" >
            <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
              <h6 class="my-auto modal-title" id="exampleModalLabel">
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
              <div className="d-flex">
                <span className="my-auto mx-1">{timetype}_{displaynames2.market}_</span>
                <input
                  type="text"
                  id="scenarionamebox"
                  className="form-control"
                  value={newscenarionamegiven}
                  onChange={(e) => { setnewscenarionamegiven(e.target.value) }}
                />
              </div>
              {uniquescenarioname && <small className="text-danger">Scenario Name is already present.Please provide other scenario name!</small>}

              <br />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="mt-2 btn btn-secondary p-2"
                data-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isprocessing}
                class={isprocessing ? "mt-2 btn btn-secondary  p-2" : "mt-2 btn btn-success p-2"}
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

      <div
        class="modal "
        id="exampleModal2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div className="modal-content" >
            <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
              <h6 class="modal-title" id="exampleModalLabel">
                Save Scenario
              </h6>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                id="closemodal2"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label className="">Please enter Scenario Name: </label>
              <div className="d-flex">
                <span className="my-auto mx-1">{timetype}_Reference_{displaynames2.market}_</span>
                <input
                  type="text"
                  id="scenarionamebox"
                  className="form-control"
                  value={newscenarionamegiven}
                  onChange={(e) => { setnewscenarionamegiven(e.target.value) }}
                />
              </div>
              {uniquescenarioname && <small className="text-danger">Scenario Name is already present.Please provide other scenario name!</small>}


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
                    savescenarioNewBase();

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
      <div className="bgpages">
        <div className='mx-5'>
          <div className={`container-fluid`}>
            <div className={`breadcrumb ${!modifybtn && resultscreen2 && 'mx-4'} `}>{`Dashboard >> Scenario Planner`}</div>
            <div className={`pageheading d-flex justify-content-between align-items-center my-2 px-3 py-2 ${!modifybtn && resultscreen2 && 'mx-4'}`}
              style={{ fontSize: "20px" }}>
              <b> Scenario Planner</b>
              {resultscreen2 &&
                <div>
                  <button className="btn btn-orange  mx-2 my-auto"
                    onClick={() => {
                      setresultscreen(false);
                      setresultscreen2(false);
                      setmarket("");
                      setselectedbrand("");
                      setscenarionewoldscreen("Select");
                      setoriginalset([]);
                      setsampledataset([]);
                      setmodifybtn(false);
                      setsavednewbasescenarioname("");
                      setsavedmasterscenarioname("");
                      setnewbasedetailscreatenew({})
                    }}>
                    Reset
                  </button>
                  <button className="btn btn-info fw-semibold" style={{ color: 'black' }} onClick={() => setmodifybtn(!modifybtn)}>
                    {modifybtn ? 'Close' : 'Modify'}
                  </button>
                </div>
              }
            </div>
          </div>
          {
            modifybtn &&
            <>
              <div className="card p-3">
                <div className="d-flex justify-content-between  "  >
                  <div className="my-2">
                    <label>FY:<span className="text-danger">*</span></label>
                    <select className="form-select"
                      placeholder="Select FY"
                      onChange={(e) => {
                        setscenarionewoldscreen("Select")
                        settimetype("")
                        setselectedyear(e.target.value);
                        //setselectedbrand("")
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

                  <div className="my-2">
                    <label>Market:<span className="text-danger">*</span></label>
                    <select className="form-select"
                      placeholder="Select market"
                      onChange={(e) => {
                        setmarket(e.target.value);
                        setscenarionewoldscreen("Select")
                        setselectedscenarioname("Select")
                        setviewscenariodatatable(false)
                        setviewnewbasescenariodata(false)
                        setviewscenariodatatable2(false)
                        setmodifybtn(false)
                        setresultscreen2(false)
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
                      placeholder="Select Scenario"
                      options={scenariooptions}
                      value={selectedscenarioname ? { label: selectedscenarioname, value: selectedscenarioname } : null}
                      onChange={(value) => {
                        setviewscenariodatatable2(false)
                        setviewscenariodatatable(false)
                        setviewnewbasescenariodata(false)
                        setselectedscenarioname(value.value);
                        setselectedscenarionametimestamp(value?.timestamp);
                        setmodifybtn(false)
                        setresultscreen2(false)
                      }}
                      className="selectboxwidth" />
                    {loader5 && <div className="my-3 d-flex flex-column align-items-center justify-content-center">
                      <div className="dot-loader">
                        <div></div><div></div><div></div>
                      </div>
                      <div className="mt-2 fw-semibold text-muted">Fetcching Scenario Data....</div>
                    </div>
                    }
                    {selectedscenarioname && selectedscenarioname !== "Select" &&
                      <button className={isprocessing ? " btn btn-sm btn-secondary mt-1 p-2" : " btngreentheme mt-1 p-2"}
                        disabled={isprocessing}
                        onClick={() => {
                          if (viewscenariodatatable2) {
                            setviewscenariodatatable2(false)
                          }
                          else { fetchdatasettable2(); }
                        }}>
                        {!viewscenariodatatable2 ? "View Scenario Data" : "Hide"}
                      </button>
                    }
                  </div>
                  {selectedscenarioname !== "Base Scenario" &&
                    <div>
                      <button
                        id="subm"
                        disabled={isprocessing}
                        className={isprocessing ? "btn btn-secondary  mt-4" : "btn btn-dark  mt-4"}
                        onClick={() => {
                          //scrollToSection("heightmainscreen");
                          handlesimulate()
                        }}
                      >
                        Simulate
                      </button>
                    </div>}
                </div>





              </div>


              {viewscenariodatatable2 && <div className="my-2 " id="attributetable">
                <div className="d-flex flex-row-reverse ">

                  <button disabled={isprocessing} className="btngreentheme my-2 p-2 mx-1" data-toggle={displaynames2.scenario === "Base Scenario" && "modal"}
                    data-target="#exampleModal1" onClick={() => { (displaynames2.scenario !== "Base Scenario") && updatescenario() }}>
                    {displaynames2.scenario === "Base Scenario" || displaynames2.scenario === "base scenario" ? "Save Scenario" : "Update Scenario"}
                  </button>
                </div>
                {sampledataset[0]?.month_data?.length === 1 ?
                  <VariableTableYearlyAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} />
                  :
                  <VariableTableAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} endDate={endDate} />
                }
              </div>
              }
            </>
          }


          <div className="">
            {
              loader ? (
                <div
                  className="d-flex  justify-content-center align-items-center "
                  style={{ height: "60vh" }}
                >
                  <LoaderCustom text="Simulating..." />
                </div>
              ) : resultscreen2 ?
                <>
                  <div className=" my-2">
                    <div className="">
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
                            />
                          </div> :

                          <div className="container-fluid">
                            <div className="card p-3 my-2">

                              <div className="d-flex justify-content-between  "  >
                                <div className="my-2">
                                  <label>FY:<span className="text-danger">*</span></label>
                                  <span>{displaynames.fy}</span>
                                </div>

                                <div className="my-2">
                                  <label>Market:<span className="text-danger">*</span></label>
                                  <span>{displaynames.market}</span>
                                </div>
                                <div className="my-2">
                                  <label>Scenario:<span className="text-danger">*</span></label>
                                  <span>{displaynames.scenario}</span>
                                </div>

                                {displaynames?.scenario.startsWith('M_') && <div className="my-2">
                                  <button onClick={() => {
                                    if (displaynames.scenario === savednewbasescenarioname) { }
                                    else {
                                      handlesetasnewbase(displaynames)
                                    }
                                  }}
                                    // className="btn btn-sm btn-secondary mx-1"
                                    className={displaynames.scenario === savednewbasescenarioname ? "btn text-success mx-1" : "btn btn-sm btn-secondary mx-1"}
                                  >
                                    {displaynames.scenario === savednewbasescenarioname ? <b>Reference</b> : "Set as Reference for Next FY"}

                                  </button>
                                </div>}</div>

                            </div>
                            <div className="card " id="simulateddata">
                              <div className="d-flex my-2 justify-content-between mx-2 my-3">
                                <h5 className="mx-5">Simulated Data</h5>

                                <button className="btngreentheme p-2 " onClick={() => setisValue(!isValue)}>{isValue ? "By Volume" : "By Value"}</button>
                              </div>

                              {displaynames?.scenario.startsWith("M_") ? fulldataset?.plot1?.length > 0 && fulldataset2?.plot1?.length > 0 &&
                                <LineChart1Atta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue}
                                  range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} /> :
                                <AnnualDataAtta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} />
                              }
                            </div>
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-12">
                                  {/* Line Chart For Monthly TimeLine */}
                                  <div className="card " id="simulateddata">
                                    <div className="d-flex my-2 justify-content-between mx-2 my-3">
                                      <h5 className="mx-5">Simulated Data</h5>
                                      <button className="btngreentheme p-2 " onClick={() => setisValue(!isValue)}>{isValue ? "By Volume" : "By Value"}</button>
                                    </div>
                                    {displaynames?.scenario.startsWith("M_") ? fulldataset?.plot1?.length > 0 && fulldataset2?.plot1?.length > 0 &&
                                      <LineChart1Atta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue}
                                        range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} /> :
                                      <AnnualDataAtta displaynames={displaynames} fulldataset1={fulldataset} fulldataset2={fulldataset2} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`} />
                                    }
                                  </div>

                                  {/* Pie Chart */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot2?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <PieChartsAtta isValue={isValue}
                                          range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          fulldataset={fulldataset2}
                                          type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`}
                                          displaynames={displaynames} />
                                      </div>
                                    }
                                    {fulldataset?.plot2?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <PieChartsAtta isValue={isValue}
                                          range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          fulldataset={fulldataset}
                                          type={displaynames.scenario} />
                                      </div>}

                                  </div>

                                  {/* Contribution Volume Core,Incremental,Media*/}
                                  <div className="row my-3">
                                    {fulldataset2?.plot3?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart1Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(Math.max(...[
                                            fulldataset?.plot3[0].total_core / 1000,
                                            fulldataset?.plot3[1].total_incremental / 1000,
                                            fulldataset?.plot3[2].total_media / 1000,
                                            fulldataset2?.plot3[0].total_core / 1000,
                                            fulldataset2?.plot3[1].total_incremental / 1000,
                                            fulldataset2?.plot3[2].total_media / 1000,
                                          ]) / 100) * 100}
                                          maxValuedynamicValue={Math.ceil(Math.max(...[
                                            fulldataset?.plot3[0].total_core_sales / 100000,
                                            fulldataset?.plot3[1].total_incremental_sales / 100000,
                                            fulldataset?.plot3[2].total_media_sales / 100000,
                                            fulldataset2?.plot3[0].total_core_sales / 100000,
                                            fulldataset2?.plot3[1].total_incremental_sales / 100000,
                                            fulldataset2?.plot3[2].total_media_sales / 100000,
                                          ]) / 100) * 100
                                          } />


                                      </div>}
                                    {fulldataset?.plot3?.length > 0 && <div className="card col-sm mx-3 p-3" id="" >

                                      <SingleBarChart1Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                        maxValuedynamicVolume={Math.ceil(Math.max(...[
                                          fulldataset?.plot3[0].total_core / 1000,
                                          fulldataset?.plot3[1].total_incremental / 1000,
                                          fulldataset?.plot3[2].total_media / 1000,
                                          fulldataset2?.plot3[0].total_core / 1000,
                                          fulldataset2?.plot3[1].total_incremental / 1000,
                                          fulldataset2?.plot3[2].total_media / 1000,
                                        ]) / 100) * 100}
                                        maxValuedynamicValue={Math.ceil(Math.max(...[
                                          fulldataset?.plot3[0].total_core_sales / 100000,
                                          fulldataset?.plot3[1].total_incremental_sales / 100000,
                                          fulldataset?.plot3[2].total_media_sales / 100000,
                                          fulldataset2?.plot3[0].total_core_sales / 100000,
                                          fulldataset2?.plot3[1].total_incremental_sales / 100000,
                                          fulldataset2?.plot3[2].total_media_sales / 100000,
                                        ]) / 100) * 100
                                        } />

                                    </div>}
                                  </div>

                                  {/* Contribution Volumne For Media Variable */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot4?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart2Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...fulldataset?.plot4.map((it) => it.contribution), ...fulldataset2?.plot4.map((it) => it.contribution)) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...fulldataset?.plot4.map((it) => it.contribution_sales_value / 100000, ...fulldataset2?.plot4.map((it) => it.contribution_sales_value / 100000)))
                                          )} />
                                      </div>
                                    }
                                    {fulldataset?.plot4?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart2Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...fulldataset?.plot4.map((it) => it.contribution), ...fulldataset2?.plot4.map((it) => it.contribution)
                                            ) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...fulldataset?.plot4.map((it) => it.contribution_sales_value / 100000, ...fulldataset2?.plot4.map((it) => it.contribution_sales_value / 100000))
                                            )
                                          )} />
                                      </div>
                                    }
                                  </div>

                                  {/* Contribution Volumne For Incremental Variable */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot10?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart5Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...fulldataset?.plot10.map((it) => it.contribution), ...fulldataset2?.plot10.map((it) => it.contribution)) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...fulldataset?.plot10.map((it) => it.contribution_sales_value / 100000), ...fulldataset2?.plot10.map((it) => it.contribution_sales_value / 100000))
                                          )} />
                                      </div>
                                    }
                                    {fulldataset?.plot10?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart5Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={Math.ceil(
                                            Math.max(...fulldataset?.plot10.map((it) => it.contribution), ...fulldataset2?.plot10.map((it) => it.contribution)) / 100
                                          ) * 100}
                                          maxValuedynamicValue={Math.ceil(
                                            Math.max(...fulldataset?.plot10.map((it) => it.contribution_sales_value / 100000), ...fulldataset2?.plot10.map((it) => it.contribution_sales_value / 100000))
                                          )} />
                                      </div>
                                    }
                                  </div>

                                  {/* ROI For Media Variable (Grouped) */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot5?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart4Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset2?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                            ))
                                          }
                                        />
                                      </div>
                                    }
                                    {fulldataset?.plot5?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart4Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset2?.plot5?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                            ))
                                          } />
                                      </div>
                                    }

                                  </div>

                                  {/* ROI For Media Variable (Un-Grouped) */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot13?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart8Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset2?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                            ))
                                          } />
                                      </div>
                                    }
                                    {fulldataset?.plot13?.length > 0 && <div className="card col-sm mx-3 p-3" id="" >
                                      <SingleBarChart8Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                        maxValuedynamicVolume={
                                          Math.ceil(Math.max(
                                            ...fulldataset?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset2?.plot13?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                          ))
                                        } />
                                    </div>
                                    }
                                  </div>

                                  {/* ROI For Incremental Variable */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot12?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart7Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                            ))
                                          } />
                                      </div>
                                    }
                                    {fulldataset?.plot12?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart7Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) }), ...fulldataset?.plot12?.filter(varObj => !ExceptionVariables.hiddenroichart?.includes(varObj?.variable))?.map((it) => { return Number(it?.attribute_value_per_roi) })
                                            ))
                                          } />
                                      </div>
                                    }
                                  </div>

                                  {/* Effectiveness For Media Variable (Grouped) */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot11?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart6Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot11?.map((it) => { return Number(it?.effectiveness) }), ...fulldataset2?.plot11?.map((it) => { return Number(it?.effectiveness) })
                                            ) / 10) * 10
                                          } />
                                      </div>
                                    }
                                    {fulldataset?.plot11?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart6Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot11?.map((it) => { return Number(it?.effectiveness) }), ...fulldataset2?.plot11?.map((it) => { return Number(it?.effectiveness) })
                                            ) / 10) * 10
                                          } />
                                      </div>
                                    }
                                  </div>

                                  {/* Effectiveness For Media Variable (Un-Grouped) */}
                                  <div className="row my-3">
                                    {fulldataset2?.plot9?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart3Atta fulldataset={fulldataset2} type={`${displaynames?.scenario?.match("Reference") ? "Reference" : "Base"} Scenario`} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot9?.map((it) => { return Number(it?.effectiveness) }), ...fulldataset2?.plot9?.map((it) => { return Number(it?.effectiveness) })) / 10) * 10
                                          } />
                                      </div>
                                    }
                                    {fulldataset?.plot9?.length > 0 &&
                                      <div className="card col-sm mx-3 p-3" id="" >
                                        <SingleBarChart3Atta fulldataset={fulldataset} type={displaynames.scenario} isValue={isValue} range={`${formatDate(fromrangeonplots)}-${formatDate(torangeonplots)}`}
                                          maxValuedynamicVolume={
                                            Math.ceil(Math.max(
                                              ...fulldataset?.plot9?.map((it) => { return Number(it?.effectiveness) }), ...fulldataset2?.plot9?.map((it) => { return Number(it?.effectiveness) })) / 10) * 10
                                          } />
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      }
                    </div>
                  </div>

                </> :

                <div className="container-fluid">
                  {brandoptions?.length > 0 ? (
                    <div className="card px-4 py-3">
                      {/* Brand Display */}
                      <div className="mb-2 fw-bold">Brand: <strong className="text-success">ATTA</strong></div>

                      {/* FY, Market, Scenario Row */}
                      <div className="row g-3">
                        <div className="col-md-4 col-12">
                          <strong><label>FY:<span className="text-danger">*</span></label></strong>
                          <select
                            className="form-select"
                            value={selectedyear}
                            onChange={(e) => {
                              setscenarionewoldscreen("Select");
                              settimetype("");
                              setviewscenariodatatable(false);
                              setviewnewbasescenariodata(false);
                              setselectedyear(e.target.value);
                              setmarket("");
                              setselectedscenarioname("");
                            }}
                          >
                            <option>Select</option>
                            {yearoptions?.map((item) => (
                              <option key={item.fy}>{item.fy}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 col-12">
                          <strong><label>Market:<span className="text-danger">*</span></label></strong>
                          <select
                            className="form-select"
                            value={market}
                            onChange={(e) => {
                              setmarket(e.target.value);
                              setscenarionewoldscreen("Select");
                              setselectedscenarioname("Select");
                              setviewscenariodatatable(false);
                              setviewnewbasescenariodata(false);
                            }}
                          >
                            <option>Select</option>
                            {marketoptions?.map((item, idx) => (
                              <option key={idx}>{item.final_market}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 col-12">
                          <strong><label>Scenario:<span className="text-danger">*</span></label></strong>
                          <select
                            className="form-select"
                            value={scenarionewoldscreen}
                            onChange={(e) => {
                              if (market && selectedbrand && market !== "Select" && selectedbrand !== "Select") {
                                settimetype("");
                                setscenarionewoldscreen(e.target.value);
                                setviewscenariodatatable(false);
                                setviewscenariobtn(false);
                                setuploadfiledata([]);
                                setviewnewbasescenariodata(false);
                                setselectedscenarioname("");
                              } else {
                                dispatch(getNotification({ message: "Please select brand and market!", type: "danger" }));
                              }
                            }}
                          >
                            <option value="select">Select</option>
                            <option value="old">Old Scenarios</option>
                            <option value="new">New Scenario</option>
                          </select>
                        </div>
                      </div>

                      {/* Old Scenarios Section */}
                      {scenarionewoldscreen === "old" && (
                        <div className="mt-3">
                          <label className="my-2">Scenario Name:<span className="text-danger">*</span></label>
                          <Select
                            placeholder="Select Scenario"
                            options={scenariooptions}
                            value={selectedscenarioname ? { label: selectedscenarioname, value: selectedscenarioname } : null}
                            onChange={(value) => {
                              setviewscenariodatatable(false);
                              setviewnewbasescenariodata(false);
                              setselectedscenarioname(value.value);
                              setselectedscenarionametimestamp(value?.timestamp);
                            }}
                            className="w-100"
                          />
                          {loader2 && <div className="my-3 d-flex flex-column align-items-center justify-content-center">
                            <div className="dot-loader">
                              <div></div><div></div><div></div>
                            </div>
                            <div className="mt-2 fw-semibold text-muted">Fetching Scenario Data...</div>
                          </div>
                          }

                          {selectedscenarioname !== "Select" && selectedscenarioname !== "" && (
                            <div className="mt-2">
                              <button
                                className={isprocessing ? "btn btn-sm btn-secondary p-2" : "btngreentheme p-2"}
                                disabled={isprocessing}
                                onClick={() => {
                                  if (viewscenariodatatable) {
                                    setviewnewbasescenariodata(false);
                                    setviewscenariodatatable(false);
                                  } else {
                                    fetchdatasettable();
                                  }
                                }}
                              >
                                {!viewscenariodatatable ? "View Scenario Data" : "Hide"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* New Scenarios Section */}
                      {scenarionewoldscreen === "new" && (
                        <>
                          {/* Radio Options in One Line */}
                          <div className="d-flex flex-wrap gap-3 mt-3">
                            <div className="form-check">
                              <input
                                id="Y"
                                type="radio"
                                name="scenarioType"
                                className="form-check-input"
                                disabled={selectedyear === "2024-25"}
                                onClick={() => {
                                  settimetype("Y");
                                  setviewnewbasescenariodata(false);
                                  setviewscenariodatatable(false);
                                  handlefetchnewbasescenario("Y");
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <strong>
                                <label className="form-check-label" htmlFor="Y"
                                  style={{ cursor: 'pointer' }}>Yearly</label>
                              </strong>
                            </div>

                            <div className="form-check">
                              <input
                                id='HY'
                                type="radio"
                                name="scenarioType"
                                className="form-check-input"
                                // disabled={Number(selectedyear?.split("-")[0]) < new Date().getFullYear() ||
                                //   (Number(selectedyear?.split("-")[0]) === new Date().getFullYear() && new Date().getMonth() > 5)}
                                onClick={() => {
                                  settimetype("HY");
                                  setviewnewbasescenariodata(false);
                                  setviewscenariodatatable(false);
                                  handlefetchnewbasescenario("HY");
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <strong><label htmlFor="HY" style={{ cursor: 'pointer' }} className="form-check-label">Half-Yearly</label></strong>
                            </div>

                            <div className="form-check">
                              <input
                                id='Q'
                                type="radio"
                                name="scenarioType"
                                className="form-check-input"
                                disabled={Number(selectedyear?.split("-")[0]) < new Date().getFullYear() ||
                                  (Number(selectedyear?.split("-")[0]) === new Date().getFullYear() && new Date().getMonth() > 8)}
                                onClick={() => {
                                  settimetype("Q");
                                  setviewnewbasescenariodata(false);
                                  setviewscenariodatatable(false);
                                  handlefetchnewbasescenario("Q");
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <strong><label htmlFor="Q" className="form-check-label" style={{ cursor: 'pointer' }}>Quarterly</label></strong>
                            </div>

                            <div className="form-check">
                              <input
                                id="M"
                                type="radio"
                                name="scenarioType"
                                className="form-check-input"
                                onClick={() => {
                                  settimetype("M");
                                  setviewnewbasescenariodata(false);
                                  setviewscenariodatatable(false);
                                  handlefetchnewbasescenario("M");
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <strong><label htmlFor="M" style={{ cursor: 'pointer' }} className="form-check-label">Monthly</label></strong>
                            </div>
                          </div>

                          {/* Buttons in One Line */}
                          <div className="d-flex flex-wrap mt-4 gap-3">
                            {timetype && (
                              <button
                                disabled={isprocessing}
                                className={isprocessing
                                  ? "btn btn-sm btn-secondary"
                                  : "btngreentheme btn-sm"}
                                onClick={() => {
                                  if (viewscenariodatatable) {
                                    setviewscenariodatatable(false);
                                  } else {
                                    fetchdatasettable("Base Scenario");
                                  }
                                }}
                              >
                                {!viewscenariodatatable ? "Create from Base Scenario Data" : "Hide"}
                              </button>
                            )}

                            {timetype && Object.keys(newbasedetailscreatenew).length > 0 && (
                              <button
                                disabled={isprocessing}
                                className={isprocessing
                                  ? "btn btn-sm btn-secondary"
                                  : "btngreentheme btn-sm"}
                                onClick={() => {
                                  if (viewnewbasescenariodata) {
                                    setviewnewbasescenariodata(false);
                                  } else {
                                    fetchdatasettablenewbasescenario();
                                  }
                                }}
                              >
                                {!viewnewbasescenariodata ? "Create from Reference Scenario" : "Hide"}
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {/* Simulate Button */}
                      {scenarionewoldscreen === "old" && selectedscenarioname !== "Base Scenario" && (
                        <div
                          className="submitfrmtbtn mt-3"
                          onClick={handlesimulate}
                          type="button"
                        >
                          <span>Simulate <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="my-3 d-flex flex-column align-items-center justify-content-center">
                      <div className="dot-loader">
                        <div></div><div></div><div></div>
                      </div>
                      <div className="mt-2 fw-semibold text-muted">Grabbing Details...</div>
                    </div>
                  )}
                </div>
            }

            {uploadfiledata?.length > 0 &&
              <div className="tablescrollbar  " style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-sm text-center ">
                  <thead className="" style={{ position: 'sticky', top: 0, zIndex: 1 }}>

                    <tr className="  " >
                      <th scope="col" style={{ backgroundColor: "grey", color: "white" }}>#</th>
                      {Object.keys(uploadfiledata[0])?.map((item) => {
                        return (
                          <th
                            scope="col"
                            style={(item === "Brand" || item === "FY") ? { minWidth: "126px", backgroundColor: "grey", color: "white" } : { backgroundColor: "grey", color: "white" }}
                          >
                            {item}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className=''>
                    {uploadfiledata?.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        {
                          Object.values(row).map((value, index) => (
                            <td key={index}>
                              {(!isNaN(Number(value)) && isFinite(Number(value))) ? Number(value).toFixed(0) : value}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>

          {
            (!viewscenariodatatable)
              ?
              ""
              :

              <div className=" mx-5" id="attributetable">
                <div className="d-flex flex-row-reverse ">

                  <button disabled={isprocessing} className={isprocessing ? "btn btn-secondary btn-sm my-2 p-2 mx-1" : "btngreentheme my-2 p-2 mx-1"} data-toggle={false && "modal"}
                    data-target="#exampleModal1" onClick={handleButtonClick}>
                    Import
                  </button>
                  <input
                    type="file"
                    accept=".xlsx"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUploadoldscenario}
                  />
                  <button disabled={isprocessing} className={isprocessing ? "btn btn-secondary btn-sm my-2 p-2 mx-1" : "btngreentheme my-2 p-2 mx-1"} data-toggle={false && "modal"}
                    data-target="#exampleModal1" onClick={() => { handleexportoldscenarios() }}>
                    Export
                  </button>

                  <button disabled={isprocessing} className={isprocessing ? "btn btn-secondary btn-sm my-2 p-2 mx-1" : "btngreentheme my-2 p-2 mx-1"} data-toggle={(displaynames2.scenario === "Base Scenario") && "modal"}
                    data-target="#exampleModal1" onClick={() => { if (displaynames2.scenario !== "Base Scenario") { updatescenario() } }}>
                    {displaynames2.scenario === "Base Scenario" ? "Save Scenario" : "Update Scenario"}
                  </button>
                  {/* <div className="d-flex flex-row-reverse ">
                
                <button className="btngreentheme my-2 p-2 mx-1" data-toggle={ "modal"}
                  data-target="#exampleModal1" onClick={() => {  }}>
                  { "Save Scenario" }
                </button>
              </div> */}
                </div>
                {loader4 ? "Loading..." : <>
                  {sampledataset[0]?.month_data?.length === 1 ?
                    <VariableTableYearlyAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} /> :
                    <VariableTableAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} endDate={endDate} />
                  }
                </>
                }
              </div>
          }
          {
            (!viewnewbasescenariodata) ?
              ""
              :

              <div className=" mx-5" id="attributetable">
                <div className="d-flex flex-row-reverse ">

                  <button disabled={isprocessing} className={isprocessing ? "btn btn-secondary btn-sm my-2 p-2 mx-1" : "btngreentheme my-2 p-2 mx-1"} data-toggle={false && "modal"}
                    data-target="#exampleModal1" onClick={handleButtonClick}>
                    Import
                  </button>
                  <input
                    type="file"
                    accept=".xlsx"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUploadoldscenario}
                  />
                  <button className={isprocessing ? "btn btn-secondary btn-sm my-2 p-2 mx-1" : "btngreentheme my-2 p-2 mx-1"} disabled={isprocessing} data-toggle={false && "modal"}
                    data-target="#exampleModal1" onClick={() => { handleexportoldscenarios() }}>
                    Export
                  </button>
                  <button className="btngreentheme my-2 p-2 mx-1" data-toggle={(displaynames2.scenario === "Base Scenario" || displaynames2.scenario === "newbase") && "modal"}
                    data-target="#exampleModal2" onClick={() => {
                      if (displaynames2.scenario !== "Base Scenario" && displaynames2.scenario !== "newbase") { updatescenario() }
                    }}>
                    {displaynames2.scenario === "Base Scenario" || displaynames2.scenario === "newbase" ? "Save Scenario" : "Update Scenario"}
                  </button>
                </div>
                {loader4 ? "Loading..." : <>
                  {sampledataset[0]?.month_data?.length === 1 ?
                    <VariableTableYearlyAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} /> :
                    <VariableTableAtta sampledataset={sampledataset} changesampledataset={changesampledataset} originalset={originalset} changeoriginalset={changeoriginalset} originaldatasetforcolorcoding={originaldatasetforcolorcoding} />
                  }
                </>
                }
              </div>
          }

        </div>
      </div>
      <FooterPages />
    </>
  );
}

export default SimulatorAtta;
