import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaChartLine,
  FaMoneyBillWave,
  FaChartBar,
  FaGlobe,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import UserService from "../../services/UserService";
import { useSelector } from "react-redux";
import RSSNewsTicker from "./RSSNewsTicker";

const { REACT_APP_REDIRECT_URI } = process.env;

const Sidebar = ({ collapsed, setCollapsed, theme = "light" }) => {
  const userName = UserService.getUsername()?.toUpperCase() || "USER";
  const { loading, salesData } = useSelector((state) => state.dashboard || {});
  const brandName = salesData?.brand || "Brand Dashboard";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      to: "/cockpit/sales-performance",
      label: "Brand Sales Performance",
      icon: <FaChartLine />,
    },
    {
      to: "/cockpit/media-sales-spends",
      label: "Media Spends Vs Contribution",
      icon: <FaMoneyBillWave />,
    },
    {
      to: "/cockpit/media-roi",
      label: "Media Wise ROI",
      icon: <FaChartBar />,
    },
    {
      to: "/cockpit/region-detail",
      label: "Region Wise Detail",
      icon: <FaGlobe />,
    },
  ];

  return (
    <>
      <aside className={`modern-sidebar ${collapsed ? "collapsed" : ""} ${theme}`}>
        <div className="sidebar-top">
          <div className="brand-block">
            <div className="brand-logo">
              <i className="fas">RR</i>
            </div>

            {!collapsed && (
              <div className="brand-text">
                <h5 className="brand-title mb-0">Cockpit</h5>
                <small className="brand-subtitle">{brandName}</small>
              </div>
            )}
          </div>

          <button
            className="collapse-btn"
            onClick={toggleSidebar}
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        </div>

        <div
          className={`sidebar-user-card ${collapsed ? "justify-content-center" : ""}`}
          title={collapsed ? userName : ""}
        >
          <div className="sidebar-user-avatar">
            <FaUserCircle />
          </div>

          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role">Dashboard User</div>
            </div>
          )}
        </div>

        <div className="sidebar-menu-wrap">
          {!collapsed && <div className="menu-section-title">Navigation</div>}

          <ul className="sidebar-menu-list">
            {navItems.map((item) => (
              <li key={item.to} title={collapsed ? item.label : ""}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? "active" : ""} ${
                      loading ? "nav-disabled" : ""
                    }`
                  }
                  onClick={(e) => {
                    if (loading) e.preventDefault();
                  }}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-news-section">
          <RSSNewsTicker collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            title={collapsed ? "Logout" : ""}
            onClick={() =>
              UserService.doLogout({
                redirectUri: `${REACT_APP_REDIRECT_URI}`,
              })
            }
            type="button"
          >
            <span className="sidebar-nav-icon">
              <FaSignOutAlt />
            </span>
            {!collapsed && <span className="sidebar-nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <style>{`
        .modern-sidebar {
          width: 315px;
          min-width: 315px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px 14px;
          transition: all 0.28s ease;
          z-index: 20;
        }

        /* 30% Structural — Deep Slate base */
        .modern-sidebar.light {
          background: linear-gradient(180deg, #1a2d3d 0%, #2C3E50 45%, #243447 100%);
          border-right: 1px solid rgba(13, 124, 102, 0.12);
          color: #F8F9FA;
          box-shadow: 8px 0 24px rgba(44, 62, 80, 0.18);
        }

        .modern-sidebar.dark {
          background: linear-gradient(180deg, #1a2332 0%, #2C3E50 45%, #1e3040 100%);
          border-right: 1px solid rgba(23, 162, 184, 0.10);
          color: #F8F9FA;
          box-shadow: 8px 0 24px rgba(0, 0, 0, 0.30);
        }

        .modern-sidebar.collapsed {
          width: 92px;
          min-width: 92px;
          padding: 18px 10px;
        }

        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        /* 10% Accent — Forest Emerald logo */
        .brand-logo {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0D7C66 0%, #17A2B8 100%);
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(13, 124, 102, 0.30);
        }

        .brand-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 800;
          color: #F8F9FA;
          line-height: 1.1;
        }

        .brand-subtitle {
          display: block;
          color: #ADB5BD;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .collapse-btn {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border: 1px solid rgba(13, 124, 102, 0.20);
          border-radius: 10px;
          background: rgba(13, 124, 102, 0.10);
          color: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.24s ease;
        }

        .collapse-btn:hover {
          background: rgba(13, 124, 102, 0.25);
          border-color: rgba(13, 124, 102, 0.40);
          color: #FFFFFF;
        }

        .sidebar-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 12px;
          border-radius: 18px;
          background: rgba(13, 124, 102, 0.08);
          border: 1px solid rgba(13, 124, 102, 0.12);
          margin-bottom: 20px;
          transition: all 0.24s ease;
        }

        .sidebar-user-card:hover {
          background: rgba(13, 124, 102, 0.14);
          border-color: rgba(13, 124, 102, 0.22);
        }

        .sidebar-user-avatar {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0D7C66 0%, #0B6B57 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.55rem;
          box-shadow: 0 2px 8px rgba(13, 124, 102, 0.25);
        }

        .sidebar-user-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 13px;
          font-weight: 700;
          color: #F8F9FA;
        }

        .sidebar-user-role {
          font-size: 11px;
          color: #6C757D;
        }

        .sidebar-menu-wrap {
          overflow-y: auto;
        }

        .menu-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #6C757D;
          margin: 0 8px 12px;
        }

        .sidebar-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-menu-list li {
          margin-bottom: 6px;
        }

        .sidebar-nav-link,
        .sidebar-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          color: #ADB5BD;
          text-decoration: none;
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.24s ease;
          font-weight: 600;
          font-size: 14px;
          position: relative;
        }

        /* Hover — Forest Dark #0A6B57 */
        .sidebar-nav-link:hover {
          background: rgba(13, 124, 102, 0.12);
          color: #FFFFFF;
          border-color: rgba(13, 124, 102, 0.18);
        }

        /* Active — Forest Emerald #0D7C66 accent */
        .sidebar-nav-link.active {
          background: linear-gradient(135deg, rgba(13, 124, 102, 0.20) 0%, rgba(23, 162, 184, 0.12) 100%);
          color: #FFFFFF;
          border-color: rgba(13, 124, 102, 0.30);
          box-shadow: inset 3px 0 0 #0D7C66;
        }

        .sidebar-nav-link.active .sidebar-nav-icon {
          color: #0D7C66;
        }

        .sidebar-nav-icon {
          width: 20px;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: color 0.24s ease;
        }

        /* Disabled — 50% opacity per design spec */
        .nav-disabled {
          pointer-events: none;
          opacity: 0.50;
          cursor: not-allowed;
        }

        .sidebar-footer {
          margin-top: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(229, 231, 235, 0.08);
        }

        .sidebar-news-section {
          padding: 4px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* Logout — standard red */
        .sidebar-logout-btn {
          border: 1px solid transparent;
          background: rgba(239, 68, 68, 0.10);
          color: #ef4444;
          transition: all 0.24s ease;
        }

        .sidebar-logout-btn:hover {
          background: rgba(239, 68, 68, 0.20);
          border-color: rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .modern-sidebar.collapsed .sidebar-nav-link,
        .modern-sidebar.collapsed .sidebar-logout-btn {
          justify-content: center;
          padding: 12px;
        }

        @media (max-width: 991px) {
          .modern-sidebar {
            width: 88px;
            min-width: 88px;
            padding: 16px 10px;
          }

          .modern-sidebar .brand-text,
          .modern-sidebar .sidebar-user-info,
          .modern-sidebar .sidebar-nav-label,
          .modern-sidebar .menu-section-title {
            display: none;
          }

          .modern-sidebar .sidebar-nav-link,
          .modern-sidebar .sidebar-logout-btn {
            justify-content: center;
            padding: 12px;
          }

          .modern-sidebar .sidebar-user-card {
            justify-content: center;
            padding: 12px 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;