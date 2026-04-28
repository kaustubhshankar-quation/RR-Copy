import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaCube,
  FaEnvelope,
  FaGlobe,
  FaLayerGroup,
  FaPhoneAlt,
  FaRocket,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import UserService from "../../services/UserService";
import { Link } from "react-router-dom";

const { REACT_APP_REDIRECT_URI } = process.env;

const HomePage = ({ theme = "dark", toggleTheme }) => {
  const isDark = theme === "dark";
  const heroRef = useRef(null);

  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    mobile: "",
    message: "",
    consent: false,
  });

  const handleLogin = () => {
    UserService.doLogin({
      redirectUri: `${UserService.hasRole(["CFOROLE"])
        ? `${REACT_APP_REDIRECT_URI}/brand-dashboard`
        : `${REACT_APP_REDIRECT_URI}/dashboard`
        }`,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMouse({ x, y });
    };

    const node = heroRef.current;
    if (node) node.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (node) node.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const themeVars = useMemo(
    () => ({
      "--bg-main": isDark ? "#07111f" : "#f4f8fb",
      "--bg-soft": isDark ? "rgba(11, 23, 42, 0.88)" : "rgba(255,255,255,0.88)",
      "--bg-card": isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255,255,255,0.90)",
      "--bg-card-strong": isDark ? "#0f172a" : "#ffffff",
      "--bg-card-soft": isDark ? "#132238" : "#f8fbff",
      "--text-main": isDark ? "#f8fafc" : "#0f172a",
      "--text-secondary": isDark ? "#cbd5e1" : "#334155",
      "--text-muted": isDark ? "#94a3b8" : "#64748b",
      "--border-soft": isDark ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.08)",
      "--shadow-soft": isDark
        ? "0 20px 60px rgba(0,0,0,0.45)"
        : "0 20px 60px rgba(15,23,42,0.10)",
      "--shadow-glow": isDark
        ? "0 0 0 1px rgba(45,212,191,0.16), 0 20px 60px rgba(34,211,238,0.16)"
        : "0 0 0 1px rgba(16,185,129,0.12), 0 20px 60px rgba(34,211,238,0.12)",
      "--primary": "#14b8a6",
      "--secondary": "#38bdf8",
      "--accent": "#22c55e",
      "--accent-2": "#8b5cf6",
      "--hero-grad": isDark
        ? "radial-gradient(circle at 20% 20%, rgba(20,184,166,0.18), transparent 28%), radial-gradient(circle at 80% 15%, rgba(56,189,248,0.16), transparent 28%), radial-gradient(circle at 70% 78%, rgba(139,92,246,0.14), transparent 26%), linear-gradient(135deg, #06101d 0%, #08172b 38%, #0b1f34 70%, #08111d 100%)"
        : "radial-gradient(circle at 20% 20%, rgba(20,184,166,0.16), transparent 28%), radial-gradient(circle at 80% 15%, rgba(56,189,248,0.14), transparent 28%), radial-gradient(circle at 70% 78%, rgba(139,92,246,0.10), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #eef8ff 40%, #f1fff9 72%, #f8fafc 100%)",
      "--hero-grid": isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.06)",
    }),
    [isDark]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demo request:", formData);
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-demo-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <div className="rr-landing-root" style={themeVars}>
        <section
          ref={heroRef}
          className="rr-hero-shell"
          style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` }}
        >
          <div className="rr-spotlight" />

          <div className="rr-navbar">
            <div className="rr-wide-container">
              <div className="d-flex align-items-center justify-content-between">
                <div className="rr-brand">
                  <div className="rr-brand-logo">
                    <FaCube />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.15rem" }}>Revenue Radar</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Modern Brand Intelligence
                    </div>
                  </div>
                </div>

                <div className="rr-nav-links">
                  <a href="#benefits">Benefits</a>
                  <a href="#features">Features</a>
                  <a href="#contact-demo-form">Contact</a>
                </div>

                <div className="d-flex align-items-center gap-2 rr-nav-actions">
                  {/* Theme Toggle Button */}
                  <button
                    type="button"
                    className="rr-btn rr-btn-theme"
                    onClick={toggleTheme}
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
                  </button>

                  {!UserService.isLoggedIn() ? (
                    <button
                      type="button"
                      className="rr-btn rr-btn-ghost"
                      onClick={() =>
                        UserService.doLogin({
                          redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard`,
                        })
                      }
                    >
                      Login <i className="fas fa-sign-in-alt"></i>
                    </button>
                  ) : (
                    <div className="dropdown">
                      <button
                        className="rr-btn rr-btn-user dropdown-toggle"
                        type="button"
                        id="rrUserDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-user-circle"></i>
                        <span className="rr-user-name">
                          {UserService.getUsername()?.toUpperCase()}
                        </span>
                      </button>

                      <ul
                        className="dropdown-menu dropdown-menu-end rr-user-menu"
                        aria-labelledby="rrUserDropdown"
                      >
                        <li>
                          <Link to="/dashboard" className="dropdown-item rr-dropdown-item">
                            <i className="fas fa-chart-line me-2"></i>
                            Dashboard
                          </Link>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            type="button"
                            className="dropdown-item rr-dropdown-item rr-logout-item"
                            onClick={() =>
                              UserService.doLogout({
                                redirectUri: `${REACT_APP_REDIRECT_URI}`,
                              })
                            }
                          >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    className="rr-btn rr-btn-primary"
                    onClick={scrollToForm}
                  >
                    Request Demo <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rr-hero-content">
            <div className="rr-wide-container">
              <div className="rr-hero-grid-main">
                <div className="rr-left">
                  <div className="rr-badge">
                    <FaWandMagicSparkles />
                    AI-powered planning, simulation & optimization
                  </div>

                  <h1 className="rr-title">
                    Transform
                    <br />
                    spend into
                    <br />
                    <span className="grad">predictable</span>
                    <br />
                    <span className="grad">growth.</span>
                  </h1>

                  <p className="rr-subtitle">
                    A premium marketing intelligence experience for brand teams.
                    Analyze performance, simulate future scenarios, optimize allocation,
                    and drive decisions with the same confident visual language as your
                    Brand Manager Dashboard.
                  </p>

                  <div className="rr-mini-features">
                    <div className="rr-mini-pill">
                      <FaChartLine />
                      Faster brand decisions
                    </div>
                    <div className="rr-mini-pill">
                      <FaBolt />
                      Scenario simulation
                    </div>
                    <div className="rr-mini-pill">
                      <FaShieldAlt />
                      Transparent optimization
                    </div>
                  </div>

                  <div className="rr-cta-row">
                    <button className="rr-btn rr-btn-primary" onClick={scrollToForm}>
                      Book a Live Demo <FaArrowRight />
                    </button>
                    <button className="rr-btn rr-btn-ghost" onClick={handleLogin}>
                      Login to Dashboard
                    </button>
                  </div>
                </div>

                <div className="rr-right">
                  <div className="rr-orbit" />
                  <div className="rr-orbit-2" />
                  <div className="rr-orbit-3" />

                  <div className="rr-floating-card rr-fc-1">
                    <div className="title">Optimization Lift</div>
                    <div className="value">+18.7%</div>
                  </div>

                  <div className="rr-floating-card rr-fc-2">
                    <div className="title">Decision Speed</div>
                    <div className="value">5x Faster</div>
                  </div>

                  <div className="rr-floating-card rr-fc-3">
                    <div className="title">Forecast Confidence</div>
                    <div className="value">92%</div>
                  </div>

                  <div className="rr-dashboard-card">
                    <div className="rr-window-top">
                      <div className="rr-window-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="rr-window-pill">Brand Manager View</div>
                    </div>

                    <div className="rr-stat-grid">
                      <div className="rr-stat-box">
                        <div className="rr-stat-label">Current FY Revenue</div>
                        <div className="rr-stat-value">₹ 134.9 Cr</div>
                        <div className="rr-stat-up">+12.4% YoY</div>
                      </div>

                      <div className="rr-stat-box">
                        <div className="rr-stat-label">Optimizer Efficiency</div>
                        <div className="rr-stat-value">1.84x</div>
                        <div className="rr-stat-up">Higher ROI mix</div>
                      </div>
                    </div>

                    <div className="rr-chart-box">
                      <div className="rr-chart-header">
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                            Media Impact Snapshot
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            Simulated uplift by channel
                          </div>
                        </div>
                        <div className="rr-window-pill">Live Intelligence</div>
                      </div>

                      <div className="rr-bars">
                        <div className="rr-bar-wrap">
                          <div className="rr-bar bar-1" />
                          <div className="rr-bar-label">TV</div>
                        </div>
                        <div className="rr-bar-wrap">
                          <div className="rr-bar bar-2" />
                          <div className="rr-bar-label">Digital</div>
                        </div>
                        <div className="rr-bar-wrap">
                          <div className="rr-bar bar-3" />
                          <div className="rr-bar-label">Retail</div>
                        </div>
                        <div className="rr-bar-wrap">
                          <div className="rr-bar bar-4" />
                          <div className="rr-bar-label">Promo</div>
                        </div>
                        <div className="rr-bar-wrap">
                          <div className="rr-bar bar-5" />
                          <div className="rr-bar-label">Search</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rr-bottom-zone">
                <div className="rr-bottom-panel" id="benefits">
                  <div className="rr-feature-strip">
                    <div className="rr-feature-card">
                      <div className="rr-feature-icon">
                        <FaRocket />
                      </div>
                      <h6>Faster Project Delivery</h6>
                      <p>
                        Compress analysis cycles and move from raw inputs to confident
                        brand decisions much faster.
                      </p>
                    </div>

                    <div className="rr-feature-card">
                      <div className="rr-feature-icon">
                        <FaLayerGroup />
                      </div>
                      <h6>Scenario Planning</h6>
                      <p>
                        Model future budget possibilities instantly and compare strategic
                        paths before committing spend.
                      </p>
                    </div>

                    <div className="rr-feature-card">
                      <div className="rr-feature-icon">
                        <FaGlobe />
                      </div>
                      <h6>Transparent Insights</h6>
                      <p>
                        Turn complex data into visual intelligence that leaders can act on
                        without friction.
                      </p>
                    </div>

                    <div className="rr-feature-card" id="features">
                      <div className="rr-feature-icon">
                        <FaUserTie />
                      </div>
                      <h6>Built for Brand Teams</h6>
                      <p>
                        Designed for business stakeholders, planners, and analysts working
                        across revenue, media, and performance.
                      </p>
                    </div>
                  </div>

                  <div className="rr-contact-grid">
                    <div className="rr-contact-card">
                      <div className="rr-contact-title">
                        Let’s build sharper growth stories.
                      </div>

                      <p className="rr-contact-text">
                        A visually premium single-page experience inspired by your Brand
                        Manager Dashboard. Strong hierarchy, rich motion, and a high-end
                        enterprise feel.
                      </p>

                      <div className="rr-contact-points">
                        <div className="rr-contact-point">
                          <div className="icon">
                            <FaEnvelope />
                          </div>
                          <span>Share your use case and request a tailored walkthrough</span>
                        </div>

                        <div className="rr-contact-point">
                          <div className="icon">
                            <FaPhoneAlt />
                          </div>
                          <span>Connect with brand, finance, or marketing stakeholders</span>
                        </div>

                        <div className="rr-contact-point">
                          <div className="icon">
                            <FaWandMagicSparkles />
                          </div>
                          <span>See optimizer, simulator, and dashboard flows in one demo</span>
                        </div>
                      </div>
                    </div>

                    <div className="rr-form-shell" id="contact-demo-form">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                        <div>
                          <h4 className="mb-1 fw-bold">Request a Demo</h4>
                          <div style={{ color: "var(--text-muted)" }}>
                            Tell us a bit about you and we’ll reach out.
                          </div>
                        </div>
                        <div className="rr-window-pill">Contact Me Form</div>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="rr-form-grid">
                          <div className="rr-form-group">
                            <input
                              type="text"
                              name="fullName"
                              className="rr-form-control"
                              placeholder="Full Name"
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="rr-form-group">
                            <input
                              type="email"
                              name="email"
                              className="rr-form-control"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="rr-form-group">
                            <input
                              type="text"
                              name="organization"
                              className="rr-form-control"
                              placeholder="Current Organisation"
                              value={formData.organization}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="rr-form-group">
                            <input
                              type="tel"
                              name="mobile"
                              className="rr-form-control"
                              placeholder="Mobile Number"
                              value={formData.mobile}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="rr-form-group">
                          <textarea
                            rows="4"
                            name="message"
                            className="rr-form-control"
                            placeholder="Tell us what you'd like to explore..."
                            value={formData.message}
                            onChange={handleChange}
                          />
                        </div>

                        <label className="rr-check">
                          <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            required
                          />
                          <span>
                            I agree to the Terms of Service and Privacy Policy, and I
                            consent to being contacted regarding a product demo.
                          </span>
                        </label>

                        <div className="d-flex flex-wrap gap-3 align-items-center">
                          <button type="submit" className="rr-btn rr-btn-primary">
                            Submit Request <FaArrowRight />
                          </button>

                          <button
                            type="button"
                            className="rr-btn rr-btn-ghost"
                            onClick={handleLogin}
                          >
                            Login
                          </button>
                        </div>

                        <div className="rr-tiny-note">
                          Premium single-screen experience with motion, depth, and contact conversion.
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      <style>{`
        .rr-landing-root {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-main);
          position: relative;
          overflow-x: hidden;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .rr-wide-container {
          width: min(92vw, 1700px);
          margin: 0 auto;
        }

        .rr-hero-shell {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--hero-grad);
          isolation: isolate;
        }

        .rr-hero-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, var(--hero-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent 92%);
          pointer-events: none;
          z-index: 0;
        }

        .rr-spotlight {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(500px circle at var(--mx) var(--my), rgba(255,255,255,0.10), transparent 42%);
          pointer-events: none;
          z-index: 0;
        }

        .rr-navbar {
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 18px 0;
          backdrop-filter: blur(16px);
          background: ${isDark ? "rgba(7,17,31,0.55)" : "rgba(255,255,255,0.55)"};
          border-bottom: 1px solid var(--border-soft);
        }

        .rr-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
        }

        .rr-brand-logo {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: 0 12px 30px rgba(20,184,166,0.28);
        }

        .rr-nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .rr-nav-links a {
          color: inherit;
          text-decoration: none;
          transition: 0.25s ease;
        }

        .rr-nav-links a:hover {
          color: var(--text-main);
        }

        .rr-btn {
          border: 0;
          outline: 0;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.28s ease;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .rr-btn-primary {
          color: #fff;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: 0 16px 40px rgba(20,184,166,0.24);
        }

        .rr-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 50px rgba(20,184,166,0.30);
        }

        .rr-btn-ghost {
          color: var(--text-main);
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          backdrop-filter: blur(14px);
        }

        .rr-btn-ghost:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-soft);
        }

        .rr-hero-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 34px 0 44px;
        }

        .rr-hero-grid-main {
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
          align-items: center;
          gap: 48px;
          min-height: calc(100vh - 110px);
        }

        .rr-left {
          max-width: 760px;
        }

        .rr-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          color: var(--text-secondary);
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow-soft);
          margin-bottom: 20px;
          font-weight: 700;
        }

        .rr-title {
          font-size: clamp(3.2rem, 6vw, 6.3rem);
          line-height: 0.92;
          font-weight: 900;
          letter-spacing: -0.05em;
          margin-bottom: 20px;
          max-width: 820px;
        }

        .rr-title .grad {
          background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rr-subtitle {
          font-size: 1.12rem;
          line-height: 1.8;
          color: var(--text-secondary);
          max-width: 760px;
          margin-bottom: 30px;
        }

        .rr-mini-features {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 30px;
        }

        .rr-mini-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          color: var(--text-secondary);
          box-shadow: var(--shadow-soft);
        }

        .rr-mini-pill svg {
          color: var(--primary);
        }

        .rr-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .rr-right {
          position: relative;
          min-height: 680px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rr-orbit,
        .rr-orbit-2,
        .rr-orbit-3 {
          position: absolute;
          border-radius: 999px;
          border: 1px dashed rgba(148,163,184,0.18);
          animation: spin 18s linear infinite;
        }

        .rr-orbit { width: 560px; height: 560px; }
        .rr-orbit-2 { width: 430px; height: 430px; animation-duration: 13s; animation-direction: reverse; }
        .rr-orbit-3 { width: 300px; height: 300px; animation-duration: 9s; }

        .rr-dashboard-card {
          width: min(680px, 100%);
          min-height: 560px;
          border-radius: 34px;
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-glow);
          backdrop-filter: blur(18px);
          padding: 24px;
          position: relative;
          transform: perspective(1600px) rotateY(-9deg) rotateX(6deg);
          transition: transform 0.35s ease;
          overflow: hidden;
        }

        .rr-dashboard-card:hover {
          transform: perspective(1600px) rotateY(-4deg) rotateX(2deg) translateY(-6px);
        }

        .rr-dashboard-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(20,184,166,0.12), transparent 28%);
          pointer-events: none;
        }

        .rr-window-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .rr-window-dots {
          display: flex;
          gap: 8px;
        }

        .rr-window-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
        }

        .rr-window-pill {
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(20,184,166,0.12);
          color: var(--primary);
          font-size: 0.82rem;
          font-weight: 800;
          border: 1px solid rgba(20,184,166,0.24);
        }

        .rr-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .rr-stat-box {
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          border-radius: 22px;
          padding: 20px;
          box-shadow: var(--shadow-soft);
        }

        .rr-stat-label {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-bottom: 10px;
        }

        .rr-stat-value {
          font-size: 1.9rem;
          font-weight: 800;
        }

        .rr-stat-up {
          color: #22c55e;
          font-weight: 700;
          font-size: 0.95rem;
          margin-top: 6px;
        }

        .rr-chart-box {
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          border-radius: 24px;
          padding: 22px;
          box-shadow: var(--shadow-soft);
          min-height: 270px;
        }

        .rr-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          gap: 12px;
        }

        .rr-bars {
          display: flex;
          align-items: end;
          gap: 16px;
          height: 180px;
          margin-top: 18px;
        }

        .rr-bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .rr-bar {
          width: 100%;
          border-radius: 18px 18px 10px 10px;
          background: linear-gradient(180deg, var(--secondary), var(--primary));
          box-shadow: inset 0 -16px 18px rgba(0,0,0,0.12);
          animation: growBar 1.25s ease both;
          transform-origin: bottom;
        }

        .rr-bar.bar-1 { height: 48%; animation-delay: 0.1s; }
        .rr-bar.bar-2 { height: 72%; animation-delay: 0.2s; }
        .rr-bar.bar-3 { height: 56%; animation-delay: 0.3s; }
        .rr-bar.bar-4 { height: 86%; animation-delay: 0.4s; }
        .rr-bar.bar-5 { height: 64%; animation-delay: 0.5s; }

        .rr-bar-label {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.84rem;
        }

        .rr-floating-card {
          position: absolute;
          padding: 16px 18px;
          border-radius: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(14px);
          animation: floatY 5.5s ease-in-out infinite;
          z-index: 2;
        }

        .rr-fc-1 { top: 11%; left: -2%; }
        .rr-fc-2 { bottom: 10%; right: -3%; animation-delay: 1.2s; }
        .rr-fc-3 { top: 52%; left: -12%; animation-delay: 0.8s; }

        .rr-floating-card .title {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .rr-floating-card .value {
          font-size: 1.2rem;
          font-weight: 800;
        }

        .rr-bottom-zone {
          position: relative;
          z-index: 1;
          padding-bottom: 36px;
        }

        .rr-bottom-panel {
          background: var(--bg-soft);
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(16px);
          border-radius: 30px;
          padding: 26px;
          margin-top: 16px;
        }

        .rr-feature-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .rr-feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          border-radius: 22px;
          padding: 18px;
          min-height: 150px;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }

        .rr-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-soft);
        }

        .rr-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          background: linear-gradient(135deg, rgba(20,184,166,0.18), rgba(56,189,248,0.16));
          color: var(--primary);
        }

        .rr-feature-card h6 {
          font-weight: 800;
          margin-bottom: 8px;
        }

        .rr-feature-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.94rem;
          line-height: 1.65;
        }

        .rr-contact-grid {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 24px;
          align-items: stretch;
        }

        .rr-contact-card {
          background: linear-gradient(135deg, rgba(20,184,166,0.10), rgba(56,189,248,0.08), rgba(139,92,246,0.07));
          border: 1px solid var(--border-soft);
          border-radius: 28px;
          padding: 24px;
          height: 100%;
        }

        .rr-contact-title {
          font-size: 1.6rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .rr-contact-text {
          color: var(--text-secondary);
          line-height: 1.75;
          margin-bottom: 18px;
        }

        .rr-contact-points {
          display: grid;
          gap: 12px;
        }

        .rr-contact-point {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .rr-contact-point .icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          color: var(--primary);
          flex-shrink: 0;
        }

        .rr-form-shell {
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          border-radius: 28px;
          padding: 22px;
          box-shadow: var(--shadow-soft);
          height: 100%;
        }

        .rr-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .rr-form-group {
          margin-bottom: 14px;
        }

        .rr-form-control {
          width: 100%;
          border: 1px solid var(--border-soft);
          background: ${isDark ? "rgba(15,23,42,0.72)" : "#ffffff"};
          color: var(--text-main);
          border-radius: 16px;
          padding: 14px 16px;
          outline: none;
          transition: all 0.25s ease;
        }

        .rr-form-control:focus {
          border-color: rgba(20,184,166,0.45);
          box-shadow: 0 0 0 4px rgba(20,184,166,0.12);
        }

        .rr-form-control::placeholder {
          color: var(--text-muted);
        }

        .rr-check {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 4px 0 18px;
        }

        .rr-tiny-note {
          color: var(--text-muted);
          font-size: 0.86rem;
          margin-top: 12px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes growBar {
          from { transform: scaleY(0.12); opacity: 0.35; }
          to { transform: scaleY(1); opacity: 1; }
        }

        @media (max-width: 1400px) {
          .rr-wide-container {
            width: min(95vw, 1500px);
          }

          .rr-title {
            font-size: clamp(3rem, 5.6vw, 5.6rem);
          }

          .rr-dashboard-card {
            width: min(620px, 100%);
          }
        }

        @media (max-width: 1199px) {
          .rr-hero-grid-main,
          .rr-contact-grid,
          .rr-feature-strip {
            grid-template-columns: 1fr 1fr;
          }

          .rr-hero-grid-main {
            gap: 36px;
          }

          .rr-right {
            min-height: 560px;
          }

          .rr-dashboard-card {
            transform: none;
            width: min(100%, 620px);
          }

          .rr-fc-3 {
            display: none;
          }
        }

        .rr-nav-actions {
          position: relative;
        }

        .rr-btn-theme {
          width: 46px;
          height: 46px;
          padding: 0;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          color: var(--text-main);
          backdrop-filter: blur(14px);
          box-shadow: var(--shadow-soft);
        }

        .rr-btn-theme:hover {
          transform: translateY(-2px) rotate(8deg);
        }

        .rr-btn-user {
          color: var(--text-main);
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          backdrop-filter: blur(14px);
          box-shadow: var(--shadow-soft);
          padding-inline: 16px;
        }

        .rr-btn-user:hover,
        .rr-btn-user:focus,
        .rr-btn-user:active {
          color: var(--text-main);
          background: var(--bg-card);
          border-color: rgba(20,184,166,0.28);
        }

        .rr-btn-user i {
          color: var(--primary);
        }

        .rr-user-name {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rr-user-menu {
          min-width: 220px;
          margin-top: 12px !important;
          border-radius: 18px;
          padding: 10px;
          border: 1px solid var(--border-soft);
          background: var(--bg-card-strong);
          box-shadow: var(--shadow-soft);
        }

        .rr-dropdown-item {
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 600;
          color: var(--text-main);
          transition: all 0.22s ease;
        }

        .rr-dropdown-item:hover,
        .rr-dropdown-item:focus {
          background: var(--bg-card-soft);
          color: var(--text-main);
        }

        .rr-logout-item {
          color: #ef4444 !important;
        }

        .rr-logout-item:hover,
        .rr-logout-item:focus {
          background: rgba(239, 68, 68, 0.10);
          color: #ef4444 !important;
        }

        @media (max-width: 767px) {
          .rr-nav-actions {
            gap: 8px !important;
          }

          .rr-user-name {
            display: none;
          }

          .rr-btn-user {
            width: 46px;
            height: 46px;
            padding: 0;
            border-radius: 50%;
          }

          .rr-btn-user::after {
            display: none;
          }
        }

        @media (max-width: 991px) {
          .rr-nav-links {
            display: none;
          }

          .rr-hero-grid-main,
          .rr-contact-grid,
          .rr-feature-strip {
            grid-template-columns: 1fr;
          }

          .rr-hero-content {
            padding-top: 18px;
          }

          .rr-right {
            min-height: 460px;
            margin-top: 18px;
          }

          .rr-orbit,
          .rr-orbit-2,
          .rr-orbit-3 {
            display: none;
          }

          .rr-floating-card {
            display: none;
          }

          .rr-dashboard-card {
            min-height: auto;
          }

          .rr-title {
            max-width: 100%;
          }

          .rr-left,
          .rr-subtitle {
            max-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .rr-wide-container {
            width: min(94vw, 100%);
          }

          .rr-title {
            font-size: 2.8rem;
            line-height: 1.02;
          }

          .rr-stat-grid,
          .rr-form-grid {
            grid-template-columns: 1fr;
          }

          .rr-bottom-panel,
          .rr-contact-card,
          .rr-form-shell {
            padding: 18px;
            border-radius: 22px;
          }

          .rr-dashboard-card {
            padding: 16px;
            border-radius: 24px;
          }

          .rr-chart-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .rr-btn {
            width: 100%;
          }

          .rr-cta-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;