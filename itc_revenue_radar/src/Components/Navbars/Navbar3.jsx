import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserService from "../../services/UserService";
import mmxlogo from "../../Assets/Images/logo.webp";
import RevenueRadarLogo from "../svg/RevenueRadarLogo";

const { REACT_APP_REDIRECT_URI } = process.env;

function Navbar3({ theme = "light", toggleTheme, collapsed, setCollapsed }) {
  const location = useLocation();
  const isLoggedIn = UserService.isLoggedIn();
  const username = UserService.getUsername()?.toUpperCase();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991.98);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991.98);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveCollapsed = !isMobile && collapsed;

  if (location.pathname === "/") return null;

  const isDashboardHome = location.pathname === "/dashboard";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "fas fa-chart-pie", roles: [] },
    { to: "/dashboard/refreshmodel", label: "Refresh Model", icon: "fas fa-sync-alt", roles: ["adminrole"] },
    { to: "/cockpit", label: "Brand Cockpit", icon: "fas fa-chart-pie", roles: ["BBMNGR", "OODMNGR"] },
    { to: "/dashboard/modelperformance", label: "Model Performance", icon: "fas fa-chart-line", roles: [] },
    { to: "/dashboard/marketanalysis", label: "Market Analysis", icon: "fas fa-store", roles: [] },
    { to: "/dashboard/brandanalysis", label: "Brand Analysis", icon: "fas fa-industry", roles: [] },
    { to: "/dashboard/simulator", label: "Scenario Planner", icon: "fas fa-flask", roles: [] },
    { to: "/dashboard/optimizer", label: "Optimized Spends", icon: "fas fa-bullseye", roles: [] },
    { to: "/dashboard/savedscenarios", label: "Saved Scenarios", icon: "fas fa-layer-group", roles: [] },
    { to: "/dashboard/savedreports", label: "Saved Reports", icon: "fas fa-bookmark", roles: [] },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles.length) return true;
    return item.roles.some((role) => UserService.hasRole([role]));
  });

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`) ||
      location.pathname === `/atta${path.replace("/", "")}`
    );
  };

  const handleLogin = () => {
    UserService.doLogin({
      redirectUri: `${REACT_APP_REDIRECT_URI}/dashboard`,
    });
  };

  const handleLogout = () => {
    UserService.doLogout({
      redirectUri: `${REACT_APP_REDIRECT_URI}`,
    });
  };

  return (
    <>
      <aside
        className={`rr-sidebar ${isNavOpen ? "open" : ""} ${effectiveCollapsed ? "collapsed" : ""}`}
      >
        <div className="rr-sidebar-top">
          <Link className="rr-brand" to="/" title="Revenue Radar">
            {!effectiveCollapsed ? (
            <RevenueRadarLogo
              theme='dark'
              width={220}
              height={76}
              showTagline={true}
              animated={true}
            />
            ) : (
            <div className="rr-brand-mini">RR</div>
            )}
          </Link>

          <div className="rr-sidebar-top-actions">
            <button
              className="rr-theme-toggle-btn"
              onClick={toggleTheme}
              type="button"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
              {!effectiveCollapsed && (
                <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
              )}
            </button>

            <button
              className="rr-collapse-btn d-none d-lg-inline-flex"
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i className={`fas ${effectiveCollapsed ? "fa-angle-right" : "fa-angle-left"}`}></i>
            </button>

            <button
              className="rr-mobile-close"
              type="button"
              onClick={() => setIsNavOpen(false)}
              aria-label="Close sidebar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="rr-sidebar-user-block">
          {!isLoggedIn ? (
            <button
              className="rr-login-btn w-100"
              type="button"
              onClick={handleLogin}
              title="Login"
            >
              <i className="fas fa-sign-in-alt"></i>
              {!effectiveCollapsed && <span>Login</span>}
            </button>
          ) : (
            <>
              <div
                className="rr-user-panel"
                title={effectiveCollapsed ? username || "User" : ""}
              >
                <div className="rr-user-avatar">
                  <i className="fas fa-user"></i>
                </div>

                {!effectiveCollapsed && (
                  <div className="rr-user-meta">
                    <div className="rr-user-welcome">Welcome to Revenue Radar</div>
                    <div className="rr-user-name">{username || "User"}</div>
                  </div>
                )}
              </div>

              <button
                className="rr-sidebar-logout"
                onClick={handleLogout}
                type="button"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                {!effectiveCollapsed && <span>Logout</span>}
              </button>
            </>
          )}
        </div>

        {!isDashboardHome && isLoggedIn && (
          <div className="rr-sidebar-nav-wrap">
            {!effectiveCollapsed && (
              <div className="rr-sidebar-section-title">Navigation</div>
            )}

            <ul className="rr-sidebar-nav-list">
              {filteredNavItems.map(({ to, label, icon }) => {
                if (UserService.hasRole(["BBMNGR", "OODMNGR"]) && to === "/dashboard") {
                  return null;
                }
                if (UserService.hasRole(["adminrole"]) && to === "/cockpit") {
                  return null;
                }

                return (
                  <li className="rr-sidebar-nav-item" key={to}>
                    <NavLink
                      to={to}
                      className={`rr-sidebar-link ${isActive(to) ? "active-sidebar-link" : ""}`}
                      onClick={() => setIsNavOpen(false)}
                      title={effectiveCollapsed ? label : ""}
                    >
                      <span className="rr-sidebar-link-icon">
                        <i className={icon}></i>
                      </span>

                      {!effectiveCollapsed && (
                        <span className="rr-sidebar-link-text">{label}</span>
                      )}

                      {effectiveCollapsed && (
                        <span className="rr-collapsed-tooltip">{label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>

      <button
        className={`rr-sidebar-toggle ${isNavOpen ? "open" : ""}`}
        type="button"
        onClick={() => setIsNavOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isNavOpen && (
        <div
          className="rr-sidebar-backdrop"
          onClick={() => setIsNavOpen(false)}
        ></div>
      )}

      <style>{`
        .rr-sidebar {
          --rr-side-bg: linear-gradient(180deg, #1a2d3d 0%, #2C3E50 45%, #243447 100%);
          --rr-side-top: linear-gradient(135deg, rgba(26,45,61,0.96) 0%, rgba(36,52,71,0.95) 100%);
          --rr-side-text: #F8F9FA;
          --rr-side-muted: #ADB5BD;
          --rr-side-border: rgba(23, 162, 184, 0.25);
          --rr-side-card: rgba(44, 62, 80, 0.85);
          --rr-side-card-strong: rgba(44, 62, 80, 0.95);
          --rr-side-shadow: 8px 0 24px rgba(44, 62, 80, 0.25);
          --rr-tooltip-bg: #e2e8f0;
          --rr-tooltip-text: #0f172a;

          position: fixed;
          top: 0;
          left: 0;
          width: 290px;
          height: 100vh;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          background: var(--rr-side-bg);
          border-right: 1px solid var(--rr-side-border);
          box-shadow: var(--rr-side-shadow);
          overflow: hidden;
          transition: width 0.28s ease, transform 0.28s ease, background 0.25s ease;
        }

        .rr-sidebar.collapsed {
          width: 92px;
        }

        .rr-sidebar-top {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 14px 12px;
          border-bottom: 1px solid var(--rr-side-border);
          background: var(--rr-side-top);
        }

        .rr-sidebar.collapsed .rr-sidebar-top {
          padding: 12px 10px;
          align-items: center;
        }

        .rr-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 52px;
          overflow: hidden;
          text-decoration: none;
        }

        .rr-brand-logo {
          max-width: 100%;
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .rr-brand-mini {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #ffffff;
          background: linear-gradient(135deg, #17A2B8 0%, #138496 100%);
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.30);
        }

        .rr-sidebar-top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .rr-sidebar.collapsed .rr-sidebar-top-actions {
          flex-direction: row;
          justify-content: center;
          width: 100%;
        }

        .rr-theme-toggle-btn,
        .rr-collapse-btn,
        .rr-mobile-close {
          border: 1px solid rgba(23, 162, 184, 0.40);
          background: rgba(23, 162, 184, 0.25);
          color: #E5E7EB;
          border-radius: 14px;
          height: 40px;
          min-width: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 12px;
          transition: all 0.25s ease;
        }

        .rr-theme-toggle-btn {
          flex: 1;
        }

        .rr-theme-toggle-btn:hover,
        .rr-collapse-btn:hover,
        .rr-mobile-close:hover {
          transform: translateY(-1px);
          background: rgba(23, 162, 184, 0.45);
          border-color: rgba(23, 162, 184, 0.60);
          color: #FFFFFF;
        }

        .rr-sidebar.collapsed .rr-theme-toggle-btn,
        .rr-sidebar.collapsed .rr-collapse-btn {
          width: 40px;
          padding: 0;
          flex: unset;
        }

        .rr-mobile-close {
          display: none;
        }

        .rr-sidebar-user-block {
          padding: 18px 12px;
          border-bottom: 1px solid var(--rr-side-border);
        }

        .rr-user-panel {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 20px;
          background: rgba(23, 162, 184, 0.22);
          border: 1px solid rgba(23, 162, 184, 0.35);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.25s ease;
        }

        .rr-sidebar.collapsed .rr-user-panel {
          justify-content: center;
          padding: 12px;
        }

        .rr-user-avatar {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #17A2B8 0%, #138496 100%);
          color: #FFFFFF;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(23, 162, 184, 0.25);
        }

        .rr-user-welcome {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--rr-side-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .rr-user-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 13px;
          font-weight: 800;
          color: var(--rr-side-text);
          margin-top: 3px;
          word-break: break-word;
        }

        .rr-login-btn,
        .rr-sidebar-logout {
          margin-top: 12px;
          width: 100%;
          border-radius: 16px;
          padding: 11px 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .rr-login-btn {
          border: none;
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
        }

        .rr-sidebar-logout {
          border: 1px solid rgba(239, 68, 68, 0.30);
          background: rgba(239, 68, 68, 0.22);
          color: #ffffff;
        }

        .rr-sidebar.collapsed .rr-login-btn,
        .rr-sidebar.collapsed .rr-sidebar-logout {
          padding: 11px;
        }

        .rr-sidebar-nav-wrap {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .rr-sidebar-nav-wrap::-webkit-scrollbar {
          display: none;
        }

        .rr-sidebar-section-title {
          font-size: 11px;
          font-weight: 800;
          color: var(--rr-side-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 10px 10px;
        }

        .rr-sidebar-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rr-sidebar-nav-item {
          position: relative;
        }

        .rr-sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          padding: 12px 14px;
          border-radius: 18px;
          color: #D1D5DB;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }

        .rr-sidebar.collapsed .rr-sidebar-link {
          justify-content: center;
          width: 56px;
          height: 56px;
          padding: 0;
          margin: 0 auto;
          border-radius: 18px;
          background: transparent;
        }

        .rr-sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.35);
          border-color: rgba(239, 68, 68, 0.45);
          color: #f87171;
        }

        .rr-sidebar-link:hover {
          background: rgba(23, 162, 184, 0.25);
          color: #ffffff;
          border-color: rgba(23, 162, 184, 0.35);
        }

        .rr-sidebar-link:hover .rr-sidebar-link-icon {
          color: #ffffff;
        }

        .rr-sidebar.collapsed .rr-sidebar-link:hover {
          transform: none;
          background: rgba(23, 162, 184, 0.25);
        }

        .rr-sidebar-link-icon {
          width: 36px;
          height: 36px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: #D1D5DB;
          font-size: 17px;
          flex-shrink: 0;
        }

        .rr-sidebar-link-text {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          white-space: nowrap;
        }

        .active-sidebar-link {
          color: #ffffff !important;
          background: linear-gradient(135deg, rgba(23, 162, 184, 0.40) 0%, rgba(23, 162, 184, 0.28) 100%) !important;
          border-color: rgba(23, 162, 184, 0.50) !important;
          box-shadow: inset 3px 0 0 #17A2B8;
        }

        .rr-sidebar.collapsed .active-sidebar-link {
          width: 56px;
          height: 56px;
        }

        .active-sidebar-link .rr-sidebar-link-icon {
          background: rgba(23, 162, 184, 0.25);
          color: #ffffff;
        }

        .rr-collapsed-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--rr-tooltip-bg);
          color: var(--rr-tooltip-text);
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
          transition: all 0.2s ease;
          z-index: 50;
        }

        .rr-collapsed-tooltip::before {
          content: "";
          position: absolute;
          left: -5px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: var(--rr-tooltip-bg);
        }

        .rr-sidebar.collapsed .rr-sidebar-nav-item:hover .rr-collapsed-tooltip {
          opacity: 1;
          visibility: visible;
        }

        .rr-sidebar-toggle {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 1300;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 1);
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }

        .rr-sidebar-toggle span {
          width: 18px;
          height: 2px;
          background: #0f172a;
          border-radius: 999px;
        }

        .rr-sidebar-backdrop {
          display: none;
        }

        @media (max-width: 991.98px) {
          .rr-sidebar {
            width: 290px;
            transform: translateX(-100%);
          }

          .rr-sidebar.collapsed {
            width: 290px;
          }

          .rr-sidebar.open {
            transform: translateX(0);
          }

          .rr-collapse-btn {
            display: none !important;
          }

          .rr-sidebar-top {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .rr-sidebar-top-actions {
            flex-direction: row;
            width: auto;
          }

          .rr-theme-toggle-btn {
            flex: unset;
          }

          .rr-sidebar-toggle {
            display: inline-flex;
          }

          .rr-mobile-close {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .rr-sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1190;
            background: rgba(15, 23, 42, 0.42);
            backdrop-filter: blur(3px);
          }

          .rr-collapsed-tooltip {
            display: none;
          }

          .rr-brand-mini {
            display: none;
          }

          .rr-brand-logo {
            height: 42px;
          }
        }

        @media (max-width: 575.98px) {
          .rr-sidebar,
          .rr-sidebar.collapsed {
            width: 270px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar3;