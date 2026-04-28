import React from "react";

import { useState } from "react";

import UserService from "../../services/UserService"; import AuthService from "../../services/AuthService";
import FooterPages from "../Footer/FooterPages";
import Navbar3 from "../Navbars/Navbar3";
import SubNavbar from "../Navbars/SubNavbar";
function Support() {
  const [loader, setLoader] = useState(false);
  const [validateFirstName, setValidateFirstName] = useState(false);
  const [validateLastName, setValidateLastName] = useState(false);
  const [validateEmail, setValidateEmail] = useState(false);
  const [issuetype, setissuetype] = useState("");
  const [issuesubtype, setissuesubtype] = useState("");

  const handleissuetype = (e) => {
    setissuetype(e.target.value);
  };
  const handlesubissuetype = (e) => {
    setissuesubtype(e.target.value);
  };
  const sendData = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const organisation = document.getElementById("organisation").value.trim();
    const country = document.getElementById("Country").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const issue_type = document.getElementById("issuetype").value.trim();
    const sub_issuetype = document.getElementById("subissuetype").value.trim();
    const details = document.getElementById("details").value.trim();
    const ticketid =0;

    const cleanData = () => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("organisation").value = "";
      document.getElementById("country").value = "";
      document.getElementById("issuetype").value = "";
      document.getElementById("subissuetype").value = "";
      document.getElementById("details").value = "";
    };
  if(issue_type!=="Select" && sub_issuetype!=="Select" && details ){
   const emailBody = `

Dear Support Team,

I have recently generated Ticket ID: 3aa63ede-e10d-4f91-a0f9-8956fcdd8aec to address certain issues encountered within the application. Please find the details of the issue below:
   
   Issue Type:${issue_type}
   Sub Issue Type:${sub_issuetype}
   Details:${details}

I would greatly appreciate your prompt attention to this matter. For your convenience, I have attached relevant documents/screenshots.
   
   Best regards,
   ${name}
   ${organisation} ${country}
   ${phone}
  
            `;
         window.location.href = `mailto:support@organization.com?subject=Inquiry/Support Assistance Required - Ticket ID: ${ticketid} &body=${encodeURIComponent(
        emailBody
      )}`;
  }
    else {
      if (name === "") {
        setValidateFirstName(true);
        document.getElementById("name").focus();
        setTimeout(() => {
          setValidateFirstName(false);
        }, 3000);
      } else if (email === "") {
        setValidateEmail(true);
        document.getElementById("email").focus();
        setTimeout(() => {
          setValidateEmail(false);
        }, 3000);
      }   else if (issue_type === "Select") {
        alert("Please provide issue type");
      } else if (sub_issuetype === "Select") {
        alert("Please provide sub issue type");
      }
      else if (details === "") {
        alert("Please provide issue details.");
      }
   
    }
  };
  return (
    <>
    <Navbar3/>
    <SubNavbar/>
    <div className="bgpages">
    <div className=' container py-2'>
          <div className='greentheme '>{`Dashboard >> Support`}</div>
          <div className='p-2 bg-white greentheme my-3' style={{ fontSize: "20px" }}><b>Support</b></div>
          </div>
          <div className="container">
       <div className="card  p-3">
      
      You may call us at +91-80-49568423 or mail us at Contactus@quation.in
      </div>      
          </div>
     
      
    </div>
    {/* <div className="bgpages">
        <div className=' container py-3'>
          <div className='greentheme '>{`Dashboard >> Support`}</div>
          <div className='p-2 bg-white greentheme my-3' style={{ fontSize: "20px" }}><b>Support</b></div>
         
          <div className="card p-3 my-3 ">
          <div className="d-flex justify-content-between">
                <div className="mb-3  contactSpace">
                  <label>Issue Type<span className="text-danger">*</span>

                  </label>
                  <select
                    id="issuetype"
                    className="form-select p-2"
                    
                         placeholder="Select Here"
                    onChange={(e) => handleissuetype(e)}
                  >
                    <option selected>Select</option>
                    <option>Technical</option>
                    <option>Non Technical</option>
                  </select>
                
                </div>
                <div className="mb-3  contactSpace">
                <label htmlFor="floatingInput">
                    Issue Sub Type<span className="text-danger">*</span>
                  </label>
                  <select
                    id="subissuetype"
                    className="form-select p-2"
                    defaultValue="Issue Sub Type"
                    placeholder="Select Here"
                    onChange={(e) => handlesubissuetype(e)}
                  >
                    <option selected>Select</option>
                    {issuetype === "Technical" ? (
                      <>
                        <option>Competitive Analysis Issues</option>
                        <option>Brand Analysis Issues</option>
                        <option>Simulator Issues</option>
                        <option>Optimizer Issues</option>
                      </>
                    ) : (
                      <>
                        <option>Profile Issues</option>
                        <option>Database Configuration</option>
                        <option>Subscription</option>
                        
                      </>
                    )}
                  </select>
                
                </div>
                
              <div className="mb-3 contactSpace">
              <label htmlFor="floatingInput">Phone Number<span className="text-danger">*</span> </label>

                <input
                  type="tel"
                  className="form-control p-2"
                  id="phone"
                  placeholder="Enter Here"
                />
              </div>
              </div>
              <div className=" mb-3 ">
                <label>Details of your issue/Feedback<span className="text-danger">*</span></label>
                <textarea
                  className="form-control mt-2 "
                  type="text"
                  rows={5}
                  id="details"
                  placeholder="Details of your issue/Feedback"
                />
              </div>
              
         
              <div className="form-floating mb-3 contactSpace">
                <input
                  type="text"
                  className=" d-none form-control"
                  id="Country"
                  defaultValue={"India"}
                  placeholder="name@example.com"
                />
       
              </div>

              <div className="mx-auto my-3">
              <button className="btngreen " onClick={()=>{}}>Submit<span className="
     
     sidearrow
        ">
                                                &rsaquo;
                                            </span></button>
            </div>
          </div>
          </div>
           </div> */}
    
     <FooterPages/>
    </>
  );
}

export default Support;
