import React, { useEffect,useState,useRef,createRef } from "react";
import { getCookie } from '../../services/DataRequestService.js';
import { Link, useLocation } from "react-router-dom";
import UserService from "../../services/UserService.js";
import mmxlogo from "../../Assets/Images/logo.webp"
import getNotification from "../../Redux/Action/action.js";
import { useDispatch } from "react-redux";
import AuthService from "../../services/AuthService.js";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

function Navbar({scrollToSection}) {
  const usernameRef = useRef();
  const passwordRef = createRef();
  const agreementRef = useRef();

  const dispatch = useDispatch();
  const [logindata,setlogindata]=useState({})
const location=useLocation()
 
const submitLogin = () => {
  try {    
    if (agreementRef.current.checked) {
      AuthService.login({ username: usernameRef.current.value, password: passwordRef.current.value });
      console.log('success', 'Logged in Successfully', 'Logged in Successfully');
    }
    else {
      console.log('danger', 'Please accept Agreement', 'Terms and Conditions');
    }

  } catch(error) {
    console.log('danger', 'Please c Agreement', 'Terms and Conditions');
  }
}
 
const onClose=()=>{

}
  return (
    <>
   <div className="modal-overlay" onClick={onClose}></div>
 
 <div id="login" class="modal">
   
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body modal-body1">
            <div class="motit">
              <button type="button" class="close"><iconify-icon icon="material-symbols:close"></iconify-icon></button>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="loginwhitebg">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <div class="loginiconbg">
                    <img src="/Assets/Images/loginicon1.webp"  class="max" alt="Revenue Radar" /><br />Login
                  </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <div class="form-group1 my-2">
                  <input ref={usernameRef} type="text" class="form-control form-control1" id="username" placeholder="Enter Your username" />
                  </div>
                  <div class="form-group1">
                    <input ref={passwordRef} type="password" class="form-control form-control1" id="password" placeholder="Enter Your Password" />
                  </div>
                  <div class="forgotpwd">
                    <a href="#" aria-label="DE">Forgot Password?</a>
                  </div>
                  <div class="form-group">
                    <div class="checkbox mx-1 my-auto">
                      <label><input ref={agreementRef} className="mx-1 my-auto" type="checkbox" id="agreement" />I agree to the Terms of Service and Privacy Policy.</label>
                    </div>
                  
                  </div>
                  <div class="form-group">
                    <div class="connectbtn">
                      <a onClick={submitLogin} href='#' aria-label="DE">Login <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>


                  </div>
                  <div class="noaccount">
                    <a href="#" aria-label="DE">Don’t Have An Account?</a>
                  </div>
                  <div class="createaccount">
                    <a onClick={""} className='open-signup' aria-label="DE">Create Account Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
   
{ location.pathname !== "/dashboard"  && 
      <nav className="navbar navbar-expand-sm sticky-top navbar-light" style={{ zIndex: 4 ,backgroundColor:""}}>
        <a className="navbar-brand " href="/">
          <img src={mmxlogo} REACT_APP_UPLOAD_DATA />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="">
          <div style={{width: "30px",height: "3px", backgroundColor:"white",margin:"6px"}}></div>
          <div style={{width: "30px",height: "3px", backgroundColor:"white",margin:"6px"}}></div>
          <div style={{width: "30px",height: "3px", backgroundColor:"white",margin:"6px"}}></div>
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {/* {location.pathname!=="/competitiveanalysis" && 
            <li
              className={
                UserService.isLoggedIn() ? "nav-item active" : "d-none"
              }
            >
              <Link className="nav-link" to="/competitiveanalysis">
                <button className="btn btn-sm drk noborder" style={{  }}>
                Competitive Analysis
                </button>
              </Link>
            </li>} */}
         
            {          UserService.hasRole(["adminrole"]) && 
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/refreshmodel">
                <button className={location.pathname==="/refreshmodel"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                 Refresh Model
                </button>
              </Link>
            </li>}
            {         UserService.hasRole(["adminrole"]) && 
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/modelperformance">
                <button className={location.pathname==="/modelperformance"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"} >
                Model Performance
                </button>
              </Link>
            </li>}
            { 
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/brandanalysis">
                <button className={location.pathname==="/brandanalysis"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}  >
                  Brand Analysis
                </button>
              </Link>
            </li>}
            {
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/simulator">
                <button className={location.pathname==="/simulator"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                Simulator
                </button>
              </Link>
            </li>}
            {
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/optimizer">
                <button className={location.pathname==="/optimizer"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                Optimizer
                </button>
              </Link>
            </li>}
            {
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/savedscenarios">
                <button className={location.pathname==="/savedscenarios"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                Compare Optimized Scenario
                </button>
              </Link>
            </li>}
            {
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/eventmanagement">
                <button className={location.pathname==="/eventmanagement"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                Event Management
                </button>
              </Link>
            </li>}
       
            { 
            <li
              className="nav-item"                
            >
              <Link className="nav-link" to="/dashboard">
                <button className={location.pathname==="/dashboard"?"btn btn-outline-dark drk noborder":"btn btn-sm drk noborder"}>
                Dashboard
                </button>
              </Link>
            </li>}
          

            {/* <li
                className={
                  UserService.isLoggedIn()
                    ? " dropdown nav-item active"
                    : "d-none"
                }
              >

                <div>
                  <button
                    className="btn  dropdown-toggle nav-item mt-2"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style={{color:"white"}}
                  >
                    <i className="fas fa-clipboard-list mr-1"></i>
                    Diagnostics
                  </button>

                  <div
                    className="dropdown-menu "
                    aria-labelledby="dropdownMenuButton"
                  >
                    <a className="dropdown-item" href="/competitiveanalysis">
                      Competitive Analysis{" "}
                    </a>
                    <a className="dropdown-item" href="/brandanalysis">
                      Brand Analysis
                    </a>

                  </div>
                </div>

              </li>

              <li
                className={
                  UserService.isLoggedIn() ? "nav-item" : "d-none"
                }
              >
                <Link className="nav-link" to="/simulator">
                  <button className="drk btn" style={{color:"white"}}>
                    Simulator
                  </button>
                </Link>
              </li>
              <li
                className={
                  UserService.isLoggedIn() ? "nav-item active" : "d-none"
                }
              >
                <Link className="nav-link" to="/optimizer">
                  <button className="btn btn-sm drk noborder" style={{color:"white"}}>
                    Optimizer
                  </button>
                </Link>
              </li>
              <li
                className={
                  UserService.isLoggedIn() ? "nav-item active" : "d-none"
                }
              >
                <Link className="nav-link" to="/eventmanagement">
                  <button className="btn btn-sm drk noborder" style={{color:"white"}}>
                  Event Management
                  </button>
                </Link>
              </li>
           
              <li
                className={
                  UserService.isLoggedIn() ? "nav-item active" : "d-none"
                }
              >
                <Link className="nav-link" to="/savedreports">
                  <button className="btn btn-sm drk noborder" style={{color:"white"}}>
                    Saved Reports
                  </button>
                </Link>
              </li> */}

          </ul>

       
          <ul className="navbar-nav ml-auto">
            <li
              className={
                UserService.isLoggedIn() ? "nav-item active" : "d-none"
              }
            >
              <Link className="nav-link" to="/">
                <button className="btn btn-sm drk noborder" style={{  }} >
                  <i className="fa fa-user" aria-hidden="true"></i> Hi,{" "}
                  {UserService.getUsername()}
                </button>
              </Link>
            </li>
            <li
              className={
                UserService.isLoggedIn() ? "nav-item active" : "d-none"
              }
            >
              <Link className="nav-link" to="/support">
                <button className="btn btn-sm drk noborder" style={{  }}>
                  <i className="fa fa-user" aria-hidden="true"></i> Support
                </button>
              </Link>
            </li>
            
            <li
              className={
                UserService.isLoggedIn() ? "d-none" : "nav-item active"
              }
            >
              <Link
                className="nav-link "
              
                onClick={() => {
                  UserService.doLogin({
                    redirectUri:`${REACT_APP_REDIRECT_URI}/dashboard`,
                  })
                }}
                //data-toggle="modal" data-target="#login"
              >
                <button className="btn btn-sm drk noborder" >
                  <i className="fas fa-sign-in-alt"></i> Login
                </button>
              </Link>
            </li>
            
            <li
              className={
                UserService.isLoggedIn() ? "d-none" : "nav-item active"
              }
            >
              <Link
                className="nav-link"
                onClick={() => UserService.doSignUp()}
              >
                <button className="btn btn-sm drk noborder" style={{  }}>
                  <i className="fas fa-user-plus"></i> SignUp
                </button>
              </Link>
            </li>

            <li
              className={
                UserService.isLoggedIn() ? "nav-item active" : "d-none"
              }
            >
              <Link
                className="nav-link"
                onClick={() => {
                  AuthService.logout({
                    redirectUri: `${REACT_APP_REDIRECT_URI}`,
                  });
                  // console.log(UserService.getToken());
                }}
              >
                <button className="btn btn-sm drk noborder" style={{  }}>
                  <i className="fas fa-sign-in-alt"></i> Logout
                </button>
              </Link>
            </li>
          </ul>
      
        </div>

     
      </nav>}
    </>
  );
}

export default Navbar;
