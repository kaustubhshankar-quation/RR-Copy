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
                            <div className="col">
                                <h3>{title}</h3>
                            </div>
                            <div className="col-auto">
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
                                style={{ color: "white" }}
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
          gap: 24px;
          padding: 24px;
          background: var(--rr-topbar-grad);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--rr-border);
          margin-bottom: 24px;
          border-radius: 16px;
        }

        .rr-app-topbar-left {
          min-width: 0;
        }

        .rr-app-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(13, 124, 102, 0.08);
          color: var(--rr-accent);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .dark-theme .rr-app-tag {
          background: rgba(255, 140, 0, 0.15);
          color: #FF8C00;
        }

        .rr-app-title {
          margin: 0 0 8px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--rr-text-main);
        }

        .rr-app-subtitle {
          max-width: 880px;
          color: var(--rr-text-muted);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.65;
        }

        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 24px;
          border-radius: 16px;
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
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(13, 124, 102, 0.08);
          color: var(--rr-accent);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .dark-theme .hero-tag {
          background: rgba(255, 140, 0, 0.15);
          color: #FF8C00;
        }

        .hero-title {
          margin: 0 0 8px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--rr-text-main);
        }

        .hero-subtitle {
          margin: 0;
          max-width: 880px;
          color: var(--rr-text-muted);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          font-weight: 400;
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
          padding: 16px;
          border-radius: 12px;
          background: var(--rr-bg-panel);
          border: 1px solid var(--rr-border);
          box-shadow: var(--rr-shadow);
          backdrop-filter: blur(8px);
        }

        .hero-stat-label {
          display: block;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          color: var(--rr-text-muted);
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 4px;
        }

        .hero-stat-value {
          display: block;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 17px;
          color: var(--rr-text-main);
          font-weight: 600;
          line-height: 1.4;
        }

        .dashboard-home-container {
          padding: 0;
        }

        .dashboard-card-shell {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
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
          height: 4px;
          background: linear-gradient(90deg, #0D7C66 0%, #17A2B8 100%);
        }

        .dashboard-card-shell:hover {
          transform: translateY(-4px);
        }

        .dashboard-card-header {
          padding: 24px 24px 12px;
        }

        .dashboard-card-header h3 {
          margin: 0;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--rr-text-main);
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .dashboard-card-header h4 {
          margin: 0;
          text-align: center;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #0D7C66;
          background: rgba(13, 124, 102, 0.08);
          padding: 6px 12px;
          border-radius: 9999px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          line-height: 1.4;
        }

        .dark-theme .dashboard-card-header h4 {
          background: rgba(255, 140, 0, 0.15);
          color: #FF8C00;
        }

        .dashboard-card-body {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 80px);
        }

        .dashboard-card-body p {
          margin: 0;
          color: var(--rr-text-muted);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          font-weight: 400;
          min-height: 100px;
        }

        .alborderbottom1 {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, rgba(226,232,240,0) 0%, rgba(203,213,225,1) 50%, rgba(226,232,240,0) 100%);
          margin: 16px 0 16px;
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
          gap: 8px;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #0D7C66 0%, #0A6B57 100%);
          color: #ffffff !important;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(13, 124, 102, 0.25);
          transition: all 0.25s ease;
        }

        .dashboard-card-btn a:hover {
          background: linear-gradient(135deg, #0A6B57 0%, #085545 100%);
          box-shadow: 0 6px 20px rgba(13, 124, 102, 0.35);
          transform: translateY(-2px);
        }

        .brand-options-popup {
          top: calc(100% - 4px);
          left: 0;
          border: 1px solid var(--rr-border);
          border-radius: 12px;
          background: var(--rr-bg-soft);
          box-shadow: var(--rr-shadow);
          backdrop-filter: blur(10px);
          z-index: 20 !important;
        }

        .trybtn {
            margin-top: 8px;
            margin-bottom: 8px;
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
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          background: var(--rr-bg-panel);
          border: 1px solid var(--rr-border);
          color: var(--rr-text-main);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 600;
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
            padding: 20px 16px;
            border-radius: 12px;
          }

          .hero-title {
            font-size: 24px;
          }

          .hero-subtitle {
            font-size: 13px;
          }

          .hero-stat-card {
            width: 100%;
          }

          .dashboard-card-header,
          .dashboard-card-body {
            padding-left: 16px;
            padding-right: 16px;
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