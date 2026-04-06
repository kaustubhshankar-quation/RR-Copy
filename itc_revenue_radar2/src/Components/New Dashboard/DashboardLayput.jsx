import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar3 from "../Navbars/Navbar3";
import FooterPages from "../Footer/FooterPages";

function DashboardLayout({ theme = "light", toggleTheme}) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <div className={`rr-app-shell ${theme}-theme`}>
        <Navbar3
          theme={theme}
          toggleTheme={toggleTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="rr-app-main" data-collapsed={collapsed ? "true" : "false"}>
          <main className="rr-app-content">
            <Outlet context={{ theme, collapsed }} />
          </main>

          <footer className="rr-app-footer">
            <FooterPages />
          </footer>
        </div>
      </div>

      <style>{`
        .rr-app-shell {
          min-height: 100vh;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .light-theme {
          --rr-bg-main: #F8F9FA;
          --rr-bg-soft: #FFFFFF;
          --rr-bg-panel: rgba(255, 255, 255, 0.85);
          --rr-text-main: #2C3E50;
          --rr-text-muted: #6C757D;
          --rr-border: #E5E7EB;
          --rr-shadow: 0 4px 24px rgba(44, 62, 80, 0.06);
          --rr-accent: #0D7C66;
          --rr-accent-light: #E8F5E8;
          --rr-accent-secondary: #17A2B8;
          --rr-danger: #DC3545;
          --rr-content-grad:
            radial-gradient(circle at top right, rgba(13, 124, 102, 0.06), transparent 26%),
            radial-gradient(circle at bottom left, rgba(23, 162, 184, 0.05), transparent 28%),
            linear-gradient(180deg, #F8F9FA 0%, #EFF1F3 100%);
        }

        .dark-theme {
          --rr-bg-main: #1A252F;
          --rr-bg-soft: #2C3E50;
          --rr-bg-panel: rgba(26, 37, 47, 0.92);
          --rr-text-main: #F8F9FA;
          --rr-text-muted: #ADB5BD;
          --rr-border: #4A6274;
          --rr-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
          --rr-accent: #0D7C66;
          --rr-accent-light: rgba(13, 124, 102, 0.15);
          --rr-accent-secondary: #17A2B8;
          --rr-danger: #DC3545;
          --rr-content-grad:
            radial-gradient(circle at top right, rgba(13, 124, 102, 0.08), transparent 26%),
            radial-gradient(circle at bottom left, rgba(23, 162, 184, 0.06), transparent 28%),
            linear-gradient(180deg, #1A252F 0%, #1E2D3A 100%);
        }

        .rr-app-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--rr-content-grad);
          color: var(--rr-text-main);
          min-width: 0;
          transition: margin-left 0.28s ease, background 0.25s ease, color 0.25s ease;
          margin-left: 290px;
        }

        .rr-app-main[data-collapsed="true"] {
          margin-left: 88px;
        }

        .rr-app-content {
          flex: 1;
          padding: 22px;
          min-width: 0;
        }

        .rr-app-footer {
          margin-top: auto;
          border-top: 1px solid var(--rr-border);
          background: var(--rr-bg-panel);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        @media (max-width: 991.98px) {
          .rr-app-main,
          .rr-app-main[data-collapsed="true"] {
            margin-left: 0;
            padding-top: 72px;
          }

          .rr-app-content {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
}

export default DashboardLayout;