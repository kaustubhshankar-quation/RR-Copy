
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Calendar, momentLocalizer } from 'react-big-calendar'

import Select from "react-select";
import dayjs from 'dayjs'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import getNotification from "../../Redux/Action/action";
import { useDispatch } from 'react-redux';
import axios from 'axios'
//import 'react-big-calendar/lib/sass/styles';
//import 'react-big-calendar/lib/addons/dragAndDrop/styles';
import './MyCalendar.css';
import UserService from '../../services/UserService';
import FooterPages from '../Footer/FooterPages';
import Navbar3 from '../Navbars/Navbar3';
import SubNavbar from '../Navbars/SubNavbar';
const localizer = momentLocalizer(moment);
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;


function EventManagement() {
    const fileTypes = [".XLS", ".XLSX", ".DOCX", ".PPT", ".PDF"];
    const [brandoptions, setbrandoptions] = useState([

    ]);
    const [dateforloadcampaign, setdateforloadcampaign] = useState({ start: "01/03/2024", end: "31/03/2024" })
    const [tacticlist, settacticlist] = useState([]);
    const [brandlist1, setbrandlist1] = useState("");
    const [events, setevents] = useState([
        {
            campaignid: 1,
            'title': 'Campaign 1',
            'brand': 'Harrier',
            'variabletype': 'Harrier Print Advertisement',
            'details': "Sale at 10% discount",

            'allDay': true,
            'start': new Date(2024, 2, 1),
            'end': new Date(2024, 2, 3),

            'spend': "120 cr",


            attachments: [
                { name: 'File1', url: 'https://example.com/file1.pdf' }]
        },
        {
            campaignid: 2,
            'title': 'Campaign 2',
            'brand': 'Harrier',
            'variabletype': 'Harrier TV Advertisement',
            'details': "Sale at 20% discount  ",

            'allDay': true,
            'start': new Date(2024, 2, 16),
            'end': new Date(2024, 2, 18),

            'spend': "120 cr",

            attachments: [
                { name: 'File1', url: 'https://example.com/file1.pdf' }
                // Add more attachments as needed
            ],
        },

    ]);
    const [SelectedEvent, setSelectedEvent] = useState([]);
    const [eventscreen, seteventscreen] = useState([])
    const [positionX, setpositionX] = useState('');
    const [positionY, setpositionY] = useState('');

    const [dateRange, setDateRange] = useState({
        end: moment().format('YYYY-MM-DD'), start: moment().format('YYYY-MM-DD')
    });
    const [addeventobject, setaddeventobject] = useState({ allDay: true })
    const [editeventobject, setediteventobject] = useState({ allDay: true })
    // const [customStartDate, setCustomStartDate] = useState(new Date());
    // const [customEndDate, setCustomEndDate] = useState('');
    const [viewagenda, setviewagenda] = useState(false)
    const dispatch = useDispatch();
    const [filteredevents, setFilteredevents] = useState([]);

    // useEffect(() => {
    //     if (UserService.isLoggedIn()) {
    //         handlebrandmenu()
    //         handletacticmenu()
    //         loadcampaigns()
        
    //     }
    //     else {

    //         UserService.doLogin({
    //             redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
    //         })

    //     }
    // }, [])

    const loadcampaigns = async () => {
        if (UserService.isLoggedIn()) {
            try {
                const FormData = require("form-data");
                const sendData = new FormData();
                sendData.append("jwttoken", UserService.getToken());
                sendData.append("startdate", dateforloadcampaign.start)
                sendData.append("enddate", dateforloadcampaign.end)
                const config = {
                    method: "post",
                    url: `${REACT_APP_UPLOAD_DATA}/eventmanagement/loadcampaigns`,
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                    },
                    data: sendData,
                };
                const getResponse = await axios(config);
                console.log(getResponse)
                if (getResponse.data !== "Invalid User!" && getResponse.data[0].Data !== "42703: column ca.spends does not exist\n\nPOSITION: 96") {
                    setevents(getResponse.data)
                }
                else if (getResponse.data[0].Data === "42703: column ca.spends does not exist\n\nPOSITION: 96") { dispatch(getNotification({ message: "Unable to fetch campaigns.Please try again later!", type: "danger" })) }
            } catch (err) {
                console.log("Server Error", err);
                if (err.response && err.response.status === 500) {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 400) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 422) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 404) {
                    dispatch(
                        getNotification({
                            message: "Page not Found",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 401) {
                    dispatch(
                        getNotification({
                            message: "Session expired! Please log in again",
                            tactic: "default",
                        })
                    );
                } else {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
                        })
                    );
                }
            }
        } else {
            setTimeout(() => {
                UserService.doLogin({
                    redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
                });
            }, 1000);
        }
    }
    function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
    const addcampaigns = async () => {
        if (UserService.isLoggedIn()) {
            try {
                const FormData = require("form-data");
                const sendData = new FormData();
                sendData.append("jwttoken", UserService.getToken());
                sendData.append("startdate", addeventobject.start)
                sendData.append("enddate", addeventobject.end)
                sendData.append("title", addeventobject.title)
                sendData.append("campaignid",getCurrentTimestamp())
                sendData.append("variabletype", addeventobject.variabletype)
                sendData.append("details", addeventobject.details)
                sendData.append("spends", addeventobject.spend)
                const config = {
                    method: "post",
                    url: `${REACT_APP_UPLOAD_DATA}/eventmanagement/addcampaigns`,
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                    },
                    data: sendData,
                };
                const getResponse = await axios(config);
                console.log(getResponse)
                if (getResponse.data !== "Invalid User!" && getResponse.data[0].Data !== "42703: column \"spends\" of relation \"tbl_campaigns\" does not exist\n\nPOSITION: 89") {
                    dispatch(getNotification({ message: "Saved successfully!", type: "success" }))
                    loadcampaigns()
                    document.getElementById('addcampaignclosebtn').click()
                }
                else if (getResponse.data[0].Data === "42703: column ca.spends does not exist\n\nPOSITION: 96") { dispatch(getNotification({ message: "Unable to addcampaigns.Please try again later!", type: "danger" })) }
            } catch (err) {
                console.log("Server Error", err);
                if (err.response && err.response.status === 500) {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 400) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 422) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 404) {
                    dispatch(
                        getNotification({
                            message: "Page not Found",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 401) {
                    dispatch(
                        getNotification({
                            message: "Session expired! Please log in again",
                            tactic: "default",
                        })
                    );
                } else {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
                        })
                    );
                }
            }
        } else {
            setTimeout(() => {
                UserService.doLogin({
                    redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
                });
            }, 1000);
        }
    }

    const handleEventClick = (events) => {

        const parentEventDiv = document.getElementById(`parenteventdiv-${events.id}`);
        const rect = parentEventDiv.getBoundingClientRect();

        // console.log('Position of clicked element:', {
        //   top: rect.top + window.scrollY,
        //   left: rect.left + window.scrollX,
        //   bottom: rect.bottom + window.scrollY,
        //   right: rect.right + window.scrollX,
        // });

        setpositionY(rect.top + window.scrollY + 40 + 'px');
        setpositionX(rect.left + window.scrollX + 40 + 'px');
        setSelectedEvent(events);
        // setclickscreen(parentEventDiv);

        if (!eventscreen[events.id]) {
            let arr = [];
            arr[events.id] = 1;
            seteventscreen(arr);

            // Attach a click event listener to the entire document to close the event details
            //document.addEventListener('click', handleDocumentClick);
        } else {
            let arr = [];
            arr[events.id] = 0;
            seteventscreen(arr);
            // Remove the click event listener when closing the event details
            //document.removeEventListener('click', handleDocumentClick);
        }

        function handleDocumentClick(event) {
            // Check if the clicked element is outside the parent event div
            if (
                event.target !== parentEventDiv &&
                !parentEventDiv.contains(event.target)
            ) {
                // Close the event details
                let arr = [];
                seteventscreen(arr);

                // Remove the click event listener
                document.removeEventListener('click', handleDocumentClick);
            }
        }
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
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 400) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 422) {
                    dispatch(
                        getNotification({
                            message: "Input is not in prescribed format",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 404) {
                    dispatch(
                        getNotification({
                            message: "Page not Found",
                            tactic: "default",
                        })
                    );
                } else if (err.response && err.response.status === 401) {
                    dispatch(
                        getNotification({
                            message: "Session expired! Please log in again",
                            tactic: "default",
                        })
                    );
                } else {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
                        })
                    );
                }
            }
        } else {
            setTimeout(() => {
                UserService.doLogin({
                    redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
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
                    url: `${REACT_APP_UPLOAD_DATA}/eventmanagement/getspends`,
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                    },
                    data: sendData,
                };
                const getResponse = await axios(config);
                //console.log(getResponse)
                if (getResponse.data !== "Invalid User!") {
                    settacticlist(getResponse.data);
                    setaddeventobject({ ...addeventobject, variabletype: getResponse.data[0].spend_to_display })
                }
            } catch (err) {
                console.log("Server Error", err);
                if (err.response && err.response.status === 500) {
                    dispatch(
                        getNotification({
                            message: "Server is Down! Please try again after sometime",
                            tactic: "default",
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
                            tactic: "default",
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
                    redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
                });
            }, 1000);
        }
    };
    const EventComponent = ({ event }) => (
        <>
            <div className='' >
                {/* <a href={event.eventwebsite} target="_blank" rel="noopener noreferrer">       */}
                <h6 style={{ color: " #f15e23" }} className='eventcontainerparent' id={`parenteventdiv-${event.id}`}>
                    {event.title}
                </h6>

                {/* </a> */}
            </div>


        </>



    );

    const handleFileInputChange = (calendarEvent) => {
        // Trigger the file input click
        const fileInput = document.getElementById(`fileInput-${calendarEvent.id}`);
        fileInput.click();
    };

    const handleFileUpload = (event, calendarEvent) => {

        if (calendarEvent === "add") {
            const files = event.target.files;
            const updatedEvent = {
                ...addeventobject,
                attachments: addeventobject.attachments
                    ? [...addeventobject.attachments, ...Array.from(files).map((file) => {
                        return { name: file.name, url: URL.createObjectURL(file) };
                    })]
                    : Array.from(files).map((file) => {
                        return { name: file.name, url: URL.createObjectURL(file) };
                    })
            };

            setaddeventobject(updatedEvent)
        }
        else if (calendarEvent === "edit") {

            const files = event.target.files;
            const updatedEvent = {
                ...editeventobject,
                attachments: editeventobject.attachments
                    ? [...editeventobject.attachments, ...Array.from(files).map((file) => {
                        return { name: file.name, url: URL.createObjectURL(file) };
                    })]
                    : Array.from(files).map((file) => {
                        return { name: file.name, url: URL.createObjectURL(file) };
                    })
            };
            setediteventobject(updatedEvent)
        }
        else {
            const file = event.target.files[0];
            const updatedEvents = events.map((evt) =>
                evt === calendarEvent
                    ? {
                        ...evt,
                        attachments: [...evt.attachments, { name: file.name, url: URL.createObjectURL(file) }],
                    }
                    : evt
            );
            setevents(updatedEvents);
            //console.log(updatedEvents.filter((evt) => evt.title === calendarEvent.title))
            setSelectedEvent(updatedEvents.filter((evt) => evt.title === calendarEvent.title)[0])


            dispatch(getNotification({ message: `File is added to ${calendarEvent.title}`, type: "success" }))
        }

    };

    const handleViewChange = (view, newDate) => {
        if (view === "agenda") {
            setviewagenda(true);
            setDateRange({ start: moment().startOf('month').format('YYYY-MM-DD'), end: moment().endOf('month').format('YYYY-MM-DD') })
            document.querySelector(".rbc-toolbar-label").classList.add("d-none")
            //  document.querySelector(".rbc-toolbar-label").innerHTML=`<input className='rounded mx-2 mb-1 p-1' type="date" value={dateRange.end} onChange={handleEndDateChange}/>`;
            document.querySelector(".rbc-toolbar").classList.add("d-flex")
            document.querySelector(".rbc-toolbar").classList.add("justify-content-between")
        }
        else {
            setviewagenda(false)
            document.querySelector(".rbc-toolbar-label").classList.remove("d-none")
        }
        let arr = []
        seteventscreen(arr)

    };

    const handleRangeChange = (range) => {
        //console.log(range)
        setDateRange({ start: moment(range.start).format('YYYY-MM-DD'), end: moment(range.end).format('YYYY-MM-DD') });
    };
    const handleNavigate = (date, view) => {
        //console.log('Navigation:', date, view);
        let arr = []
        seteventscreen(arr)
        // Do something with the new date and view (today, back, next)

    };

    const handleStartDateChange = (e) => {
        const formattedStartDate = moment(e.target.value).format('YYYY-MM-DD');
        //console.log(formattedStartDate)
        setDateRange((prevRange) => ({ ...prevRange, start: formattedStartDate }));

    };

    const handleEndDateChange = (e) => {
        const formattedEndDate = moment(e.target.value).format('YYYY-MM-DD');
        //console.log(dateRange)
        setDateRange((prevRange) => ({ ...prevRange, end: formattedEndDate }));
    };

    const filteredEvents = events.filter((event) => {
        return (
            moment(event.start).isBetween(dateRange.start, dateRange.end, null, '[]') ||
            moment(event.end).isBetween(dateRange.start, dateRange.end, null, '[]')
        );
    });

    //console.log('Filtered Events:', filteredEvents);
    const submitaddevent = () => {

    }
    const handledeletefile = (filename, type) => {
        if (type === "add") {
            const updatedEvent = {
                ...addeventobject, attachments: addeventobject.attachments.filter((item) => {
                    return item.name !== filename
                })
            }
            //console.log(updatedEvent)
            setaddeventobject(updatedEvent)
        }
        else {
            const updatedEvent = {
                ...editeventobject, attachments: editeventobject.attachments.filter((item) => {
                    return item.name !== filename
                })
            }
            //console.log(updatedEvent)
            setediteventobject(updatedEvent)
        }
        console.log(filename)
    }

    const handleaddEvent = (events) => {
        let arr = []
        seteventscreen(arr)
        //console.log("h");
        //handlebrandmenu();
        //handletacticmenu();
        document.getElementById("addeventbutton").click();
        setaddeventobject({ ...addeventobject, start: moment(events.slots[0]).format('YYYY-MM-DD'), end: moment(events.slots[0]).format('YYYY-MM-DD') })


    }
    const editEventtoDb = async () => {
        if (UserService.isLoggedIn()) {
            try {
                const FormData = require("form-data");
                const sendData = new FormData();
                sendData.append("jwttoken", UserService.getToken());
                sendData.append("campaignid", "");
                sendData.append("title", addeventobject.title);
                //sendData.append("type", addeventobject.tactic);
                sendData.append("variabletype", addeventobject.variabletype);
                sendData.append("details", addeventobject.details);
                sendData.append("startdate", addeventobject.start);
                sendData.append("enddate", addeventobject.end);
                sendData.append("starttime", "");
                sendData.append("endtime", "");
                sendData.append("circulation", addeventobject.circulation);
                sendData.append("spend", addeventobject.spend);
                sendData.append("camp_month", "");


                const config = {
                    method: "post",
                    url: `${REACT_APP_UPLOAD_DATA}/eventmanagement/addcampaigns`,
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                    },
                    data: sendData,
                };
                const getResponse = await axios(config);


                //   jwttoken: UserService.getToken(),
                //   brand: selectedbrand,
                //   fin_year: selectedyear,
                // };
                // const config = {
                //   method: "post",
                //   url: `${REACT_APP_UPLOAD_DATA}/Simulation/get_base_scenariodata`,
                //   headers: {
                //     accept: "text/plain",
                //     "Content-Type": "application/json",
                //   },
                //   data: requestData,
                // };
                //const getResponse = await axios(config);
                console.log(getResponse);
                //handleMouseLeave();
                if (getResponse.status === 200) {
                    if (getResponse.data.length > 0) {

                        setevents(getResponse.data)
                    } else {
                        dispatch(
                            getNotification({
                                message: `There are no events for this year  `,
                                type: "default",
                            })
                        );
                    }
                }
            } catch (err) {
                console.log("Server Error", err);
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
        } else {
            setTimeout(() => {
                UserService.doLogin({
                    redirectUri: `${REACT_APP_REDIRECT_URI}/eventmanagement`,
                });
            }, 1000);
        }
        //setloader(false);
    };


    return (
        <>
              <button className="d-none" id="addeventbutton" data-toggle="modal"
                data-target="#exampleModal">Add Event </button>
            <div
                class="modal  bd-example-modal-lg"
                id="exampleModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
                            <h6 class="modal-title" id="exampleModalLabel">
                                Add Event
                            </h6>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <div className='row'>
                                <div className='my-3 '>
                                    <label className='headingcolor ml-2'>Start Date: </label>
                                    <input
                                        className="rounded pl-1 ml-4"
                                        type="date"
                                        style={{ border: "1px solid grey" }}
                                        value={addeventobject.start}
                                        onChange={(e) => {

                                            setaddeventobject({ ...addeventobject, start: new Date(e.target.value) })
                                        }}
                                    />

                                    <i class='mx-5 fas fa-arrow-right'></i>
                                    <span className=''>
                                        <label className='headingcolor '>End Date: </label>
                                        <input
                                            type="date"
                                            className="rounded pl-1 ml-5"
                                            style={{ border: "1px solid grey" }}
                                            value={addeventobject.end}
                                            onChange={(e) => { setaddeventobject({ ...addeventobject, end: new Date(e.target.value) }) }}
                                        /></span>

                                </div>

                                <div className='col-sm-6'>
                                    <label className='headingcolor'>Title: </label>
                                    <input
                                        type="text"
                                        placeholder='Enter Title upto 30 characters'
                                        className="form-control"
                                        value={addeventobject.title}
                                        onChange={(e) => { if (e.target.value.length < 30) { setaddeventobject({ ...addeventobject, title: e.target.value }) } }}
                                    />
                                    <div className=" ">
                                        <label className='headingcolor'>Brand:</label>
                                        <Select
                                            placeholder="Select Brand"
                                            options={brandoptions}
                                            onChange={(value) => {

                                                setaddeventobject({ ...addeventobject, brand: value.value })
                                            }}
                                        />{" "}
                                    </div>

                                    {/* <label className='headingcolor'>Tactic: </label>

                                    <select
                                        type="text"
                                        className="form-control"
                                        value={addeventobject.tactic}
                                        onChange={(e) => {
                                            setaddeventobject({ ...addeventobject, tactic: e.target.value }); console.log(tacticlist?.filter((item) => {
                                                return item.Spend_to_Display === addeventobject.tactic

                                            })[0].subcategory);
                                        }}
                                    >
                                        {tacticlist?.map((item) => {
                                            return <option>{item.Spend_to_Display}</option>
                                        })}
                                    </select> */}


                                    <label className='headingcolor'>Event / Campaign: </label>

                                    <select
                                        type="text"
                                        className="form-control"
                                        value={addeventobject.variabletype}
                                        onChange={(e) => { console.log(); setaddeventobject({ ...addeventobject, variabletype: e.target.value }) }}
                                    >

                                        {tacticlist.length > 0 && tacticlist?.map((item) => {

                                            return <option>{item.spend_to_display}</option>

                                        })
                                        }

                                    </select>
                                    {/* <input
                                        type="text"
                                        className="form-control"
                                        value={addeventobject.variabletype}
                                        onChange={(e) => {setaddeventobject({ ...addeventobject, variabletype: e.target.value }) }}
                                    /> */}


                                    <label className='headingcolor'>Campaign Details: </label>
                                    <textarea
                                        rows="3"
                                        type="text"
                                        className="form-control"
                                        value={addeventobject.details}
                                        onChange={(e) => { setaddeventobject({ ...addeventobject, details: e.target.value }) }}
                                    />





                                    <label className='headingcolor'> Spend: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addeventobject.spend}
                                        onChange={(e) => { setaddeventobject({ ...addeventobject, spend: e.target.value }) }}
                                    />


                                </div>
                                <div className='col-sm-6'>
                                    <label className='headingcolor'>Files
                                        :</label>

                                    {addeventobject.attachments?.length > 0 &&
                                        <table className='table my-3'>
                                            <thead>
                                                <th className='headingcolor'>S. No.</th>
                                                <th className='headingcolor'>File Name</th>
                                                <th className='headingcolor'>Action</th>
                                            </thead>
                                            <tbody>
                                                {addeventobject.attachments?.map((item, index) => {
                                                    return <tr><td>{index + 1}</td><td>{item.name}</td> <td onClick={() => handledeletefile(item.name, "add")}>Delete</td> </tr>
                                                })}

                                            </tbody>
                                        </table>
                                    }
                                    Add files...
                                    <input className="form-control" accept={fileTypes} type="file" multiple onChange={(e) => handleFileUpload(e, "add")}></input>
                                    <button className='btn btn-sm btn-success float-end my-2'>Upload</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary btn-sm"
                                data-dismiss="modal"
                                id="addcampaignclosebtn"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary btn-sm"
                                onClick={() => {
                                    // if (addeventobject.title && addeventobject.tactic && addeventobject.variabletype && addeventobject.start && addeventobject.end && addeventobject.circulation && addeventobject.spend) {
                                    //     console.log("h")
                                    //     dispatch(getNotification({
                                    //         message: "Please enter all details",
                                    //         type: "default"
                                    //     }))
                                    // } else {
                                  addcampaigns()

                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="modal  bd-example-modal-lg"
                id="ModalEdit"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div class="modal-header" style={{ backgroundColor: "#f2f2f2" }}>
                            <h6 class="modal-title" id="exampleModalLabel">
                                Edit Event
                            </h6>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <div className='row'>
                                <div className='my-4'>
                                    <label className="headingcolor">Start Date: </label>
                                    <input
                                        className="rounded  m-2 pl-1"
                                        type="date"
                                        style={{ border: "1px solid grey" }}
                                        value={moment(editeventobject.start).format("YYYY-MM-DD")}
                                        onChange={(e) => {
                                            setediteventobject({ ...editeventobject, start: new Date(e.target.value) })
                                        }}
                                    />

                                    <i class='mx-5 fas fa-arrow-right'></i>
                                    <span className=''>
                                        <label className="headingcolor">End Date: </label>
                                        <input
                                            type="date"
                                            style={{ border: "1px solid grey" }}
                                            className="rounded m-2 pl-1"
                                            value={moment(editeventobject.end).format("YYYY-MM-DD")}
                                            onChange={(e) => { setediteventobject({ ...editeventobject, end: new Date(e.target.value) }) }}
                                        />

                                    </span>

                                </div>
                                <div className='col-sm-6'> <label className="headingcolor">Title: </label>
                                    <input
                                        type="text"
                                        placeholder='Enter Title upto 30 characters'
                                        className="form-control"
                                        value={editeventobject.title}
                                        onChange={(e) => { if (e.target.value.length < 30) { setediteventobject({ ...editeventobject, title: e.target.value }) } }}
                                    />
                                    <div className="">
                                        <label className='headingcolor'>Brand:</label>
                                        <Select
                                            placeholder="Select Brand"
                                            options={brandoptions}
                                            value={{ label: editeventobject.brand, value: editeventobject.brand }}
                                            onChange={(value) => {
                                                setediteventobject({ ...editeventobject, brand: value.value })
                                            }}
                                        />{" "}
                                    </div>

                                    {/* <label className="headingcolor">Tactic: </label>
                                    <select
                                        type="text"
                                        className="form-control"
                                        value={editeventobject.tactic}
                                        onChange={(e) => { console.log(editeventobject); setediteventobject({ ...editeventobject, tactic: e.target.value }) }}
                                    >
                                        {tacticlist?.map((item) => {
                                            return <option>{item.Spend_to_Display}</option>
                                        })}
                                    </select> */}


                                    <label className="headingcolor">Event / Campaign: </label>
                                    <select
                                        type="text"
                                        className="form-control"
                                        value={editeventobject.variabletype}
                                        onChange={(e) => { console.log(editeventobject); setediteventobject({ ...editeventobject, variabletype: e.target.value }) }}
                                    >

                                        {tacticlist.length > 0 && tacticlist?.map((item) => {

                                            return <option>{item.spend_to_display}</option>

                                        })
                                        }

                                    </select>


                                    <label className="headingcolor">Campaign Details: </label>
                                    <textarea
                                        rows="3"
                                        type="text"
                                        className="form-control"
                                        value={editeventobject.details}
                                        onChange={(e) => { setediteventobject({ ...editeventobject, details: e.target.value }) }}
                                    />






                                    <label className="headingcolor">Spend: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editeventobject.spend}
                                        onChange={(e) => { setediteventobject({ ...editeventobject, spend: e.target.value }) }}
                                    />

                                </div>
                                <div className='col-sm-6'> <label className='headingcolor'><span>Files :{"  "}</span></label>
                                    {editeventobject.attachments?.length > 0 &&
                                        <table className='table my-3'>
                                            <thead>
                                                <th className='headingcolor'>S. No.</th>
                                                <th className='headingcolor'>File Name</th>
                                                <th className='headingcolor'>Action</th>
                                            </thead>
                                            <tbody>
                                                {editeventobject.attachments?.map((item, index) => {
                                                    return <tr><td>{index + 1}</td><td><a key={index} href={item.eventwebsite} target="_blank" rel="noopener noreferrer">{item.name}</a></td> <td onClick={() => handledeletefile(item.name, "edit")}>Delete</td> </tr>
                                                })}

                                            </tbody>
                                        </table>
                                    }
                                    Add files...
                                    <input className="form-control" type="file" multiple accept={fileTypes} onChange={(e) => handleFileUpload(e, "edit")}></input>
                                </div>
                            </div>
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
                                    if (addeventobject.title && addeventobject.variabletype && addeventobject.start && addeventobject.end && addeventobject.circulation && addeventobject.spend) {
                                        dispatch(getNotification({
                                            message: "Please enter all details",
                                            type: "default"
                                        }))
                                    } else {
                                        submitaddevent();
                                    }
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar3/>
            <SubNavbar/>
            <div className="bgpages">
        <div className=' container py-3'>
          <div className='greentheme '>{`Dashboard >> Event Management`}</div>
          <div className='p-2 bg-white greentheme my-3' style={{ fontSize: "20px" }}><b>Saved Reports</b></div>
         
          <div className="card p-3 my-3 ">
          <div className="container p-5"  >
                <div className='row'>
                    
                    <div className='mt-4'>
                        {viewagenda && <div className='d-flex flex-row-reverse mb-2'>
                            {/* <button className="btn btn-success p-1 mb-4 " onClick={() => handleApplyFilter()}>Apply Filter</button> */}
                            <div>
                                <button className='btn btn-danger' onClick={() => setDateRange({
                                    start: moment(new Date()).format('YYYY-MM-DD'),
                                    end: moment().endOf('month').format('YYYY-MM-DD'),
                                })}> Reset</button>



                            </div>
                            <div>
                                End Date:
                                <input className='rounded mx-2 p-1 '
                                    type="date"
                                    value={dateRange.end}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                            <div>
                                Start Date:
                                <input className='rounded mx-2 p-1 '
                                    type="date"
                                    value={dateRange.start}
                                    onChange={handleStartDateChange}
                                />

                            </div>
                        </div>
                        }
                        <div>
                            <Calendar
                                className="custom-calendar"
                                localizer={localizer}
                                events={filteredEvents}
                                components={{
                                    event: EventComponent,
                                }
                                }
                                startAccessor="start"
                                endAccessor="end"
                                views={['month', 'week', 'day']}
                                style={{ height: 500 }}
                                defaultView="month"
                                onSelectEvent={handleEventClick}
                                onView={handleViewChange}
                                onNavigate={handleNavigate}
                                onSelectSlot={handleaddEvent}
                                selectable
                                onRangeChange={handleRangeChange}
                                step={60}

                            />
                        </div></div>

                </div>

            </div>
            {eventscreen[SelectedEvent.id] &&
                <>
                    <div className='campaignbox border rounded py-3 px-4 position-absolute' style={{ color: "black", top: positionY, left: positionX }} >
                        <i className='fas fa-caret-up mr-4'></i>
                        <span style={{ color: "#647f99" }}>Calender Event Details</span>
                        <hr className='hrdivider my-3 ' />
                        <h6 className="mt-2" style={{ color: "  #f15e23" }}>{SelectedEvent.title}
                            <i className='float-end fas fa-edit text-primary' data-toggle="modal"
                                data-target="#ModalEdit" onClick={() => { seteventscreen([]); setediteventobject(SelectedEvent) }}></i></h6>
                        <div className='wrap'>{SelectedEvent.details}</div>
                        <hr className='hrdivider my-3 ' />
                        {/* <div className='my-2'><b>Campaign Type:</b> {SelectedEvent.tactic}</div> */}
                        <div className='my-2'><b>Tactic:</b> {SelectedEvent.variabletype}</div>

                        <div className='my-2'><b>Estimated spend: </b>{SelectedEvent.spend} </div>
                        <div className='my-2'>
                            <span><b>Event attachments:</b> </span>
                            <span className=''>
                                {SelectedEvent.attachments?.length > 1 ? SelectedEvent.attachments?.map((file, index) => (

                                    <a key={index} href={file.eventwebsite} target="_blank" rel="noopener noreferrer">
                                        <span>{file.name.split(".")[0]},{" "}</span>
                                    </a>

                                )) :
                                    SelectedEvent.attachments?.map((file, index) => (

                                        <a key={index} href={file.eventwebsite} target="_blank" rel="noopener noreferrer">
                                            {file.name}
                                        </a>))
                                }
                            </span>
                        </div>
                        <div>
                            <hr className='hrdivider ' />
                            < button className="btn btn-sm btn-primary float-end" onClick={() => handleFileInputChange(SelectedEvent)}>Add attachments</button>
                            <input className="d-none" type="file" id={`fileInput-${SelectedEvent.id}`} onChange={(e) => handleFileUpload(e, SelectedEvent)} />
                        </div> </div> </> || null}   </div>   </div>   </div>

          
           <div>
            <FooterPages/>
           </div>
        </>
    )
}

export default EventManagement