import React, { useRef, createRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import UserService from "../../services/UserService.js";
import AuthService from "../../services/AuthService.js";
import getNotification from "../../Redux/Action/action.js";
import mmxlogo from "../../Assets/Images/logo.webp";

const { REACT_APP_REDIRECT_URI } = process.env;

function Navbar2({ scrollToSection }) {
  const usernameRef = useRef();
  const passwordRef = createRef();
  const agreementRef = useRef();
  const dispatch = useDispatch();
  const location = useLocation();

  const [wrongidpass, setWrongidpass] = useState(false);

  const submitLogin = async () => {
    try {
      if (!agreementRef.current.checked) {
        return dispatch(
          getNotification({
            message: "Please accept Agreement for Terms and Conditions",
            type: "warning",
          })
        );
      }

      let loggedin = await AuthService.login({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });

      if (loggedin === "creds incorrect") {
        setWrongidpass(true);
        setTimeout(() => setWrongidpass(false), 5000);
      }
    } catch (error) {
      dispatch(
        getNotification({
          message: "We are facing some issues logging you in!!",
          type: "danger",
        })
      );
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div className="modal fade" id="login" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg rounded-3 border-0">
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0 fw-bold text-success">Login</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="text-center mb-4">
                <img
                  src="/Assets/Images/loginicon1.webp"
                  alt="Login"
                  style={{ width: "60px" }}
                  className="mb-2"
                />
                <h6 className="fw-semibold">Welcome Back</h6>
              </div>

              <input
                ref={usernameRef}
                type="text"
                className="form-control mb-3"
                placeholder="Enter Username"
              />
              <input
                ref={passwordRef}
                type="password"
                className="form-control mb-2"
                placeholder="Enter Password"
              />

              {wrongidpass && (
                <p className="text-danger small">
                  Please enter correct credentials!
                </p>
              )}

              <div className="form-check mb-3">
                <input
                  ref={agreementRef}
                  type="checkbox"
                  className="form-check-input"
                  id="agreement"
                />
                <label htmlFor="agreement" className="form-check-label">
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>

              <button
                className="btn btn-success w-100 mb-2"
                onClick={submitLogin}
              >
                Login
              </button>
              <div className="text-center">
                <a href="#" className="text-muted small">
                  Forgot Password?
                </a>
              </div>
              <div className="text-center mt-3">
                <span className="small text-muted">Don’t have an account?</span>
                <br />
                <a href="#" className="fw-bold text-success">
                  Create Account Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      {location.pathname !== "/dashboard" && (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-lg sticky-top">
          <div className="container-fluid">
            {/* Left: Logo */}
            <a className="navbar-brand d-flex align-items-center" href="/">
              <img src={mmxlogo} alt="Logo" style={{ height: "50px" }} />
            </a>

            {/* Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Middle + Right Sections */}
            <div className="collapse navbar-collapse" id="navbarContent">
              <div className="d-flex flex-grow-1 justify-content-between align-items-center">
                {/* Middle: Nav Items */}
                <ul className="navbar-nav mx-auto">
                  {["Home","About Us",  "Benefits","Features", "Contact With Us"].map(
                    (item, idx) => (
                      <li key={idx} className="nav-item mx-2"s>
                        <button
                          className="btn btn-link nav-link fw-semibold subNavbar2Navlink"
                          onClick={() =>
                            scrollToSection(item.toLowerCase().replace(" ", ""))
                          }
                        >
                          {item}
                        </button>
                      </li>
                    )
                  )}
                </ul>

                {/* Right: Contact + Login */}
                <ul className="navbar-nav ms-auto align-items-center">
                  <li className="nav-item d-flex align-items-center me-3" style={{color:'#063970',userSelect:'None'}}>
                    <i className="fas fa-phone-alt me-2"></i>
                    <span className="fw-semibold">
                      +91-80-49568423
                    </span>
                  </li>

                  {!UserService.isLoggedIn() ? (
                    <li className="nav-item">
                      <button
                        className="btn  px-4 rounded-pill btngreentheme"
                        onClick={() =>
                          UserService.doLogin({
                            redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard`,
                          })
                        }
                      >
                        Login <i className="fas fa-sign-in-alt"></i>
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle d-flex align-items-center"
                        href="#"
                        id="userDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-user-circle fa-lg text-success me-2"></i>
                        {UserService.getUsername()?.toUpperCase()}
                      </a>
                      <ul
                        className="dropdown-menu dropdown-menu-end shadow-sm"
                        aria-labelledby="userDropdown"
                      >
                        <li>
                          <Link to="/dashboard" className="dropdown-item">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() =>
                              UserService.doLogout({
                                redirectUri: `${REACT_APP_REDIRECT_URI}`,
                              })
                            }
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}

    </>
  );
}

export default Navbar2;
