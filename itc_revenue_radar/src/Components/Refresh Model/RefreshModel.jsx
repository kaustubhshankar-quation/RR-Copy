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
          redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard/refreshmodel`,
        });
      }, 1000);
    }

  }

  const handlepulllatestdata = async () => {
    if (!UserService.isLoggedIn()) {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard/refreshmodel`,
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
        redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard/refreshmodel`,
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
      <div className="rm-page">
          {/* Header Card with Breadcrumb + Title */}
          <div className="rm-header-card">
            <div className="rm-header-left">
              <div className="rm-breadcrumb">Dashboard / Refresh Model</div>
              <h2 className="rm-page-title">Refresh Model</h2>
              <p className="rm-page-subtitle mb-0">
                Pull latest data and update your brand models with the most recent records.
              </p>
            </div>
          </div>

          <div>
            {loader2 ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <Loader
                  type="box-rectangular"
                  bgColor={"#0D7C66"}
                  title={"Processing..."}
                  color={"#0D7C66"}
                  size={75}
                />
              </div>
            ) :
              resultscreen2 &&
              <div>
                {/* Filter Card */}
                <div className="rm-filter-card">
                  <div className="row g-3 align-items-end">
                    <div className="col-lg-4 col-md-6 col-12">
                      <label className="rm-label">
                        Brand <span className="text-danger">*</span>
                      </label>
                      <Select
                        placeholder="Select Brand"
                        value={selectedbrand ? { label: selectedbrand, value: selectedbrand } : null}
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
                        classNamePrefix="rm-select"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 col-12">
                      {((newrecordstable?.length > 0) || (posData?.length > 0 && mediaData?.length > 0))
                        ? (
                          <button
                            className="rm-submit-btn w-100"
                            disabled={pushingDataFlag}
                            onClick={() => { if (!pushingDataFlag) handlerefreshmodel(); }}
                          >
                            <span>
                              {pushingDataFlag
                                ? <>Saving...</>
                                : <>Save <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></>
                              }
                            </span>
                          </button>
                        ) : (
                          <button
                            className="rm-submit-btn w-100"
                            disabled={pullingDataFlag}
                            onClick={() => { if (!pullingDataFlag) handlepulllatestdata(); }}
                          >
                            <span>
                              {pullingDataFlag
                                ? <>Pulling...</>
                                : <>Pull Latest Data <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></>
                              }
                            </span>
                          </button>
                        )
                      }
                    </div>
                  </div>

                  {/* Date Info Badges */}
                  {attaMediaMaxDate && attaPosMaxDate && (
                    <div className="rm-info-bar mt-3">
                      <div className="rm-info-item">
                        <i className="fas fa-database rm-info-icon"></i>
                        <span className="rm-info-label">{selectedbrand} POS Data Till:</span>
                        <span className="rm-info-value">{attaPosMaxDate || 'N/A'}</span>
                      </div>
                      <div className="rm-info-item">
                        <i className="fas fa-broadcast-tower rm-info-icon"></i>
                        <span className="rm-info-label">{selectedbrand} Media Data Till:</span>
                        <span className="rm-info-value">{attaMediaMaxDate || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                  {maxdatebeforerefresh && (
                    <div className="rm-info-bar mt-3">
                      <div className="rm-info-item">
                        <i className="fas fa-calendar-check rm-info-icon"></i>
                        <span className="rm-info-label">{selectedbrand} Data Available Till:</span>
                        <span className="rm-info-value">{maxdatebeforerefresh || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loader States */}
                {pushingDataFlag
                  ? <LoaderCustom text={'Pushing Data To The Working DataBase'} />
                  : <>
                    {pullingDataFlag
                      ? <LoaderCustom text={'Data Pulling is happening...'} />
                      : <>
                        {/* Non Atta Data */}
                        {newrecordstable?.length > 0 && (
                          <div className="rm-accordion-wrap mt-4">
                            <div className="rm-accordion-item">
                              <h2 className="accordion-header" id="headingNew">
                                <button
                                  className="rm-accordion-btn"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseNew"
                                  aria-expanded="true"
                                  aria-controls="collapseNew"
                                >
                                  <span className="rm-accordion-badge">
                                    <i className="fas fa-plus-circle"></i> NEW
                                  </span>
                                  <span>New Records — {newrecordstable.length} rows, {Object.keys(newrecordstable[0]).length} columns</span>
                                </button>
                              </h2>
                              <div id="collapseNew" className="accordion-collapse show" aria-labelledby="headingNew">
                                <div className="rm-accordion-body">
                                  <div className="rm-table-wrap">
                                    <table className="rm-table">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          {Object.keys(newrecordstable[0])?.map((key, index) => (
                                            <th key={index}>{key}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {newrecordstable.map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                            <td>{rowIndex + 1}</td>
                                            {Object.keys(row).map((key, colIndex) => (
                                              <td key={colIndex}>{row[key]}</td>
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

                        {/* Atta Data */}
                        <div className="rm-accordion-wrap mt-4">
                          {posData?.length > 0 && (
                            <div className="rm-accordion-item mb-3">
                              <h2 className="accordion-header" id="headingPos">
                                <button
                                  className="rm-accordion-btn collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapsePos"
                                  aria-expanded="false"
                                  aria-controls="collapsePos"
                                >
                                  <span className="rm-accordion-badge rm-badge-blue">
                                    <i className="fas fa-chart-bar"></i> POS
                                  </span>
                                  <span>POS New Records — {totalPosData} rows, {totalPosColumnCount} columns</span>
                                </button>
                              </h2>
                              <div id="collapsePos" className="accordion-collapse collapse" aria-labelledby="headingPos">
                                <div className="rm-accordion-body">
                                  <div className="rm-table-wrap">
                                    <table className="rm-table">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          {Object.keys(posData[0])?.map((key, idx) => (
                                            <th key={idx}>{key}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {posData.map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                            <td>{rowIndex + 1}</td>
                                            {Object.keys(row).map((key, colIndex) => (
                                              <td key={colIndex}>{row[key]}</td>
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

                          {mediaData?.length > 0 && (
                            <div className="rm-accordion-item mb-3">
                              <h2 className="accordion-header" id="headingMedia">
                                <button
                                  className="rm-accordion-btn collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseMedia"
                                  aria-expanded="false"
                                  aria-controls="collapseMedia"
                                >
                                  <span className="rm-accordion-badge rm-badge-purple">
                                    <i className="fas fa-film"></i> MEDIA
                                  </span>
                                  <span>Media New Records — {totalMediaData} rows, {totalMediaColumnCount} columns</span>
                                </button>
                              </h2>
                              <div id="collapseMedia" className="accordion-collapse collapse" aria-labelledby="headingMedia">
                                <div className="rm-accordion-body">
                                  <div className="rm-table-wrap">
                                    <table className="rm-table">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          {Object.keys(mediaData[0])?.map((key, idx) => (
                                            <th key={idx}>{key}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {mediaData.map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                            <td>{rowIndex + 1}</td>
                                            {Object.keys(row).map((key, colIndex) => (
                                              <td key={colIndex}>{row[key]}</td>
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
      </div>

      <style>{`
        .rm-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--rr-text-main);
        }

        /* Breadcrumb */
        .rm-breadcrumb {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--rr-accent);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        /* Header Card */
        .rm-header-card,
        .rm-filter-card {
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 16px;
        }
        .rm-header-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          margin-bottom: 16px;
          background: var(--rr-topbar-grad);
        }
        .rm-header-left {
          min-width: 0;
        }

        /* Page Title */
        .rm-page-title {
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--rr-text-main);
        }
        .rm-page-subtitle {
          margin-top: 8px;
          max-width: 880px;
          color: var(--rr-text-muted);
          font-size: 15px;
          line-height: 1.65;
          font-weight: 400;
        }

        /* Filter Card */
        .rm-filter-card {
          padding: 20px;
          margin-bottom: 16px;
        }

        /* Label */
        .rm-label {
          display: inline-block;
          margin-bottom: 8px;
          color: var(--rr-text-main);
          font-size: 15px;
          font-weight: 600;
        }

        /* Submit Button */
        .rm-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 20px;
          border-radius: 9999px;
          border: none;
          color: #FFFFFF;
          background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
          font-size: 17px;
          font-weight: 700;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 4px 16px rgba(13, 124, 102, 0.25);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .rm-submit-btn span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .rm-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px rgba(13, 124, 102, 0.30);
        }
        .rm-submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* React-Select via classNamePrefix */
        .rm-select__control {
          min-height: 44px !important;
          border-radius: 8px !important;
          border: 1px solid var(--rr-border) !important;
          background: var(--rr-bg-soft) !important;
          box-shadow: none !important;
          font-size: 15px;
        }
        .rm-select__control:hover {
          border-color: rgba(13, 124, 102, 0.40) !important;
        }
        .rm-select__control--is-focused {
          border-color: #0D7C66 !important;
          box-shadow: 0 0 0 3px rgba(13, 124, 102, 0.16) !important;
        }
        .rm-select__single-value,
        .rm-select__input-container,
        .rm-select__placeholder {
          color: var(--rr-text-main) !important;
          font-size: 15px;
        }
        .rm-select__placeholder {
          color: var(--rr-text-muted) !important;
        }
        .rm-select__menu {
          background: var(--rr-bg-soft) !important;
          border: 1px solid var(--rr-border) !important;
          border-radius: 12px !important;
          overflow: hidden;
          z-index: 40 !important;
        }
        .rm-select__option {
          background: var(--rr-bg-soft) !important;
          color: var(--rr-text-main) !important;
          font-size: 15px;
        }
        .rm-select__option--is-focused {
          background: rgba(13, 124, 102, 0.08) !important;
        }
        .rm-select__option--is-selected {
          background: rgba(13, 124, 102, 0.15) !important;
          color: #0D7C66 !important;
          font-weight: 600;
        }

        /* Dark theme select overrides */
        .dark-theme .rm-select__placeholder,
        .dark-theme .rm-select__single-value,
        .dark-theme .rm-select__input-container {
          color: var(--rr-text-main) !important;
        }
        .dark-theme .rm-select__control:hover {
          border-color: rgba(23, 162, 184, 0.40) !important;
        }
        .dark-theme .rm-select__control--is-focused {
          border-color: #17A2B8 !important;
          box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.15) !important;
        }
        .dark-theme .rm-select__option--is-focused {
          background: rgba(23, 162, 184, 0.08) !important;
        }
        .dark-theme .rm-select__option--is-selected {
          background: rgba(23, 162, 184, 0.15) !important;
          color: #17A2B8 !important;
        }

        /* Info Bar */
        .rm-info-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 14px 18px;
          background: linear-gradient(135deg, rgba(13,124,102,0.05), rgba(23,162,184,0.05));
          border: 1px solid rgba(13,124,102,0.15);
          border-radius: 12px;
        }
        .rm-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .rm-info-icon {
          color: var(--rr-accent);
          font-size: 14px;
        }
        .rm-info-label {
          color: var(--rr-text-muted);
          font-weight: 500;
        }
        .rm-info-value {
          color: var(--rr-accent);
          font-weight: 700;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
        }

        /* Accordion */
        .rm-accordion-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rm-accordion-item {
          background: var(--rr-bg-soft);
          border: 1px solid var(--rr-border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--rr-shadow);
        }
        .rm-accordion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: linear-gradient(135deg, var(--rr-bg-panel), var(--rr-bg-soft));
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--rr-text-main);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .rm-accordion-btn:hover {
          background: linear-gradient(135deg, rgba(13,124,102,0.04), rgba(23,162,184,0.04));
        }
        .rm-accordion-btn:not(.collapsed) {
          background: linear-gradient(135deg, rgba(13,124,102,0.08), rgba(23,162,184,0.05));
          color: var(--rr-accent);
        }
        .rm-accordion-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(13,124,102,0.1);
          color: #0D7C66;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .rm-badge-blue {
          background: rgba(37,99,235,0.1);
          color: #2563eb;
        }
        .rm-badge-purple {
          background: rgba(139,92,246,0.1);
          color: #8b5cf6;
        }
        .rm-accordion-body {
          padding: 0 20px 16px 20px;
        }

        /* Table */
        .rm-table-wrap {
          max-height: 600px;
          overflow: auto;
          border-radius: 10px;
          border: 1px solid var(--rr-border);
        }
        .rm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .rm-table thead {
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .rm-table thead th {
          background: var(--rr-bg-soft);
          color: var(--rr-text-main);
          padding: 12px;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 1px solid var(--rr-border);
          border-right: 1px solid var(--rr-border);
        }
        .rm-table thead th:last-child {
          border-right: none;
        }
        .rm-table tbody tr {
          border-bottom: 1px solid var(--rr-border);
        }
        .rm-table tbody tr:last-child {
          border-bottom: none;
        }
        .rm-table tbody td {
          padding: 12px;
          white-space: nowrap;
          color: var(--rr-text-main);
          font-size: 14px;
          font-weight: 500;
          border-bottom: 1px solid var(--rr-border);
          border-right: 1px solid var(--rr-border);
          background: transparent;
        }
        .rm-table tbody td:last-child {
          border-right: none;
        }

        /* Dark theme overrides */
        .dark-theme .rm-submit-btn {
          background: linear-gradient(135deg, #17A2B8 0%, #138496 100%);
          box-shadow: 0 4px 16px rgba(23, 162, 184, 0.25);
        }
        .dark-theme .rm-submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(23, 162, 184, 0.30);
        }
        .dark-theme .rm-info-bar {
          background: linear-gradient(135deg, rgba(23,162,184,0.08), rgba(13,124,102,0.08));
          border-color: rgba(23,162,184,0.2);
        }
        .dark-theme .rm-accordion-btn:not(.collapsed) {
          background: rgba(23,162,184,0.1);
          color: #17A2B8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .rm-header-card,
          .rm-filter-card {
            border-radius: 12px;
          }
          .rm-header-card {
            padding: 16px;
          }
          .rm-page-title {
            font-size: 1.4rem;
          }
          .rm-filter-card {
            padding: 16px;
          }
          .rm-submit-btn {
            width: 100%;
          }
          .rm-info-bar {
            flex-direction: column;
          }
        }
      `}</style>
    </>

  )
}

export default RefreshModel