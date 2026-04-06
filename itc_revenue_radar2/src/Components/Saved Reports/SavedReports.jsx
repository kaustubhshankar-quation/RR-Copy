import React, { useEffect, useState } from "react";
import axios from "axios";
import UserService from "../../services/UserService.js";
import getNotification from "../../Redux/Action/action";
import { useDispatch } from "react-redux";
import { downloadPdf } from "../HelperFunction/helperFunction.js";
import maskedBrandOption from "../JSON Files/MaskedBrandOption.json";
import Select from "react-select";
const { REACT_APP_REDIRECT_URI } = process.env;
const { REACT_APP_UPLOAD_DATA } = process.env;

const SavedReports = () => {
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [isfetching, setIsfetching] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingMap, setDownloadingMap] = useState({});

  const reportTypes = [
    "MarketAnalysis",
    "BrandAnalysis",
    "SimulatorReport",
    "OptimizerReport",
  ];

  const reportsPerPage = 12;

  const fetchReports = async () => {
    if (UserService.isLoggedIn()) {
      setIsfetching(true);
      try {
        const config = {
          method: "get",
          url: `${REACT_APP_UPLOAD_DATA}/app/getReports`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        const getResponse = await axios(config);
        setReports(getResponse?.data?.reports || []);
      } catch (err) {
        console.log("Server Error", err);
        if (err.response && err.response.status === 500) {
          dispatch(
            getNotification({
              message: "Server is Down! Please try again after sometime",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 400) {
          dispatch(
            getNotification({
              message: "Input is not in prescribed format",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 422) {
          dispatch(
            getNotification({
              message: "Input is not in prescribed format",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 404) {
          dispatch(
            getNotification({
              message: "Page not Found",
              type: "default",
            })
          );
        } else if (err.response && err.response.status === 401) {
          dispatch(
            getNotification({
              message: "Session expired! Please log in again",
              type: "default",
            })
          );
        }
      } finally {
        setIsfetching(false);
      }
    } else {
      setTimeout(() => {
        UserService.doLogin({
          redirectUri: `${REACT_APP_REDIRECT_URI}/savedreports`,
        });
      }, 1000);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.report_type.replace("_", "") === selectedReportType &&
      (!brandFilter || r.brand.toLowerCase() === brandFilter.toLowerCase())
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const brands = [
    ...new Set(
      reports
        .filter((r) => r.report_type.replace("_", "") === selectedReportType)
        .map((r) => r.brand)
    ),
  ].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <div className="sr-page">
        <div className="container-fluid px-3 px-md-4 py-3">
          <div className="sr-header-card">
            <div className="sr-header-left">
              <div className="sr-breadcrumb">Dashboard / Saved Reports</div>
              <h2 className="sr-page-title">Saved Reports</h2>
              <p className="sr-page-subtitle mb-0">
                Browse, filter, and download previously generated reports across
                market analysis, brand analysis, simulator, and optimizer
                workflows from one workspace.
              </p>
            </div>
          </div>

          {isfetching ? (
            <div className="sr-empty-state my-3">
              <div className="dot-loader">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="mt-2 fw-semibold sr-muted-text">
                Grabbing Details...
              </div>
            </div>
          ) : reports?.length === 0 ? (
            <div className="sr-section-card">
              <div className="sr-empty-message">
                <span className="sr-empty-icon">⚠</span>
                No reports found to display.
              </div>
            </div>
          ) : (
            <>
              <div className="sr-section-card">
                <div className="row align-items-end g-3">
                  <div className="col-12 col-lg-8">
                    <label className="sr-label">
                      Select Report Type <span className="text-danger">*</span>
                    </label>

                    <Select
                      classNamePrefix="sr-select"
                      placeholder="-- Choose Report Type --"
                      options={[
                        { label: "-- Choose Report Type --", value: "" },
                        ...(reportTypes?.map((type) => ({
                          label: type,
                          value: type,
                        })) || []),
                      ]}
                      value={
                        selectedReportType !== undefined && selectedReportType !== null
                          ? {
                            label: selectedReportType || "-- Choose Report Type --",
                            value: selectedReportType || "",
                          }
                          : { label: "-- Choose Report Type --", value: "" }
                      }
                      onChange={(option) => {
                        const value = option?.value || "";
                        setSelectedReportType(value);
                        setBrandFilter("");
                        setCurrentPage(1);
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="sr-type-chip-wrap">
                      <div className="sr-type-chip">
                        {selectedReportType || "No report type selected"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedReportType && (
                <div className="row g-3">
                  <div className="col-12 col-md-4 col-lg-3">
                    <div className="sr-section-card">
                      <h5 className="sr-filter-title">Filters</h5>

                      <div className="mb-2">
                        <label className="sr-label">Brand</label>

                        <Select
                          classNamePrefix="sr-select"
                          placeholder="All Brands"
                          options={[
                            { label: "All Brands", value: "" },
                            ...(brands?.map((brand) => ({
                              label: maskedBrandOption?.maskedBrandOption?.[brand] || brand,
                              value: brand,
                            })) || []),
                          ]}
                          value={
                            brandFilter !== undefined && brandFilter !== null
                              ? {
                                label:
                                  brandFilter === ""
                                    ? "All Brands"
                                    : maskedBrandOption?.maskedBrandOption?.[brandFilter] || brandFilter,
                                value: brandFilter || "",
                              }
                              : { label: "All Brands", value: "" }
                          }
                          onChange={(option) => {
                            const value = option?.value || "";
                            setBrandFilter(value);
                            setCurrentPage(1);
                          }}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </div>

                      <div className="sr-filter-meta mt-3">
                        <div className="sr-filter-stat">
                          <strong>Type</strong>
                          <span>{selectedReportType}</span>
                        </div>
                        <div className="sr-filter-stat">
                          <strong>Brands</strong>
                          <span>{brands.length}</span>
                        </div>
                        <div className="sr-filter-stat">
                          <strong>Results</strong>
                          <span>{filteredReports.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-8 col-lg-9">
                    {currentReports.length === 0 ? (
                        <div className="sr-empty-message sr-empty-message-soft">
                          No reports match the selected filters.
                        </div>
                      ) : (
                        <>
                          <div className="row g-3">
                            {currentReports.map((report) => (
                              <div
                                key={report.id}
                                className="col-12 col-md-6 col-xl-4"
                              >
                                <div className="sr-report-card h-100">
                                  <div className="sr-report-top">
                                    <div className="sr-report-badge">
                                      {report.report_type.replace("_", " ")}
                                    </div>
                                  </div>

                                  <div className="sr-report-body">
                                    <h6 className="sr-report-title">
                                      {maskedBrandOption?.maskedBrandOption?.[
                                        report.brand
                                      ] || report.brand}
                                    </h6>

                                    <div className="sr-report-meta">
                                      <div className="sr-report-meta-item">
                                        <strong>File Name</strong>
                                        <span>{report.pdf_name}</span>
                                      </div>

                                      <div className="sr-report-meta-item">
                                        <strong>Brand</strong>
                                        <span>
                                          {maskedBrandOption?.maskedBrandOption?.[
                                            report.brand
                                          ] || report.brand}
                                        </span>
                                      </div>

                                      <div className="sr-report-meta-item">
                                        <strong>Created</strong>
                                        <span>{report.created_at}</span>
                                      </div>
                                    </div>

                                    <button
                                      disabled={!!downloadingMap[report.job_id]}
                                      className="sr-primary-btn mt-auto"
                                      onClick={() => {
                                        setDownloadingMap((prev) => ({ ...prev, [report.job_id]: true }));

                                        downloadPdf(report.job_id, () => {
                                          setDownloadingMap((prev) => ({
                                            ...prev,
                                            [report.job_id]: false,
                                          }));
                                        });
                                      }}
                                    >
                                      {downloadingMap[report.job_id] ? "Downloading..." : "Download Report"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {totalPages > 1 && (
                            <div className="sr-pagination-wrap mt-4">
                              <button
                                className="sr-pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                              >
                                Previous
                              </button>

                              <div className="sr-pagination-numbers">
                                {[...Array(totalPages)].map((_, idx) => (
                                  <button
                                    key={idx}
                                    className={`sr-page-number ${currentPage === idx + 1 ? "active" : ""
                                      }`}
                                    onClick={() => setCurrentPage(idx + 1)}
                                  >
                                    {idx + 1}
                                  </button>
                                ))}
                              </div>

                              <button
                                className="sr-pagination-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .sr-page {
          color: var(--rr-text-main);
        }

        .sr-header-card,
        .sr-section-card,
        .sr-empty-state,
        .sr-report-card {
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 22px;
        }

        .sr-header-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          padding: 22px 24px;
          margin-bottom: 18px;
          background: var(
            --rr-topbar-grad,
            linear-gradient(135deg, var(--rr-bg-soft) 0%, var(--rr-bg-panel) 100%)
          );
        }

        .sr-header-left {
          min-width: 0;
        }

        .sr-breadcrumb {
          font-size: 12px;
          font-weight: 700;
          color: var(--rr-text-muted);
          margin-bottom: 8px;
        }

        .sr-page-title {
          margin: 0;
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--rr-text-main);
        }

        .sr-page-subtitle {
          margin-top: 8px;
          max-width: 920px;
          color: var(--rr-text-muted);
          font-size: 13px;
          line-height: 1.7;
          font-weight: 500;
        }

        .sr-section-card {
          padding: 20px;
          margin-bottom: 18px;
        }

        .sr-label {
          display: inline-block;
          margin-bottom: 8px;
          color: var(--rr-text-main);
          font-size: 13px;
          font-weight: 700;
        }

        .sr-native-select {
          min-height: 46px;
          border-radius: 14px;
          border: 1px solid var(--rr-border);
          background: var(--rr-bg-soft);
          color: var(--rr-text-main);
          box-shadow: none !important;
        }

        .sr-native-select:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.12) !important;
          background: var(--rr-bg-soft);
          color: var(--rr-text-main);
        }

        .sr-select__control {
          min-height: 46px !important;
          border-radius: 14px !important;
          border: 1px solid var(--rr-border) !important;
          background: var(--rr-bg-soft) !important;
          box-shadow: var(--rr-shadow) !important;
          transition: all 0.22s ease !important;
        }

        .sr-select__control:hover {
          border-color: #93c5fd !important;
        }

        .sr-select__control--is-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16) !important;
        }

        .sr-select__single-value,
        .sr-select__placeholder,
        .sr-select__input-container,
        .sr-select__input input {
          color: var(--rr-text-main) !important;
        }

        .sr-select__menu {
            margin-top: 8px !important;
            border-radius: 16px !important;
            border: 1px solid var(--rr-border) !important;
            background: rgba(3, 25, 72) !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35) !important;
            overflow: hidden !important;
            z-index: 9999 !important;
            opacity: 1 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            color:#fff !important;
        }

        .sr-select__menu-list {
          padding: 8px !important;
          max-height: 260px !important;
          background: var(--rr-bg-soft) !important;
        }

        .sr-select__option {
          padding: 10px 12px !important;
          border-radius: 10px !important;
          background: transparent !important;
          color: var(--rr-text-main) !important;
          transition: all 0.18s ease !important;
        }

        .sr-select__option--is-focused {
          background: rgba(37, 99, 235, 0.08) !important;
          color: var(--rr-text-main) !important;
        }

        .sr-select__option--is-selected {
          bbackground: linear-gradient(135deg, #1d4ed8 0%, #031336 100%) !important;
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .sr-select__option:active {
          background: rgba(37, 99, 235, 0.16) !important;
          color: var(--rr-text-main) !important;
        }

        .sr-select__indicator-separator {
          background-color: var(--rr-border) !important;
        }

        .sr-select__dropdown-indicator,
        .sr-select__clear-indicator {
          color: var(--rr-text-muted) !important;
        }

        .sr-select__dropdown-indicator:hover,
        .sr-select__clear-indicator:hover {
          color: var(--rr-text-main) !important;
        }

        .sr-select__menu-notice,
        .sr-select__no-options-message,
        .sr-select__loading-message {
          color: var(--rr-text-muted) !important;
          background: var(--rr-bg-soft) !important;
        }

        .sr-select__menu-portal {
          z-index: 9999 !important;
        }

        .sr-type-chip-wrap {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 46px;
        }

        .sr-type-chip {
          display: inline-flex;
          align-items: center;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.12);
          border: 1px solid rgba(37, 99, 235, 0.22);
          color: var(--rr-text-main);
          font-size: 13px;
          font-weight: 700;
        }

        .sr-filter-title {
          margin: 0 0 14px;
          color: var(--rr-text-main);
          font-size: 1rem;
          font-weight: 800;
        }

        .sr-filter-meta {
          display: grid;
          gap: 10px;
        }

        .sr-filter-stat {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid var(--rr-border);
          background: var(--rr-bg-soft);
        }

        .sr-filter-stat strong {
          color: var(--rr-text-main);
          font-size: 12px;
        }

        .sr-filter-stat span {
          color: var(--rr-text-muted);
          font-size: 12px;
          font-weight: 700;
        }

        .sr-report-card {
          padding: 14px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .sr-report-card:hover {
          transform: translateY(-3px);
          border-color: rgba(37, 99, 235, 0.28);
        }

        .sr-report-top {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .sr-report-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(15, 194, 81, 0.42);
          border: 1px solid rgba(22, 163, 74, 0.22);
          color: var(--rr-text-main);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .sr-report-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
          height: 100%;
        }

        .sr-report-title {
          margin: 0;
          color: var(--rr-text-main);
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.4;
        }

        .sr-report-meta {
          display: grid;
          gap: 10px;
        }

        .sr-report-meta-item {
          display: grid;
          gap: 4px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid var(--rr-border);
          background: var(--rr-bg-soft);
        }

        .sr-report-meta-item strong {
          color: var(--rr-text-main);
          font-size: 12px;
        }

        .sr-report-meta-item span {
          color: var(--rr-text-muted);
          font-size: 12px;
          word-break: break-word;
        }

        .sr-primary-btn,
        .sr-secondary-btn {
          border: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .sr-primary-btn {
          color: #ffffff;
          background: #2563eb;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
        }

        .sr-primary-btn:hover {
          transform: translateY(-1px);
        }

        .sr-primary-btn:disabled,
        .sr-pagination-btn:disabled,
        .sr-page-number:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .sr-empty-state {
          padding: 24px;
          text-align: center;
          color: var(--rr-text-muted);
          font-weight: 700;
        }

        .sr-empty-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 120px;
          border-radius: 18px;
          border: 1px dashed var(--rr-border);
          background: rgba(245, 158, 11, 0.08);
          color: var(--rr-text-main);
          font-weight: 700;
        }

        .sr-empty-message-soft {
          min-height: 180px;
          background: rgba(37, 99, 235, 0.05);
        }

        .sr-empty-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.14);
        }

        .sr-muted-text {
          color: var(--rr-text-muted);
        }

        .sr-pagination-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sr-pagination-numbers {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .sr-pagination-btn,
        .sr-page-number {
          border: 1px solid var(--rr-border);
          background: var(--rr-bg-soft);
          color: var(--rr-text-main);
          border-radius: 12px;
          min-width: 42px;
          height: 42px;
          padding: 0 14px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .sr-pagination-btn:hover,
        .sr-page-number:hover {
          border-color: rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .sr-page-number.active {
          color: #ffffff;
          border-color: transparent;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
        }

        .dot-loader {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .dot-loader div {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #2563eb;
          animation: srBounce 1.2s infinite ease-in-out;
        }

        .dot-loader div:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot-loader div:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes srBounce {
          0%, 80%, 100% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 992px) {
          .sr-header-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .sr-type-chip-wrap {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .sr-header-card,
          .sr-section-card,
          .sr-empty-state,
          .sr-report-card {
            border-radius: 18px;
          }

          .sr-header-card {
            padding: 18px;
          }

          .sr-page-title {
            font-size: 1.4rem;
          }

          .sr-primary-btn,
          .sr-pagination-btn {
            width: 100%;
          }

          .sr-pagination-wrap {
            align-items: stretch;
          }

          .sr-pagination-numbers {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default SavedReports;