import React from "react";
import { Link } from "react-router-dom";
import FooterPages from "./Footer/FooterPages";
import Navbar3 from "./Navbars/Navbar3";
import UserService from "../services/UserService";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

function PageNotFound() {
  const isLoggedIn = UserService.isLoggedIn();
  const isAdmin = UserService.hasRole(["adminrole"]);

  const getMessage = () => {
    if (!isLoggedIn) {
      return "Please login to continue.";
    }

    if (!isAdmin) {
      return "You do not have permission to access this page. Please login with an admin account.";
    }

    return "The page you are looking for does not exist or may have been moved.";
  };

  return (
    <>
      <div
        className="min-vh-100 d-flex flex-column"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 25%), linear-gradient(135deg, #0f172a 0%, #111827 45%, #14532d 100%)",
        }}
      >
        <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <motion.div
            className="text-center w-100"
            style={{ maxWidth: "560px" }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-4"
            >
              <div
                className="mx-auto d-flex align-items-center justify-content-center"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <FaExclamationTriangle
                  size={42}
                  className="text-warning"
                  style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }}
                />
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-4 mb-3"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <div
                className="mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Error 404
              </div>

              <h2
                className="mb-3"
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                Page Not Found
              </h2>

              <p
                className="mb-0"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "15px",
                  lineHeight: "1.7",
                }}
              >
                {getMessage()}
              </p>
            </motion.div>

            <motion.div
              className="d-flex flex-wrap gap-3 justify-content-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Link
                to="/"
                className="btn px-4 py-2 rounded-pill"
                style={{
                  background: "linear-gradient(90deg, #84cc16, #22c55e)",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                  boxShadow: "0 10px 24px rgba(34,197,94,0.28)",
                }}
              >
                ⬅ Go Back Home
              </Link>

              {!isLoggedIn && (
                <button
                  type="button"
                  className="btn px-4 py-2 rounded-pill"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                  }}
                  onClick={() => UserService.doLogin()}
                >
                  Login
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <FooterPages />
    </>
  );
}

export default PageNotFound;