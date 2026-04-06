import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import UserService from "../../services/UserService";

function DashboardHome() {
    const navigate = useNavigate();
    const { theme } = useOutletContext();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);

    const renderBrandOptions = (index, attaLink, otherLink) =>
        hoveredIndex === index && (
            <div className="brand-options-popup card p-3 position-absolute w-100 mt-2">
                <div className="d-flex flex-column flex-sm-row justify-content-around gap-2">
                    <div className="trybtn3">
                        <a href={attaLink}>ATTA</a>
                    </div>
                    <div className="trybtn3">
                        <a href={otherLink}>BI | SX | ND</a>
                    </div>
                </div>
            </div>
        );

    const renderCard = (
        title,
        subtitle,
        description,
        index,
        attaLink,
        otherLink,
        onClick,
        isAdminOnly = false,
        isBrandManager = false
    ) => {
        if (isAdminOnly && !UserService.hasRole(["adminrole"])) return null;
        if (isBrandManager && !UserService.hasRole(["BBMNGR", "OODMNGR"])) return null;

        const isHoverable = attaLink && otherLink;

        return (
            <div
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-4 position-relative dashboard-card-col"
                onMouseLeave={() => isHoverable && handleMouseLeave()}
            >
                <div className="afterlogcon3box1 h-100 dashboard-card-shell p-4">
                    <div className="col-12 padding dashboard-card-header">
                        <div className="row align-items-start">
                            <div className="col-8">
                                <h3>{title}</h3>
                            </div>
                            <div className="col-4">
                                <h4>{subtitle}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 dashboard-card-body mt-2">
                        <p>{description}</p>
                        <div className="alborderbottom1"></div>

                        <div
                            className="trybtn dashboard-card-btn"
                            onMouseEnter={() => isHoverable && handleMouseEnter(index)}
                            style={{ cursor: "pointer" }}
                        >
                            <a
                                style={{ color: "white",fontSize:'18px' }}
                                onClick={() => onClick?.(index)}
                                aria-label="DE"
                            >
                                {attaLink ? "Select Brand" : "Go"}{" "}
                                <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
                            </a>
                        </div>

                        {attaLink && renderBrandOptions(index, attaLink, otherLink)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={`dashboard-home-page ${theme}-theme`}>
                <div className="rr-app-topbar">
                    <div className="rr-app-topbar-left">
                        <div className="rr-app-tag">Decision Intelligence Suite</div>
                        <h2 className="rr-app-title">Executive Workspace</h2>
                        <p className="rr-app-subtitle mb-0">
                            Access diagnostics, simulation, optimization, reporting and
                            brand-level intelligence from one unified workspace.
                        </p>
                    </div>

                    <div className="hero-right">
                        <div className="hero-stat-card">
                            <span className="hero-stat-label">Modules</span>
                            <strong className="hero-stat-value">9+</strong>
                        </div>
                        <div className="hero-stat-card">
                            <span className="hero-stat-label">Access</span>
                            <strong className="hero-stat-value">Role Based</strong>
                        </div>
                    </div>
                </div>
                <div className="container-fluid dashboard-home-container">
                    <div className="row dashboard-grid">
                        {renderCard(
                            "Refresh Model",
                            "Admin",
                            "Refresh Model feature enables the administrator to upload a new Excel file containing updated data and refresh the system's model accordingly.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/refreshmodel"),
                            true
                        )}

                        {renderCard(
                            "Brand Cockpit",
                            "Manager",
                            "Brand Cockpit offers a comprehensive overview of brand performance by integrating sales, media spends, and ROI insights, helping stakeholders make data-driven strategic decisions.",
                            null,
                            null,
                            null,
                            () => navigate("/cockpit"),
                            false,
                            true
                        )}

                        {renderCard(
                            "Model Performance",
                            "Diagnostics",
                            "Model Performance compares actual outcomes with predicted results to assess accuracy and reliability of the model which provides insights for refining and improving model predictions over time.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/modelperformance")
                        )}

                        {renderCard(
                            "Market Analysis",
                            "Diagnostics",
                            "Market Analysis dissects expenditure trends among single brand with multiple tactics in a specific source of expenditure over a defined time frame, providing valuable insights for analytics.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/marketanalysis")
                        )}

                        {renderCard(
                            "Brand Analysis",
                            "Diagnostics",
                            "Brand Analysis dissects expenditure trends among single brand with multiple tactics in a specific source of expenditure over a defined time frame, providing valuable insights for analytics.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/brandanalysis")
                        )}

                        {renderCard(
                            "Scenario Planner",
                            "Simulation",
                            "Scenario Planner offers an advanced solution for analyzing expenditure data, transforming raw financial inputs into comprehensive charts, uncovering patterns and trends, enabling users to gain actionable insights.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/simulator")
                        )}

                        {renderCard(
                            "Optimized Spends",
                            "Optimization",
                            "Optimized Spends analyzes expenditure data and user-defined budgets to recommend optimal spending strategies helping in allocation of resources, ensuring maximum return on investment.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/optimizer")
                        )}

                        {renderCard(
                            "Saved Scenarios",
                            "Simulation",
                            "Saved Scenarios analyzes expenditure data and user-defined budgets to recommend optimal spending strategies helping in allocation of resources, ensuring maximum return on investment.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/savedscenarios")
                        )}

                        {renderCard(
                            "Saved Reports",
                            "User Saved",
                            "Saved Reports lets User to access securely their saved reports for future reference and continued analysis.",
                            null,
                            null,
                            null,
                            () => navigate("/dashboard/savedreports")
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .dashboard-home-page {
          min-height: 100%;
        }

        .dashboard-home-hero {
          padding-bottom: 12px;
        }
        .rr-app-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding: 22px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--rr-border);
        }

        .rr-app-topbar-left {
          min-width: 0;
        }

                .rr-app-tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          margin-bottom: 10px;
        }

        .dark-theme .rr-app-tag {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .rr-app-title {
          margin: 0 0 6px;
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--rr-text-main);
        }

        .rr-app-subtitle {
          max-width: 760px;
          color: var(--rr-text-muted);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.7;
        }

        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 28px 30px;
          border-radius: 24px;
          background: var(--rr-topbar-grad);
          border: 1px solid var(--rr-border);
          box-shadow: var(--rr-shadow);
        }

        .hero-left {
          min-width: 0;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          margin-bottom: 12px;
        }

        .dark-theme .hero-tag {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .hero-title {
          margin: 0 0 8px;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.15;
          color: var(--rr-text-main);
        }

        .hero-subtitle {
          margin: 0;
          max-width: 760px;
          color: var(--rr-text-muted);
          font-size: 14px;
          line-height: 1.7;
          font-weight: 500;
        }

        .hero-right {
          display: flex;
          align-items: stretch;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .hero-stat-card {
          min-width: 140px;
          padding: 14px 16px;
          border-radius: 18px;
          background: var(--rr-bg-panel);
          border: 1px solid var(--rr-border);
          box-shadow: var(--rr-shadow);
          backdrop-filter: blur(8px);
        }

        .hero-stat-label {
          display: block;
          font-size: 12px;
          color: var(--rr-text-muted);
          font-weight: 700;
          margin-bottom: 6px;
        }

        .hero-stat-value {
          display: block;
          font-size: 1rem;
          color: var(--rr-text-main);
          font-weight: 800;
        }

        .dashboard-home-container {
          padding: 6px 0 0;
        }

        .dashboard-card-shell {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          padding: 0;
        }

        .dashboard-card-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, #2563eb 0%, #16a34a 100%);
        }

        .dashboard-card-shell:hover {
          transform: translateY(-6px);
        }

        .dashboard-card-header {
          padding: 22px 22px 12px;
        }

        .dashboard-card-header h3 {
          margin: 0;
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--rr-text-main);
          line-height: 1.3;
        }

        .dashboard-card-header h4 {
          margin: 0;
          text-align: right;
          font-size: 11px;
          font-weight: 800;
          color: #2563eb;
          background: #eff6ff;
          padding: 8px 10px;
          border-radius: 999px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 34px;
          text-transform: uppercase;
          letter-spacing: 0.35px;
        }

        .dark-theme .dashboard-card-header h4 {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .dashboard-card-body {
          padding: 0 22px 22px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 80px);
        }

        .dashboard-card-body p {
          margin: 0;
          color: var(--rr-text-muted);
          font-size: 14px;
          line-height: 1.7;
          font-weight: 500;
          min-height: 100px;
        }

        .alborderbottom1 {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, rgba(226,232,240,0) 0%, rgba(203,213,225,1) 50%, rgba(226,232,240,0) 100%);
          margin: 18px 0 16px;
        }

        .dark-theme .alborderbottom1 {
          background: linear-gradient(90deg, rgba(36,48,65,0) 0%, rgba(71,85,105,1) 50%, rgba(36,48,65,0) 100%);
        }

        .dashboard-card-btn {
          margin-top: auto;
          display: inline-flex;
          align-self: flex-start;
          padding: 0;
          background: none !important;
        }

        .dashboard-card-btn a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 12px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          color: #ffffff !important;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
          transition: all 0.25s ease;
        }

        .brand-options-popup {
          top: calc(100% - 4px);
          left: 0;
          border: 1px solid var(--rr-border);
          border-radius: 18px;
          background: var(--rr-bg-soft);
          box-shadow: var(--rr-shadow);
          backdrop-filter: blur(10px);
          z-index: 20 !important;
        }

        .trybtn {
            margin-top: 10px;
            margin-bottom: 10px;
            transition: all 0.25s ease;
            backdrop-filter: blur(6px);
        }
        .trybtn:hover {
          transform: translateY(-2px) scale(1.02);
        }

        .trybtn3 a {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-width: 140px;
          padding: 11px 16px;
          border-radius: 12px;
          text-decoration: none;
          background: var(--rr-bg-panel);
          border: 1px solid var(--rr-border);
          color: var(--rr-text-main);
          font-size: 18px;
          font-weight: 700;
          transition: all 0.25s ease;
        }
        .trybtn a iconify-icon {
            position: relative;
            right: -5%;
            top: -5px;
            margin-top: 10px;
            background-color: #fff;
            border-radius: 100px;
            width: 25px;
            height: 25px;
            color: #063970;
            padding: 5px 0px 0px 5px;
            -webkit-box-shadow: 0px 0px 13px -2px rgba(0, 0, 0, 0.45);
            -moz-box-shadow: 0px 0px 13px -2px rgba(0, 0, 0, 0.45);
            box-shadow: 0px 0px 13px -2px rgba(0, 0, 0, 0.45);
        }

        @media (max-width: 1200px) {
          .hero-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-right {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .hero-inner {
            padding: 20px 18px;
            border-radius: 20px;
          }

          .hero-title {
            font-size: 1.55rem;
          }

          .hero-subtitle {
            font-size: 13px;
          }

          .hero-stat-card {
            width: 100%;
          }

          .dashboard-card-header,
          .dashboard-card-body {
            padding-left: 18px;
            padding-right: 18px;
          }

          .dashboard-card-body p {
            min-height: auto;
            font-size: 13px;
          }

          .dashboard-card-btn,
          .dashboard-card-btn a {
            width: 100%;
          }

          .dashboard-card-btn a {
            justify-content: center;
          }

          .trybtn3 a {
            min-width: 100%;
          }
        }
      `}</style>
        </>
    );
}

export default DashboardHome;