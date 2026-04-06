import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import FooterPages from './Footer/FooterPages.jsx'
import UserService from "../services/UserService.js";
import AuthService from "../services/AuthService.js";

import Select, { components } from "react-select";
import axios from "axios";
import { useDispatch } from "react-redux";
import getNotification from "../Redux/Action/action.js";
//import styled from 'styled-components';
import Plot from "react-plotly.js";
import Loader from "react-js-loader";

import Navbar2 from "./Navbars/Navbar2.jsx";

const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

function CompetitiveAnalysis2() {


  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displaynames, setdisplaynames] = useState({});
  const [brandoptions, setbrandoptions] = useState([
 
  ]);
  const [loader, setloader] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [resultscreen, setresultscreen] = useState(false);
  const [comparescreen, setcomparescreen] = useState(false);
  const [comparetacticmenu, setcomparetacticmenu] = useState(false);
  const [selectedbrands, setselectedbrands] = useState([]);
  const [selectedbrandsshow, setselectedbrandsshow] = useState([]);
  const [tacticlist, settacticlist] = useState([]);
  const [tacticlist2, settacticlist2] = useState([]);
  const [spendtoplot1, setspendtoplot1] = useState({value:"Select Sub Tactic",label:"Select Sub Tactic",category:"Select Sub Tactic"});
  const [spendtoplot1main, setspendtoplot1main] = useState("");
  const [spendtoplot2, setspendtoplot2] = useState({value:"Select Sub Tactic",label:"Select Sub Tactic",category:"Select Sub Tactic"});
  const [spendtoplot2main, setspendtoplot2main] = useState("Select Tactic");
  const [plotdata1, setplotdata1] = useState([]);
  const [plotdata2, setplotdata2] = useState([]);
  const [statisticsdata1, setstatisticsdata1] = useState([]);
  const [statisticsdata2, setstatisticsdata2] = useState([]);
  const dispatch = useDispatch();
  const [reportName, setreportName] = useState("");

  const [tacticoptions, settacticoptions] = useState([])
  const [subtacticoptions, setsubtacticoptions] = useState([])
  const [subtacticoptions2, setsubtacticoptions2] = useState([])
  useEffect(() => {
    handledatemenu();
    handlebrandmenu();
    handletacticmenu();

  }, []);

  const formatMonthYear = (inputString) => {
    // Split the input string into month and year
    const [month, year] = inputString.split('-');

    // Get the first three characters of the month and the last two characters of the year
    const formattedMonth = month.slice(0, 3);
    const formattedYear = year.slice(2);

    // Combine the formatted month and year with a hyphen
    const formattedString = formattedMonth + '-' + formattedYear;

    return formattedString;
  }
  const handleMouseEnter = () => {
    // setIsHovered(true);
    document.getElementById("userparabtn").classList.add("d-none");
    // document.getElementById("sidenav").style.width = "350px";
    document.getElementById("mainscreen").classList.add("blurry-component");
    if (document.getElementById("subcontainer3")) {
      document.getElementById("subcontainer3").classList.add("blurry-component");

    }
  };

  const handleMouseLeave = () => {
    //setIsHovered(false);
    document.getElementById("userparabtn").classList.remove("d-none");
    //document.getElementById("sidenav").style.width = "245px";
    //document.getElementById("sidenav").classList.remove("col-sm-6");
    document.getElementById("mainscreen").classList.remove("blurry-component");
    if (document.getElementById("subcontainer3")) {
      document.getElementById("subcontainer3").classList.remove("blurry-component");
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
  const handledatemenu = async () => {
    try {
      const FormData = require("form-data");
      const sendData = new FormData();
      sendData.append("jwttoken", UserService.getToken());

      const config = {
        method: "post",
        url: `${REACT_APP_UPLOAD_DATA}/dates/loaddates`,
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        data: sendData,
      };
      const getResponse = await axios(config);
      setStartDate(getResponse.data[1]._date);
      // console.log(getResponse.data[1]._date)
      setEndDate(getResponse.data[0]._date);
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
  };

  const customStyles = {
    option: (provided, state) => {
      // Get the category of the current option
      const category = state.data.category;
    
      // Get the color for the category
      const color = category==="Significant"? "green":"red" || 'black'; // Default to black if category is not found
        return {
        ...provided,
        color: state.isSelected ? 'white' : color, // Text color based on category
        backgroundColor: state.isSelected ? color : 'white', // Background color for selected option
      };
    },
    singleValue: (provided, state) => {
      // Get the category of the selected option
      const category = state.data.category;
      // Get the color for the category
      const color = category==="Significant"? "green":"red" || 'black'; // Default to black if category is not found
        return {
        ...provided,
        color: color, // Text color for the selected option in the input
      };
    },
  };
  const handlebrandmenu = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("jwttoken", UserService.getToken());
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/brand/getbrands`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        if (getResponse.data !== "Invalid User!") {
          setbrandoptions(
            getResponse.data?.map((it) => {
              return { value: it.brand, label: it.brand };
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
  };
  const handletacticmenu = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("jwttoken", UserService.getToken());

        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/variables/gettactics`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData,
        };
        const getResponse = await axios(config);
        console.log(getResponse)
        if (getResponse.data !== "Invalid User!") {
          settacticlist(getResponse.data);
          settacticlist2(getResponse.data)
          settacticoptions(getResponse.data.map((item) => {
            return {
              label: item.spend_to_display,
              value: item.spend_to_display
            }
          }))

        }
        else {
          UserService.doLogin({
            redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
          });
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
  };
  const handletacticmenu2 = async () => {
    if (UserService.isLoggedIn()) {
      try {
        const FormData = require("form-data");
        const sendData = new FormData();
        sendData.append("jwttoken", UserService.getToken());
        sendData.append("spend", spendtoplot1.value);
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/api/variables/forcompare`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: sendData,
        };
        const getResponse = await axios(config);

        if (getResponse.data !== "Invalid User!") {
          settacticlist(getResponse.data);
        }
        else {
          UserService.doLogin({
            redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
          });
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
  };
  const processplotdata = (fetchplotresponse, oneortwo) => {
    let arr1 = [];
    let arr2 = [];
    let plot_data = [];
    const colors = [
      "red",
      "blue",
      "green",
      "purple",

      "cyan",
      "magenta",
      "yellow",
      "lime",
      "pink",
      "teal",
      "indigo",
      "brown",
      "grey",
      "violet",
      "olive",
      "navy",
      "maroon",
      "gold",
      "darkgreen",
      "darkred",
      "darkblue",
      "darkorange",
      "darkcyan",
      "darkmagenta",
      "darkyellow",
      "darklime",
      "darkpink",
      "darkteal",
      "darkviolet",
    ];

    fetchplotresponse?.map((item) => {
      arr1.push(formatMonthYear(item.month));
      arr2.push(item.cs);
    });
    for (let i = 0; i * 6 < arr1.length; i++) {
      plot_data.push({
        x: arr1.slice(i * 6, (i + 1) * 6),
        y: arr2.slice(i * 6, (i + 1) * 6),
        type: "scatter",
        name: "brand",
        mode: "lines",
        marker: { color: colors[i % colors.length] },
      });
    }
    oneortwo === "one" ? setplotdata1(plot_data) : setplotdata2(plot_data);
  };


  const fetchplotdata = async () => {
    if (UserService.isLoggedIn()) {
      if (spendtoplot1 && selectedbrands.length > 0 && startDate && endDate) {
        try {
          setloader(true);
          fetchstatisticsdata("one");
          //handleMouseLeave();
          const requestData = {
            jwttoken: UserService.getToken(),
            startDate: startDate,
            endDate: endDate,
            spend: spendtoplot1.value,
            brands: selectedbrands,
          };

          const config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/competitive/getchart`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const getResponse = await axios(config);

          //console.log(getResponse);

          if (getResponse.status === 200) {

            if (getResponse.data[0] !== "Invalid User!") {
              setresultscreen(true);
              setcomparetacticmenu(false);
              processplotdata(getResponse.data, "one");
              //matchHeights();
              setdisplaynames({
                ...displaynames,
                startDate: startDate,
                endDate: endDate,
                selectedbrands: selectedbrands,
                tactic: spendtoplot1main,
                subtactic:spendtoplot1.value
              })
            }
            else if (getResponse.data[0] === "Invalid User!") {
              UserService.doLogin({
                redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
              });
            }
          }
        } catch (err) {
          //document.getElementById("subm").classList.remove("d-none");
          console.log("Server Error", err);
          //handleMouseEnter();
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
    setloader(false);
  };
  const fetchplotdatacompare = async () => {
    if (UserService.isLoggedIn()) {
      if (spendtoplot2 && selectedbrands.length > 0 && startDate && endDate) {
        try {
          setloader2(true);
          fetchstatisticsdata("two");
          //handleMouseLeave()
          // const FormData = require("form-data");
          // const sendData = new FormData();
          // sendData.append("jwttoken", UserService.getToken());
          // sendData.append("startDate", startDate);
          // sendData.append("endDate", endDate);
          // sendData.append("spend", spendtoplot2);
          // sendData.append("brands", selectedbrands);
          const requestData = {
            jwttoken: UserService.getToken(),
            startDate: startDate,
            endDate: endDate,
            spend: spendtoplot2.value,
            brands: selectedbrands,
          };
          const config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/competitive/getchart`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const getResponse = await axios(config);


          // setplot1list(Array.from(getResponse.data));
          if (getResponse.status === 200) {
            //document  .getElementById("mainscreen")              .classList.remove("col-sm-9");
            //document.getElementById("mainscreen").classList.add("col-sm-5");
            //scrollToSection("heightmainscreen");
            setcomparescreen(true);
            processplotdata(getResponse.data, "two");
            document.getElementById("comparesectiontacticmenu").classList.add("d-none")

            setdisplaynames({
              ...displaynames,
              startDate: startDate,
              endDate: endDate,
              selectedbrands: selectedbrands,
              tactic: spendtoplot1main,
              subtactic:spendtoplot1.value,
              tactic2: spendtoplot2main,
              subtactic2:spendtoplot2.value

            })
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
    setloader2(false);
  };
  const fetchstatisticsdata = async (test) => {
    if (UserService.isLoggedIn()) {
      try {
        const requestData = {
          jwttoken: UserService.getToken(),
          startDate: startDate,
          endDate: endDate,
          spend: test === "one" ? spendtoplot1.value : spendtoplot2.value,
          brands: selectedbrands,
        };
        const config = {
          method: "post",
          url: `${REACT_APP_UPLOAD_DATA}/competitive/getstatistics`,
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          data: requestData,
        };
        const getResponse = await axios(config);

        // setplot1list(Array.from(getResponse.data));
        if (getResponse.status === 200) {
          if (getResponse.data !== "No Records Found.") {
            test === "one"
              ? setstatisticsdata1(getResponse.data)
              : setstatisticsdata2(getResponse.data);
          } else {
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
  };
  const handlesavereport = async () => {
    if (UserService.isLoggedIn()) {
     
      if (
        reportName &&
        spendtoplot1 &&
        selectedbrands.length > 0 &&
        startDate &&
        endDate
      ) {
        try {
          // const FormData = require("form-data");
          // const sendData = new FormData();
          // sendData.append("jwttoken", UserService.getToken());
          // sendData.append("reportName", reportName);
          // sendData.append("startDate", startDate);
          // sendData.append("endDate", endDate);
          // sendData.append("spend", spendtoplot1);
          // sendData.append("compare_spend", spendtoplot2);
          // sendData.append("createdby", UserService.getFullName());
          // sendData.append("brands", selectedbrands);
          const requestData = {
            jwttoken: UserService.getToken(),
            reportName: reportName,
            startDate: startDate,
            endDate: endDate,
            spend: spendtoplot1.value,
            compare_spend: spendtoplot2.value,
            createdby: UserService.getFullName(),
            brands: selectedbrands,
          };
          const config = {
            method: "post",
            url: `${REACT_APP_UPLOAD_DATA}/competitive/savereport`,
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            data: requestData,
          };
          const getResponse = await axios(config);

          // setplot1list(Array.from(getResponse.data));
          if (getResponse.status === 200) {
            dispatch(
              getNotification({
                message: "Report has been saved successfully",
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/competitiveanalysis`,
        });
      }, 1000);
    }
    setloader(false);
  };
  const handleDropdownChange = (selectedOption, dropdownType) => {

if(dropdownType==="category2"){
    setsubtacticoptions2(tacticlist.filter((it) => it.spend_to_display === selectedOption.value)[0]?.child_Items.filter(item => item.spend_to_display!== spendtoplot1.value).map((item) => {
   
    return {
      value: item.spend_to_display,
      label: item.spend_to_display,
      category:item.category
      //fullset:item
    }
   
  }))
}
else{
    setsubtacticoptions(tacticlist.filter((it) => it.spend_to_display === selectedOption.value)[0]?.child_Items.map((item) => {
      return {
        value: item.spend_to_display,
        label: item.spend_to_display,
        category:item.category
        //fullset:item
      }
    }))
    console.log(subtacticoptions)}
    
  };

  return (
    <>
   

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
              <h6 className="modal-title" id="exampleModalLabel">
                Report
              </h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"

              >
                <span aria-hidden="true" >&times;</span>
              </button>
            </div>
            <div className="modal-body">
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
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


      <div className="">
      
             <div className="bgpages px-4 py-3 " >
          
          <div className="row my-3">
            <div className="col-sm-9 align-self-center">
            <h5 className='orangetheme' style={{ fontWeight: "700" }} >COMPETITIVE ANALYSIS</h5>
            <p className="text-light" >
              Dissects expenditure trends among multiple brands in a specific source of expenditure over a defined time frame.
            </p>
            </div>
          <div className="col-sm-3">
            {resultscreen && displaynames.selectedbrands?.length > 0
                // && displaynames.tacticlist?.length>0
                &&
                <div className="rounded-4 m-1 p-3 card" style={{ backgroundColor: "#FAFFE7",border:"2px solid red",width:"320px",fontSize:"14.5px" }}>
                  <span className=" orangetheme" ><b>User Selections</b>
                  <hr className="m-1" style={{border:"1px solid #f15e23"}}/>
                    </span>
                  <table className="mx-auto">
                    <thead>
                      <tr>
                        <th style={{color:"darkblue"}}>Parameter</th>
                        <th className="text-right " style={{color:"darkblue"}}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td scope="" className="" style={{color:"darkblue"}} >Start Date</td>
                        <td className="text-right">{displaynames.startDate}</td>

                      </tr>
                      <tr>
                        <td scope=""  className="" style={{color:"darkblue"}}>End Date</td>
                        <td className="text-right">{displaynames.endDate}</td>
                      </tr>
                      <tr>
                        <td scope=""  className="" style={{color:"darkblue"}}>Brands</td>
                        {displaynames.selectedbrands?.length > 1 ? <td className="text-right">{selectedbrands.map((brand, index) => (
                          <span key={index}>{brand}{index !== selectedbrands.length - 1 && <br />}</span>
                        ))}</td> : <td className="text-right">{selectedbrands.map((brand) => { return `${brand}` })}</td>}
                      </tr>
                      <tr>
                        <td scope="" className="" style={{color:"darkblue"}}>Tactic</td>
                        <td className="text-right">{displaynames.subtactic}</td>
                      </tr>
                      {displaynames.spendtoplot2 && <tr>
                        <td scope="" className="" style={{color:"darkblue"}}>Compare Tactic</td>
                        <td className="text-right">{displaynames.subtactic2}</td>
                      </tr>}
                    </tbody>
                  </table>

                </div>}
                </div>
          </div>
       
          <div className="">

            <div className="rounded-5 card " style={{ backgroundColor: "white", border:"1px solid #E4CCFF" }}>
              {/* <span className="float-end"><img src="./Assets/Images/icon1.png" style={{ width: "70px", height: "60px" }} /></span> */}

              <div style={{ fontWeight: "500", backgroundColor: "#EAF7FF" }} className="headingcolor p-3 rounded-5" >
                {resultscreen ? <div>Visualization Wizard
                  <span className="float-end">
                    <button className="btn btn-outline-secondary btn-sm m-1 position-relative" onClick={()=>{setcomparetacticmenu(!comparetacticmenu);}}>Compare</button>
                    <button className="btn btn-outline-secondary btn-sm m-1"
                      data-toggle="modal"
                      data-target="#exampleModal">Save Report</button>
                      

                  {comparetacticmenu && <div className="mt-4 row position-absolute" style={{zIndex: 5}}>
                    <div id="accordion2" className="" >
              
                      <div id="comparesectiontacticmenu" className=" p-3 card" style={{  backgroundColor: "#F7EFFF" }}>
                         
                        {tacticlist2.length > 0 && brandoptions.length > 0
                         ?
                              <div className="">
                               <Select
                                placeholder="Select Compare Tactic"
                                
                                options={tacticoptions}
                                value={{label:spendtoplot2main,value:spendtoplot2main}}
                                onChange={(value) => {
                                handleDropdownChange(value, 'category2')
                               setspendtoplot2main(value.value)
                                }}

                              />{" "}
                              
                              <Select
                                className="mt-2"
                                placeholder="Select Sub Tactic"
                                options={subtacticoptions2}
                                value={spendtoplot2}
                                onChange={(value) => {
                                setspendtoplot2(value)                                  
                                }}
                                styles={customStyles}
                              />{" "}
                              </div>
                          
                          : "You are not authorized to proceed"}
                      
                        <button
                          id="compare"
                          className="btn btn-primary btn-sm w-100  mt-4"
                          onClick={() => {
                           
                            fetchplotdatacompare();
                          }}
                        >
                          Submit
                        </button>
                      </div>
                      </div></div>}

                      
                    {resultscreen && (
                      <button

                        className={"btn btn-outline-danger  btn-sm m-1"}
                        onClick={() => {
                          setresultscreen(false)
                          setcomparetacticmenu(false);
                          //scrollToSection("heightmainscreen")
                          setselectedbrands([])
                          setselectedbrandsshow([])
                          setspendtoplot2({value:"Select Sub Tactic",label:"Select Sub Tactic",category:"Select Sub Tactic"})
                          setcomparescreen(false);
                          setdisplaynames({});
                          setspendtoplot1({value:"Select Sub Tactic",label:"Select Sub Tactic",category:"Select Sub Tactic"})
                        }}
                      >
                        Reset
                      </button>
                    )}

                  </span>
                </div> : "Metrics Customizer"}
 
              </div>

              <div className="row py-3 px-4" >
                {loader ? (
                  <div
                    className="row d-flex  justify-content-center align-items-center "
                    style={{ height: "70vh" }}
                  >
                    <Loader
                      type="box-rectangular"
                      bgColor={"#0A4742"}
                      title={"Processing Plots..."}
                      color={"#0A4742"}
                      size={75}
                    />
                  </div>
                ) : resultscreen ? <div>
                  <div className="row ">
                  <div className="col-sm-2" >
                 
                  <div className="p-2" style={{width:"90%",backgroundColor:"#f2f2f2"}}>

                          <div className="form-group-sm ">
                            <label htmlFor="" >
                              Start Date<span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              disabled={comparescreen}
                              className="form-control input-lg"
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
                              placeholder=" Start Date"
                            />

                          </div>

                          <div className=" my-2 ">
                            <label htmlFor="">
                              End Date<span className="text-danger">*</span>
                            </label>
                            <input
                              disabled={comparescreen}
                              type="date"
                              className="form-control"
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
                          <div className="my-2">
                            <label>Brands:<span className="text-danger">*</span></label>
                            <Select
                              isdisabled={comparescreen}
                              placeholder="Select Brand/Brands"
                              options={brandoptions}
                              value={selectedbrandsshow}
                              onChange={(value) => {
                                if (comparescreen) {
                                } else {
                                  let arr1 = [];
                                  value.forEach((it) => { arr1.push(it.value) });
                                  setselectedbrands(arr1);
                                  setselectedbrandsshow(value);

                                }
                              }}
                              isMulti
                            />{" "}





                          </div>

                          <div className="">
                            <div className="">
                              <label>Tactics:
                              <span className="text-danger">*</span>
                              </label>
                              <div className="mb-2">
                                <span className="text-success">S: Significant</span>,{"  "}
                                <span className="text-danger">NS: Non Significant</span>
                              </div>
                              <Select
                              
                                placeholder="Select Tactic"
                                options={tacticoptions}
                                value={{label:spendtoplot1main,value:spendtoplot1main}}
                                onChange={(value) => {
                                 
                                    setspendtoplot1main(value.value)
                                    handleDropdownChange(value, 'category')
                                    console.log(value.value)
                                  
                                  
                                }}

                              />{" "}
                          
                              <Select
                                className="mt-2"
                                
                                placeholder="Select Sub Tactic"
                                options={subtacticoptions}
                                value={spendtoplot1}
                                onChange={(value) => {
                                 
                                    setspendtoplot1(value)
                                  
                                }}
                                styles={customStyles}
                              />{" "}
                            
                              <button
                                id="subm"
                                className="btn btn-primary btn-sm w-100  my-4"
                                onClick={() => {
                                  //scrollToSection("heightmainscreen");
                                  fetchplotdata();
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>



                        



</div>

                  </div>
                    <div className="col-sm-8 justify-content-center d-flex position-relative">
                    {/* <button className="btn position-absolute " style={{top:"50%",left:"0px"}} onClick={()=>{setIsHovered(!isHovered)}}> 
                    <i class='fas fa-caret-square-right text-success'></i>
                   
                    </button> */}

                      <Plot
                      className="mt-5"
                        data={plotdata1}
                        layout={{
                          width: 500,
                          height: 350,
                          title: `${displaynames.subtactic}`,
                          xaxis: { title: "Month/Year", showgrid: false, automargin: true, showline: true, font: 6 },
                          yaxis: { title: "spends", showgrid: false, automargin: true, showline: true, rangemode: 'tozero', },
                          legend: "",
                          showlegend: false,
                          font: {
                            size: 10
                          },
                          legend: {
                            xaxis: `${ spendtoplot1.value }`,
                            xanchor: "center",
                            yanchor: "top",
                            y: -0.3, // play with it
                            x: 0.5, // play with it
                          },
                        }}
                      />
                      {comparescreen && (

<div>
  <button
    type="button"
    className="btn "

    onClick={() => {
      setcomparescreen(false);
      // document
      //   .getElementById("mainscreen")
      //   .classList.remove("col-sm-4");
      // document
      //   .getElementById("mainscreen")
      //   .classList.add("col-sm-9");
      setdisplaynames({ ...displaynames, tactic2: "",subtactic2:"" })
    }}
  >
    <span aria-hidden="true">&times; Close compare</span>
  </button>


 
      <Plot
        className="mt-3"
        data={plotdata2}
        layout={{
          width: 500,
          height: 350,
          font: {
            size: 10
          },
          title: `${displaynames.subtactic2}`,
          xaxis: { title: "Month/Year", showgrid: false, automargin: true, showline: true, },
          yaxis: { title: "spends", showgrid: false, automargin: true, showline: true, rangemode: 'tozero', },
          legend: "",
          showlegend: false,
          legend: {
            xaxis:`${ spendtoplot2.value }`,
            xanchor: "center",
            yanchor: "top",
            y: -0.3, // play with it
            x: 0.5, // play with it
          },
        }}
      />
      </div>)
}
                      </div>
                      <div className="col-sm-2">
                      {statisticsdata1.length > 0 ? (
                        <div className="border rounded-3 p-3 card" style={{backgroundColor:"#FFEBF8",border:"1px solid #FF87D6"}} id="statistics">
                          <h6 className="purpletheme">Statistics for main Plot  </h6>
                          <table className="">
                            <tbody>
                              <tr >
                                <td className="purpletheme">Brand</td>
                                <td className="text-right">{statisticsdata1[0].brand}</td>


                              </tr>

                              <tr>
                                <td className="purpletheme">Min</td>
                                <td className="text-right">{statisticsdata1[0].bmin}</td>
                              </tr>
                              <tr>
                                <td className="purpletheme">Max</td>

                                <td className="text-right">{statisticsdata1[0].bmax}</td>
                              </tr>
                              <tr>
                                <td className="purpletheme">Avg</td>


                                <td className="text-right">{statisticsdata1[0].bavg}</td>
                              </tr>
                              <tr>

                                <td className="purpletheme">St. Deviation</td>

                                <td className="text-right">{statisticsdata1[0].bstdev}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ): <div className="border rounded-3 p-3 card" style={{backgroundColor:"#FFEBF8",border:"1px solid #FF87D6"}} id="statistics">  <h6 className="purpletheme">Statistics for main Plot  </h6>There are no records for main plot selections </div>}
                      
                       {comparescreen ? statisticsdata2.length > 0 ? (
                                  <div className="border rounded-3 p-3 card mt-3" style={{backgroundColor:"#E5FEEC",border:"1px solid #FF87D6"}}> 
                                    <h6 className="" style={{ color: "green" }}>Statistics for compare</h6>
                                    <table className="">
                            <tbody>
                              <tr >
                                <td style={{ color: "green" }}>Brand</td>
                                <td className="text-right">{statisticsdata2[0].brand}</td>


                              </tr>

                              <tr>
                                <td style={{ color: "green" }}>Min</td>
                                <td className="text-right">{statisticsdata2[0].bmin}</td>
                              </tr>
                              <tr>
                                <td style={{ color: "green" }}>Max</td>

                                <td className="text-right">{statisticsdata2[0].bmax}</td>
                              </tr>
                              <tr>
                                <td style={{ color: "green" }}>Avg</td>


                                <td className="text-right">{statisticsdata2[0].bavg}</td>
                              </tr>
                              <tr>

                                <td style={{ color: "green" }}>St. Deviation</td>

                                <td className="text-right">{statisticsdata2[0].bstdev}</td>
                              </tr>
                            </tbody>
                          </table>
                                  </div>
                                ):
                                <div className="border rounded-3 p-3 card mt-3" style={{backgroundColor:"#E5FEEC",border:"1px solid #FF87D6"}} id="statistics">  <h6 className="text-success">Statistics for Compare Plot  </h6>There are no records for main plot selections </div>:""}
                    </div>
                    {comparescreen && <div id="subcontainer3"
                      className="col-sm-6"

                    >
                    
                    </div>}
                    <div className="d-flex flex-row justify-content-between">                    <img src="../Assets/Images/image2.png" className="mt-5" align="center" style={{}} />
                    <img src="../Assets/Images/image3.png" className="" align="center" style={{}} /> 
                  </div>
                  </div>
                </div> :
                  <>
                  <div className="col-sm">
                    {brandoptions.length > 0 && tacticlist.length > 0 ?
                   
                        <div>
                          <div className="form-group-sm ">
                            <label htmlFor="" >
                              Start Date<span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              disabled={comparescreen}
                              className="form-control input-lg "
                              style={{height:"30px"}}
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
                              placeholder=" Start Date"
                            />

                          </div>

                          <div className=" my-2 ">
                            <label htmlFor="">
                              End Date<span className="text-danger">*</span>
                            </label>
                            <input
                            style={{height:"30px"}}
                              disabled={comparescreen}
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
                          <div className="my-2">
                            <label>Brands:<span className="text-danger">*</span></label>
                            <Select
                              isdisabled={comparescreen}
                              
                              placeholder="Select Brand/Brands"
                              options={brandoptions}
                              value={selectedbrandsshow}
                              onChange={(value) => {
                                if (resultscreen) {
                                } else {
                                  let arr1 = [];
                                  value.forEach((it) => { arr1.push(it.value) });
                                  setselectedbrands(arr1);
                                  setselectedbrandsshow(value);

                                }
                              }}
                              isMulti
                            />{" "}





                          </div>

                          <div className="">
                            <div className="">
                              <label>Tactics:
                              <span className="text-danger">*</span>
                              </label>
                              <div className="mb-2">
                                <span className="text-success">S: Significant</span>,{"  "}
                                <span className="text-danger">NS: Non Significant</span>
                              </div>
                              <Select
                                isdisabled={comparescreen}
                                placeholder="Select Tactic"
                                options={tacticoptions}
                                //value={spendtoplot1main}
                                onChange={(value) => {
                                  if (comparescreen) {
                                  } else {
                                    setspendtoplot1main(value.value)
                                    handleDropdownChange(value, 'category')
                                    console.log(value.value)
                                  
                                  }
                                }}

                              />{" "}
                              <Select
                                className="mt-2"
                                isdisabled={comparescreen}
                                placeholder="Select Sub Tactic"
                                options={subtacticoptions}
                                value={spendtoplot1}
                                onChange={(value) => {
                                  if (resultscreen) {
                                  } else {
                                    setspendtoplot1(value)

                                  }
                                }}
                                styles={customStyles}
                              />{" "}
                            
                              <button
                                id="subm"
                                className="btn btn-primary btn-sm w-100  my-4"
                                onClick={() => {
                                  //scrollToSection("heightmainscreen");
                                  fetchplotdata();
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>



                        </div>
                      : "Loading..."}</div>
                    <div className="col-sm my-auto">
                      <img src="../Assets/Images/image1.png" className="mr-5" align="right" style={{}} />
                    </div>
                    </>
                }
    
              </div>



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

export default CompetitiveAnalysis2;
