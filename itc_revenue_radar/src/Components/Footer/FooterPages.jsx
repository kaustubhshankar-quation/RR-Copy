import React from "react";
import copyimg from "../../Assets/Images/copyimg.webp";
// import copyimg from "../../Assets/Images/ftr.png";

function FooterPages() {
  return (
    <>
      <footer className="footer-modern">
        <div className="footer-inner container-fluid">
          <div className="row align-items-center g-3">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="footer-brand-wrap">
                <div className="footer-logo-box">
                  <img
                    src={copyimg}
                    alt="Revenue Radar"
                    className="footer-logo"
                  />
                </div>

                <div className="footer-brand-text">
                  <h6 className="footer-title mb-1">Revenue Radar</h6>
                  <small className="footer-copy">
                    © 2023 Quation Solutions Pvt. Ltd. All rights reserved.
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="footer-actions">
                <a
                  href="#top"
                  className="social-btn scroll-top"
                  aria-label="Scroll to top"
                >
                  <i className="fas fa-arrow-up"></i>
                </a>
              </div>
            </div>

          </div>

        </div>
      </footer>

      <style>{`
        .footer-modern {
          width: 100%;
          margin-top: auto;
          padding: 14px 20px;
          border-top: 1px solid var(--rr-border, #e2e8f0);
          background: var(--rr-bg-panel, rgba(255,255,255,0.86));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.04);
        }

        .footer-inner {
          padding: 0;
        }

        .footer-brand-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .footer-logo-box {
          width: fit;
          height: fit;
          padding:0.25rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%);
          border: 1px solid var(--rr-border, #e2e8f0);
          flex-shrink: 0;
        }

        .footer-brand-text {
          min-width: 0;
        }

        .footer-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--rr-text-main, #0f172a);
          margin: 0;
          line-height: 1.2;
        }

        .footer-copy {
          color: var(--rr-text-muted, #64748b);
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .social-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--rr-text-main, #0f172a);
          background: var(--rr-bg-soft, #ffffff);
          border: 1px solid var(--rr-border, #e2e8f0);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
          transition: all 0.25s ease;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          border-color: transparent;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
        }

        .scroll-top {
          font-weight: 700;
        }

        @media (max-width: 767.98px) {
          .footer-modern {
            padding: 14px;
          }

          .footer-brand-wrap {
            justify-content: center;
            text-align: center;
          }

          .footer-brand-text {
            width: 100%;
          }

          .footer-actions {
            justify-content: center;
          }

          .footer-logo-box {
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}

export default FooterPages;