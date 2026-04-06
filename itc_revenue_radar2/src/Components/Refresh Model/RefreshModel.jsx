import React, { useEffect, useState } from 'react'
import FooterPages from '../Footer/FooterPages'
import Loader from "react-js-loader";
import UserService from '../../services/UserService';
import { useDispatch } from "react-redux";
import AuthService from '../../services/AuthService';
import getNotification from '../../Redux/Action/action';
import swal from 'sweetalert'
import Chart from "react-apexcharts";
import Navbar2 from '../Navbars/Navbar2';
import SubNavbar from '../Navbars/SubNavbar';
import Navbar3 from '../Navbars/Navbar3';
import { upload } from '@testing-library/user-event/dist/upload';
import axios from 'axios'
import Select, { components } from "react-select";
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import LoaderCustom from '../LoaderCustom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const XLSX = require("xlsx");


const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

function RefreshModel() {
  const [modifybtn, setmodifybtn] = useState(false)
  const [brandoptions, setbrandoptions] = useState([]);
  const [selectedbrand, setselectedbrand] = useState("");
  const [timetorefresh, settimetorefresh] = useState(9000);
  const [percentagetoshowonloader, setpercentagetoshowonloader] = useState(0);
  const [loaderrefresh, setloaderrefresh] = useState(false)
  const [displaynames, setdisplaynames] = useState({});
  const [resultscreen, setresultscreen] = useState(false);
  const [loader1, setloader1] = useState(false);
  const [loader2, setloader2] = useState(false);
  const [uploadfiledata, setuploadfiledata] = useState([])
  const [uploadfilefilterobject, setuploadfilefilterobject] = useState({ Brand: "Select", FY: "Select", Final_Market: "Select" })
  const [resultscreen4, setresultscreen4] = useState(false)
  const [resultscreen2, setresultscreen2] = useState(true)
  const [maxdatebeforerefresh, setmaxdatebeforerefresh] = useState("")
  const [newrecordstable, setnewrecordstable] = useState([])
  let counter = 1;
  const dispatch = useDispatch();

  // For atta
  const [attaPosMaxDate, setAttaPosMaxDate] = useState('')
  const [attaMediaMaxDate, setAttaMediaMaxDate] = useState('')
  const [posData, setPosData] = useState([])
  const [mediaData, setMediaData] = useState([])
  const [totalPosData, setTotalPosData] = useState('')
  const [totalPosColumnCount, setTotalPosColumnCount] = useState('')
  const [totalMediaData, setTotalMediaData] = useState('')
  const [totalMediaColumnCount, setTotalMediaColumnCount] = useState('')
  const [pullingDataFlag, setPullingDataFlag] = useState(false)
  const [pushingDataFlag, setPushingDataFlag] = useState(false)

  useEffect(() => {
    handlevariablesfetchfybrand()
    //handlevariablesfetch();
  }, []);

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
          setbrandoptions(
            getResponse.data.brands?.filter(it => !ExceptionVariables?.brandoptionshide2?.includes(it?.brand))?.sort((a, b) => a.brand.localeCompare(b.brand))?.map((it) => {
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/modelperformance`,
        });
      }, 1000);
    }
  };

  const handlefetchmaxdatebeforerefresh = async (brand) => {
    if (UserService.isLoggedIn()) {
      try {

        if (true) {
          try {
            setmaxdatebeforerefresh("")
            let config = {};
            const requestData = {
              brand: brand,
            };
            config = {
              method: "post",
              url: brand === 'ATTA' ? `${REACT_APP_UPLOAD_DATA}/app/atta_model_Min_date_before_refresh` : `${REACT_APP_UPLOAD_DATA}/app/model_Min_date_before_refresh`,
              headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
              },
              data: requestData,
            };
            const getResponse = await axios(config);
            if (getResponse.status === 200) {
              if (brand === 'ATTA') {
                // console.log(getResponse)
                setAttaMediaMaxDate(getResponse.data.media_max_date)
                setAttaPosMaxDate(getResponse.data.pos_max_date)
              }
              else {
                setmaxdatebeforerefresh(getResponse?.data[0]?.max_date_before_refresh?.split("T")[0]?.split("-")?.reverse()?.join("-"))
                setresultscreen2(true)
                setdisplaynames({
                  ...displaynames,
                  brand: selectedbrand,
                })
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
          redirectUri: `${REACT_APP_REDIRECT_URI}/refreshmodel`,
        });
      }, 1000);
    }

  }

  const handlepulllatestdata = async () => {
    if (!UserService.isLoggedIn()) {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/refreshmodel`,
        });
      }, 1000);
      return;
    }

    if (selectedbrand === "") {
      dispatch(
        getNotification({
          message: "Please select brand!",
          type: "danger",
        })
      );
      return;
    }

    setnewrecordstable([]);
    setPullingDataFlag(true);

    try {
      const requestData = { brand: selectedbrand };
      const url =
        selectedbrand === "ATTA"
          ? `${REACT_APP_UPLOAD_DATA}/app/atta_pullData`
          : `${REACT_APP_UPLOAD_DATA}/app/model_refresh_pull`;

      const config = {
        method: "post",
        url,
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        data: requestData,
      };

      const getResponse = await axios(config);

      if (getResponse.status === 200) {
        setpercentagetoshowonloader(0);
        const responseData = getResponse.data;

        if (responseData === null) {
          dispatch(
            getNotification({
              message: "There are no records to upload!",
              type: "default",
            })
          );
          return;
        }

        if (selectedbrand === "ATTA") {
          if (responseData.message) {
            if (responseData.message === 'Data is up to date') {
              dispatch(
                getNotification({
                  message: `${responseData.message}`,
                  type: "success",
                })
              );
            }
            else {
              dispatch(
                getNotification({
                  message: `${responseData.message}`,
                  type: "danger",
                })
              );
            }
          }
          else {
            setPosData(responseData.pos_data);
            setMediaData(responseData.media_data);
            setTotalMediaData(responseData.total_media_data);
            setTotalPosData(responseData.total_pos_data);
            setTotalPosColumnCount(responseData.total_pos_column_count)
            setTotalMediaColumnCount(responseData.total_media_column_count)
          }
        } else {
          setnewrecordstable(responseData?.[4] || []);
          setresultscreen(true);
          setdisplaynames((prev) => ({
            ...prev,
            brand: selectedbrand,
          }));
        }
      }
    } catch (err) {
      const status = err?.response?.status;

      const errorMessages = {
        400: "Input is not in prescribed format",
        401: "Session expired! Please log in again",
        404: "Page not Found",
        422: "Input is not in prescribed format",
        500: "Server is Down! Please try again after sometime",
      };

      const message =
        errorMessages[status] || "Server is Down! Please try again after sometime";

      dispatch(
        getNotification({
          message,
          type: "default",
        })
      );

      if (status === 401) {
        setTimeout(() => {
          UserService.doLogin();
        }, 1000);
      }
    } finally {
      setPullingDataFlag(false);
    }
  };

  const handlerefreshmodel = async () => {
    if (!UserService.isLoggedIn()) {
      return UserService.doLogin({
        redirectUri: `${REACT_APP_REDIRECT_URI}/refreshmodel`,
      });
    }

    try {
      setnewrecordstable([]);
      setloaderrefresh(true);
      setPushingDataFlag(true)
      const requestData = { brand: selectedbrand };
      const isAtta = selectedbrand === 'ATTA';

      const config = {
        method: "post",
        url: isAtta
          ? `${REACT_APP_UPLOAD_DATA}/app/atta_pushData`
          : `${REACT_APP_UPLOAD_DATA}/app/model_refresh_save`,
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        data: requestData,
      };

      // Progress bar simulation
      let percentage = 0;
      let refreshTimer = 0;
      const interval = setInterval(() => {
        if (percentage < 100) {
          percentage += 1;
          refreshTimer += 30;
          setpercentagetoshowonloader(percentage);
          console.log(refreshTimer);
        } else {
          clearInterval(interval);
        }
      }, timetorefresh);

      const response = await axios(config);

      if (response.status === 200) {
        clearInterval(interval);
        if (selectedbrand === 'ATTA') {
          const posMaxDate = response?.data?.pos_max_date
          const mediaMaxDate = response?.data?.media_max_date
          setAttaPosMaxDate(posMaxDate)
          setAttaMediaMaxDate(mediaMaxDate)
          setMediaData([])
          setPosData([])
          setselectedbrand('')
          swal(
            'Data uploaded successfully!',
            `POS data Updated till ${posMaxDate} & Media Data Updated till ${mediaMaxDate}`,
            'success'
          );
        }
        else {
          const minDate = formatDate(response?.data[0][0]?.min_date);
          const maxDate = formatDate(response?.data[1][0]?.max_date);
          const newRecords = response?.data[3][0]?.new_records;
          setmaxdatebeforerefresh(maxDate);
          swal(
            'Data uploaded successfully!',
            `Data Available from: ${minDate}\nTill: ${maxDate}\nNew Records Inserted: ${newRecords}`,
            'success'
          );
        }
        setresultscreen2(true);
        setdisplaynames((prev) => ({ ...prev, brand: selectedbrand }));
      }
    } catch (err) {
      handleErrorResponse(err);

      if (displaynames?.brand) {
        setselectedbrand(displaynames.brand || brandoptions[0].brand);
      }
    } finally {
      setloaderrefresh(false);
      setPushingDataFlag(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) =>
    dateStr?.split("T")[0]?.split("-")?.reverse()?.join("-") || "N/A";

  // Error handler
  const handleErrorResponse = (err) => {
    console.error("Server Error", err);

    const status = err?.response?.status;
    const errorMessages = {
      500: "Server is Down! Please try again after sometime",
      400: "Input is not in prescribed format",
      422: "Input is not in prescribed format",
      404: "Page not Found",
      401: "Session expired! Please log in again",
    };

    const message = errorMessages[status] || "Unknown Error. Try again later";
    dispatch(getNotification({ message, type: "default" }));

    if (status === 401) {
      UserService.doLogin();
    }
  };


  return (
    <>
      <Navbar3 />
      <div className="bgpages">
        <div className=' container-fluid py-3 mx-2'>
          <div className='breadcrumb '>{`Dashboard >> Refresh Model`}</div>
          <div className='p-2  pageheading my-3' style={{ fontSize: "20px" }}><b>Refresh Model</b></div>
          <div>
            {loader2 ? (
              <div
                className="row d-flex  justify-content-center align-items-center "
                style={{ height: "83vh" }}
              >
                <Loader
                  type="box-rectangular"
                  bgColor={"#0A4742"}
                  title={"Processing Plots..."}
                  color={"#0A4742"}
                  size={75}
                />
              </div>
            ) :
              resultscreen2 &&
              <div>
                <div className='card p-3'>
                  <div className="row ">
                    <div className="col-sm">
                      <div className="">
                        <strong>Brand<span className="text-danger">*</span></strong>
                      </div>
                      <div className="" >
                        <Select
                          placeholder="Select Brand"
                          value={selectedbrand ? { label: selectedbrand, value: selectedbrand } : null}
                          className="my-2 w-75"
                          options={brandoptions}
                          onChange={(value) => {
                            handlefetchmaxdatebeforerefresh(value.value);
                            setselectedbrand(value.value);
                            setnewrecordstable([]);
                            setPosData([])
                            setMediaData([])
                            setTotalMediaColumnCount('')
                            setTotalPosColumnCount('')
                            setresultscreen(false);
                            setAttaMediaMaxDate('')
                            setAttaPosMaxDate('')
                          }}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }) // High z-index ensures it appears above everything
                          }}
                          menuPortalTarget={document.body} // Moves dropdown to body
                        />
                      </div>
                    </div>
                    <div className='col-sm d-flex'>
                      {/* Pull Button */}
                      {
                        ((newrecordstable?.length > 0) || (posData?.length > 0 && mediaData?.length > 0))
                          ?
                          <div
                            className={`submitfrmtbtnred mx-2 ${pushingDataFlag ? 'disabled' : ''}`}
                            style={{
                              pointerEvents: pushingDataFlag ? 'none' : 'auto',
                              opacity: pushingDataFlag ? 0.5 : 1,
                              cursor: pushingDataFlag ? 'not-allowed' : 'pointer'
                            }}
                            type="button"
                            onClick={() => {
                              if (!pushingDataFlag) handlerefreshmodel();
                            }}
                          >
                            <span>
                              Save <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                            </span>
                          </div>
                          :
                          <div
                            className={`submitfrmtbtn mx-2 ${pullingDataFlag ? 'disabled' : ''}`}
                            style={{
                              pointerEvents: pullingDataFlag ? 'none' : 'auto',
                              opacity: pullingDataFlag ? 0.5 : 1,
                              cursor: pullingDataFlag ? 'not-allowed' : 'pointer'
                            }}
                            type="button"
                            onClick={() => {
                              if (!pullingDataFlag) handlepulllatestdata();
                            }}
                          >
                            <span>
                              Pull Latest data <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                            </span>
                          </div>
                      }

                    </div>
                  </div>
                  {
                    attaMediaMaxDate && attaPosMaxDate &&
                    <div className="alert alert-info p-2 mb-3">
                      <div>
                        <strong>{selectedbrand} POS Data Available Till:</strong>{" "}
                        <span className="text-danger">{attaPosMaxDate || 'N/A'}</span>
                      </div>
                      <div>
                        <strong>{selectedbrand} Media Data Available Till:</strong>{" "}
                        <span className="text-danger">{attaMediaMaxDate || 'N/A'}</span>
                      </div>
                    </div>
                  }
                  {
                    maxdatebeforerefresh &&
                    <div className="alert alert-info p-2 mb-3">
                      <div>
                        <strong>{selectedbrand} Data Available Till:</strong>{" "}
                        <span className="text-danger">{maxdatebeforerefresh || 'N/A'}</span>
                      </div>
                    </div>
                  }
                </div>

                {
                  pushingDataFlag
                    ? 
                    <LoaderCustom text={'Pushing Data To The Working DataBase'} />
                    :
                    <>
                      {
                        pullingDataFlag ?
                          <LoaderCustom text={'Data Pulling is happening...'} />
                          :
                          <>
                            {/* Non Atta Data */}
                            {newrecordstable?.length > 0 && (
                              <div className="accordion my-4" id="attaAccordion">
                                <div className="accordion-item mb-4">
                                  <h2 className="accordion-header" id="headingNew">
                                    <button
                                      className="accordion-button" // Removed 'collapsed'
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseNew"
                                      aria-expanded="true" // Changed to true
                                      aria-controls="collapseNew"
                                    >
                                      🆕 New Records — {newrecordstable.length} rows, {Object.keys(newrecordstable[0]).length} columns
                                    </button>
                                  </h2>
                                  <div
                                    id="collapseNew"
                                    className="accordion-collapse show" // Added 'show'
                                    aria-labelledby="headingNew"
                                    data-bs-parent="#attaAccordion"
                                  >
                                    <div className="accordion-body">
                                      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                        <table className="table table-sm table-bordered table-striped">
                                          <thead className="bg-secondary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                            <tr>
                                              <th style={{ whiteSpace: 'nowrap' }}>#</th>
                                              {Object.keys(newrecordstable[0])?.map((key, index) => (
                                                <th key={index} style={{ whiteSpace: 'nowrap' }}>{key}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {newrecordstable.map((row, rowIndex) => (
                                              <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                {Object.keys(row).map((key, colIndex) => (
                                                  <td key={colIndex} style={{ whiteSpace: 'nowrap' }}>{row[key]}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}


                            <div className="accordion my-4" id="attaAccordion">
                              {/* POS DATA Accordion */}
                              {posData?.length > 0 && (
                                <div className="accordion-item mb-4">
                                  <h2 className="accordion-header" id="headingPos">
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapsePos"
                                      aria-expanded="false"
                                      aria-controls="collapsePos"
                                    >
                                      📊 POS New Records — {totalPosData} rows, {totalPosColumnCount} columns
                                    </button>
                                  </h2>
                                  <div
                                    id="collapsePos"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingPos"
                                    data-bs-parent="#attaAccordion"
                                  >
                                    <div className="accordion-body">
                                      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                        <table className="table table-sm table-bordered table-striped">
                                          <thead className="bg-secondary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                            <tr>
                                              <th style={{ whiteSpace: 'nowrap' }}>#</th>
                                              {Object.keys(posData[0])?.map((key, idx) => (
                                                <th key={idx} style={{ whiteSpace: 'nowrap' }}>{key}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {posData.map((row, rowIndex) => (
                                              <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                {Object.keys(row).map((key, colIndex) => (
                                                  <td key={colIndex} style={{ whiteSpace: 'nowrap' }}>{row[key]}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* MEDIA DATA Accordion */}
                              {mediaData?.length > 0 && (
                                <div className="accordion-item mb-4">
                                  <h2 className="accordion-header" id="headingMedia">
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseMedia"
                                      aria-expanded="false"
                                      aria-controls="collapseMedia"
                                    >
                                      🎥 MEDIA New Records — {totalMediaData} rows, {totalMediaColumnCount} columns
                                    </button>
                                  </h2>
                                  <div
                                    id="collapseMedia"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="headingMedia"
                                    data-bs-parent="#attaAccordion"
                                  >
                                    <div className="accordion-body">
                                      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                        <table className="table table-sm table-bordered table-striped">
                                          <thead className="bg-secondary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                            <tr>
                                              <th style={{ whiteSpace: 'nowrap' }}>#</th>
                                              {Object.keys(mediaData[0])?.map((key, idx) => (
                                                <th key={idx} style={{ whiteSpace: 'nowrap' }}>{key}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {mediaData.map((row, rowIndex) => (
                                              <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                {Object.keys(row).map((key, colIndex) => (
                                                  <td key={colIndex} style={{ whiteSpace: 'nowrap' }}>{row[key]}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                      }
                    </>
                }
              </div>
            }
          </div>
        </div></div>


      <FooterPages />
    </>

  )
}

export default RefreshModel