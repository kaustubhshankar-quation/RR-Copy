import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

const RegionWiseDetail = () => {
  const { regionWiseData, loading } = useSelector((state) => state.dashboard || {});
  const { theme } = useOutletContext();
  const isDark = theme === "dark";

  const [activeQuarter, setActiveQuarter] = useState("");

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₹ 0";
    return `₹ ${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  const formatCr = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₹ 0 Cr";
    return `₹ ${(Number(value) / 10000000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  };

  const getGrowthClass = (value) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-secondary";
  };

  const getGrowthBadgeClass = (value) => {
    if (value > 0) return "bg-success-subtle text-success";
    if (value < 0) return "bg-danger-subtle text-danger";
    return "bg-secondary-subtle text-secondary";
  };

  const quarterList = useMemo(() => {
    return regionWiseData?.qtr_sales_region_wise?.map((item) => item.fy_quarter) || [];
  }, [regionWiseData]);

  useEffect(() => {
    if (quarterList.length && !activeQuarter) {
      setActiveQuarter(quarterList[0]);
    }
  }, [quarterList, activeQuarter]);

  const activeQuarterData = useMemo(() => {
    return (
      regionWiseData?.qtr_sales_region_wise?.find(
        (item) => item.fy_quarter === activeQuarter
      ) || null
    );
  }, [regionWiseData, activeQuarter]);

  const totalPreviousFY = useMemo(() => {
    return (
      regionWiseData?.yearly_sales_region_wise?.reduce(
        (sum, item) => sum + (Number(item.previous_fy) || 0),
        0
      ) || 0
    );
  }, [regionWiseData]);

  const totalCurrentFY = useMemo(() => {
    return (
      regionWiseData?.yearly_sales_region_wise?.reduce(
        (sum, item) => sum + (Number(item.current_fy) || 0),
        0
      ) || 0
    );
  }, [regionWiseData]);

  const overallGrowth = useMemo(() => {
    if (!totalPreviousFY) return 0;
    return ((totalCurrentFY - totalPreviousFY) / totalPreviousFY) * 100;
  }, [totalPreviousFY, totalCurrentFY]);

  const bestRegion = useMemo(() => {
    if (!regionWiseData?.yearly_sales_region_wise?.length) return null;
    return [...regionWiseData.yearly_sales_region_wise].sort(
      (a, b) => (b.change_percent || 0) - (a.change_percent || 0)
    )[0];
  }, [regionWiseData]);

  const weakestRegion = useMemo(() => {
    if (!regionWiseData?.yearly_sales_region_wise?.length) return null;
    return [...regionWiseData.yearly_sales_region_wise].sort(
      (a, b) => (a.change_percent || 0) - (b.change_percent || 0)
    )[0];
  }, [regionWiseData]);

  if (loading) {
    return (
      <div className="container-fluid py-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-5 text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "2.7rem", height: "2.7rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="fw-semibold mb-1">Preparing Region Wise Details...</h5>
            <p className="text-muted mb-0">
              Fetching yearly and quarter-wise regional performance
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!regionWiseData || !regionWiseData?.yearly_sales_region_wise?.length) {
    return (
      <div className="container-fluid py-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-5 text-center">
            <i className="fas fa-map-marked-alt fs-1 text-muted mb-3"></i>
            <h5 className="fw-semibold">No Region Data Available</h5>
            <p className="text-muted mb-0">
              Region-wise details will appear here once data is loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 region-detail-header">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h3 className="fw-bold mb-1">
                <i className="fas fa-globe-asia text-primary me-2"></i>
                Region Wise Details
              </h3>
              <p className="text-muted mb-0">
                Detailed regional performance view for{" "}
                <span className="fw-semibold text-dark">{regionWiseData.brand}</span>
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2">
                Brand: {regionWiseData.brand}
              </span>
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                Previous FY: {regionWiseData.previous_fy}
              </span>
              <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                Current FY: {regionWiseData.current_fy}
              </span>
              <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2">
                Data Till: {regionWiseData.data_present_till}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 region-kpi-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted d-block">Previous FY Sales</small>
                  <h4 className="fw-bold mt-2 mb-1 text-primary">
                    {formatCr(totalPreviousFY)}
                  </h4>
                  <small className="text-muted">{regionWiseData.previous_fy}</small>
                </div>
                <div className="icon-wrap bg-primary-subtle text-primary">
                  <i className="fas fa-chart-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 region-kpi-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted d-block">Current FY Sales</small>
                  <h4 className="fw-bold mt-2 mb-1 text-success">
                    {formatCr(totalCurrentFY)}
                  </h4>
                  <small className="text-muted">{regionWiseData.current_fy}</small>
                </div>
                <div className="icon-wrap bg-success-subtle text-success">
                  <i className="fas fa-sack-dollar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 region-kpi-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted d-block">Overall Growth</small>
                  <h4 className={`fw-bold mt-2 mb-1 ${getGrowthClass(overallGrowth)}`}>
                    {overallGrowth >= 0 ? "+" : ""}
                    {overallGrowth.toFixed(2)}%
                  </h4>
                  <small className="text-muted">All regions combined</small>
                </div>
                <div
                  className={`icon-wrap ${
                    overallGrowth >= 0
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  }`}
                >
                  <i className="fas fa-arrow-trend-up"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 region-kpi-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted d-block">Best Growth Region</small>
                  <h4 className="fw-bold mt-2 mb-1 text-dark">
                    {bestRegion?.final_market || "-"}
                  </h4>
                  <small className="text-success fw-semibold">
                    {bestRegion ? `+${bestRegion.change_percent?.toFixed(2)}%` : "-"}
                  </small>
                </div>
                <div className="icon-wrap bg-info-subtle text-info">
                  <i className="fas fa-trophy"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Performance Cards */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4 pb-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Yearly Performance by Region</h5>
            <span className="text-muted small">
              Comparing {regionWiseData.previous_fy} vs {regionWiseData.current_fy}
            </span>
          </div>
        </div>

        <div className="card-body pt-3">
          <div className="row g-4">
            {regionWiseData.yearly_sales_region_wise.map((item, index) => {
              const diff = (Number(item.current_fy) || 0) - (Number(item.previous_fy) || 0);

              return (
                <div className="col-xl-3 col-md-6" key={`${item.final_market}-${index}`}>
                  <div className="region-performance-card h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="fw-bold mb-0">{item.final_market}</h6>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${getGrowthBadgeClass(
                          item.change_percent
                        )}`}
                      >
                        {item.change_percent >= 0 ? "+" : ""}
                        {Number(item.change_percent || 0).toFixed(2)}%
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>{regionWiseData.previous_fy}</span>
                        <span>{formatCr(item.previous_fy)}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>{regionWiseData.current_fy}</span>
                        <span>{formatCr(item.current_fy)}</span>
                      </div>
                    </div>

                    <div className="region-progress-track mb-3">
                      <div
                        className="region-progress-fill"
                        style={{
                          width: `${
                            Math.min(
                              ((Number(item.current_fy) || 0) /
                                Math.max(
                                  ...(regionWiseData.yearly_sales_region_wise || []).map(
                                    (r) => Number(r.current_fy) || 0
                                  ),
                                  1
                                )) *
                                100,
                              100
                            ) || 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Absolute Change</small>
                      <small className={`fw-semibold ${getGrowthClass(diff)}`}>
                        {diff >= 0 ? "+" : ""}
                        {formatCr(diff)}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quarter Wise Detail */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h5 className="fw-bold mb-0">Quarter Wise Regional Details</h5>

            <div className="quarter-tabs d-flex flex-wrap gap-2">
              {quarterList.map((quarter) => (
                <button
                  key={quarter}
                  className={`btn btn-sm rounded-pill px-3 ${
                    activeQuarter === quarter ? "btn-primary" : "btn-light border"
                  }`}
                  onClick={() => setActiveQuarter(quarter)}
                >
                  {quarter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-body">
          {activeQuarterData?.regions?.length ? (
            <>
              <div className="table-responsive">
                <table className="table align-middle region-table">
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>{regionWiseData.previous_fy}</th>
                      <th>{regionWiseData.current_fy}</th>
                      <th>Absolute Change</th>
                      <th>% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeQuarterData.regions.map((region, index) => {
                      const prev = Number(region.previous_fy) || 0;
                      const curr = Number(region.current_fy) || 0;
                      const diff = curr - prev;
                      const pct = prev ? (diff / prev) * 100 : 0;

                      return (
                        <tr key={`${region.final_market}-${index}`}>
                          <td>
                            <span className="fw-semibold">{region.final_market}</span>
                          </td>
                          <td>{formatCr(prev)}</td>
                          <td>{formatCr(curr)}</td>
                          <td className={getGrowthClass(diff)}>
                            <span className="fw-semibold">
                              {diff >= 0 ? "+" : ""}
                              {formatCr(diff)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${getGrowthBadgeClass(
                                pct
                              )}`}
                            >
                              {pct >= 0 ? "+" : ""}
                              {pct.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="row g-4 mt-1">
                {activeQuarterData.regions.map((region, index) => {
                  const prev = Number(region.previous_fy) || 0;
                  const curr = Number(region.current_fy) || 0;
                  const diff = curr - prev;
                  const pct = prev ? (diff / prev) * 100 : 0;

                  return (
                    <div className="col-lg-3 col-md-6" key={`q-card-${region.final_market}-${index}`}>
                      <div className="quarter-region-card h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0">{region.final_market}</h6>
                          <span
                            className={`badge rounded-pill ${getGrowthBadgeClass(pct)}`}
                          >
                            {pct >= 0 ? "+" : ""}
                            {pct.toFixed(2)}%
                          </span>
                        </div>

                        <div className="small text-muted mb-1">
                          {regionWiseData.previous_fy}:{" "}
                          <span className="fw-semibold text-dark">{formatCr(prev)}</span>
                        </div>
                        <div className="small text-muted mb-3">
                          {regionWiseData.current_fy}:{" "}
                          <span className="fw-semibold text-dark">{formatCr(curr)}</span>
                        </div>

                        <div className="small">
                          <span className="text-muted">Change: </span>
                          <span className={`fw-bold ${getGrowthClass(diff)}`}>
                            {diff >= 0 ? "+" : ""}
                            {formatCr(diff)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted">
              No quarter-wise region details available.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Key Highlights</h5>

              <div className="insight-item mb-3">
                <div className="insight-icon bg-success-subtle text-success">
                  <i className="fas fa-arrow-up"></i>
                </div>
                <div>
                  <div className="fw-semibold">Top Growth Region</div>
                  <small className="text-muted">
                    {bestRegion?.final_market || "-"} delivered the highest yearly growth at{" "}
                    <span className="fw-bold text-success">
                      {bestRegion?.change_percent?.toFixed(2)}%
                    </span>.
                  </small>
                </div>
              </div>

              <div className="insight-item mb-3">
                <div className="insight-icon bg-danger-subtle text-danger">
                  <i className="fas fa-arrow-down"></i>
                </div>
                <div>
                  <div className="fw-semibold">Lowest Growth Region</div>
                  <small className="text-muted">
                    {weakestRegion?.final_market || "-"} showed the lowest yearly growth at{" "}
                    <span className="fw-bold text-danger">
                      {weakestRegion?.change_percent?.toFixed(2)}%
                    </span>.
                  </small>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon bg-primary-subtle text-primary">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <div>
                  <div className="fw-semibold">Overall Brand Momentum</div>
                  <small className="text-muted">
                    OODLES regional business is showing an aggregate growth of{" "}
                    <span className={`fw-bold ${getGrowthClass(overallGrowth)}`}>
                      {overallGrowth >= 0 ? "+" : ""}
                      {overallGrowth.toFixed(2)}%
                    </span>{" "}
                    between {regionWiseData.previous_fy} and {regionWiseData.current_fy}.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Region Share in Current FY</h5>

              {(regionWiseData?.yearly_sales_region_wise || []).map((item, index) => {
                const share = totalCurrentFY
                  ? ((Number(item.current_fy) || 0) / totalCurrentFY) * 100
                  : 0;

                return (
                  <div className="mb-3" key={`share-${item.final_market}-${index}`}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">{item.final_market}</span>
                      <span className="small text-muted">{share.toFixed(2)}%</span>
                    </div>

                    <div className="region-progress-track">
                      <div
                        className="region-progress-fill"
                        style={{ width: `${share}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .region-detail-header {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
        }

        .region-detail-header h3 {
          font-family: 'Playfair Display', Georgia, serif !important;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .region-detail-header p {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.5;
        }

        .region-detail-header .badge {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
        }

        .region-kpi-card {
          border-radius: 16px;
          transition: all 0.25s ease;
        }

        .region-kpi-card:hover {
          transform: translateY(-4px);
        }

        .region-kpi-card small {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.5;
        }

        .region-kpi-card h4 {
          font-family: 'JetBrains Mono', 'Inter', monospace;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.4;
        }

        .region-kpi-card h4.text-primary {
          color: ${isDark ? "#F8F9FA" : "#2C3E50"} !important;
        }

        .region-kpi-card h4.text-success {
          color: ${isDark ? "#17A2B8" : "#198754"} !important;
        }

        .region-kpi-card h4.text-danger {
          color: #DC3545 !important;
        }

        .icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }

        .region-performance-card,
        .quarter-region-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 16px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(44, 62, 80, 0.04);
        }

        .region-performance-card:hover,
        .quarter-region-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(44, 62, 80, 0.08);
        }

        .region-progress-track {
          width: 100%;
          height: 10px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .region-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #0D7C66, #17A2B8);
        }

        .region-table thead th {
          font-family: 'Inter', system-ui, sans-serif;
          background: #F8F9FA;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6C757D;
          border-bottom: 1px solid #E5E7EB;
          white-space: nowrap;
        }

        .region-table tbody td {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.5;
        }

        .region-table tbody td .fw-semibold {
          font-weight: 500;
        }

        .region-table tbody tr:hover {
          background: #F8F9FA;
        }

        .quarter-tabs .btn {
          min-width: 72px;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          font-size: 14px;
        }

        .insight-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .insight-item .fw-semibold {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
        }

        .insight-item small {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.5;
        }

        .insight-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h5.fw-bold {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
        }

        .fw-semibold {
          font-family: 'Inter', system-ui, sans-serif;
        }

        .region-performance-card h6,
        .quarter-region-card h6 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 17px;
          font-weight: 600;
          line-height: 1.4;
        }

        .region-performance-card .text-success,
        .quarter-region-card .text-success {
          color: ${isDark ? "#17A2B8" : "#0D7C66"} !important;
        }

        .region-performance-card .text-danger,
        .quarter-region-card .text-danger {
          color: #DC3545 !important;
        }

        @media (max-width: 768px) {
          .region-kpi-card h4 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RegionWiseDetail;