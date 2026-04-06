import React, { useMemo, useState } from "react";
import ExceptionVariables from "../JSON Files/ExceptionVariables.json";
import { useDispatch } from "react-redux";
import getNotification from "../../Redux/Action/action";
import Select from "react-select";

function UbLbTable({
  objective,
  originalsetublboriginal,
  sampledataset2,
  originalset2,
  handleoriginaldataset2change,
  handlesampledataset2change,
}) {
  const hidingvariablelist = ExceptionVariables?.hiddenvariables || [];
  const [addminuspercentagelb, setaddminuspercentagelb] = useState([]);
  const [addminuspercentageub, setaddminuspercentageub] = useState([]);
  const [edit, setedit] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const dispatch = useDispatch();

  const visibleDataset = useMemo(() => {
    return (sampledataset2 || []).filter(
      (item) => !hidingvariablelist.some((variable) => variable === item.variables)
    );
  }, [sampledataset2, hidingvariablelist]);

  const attributeOptions = useMemo(() => {
    return visibleDataset.map((item) => ({
      label: item.variables,
      value: item.variables,
    }));
  }, [visibleDataset]);

  const filteredDataset = useMemo(() => {
    if (!selectedAttributes?.length) return visibleDataset;
    const selectedValues = selectedAttributes.map((item) => item.value);
    return visibleDataset.filter((item) => selectedValues.includes(item.variables));
  }, [visibleDataset, selectedAttributes]);

  const table2edit = (e, variableIndex, type) => {
    const updatedDataset = [...sampledataset2];
    const enteredvalue = e.target.value || 0;

    if (type === "lb") {
      let arr = [...addminuspercentagelb];
      const percentageChange = (
        ((enteredvalue - originalsetublboriginal[variableIndex].a_point) /
          originalsetublboriginal[variableIndex].a_point) *
        100
      )?.toFixed(2);
      arr[variableIndex] = percentageChange === "Infinity" ? 0 : percentageChange;
      updatedDataset[variableIndex].a_point = enteredvalue;
      setaddminuspercentagelb(arr);
    } else if (type === "ub") {
      let arr = [...addminuspercentagelb];
      if (
        objective === "Maintain Spends to Maximize Sales" ||
        objective === "Maintain Sales and Minimize Spends"
      ) {
        const percentageChange = (
          ((enteredvalue - originalsetublboriginal[variableIndex].c_point) /
            originalsetublboriginal[variableIndex].c_point) *
          100
        )?.toFixed(2);
        arr[variableIndex] = percentageChange === "Infinity" ? 0 : percentageChange;
        updatedDataset[variableIndex].c_point = enteredvalue;
      } else {
        const percentageChange = (
          ((enteredvalue - originalsetublboriginal[variableIndex].d_point) /
            originalsetublboriginal[variableIndex].d_point) *
          100
        )?.toFixed(2);
        arr[variableIndex] = percentageChange === "Infinity" ? 0 : percentageChange;
        updatedDataset[variableIndex].d_point = enteredvalue;
      }
      setaddminuspercentageub(arr);
    }

    handlesampledataset2change(updatedDataset);
  };

  const table2editpercetnagebasis = (e, variableIndex, type) => {
    const updatedDataset = [...sampledataset2];
    const enteredValue = parseFloat(e.target.value) || 0;

    if (false) {
      dispatch(
        getNotification({
          message: "Entered value must be between -25% and 25%.",
          type: "danger",
        })
      );
      return;
    }

    const updatePercentage = (array, index, value, isLowerLimit) => {
      const updatedArray = [...array];
      updatedArray[index] = value;
      isLowerLimit
        ? setaddminuspercentagelb(updatedArray)
        : setaddminuspercentageub(updatedArray);
    };

    if (type === "lb") {
      updatePercentage(addminuspercentagelb, variableIndex, enteredValue, true);

      updatedDataset[variableIndex].a_point = Number(
        originalsetublboriginal[variableIndex].a_point * (1 + enteredValue / 100)
      )?.toFixed(2);
    } else if (type === "ub") {
      updatePercentage(addminuspercentageub, variableIndex, enteredValue, false);

      if (
        objective === "Maintain Spends to Maximize Sales" ||
        objective === "Maintain Sales and Minimize Spends"
      ) {
        updatedDataset[variableIndex].c_point = Number(
          originalsetublboriginal[variableIndex].c_point * (1 + enteredValue / 100)
        )?.toFixed(2);
      } else {
        updatedDataset[variableIndex].d_point = Number(
          originalsetublboriginal[variableIndex].d_point * (1 + enteredValue / 100)
        )?.toFixed(2);
      }
    }

    handlesampledataset2change(updatedDataset);
  };

  const handlecancel = (variableIndex) => {
    const updatedDataset1 = [...sampledataset2];
    const updatedDataset2 = [...originalset2];

    let arr1 = [...addminuspercentagelb];
    let arr2 = [...addminuspercentageub];

    const isMaintainObjective =
      objective === "Maintain Spends to Maximize Sales" ||
      objective === "Maintain Sales and Minimize Spends";

    const lowerLimitBase = originalsetublboriginal[variableIndex].a_point || 1;
    const upperKey = isMaintainObjective ? "c_point" : "d_point";

    const upperLimitBase = originalsetublboriginal[variableIndex][upperKey] || 1;

    let percentageChangelb =
      ((updatedDataset1[variableIndex].lower_limit -
        originalsetublboriginal[variableIndex].lower_limit) /
        lowerLimitBase) *
      100;

    let percentageChangeub =
      ((updatedDataset1[variableIndex][upperKey] -
        originalsetublboriginal[variableIndex][upperKey]) /
        upperLimitBase) *
      100;

    percentageChangelb = isFinite(percentageChangelb)
      ? percentageChangelb.toFixed(0)
      : 0;
    percentageChangeub = isFinite(percentageChangeub)
      ? percentageChangeub.toFixed(0)
      : 0;

    setaddminuspercentagelb(arr1);
    setaddminuspercentageub(arr2);

    if (isMaintainObjective) {
      updatedDataset1[variableIndex].c_point = updatedDataset2[variableIndex].c_point;
    } else {
      updatedDataset1[variableIndex].d_point = updatedDataset2[variableIndex].d_point;
    }

    updatedDataset1[variableIndex].a_point = updatedDataset2[variableIndex].a_point;
    handlesampledataset2change(updatedDataset1);
  };

  const handleupdate = (variableIndex) => {
    const updatedDataset1 = [...sampledataset2];
    const updatedDataset2 = [...originalset2];
    let arr1 = [...addminuspercentagelb];
    let arr2 = [...addminuspercentageub];

    const isMaintainObjective =
      objective === "Maintain Spends to Maximize Sales" ||
      objective === "Maintain Sales and Minimize Spends";

    const lowerLimitBase = originalsetublboriginal[variableIndex].a_point || 1;
    const upperKey = isMaintainObjective ? "c_point" : "d_point";
    const upperLimitBase = originalsetublboriginal[variableIndex][upperKey] || 1;

    let percentageChangelb =
      ((updatedDataset1[variableIndex].lower_limit -
        originalsetublboriginal[variableIndex].lower_limit) /
        lowerLimitBase) *
      100;

    let percentageChangeub =
      ((updatedDataset1[variableIndex][upperKey] -
        originalsetublboriginal[variableIndex][upperKey]) /
        upperLimitBase) *
      100;

    percentageChangelb = isFinite(percentageChangelb)
      ? percentageChangelb.toFixed(0)
      : 0;
    percentageChangeub = isFinite(percentageChangeub)
      ? percentageChangeub.toFixed(0)
      : 0;

    if (
      percentageChangelb <= 25 &&
      percentageChangelb >= -25 &&
      percentageChangeub <= 25 &&
      percentageChangeub >= -25
    ) {
      const lowerBound = updatedDataset1[variableIndex].a_point;
      const comparePoint = isMaintainObjective
        ? updatedDataset1[variableIndex].c_point
        : updatedDataset1[variableIndex].d_point;

      if (Number(lowerBound) > Number(comparePoint)) {
        dispatch(
          getNotification({
            message: `Upper Bound is less than lower bound!`,
            type: "danger",
          })
        );
      } else {
        arr1[variableIndex] = percentageChangelb;
        arr2[variableIndex] = percentageChangeub;
        setaddminuspercentagelb(arr1);
        setaddminuspercentageub(arr2);

        if (isMaintainObjective) {
          updatedDataset2[variableIndex].c_point =
            updatedDataset1[variableIndex].c_point;
        } else {
          updatedDataset2[variableIndex].d_point =
            updatedDataset1[variableIndex].d_point;
        }

        updatedDataset2[variableIndex].a_point =
          updatedDataset1[variableIndex].a_point;

        edit[variableIndex] = false;
        handleoriginaldataset2change(updatedDataset2);

        dispatch(
          getNotification({
            message: `Bounds updated for ${updatedDataset2[variableIndex].variables}`,
            type: "success",
          })
        );
      }
    } else if (
      percentageChangelb > 25 ||
      percentageChangelb < -25 ||
      percentageChangeub > 25 ||
      percentageChangeub < -25
    ) {
      let confirmedbounds = window.confirm(
        "Entered change percentage is not within -25% to 25% range.Do you wish to continue?"
      );

      if (confirmedbounds) {
        const lowerBound = updatedDataset1[variableIndex].a_point;
        const comparePoint = isMaintainObjective
          ? updatedDataset1[variableIndex].c_point
          : updatedDataset1[variableIndex].d_point;

        if (Number(lowerBound) > Number(comparePoint)) {
          dispatch(
            getNotification({
              message: `Upper Bound is less than lower bound!`,
              type: "danger",
            })
          );
          return;
        }

        arr1[variableIndex] = percentageChangelb;
        arr2[variableIndex] = percentageChangeub;
        setaddminuspercentagelb(arr1);
        setaddminuspercentageub(arr2);

        if (isMaintainObjective) {
          updatedDataset2[variableIndex].c_point =
            updatedDataset1[variableIndex].c_point;
        } else {
          updatedDataset2[variableIndex].d_point =
            updatedDataset1[variableIndex].d_point;
        }

        updatedDataset2[variableIndex].a_point =
          updatedDataset1[variableIndex].a_point;

        edit[variableIndex] = false;
        handleoriginaldataset2change(updatedDataset2);

        dispatch(
          getNotification({
            message: `Bounds updated for ${updatedDataset2[variableIndex].variables}`,
            type: "success",
          })
        );
      }
    }
  };

  return (
    <>
      <div className="ublb-page mt-3">
        <div className="accordion ublb-accordion" id="boundsAccordion">
          <div className="accordion-item ublb-accordion-item">
            <h2 className="accordion-header" id="boundHeading">
              <button
                className="accordion-button ublb-accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#boundCollapse"
                aria-expanded="true"
                aria-controls="boundCollapse"
              >
                <div className="ublb-accordion-title-wrap">
                  <div className="ublb-breadcrumb">Optimization / Bounds Table</div>
                  <div className="ublb-section-title">Upper Bounds and Lower Bounds</div>
                  <div className="ublb-section-subtitle">
                    Review and edit weekly lower and upper bounds for selected attributes.
                  </div>
                </div>
              </button>
            </h2>

            <div
              id="boundCollapse"
              className="accordion-collapse collapse show"
              aria-labelledby="boundHeading"
              data-bs-parent="#boundsAccordion"
            >
              <div className="accordion-body ublb-accordion-body">
                {/* Filter Section */}
                <div className="ublb-inner-panel ublb-filter-panel">
                  <div className="row g-3 align-items-end">
                    <div className="col-lg-8 col-md-12 col-12">
                      <label className="ublb-label">Filter Attribute Name</label>
                      <Select
                        isMulti
                        options={attributeOptions}
                        value={selectedAttributes}
                        onChange={(value) => setSelectedAttributes(value || [])}
                        placeholder="Select one or multiple attributes"
                        classNamePrefix="ublb-select"
                      />
                    </div>

                    <div className="col-lg-4 col-md-12 col-12">
                      <button
                        className="ublb-secondary-btn w-100"
                        onClick={() => setSelectedAttributes([])}
                      >
                        Clear Filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="ublb-inner-panel ublb-table-panel">
                  <div className="ublb-table-head">
                    <h5 className="ublb-table-title mb-0">Bounds Configuration Table</h5>
                  </div>

                  <div className="table-responsive ublb-table-wrap">
                    <table className="table ublb-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Attribute</th>
                          <th>Lower Bound (Weekly)</th>
                          <th>Upper Bound (Weekly)</th>
                          <th>Edit</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDataset?.length > 0 ? (
                          filteredDataset.map((item) => {
                            const variableIndex = sampledataset2.findIndex(
                              (row) => row.variables === item.variables
                            );

                            if (variableIndex === -1) return null;

                            return (
                              <tr key={`row-${variableIndex}`}>
                                <td>
                                  <div className="ublb-attribute-cell">
                                    <span className="ublb-attribute-name">
                                      {item.variables}
                                    </span>
                                    <span className="ublb-attribute-type">
                                      {item.type}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  <div className="ublb-bound-box">
                                    <div className="ublb-bound-left">
                                      {edit[variableIndex] ? (
                                        <div className="ublb-input-group">
                                          <small>Bound</small>
                                          <input
                                            className="ublb-input"
                                            placeholder="Lower Limit"
                                            value={item.a_point}
                                            onChange={(e) =>
                                              table2edit(e, variableIndex, "lb")
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <span className="ublb-bound-value">
                                          {Number(item.a_point)?.toFixed(2)}
                                        </span>
                                      )}
                                    </div>

                                    {edit[variableIndex] && (
                                      <div className="ublb-bound-right">
                                        <div className="ublb-input-group">
                                          <small>Percentage Change</small>
                                          <input
                                            className="ublb-input"
                                            type="number"
                                            placeholder="% increase/decrease"
                                            value={addminuspercentagelb[variableIndex]}
                                            onChange={(e) =>
                                              table2editpercetnagebasis(
                                                e,
                                                variableIndex,
                                                "lb"
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td>
                                  <div className="ublb-bound-box">
                                    <div className="ublb-bound-left">
                                      {edit[variableIndex] ? (
                                        <div className="ublb-input-group">
                                          <small>Bound</small>
                                          <input
                                            className="ublb-input"
                                            placeholder="Upper Limit"
                                            value={
                                              objective ===
                                                "Maintain Spends to Maximize Sales" ||
                                                objective ===
                                                "Maintain Sales and Minimize Spends"
                                                ? item.c_point
                                                : item.d_point
                                            }
                                            onChange={(e) =>
                                              table2edit(e, variableIndex, "ub")
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <span className="ublb-bound-value">
                                          {objective ===
                                            "Maintain Spends to Maximize Sales" ||
                                            objective ===
                                            "Maintain Sales and Minimize Spends"
                                            ? Number(item.c_point)?.toFixed(2)
                                            : Number(item.d_point)?.toFixed(2)}
                                        </span>
                                      )}
                                    </div>

                                    {edit[variableIndex] && (
                                      <div className="ublb-bound-right">
                                        <div className="ublb-input-group">
                                          <small>Percentage Change</small>
                                          <input
                                            className="ublb-input"
                                            type="number"
                                            placeholder="% increase/decrease"
                                            value={addminuspercentageub[variableIndex]}
                                            onChange={(e) =>
                                              table2editpercetnagebasis(
                                                e,
                                                variableIndex,
                                                "ub"
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td>
                                  {edit[variableIndex] ? (
                                    <div className="ublb-action-row">
                                      <button
                                        className="ublb-icon-btn success"
                                        onClick={() => {
                                          handleupdate(variableIndex);
                                        }}
                                      >
                                        <i className="fa fa-check"></i>
                                      </button>

                                      <button
                                        className="ublb-icon-btn neutral"
                                        onClick={() => {
                                          let arr = [];
                                          setedit(arr);
                                          handlecancel(variableIndex);
                                        }}
                                      >
                                        <i className="fa fa-arrow-circle-left"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="ublb-edit-btn"
                                      onClick={() => {
                                        let arr = [];
                                        arr[variableIndex] = true;
                                        setedit(arr);
                                      }}
                                    >
                                      <i className="fas fa-edit me-1"></i> Edit
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4">
                              <div className="ublb-empty-state">
                                No attributes available for the selected filter.
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        .ublb-page {
          color: var(--rr-text-main);
        }

        .ublb-accordion {
          margin-top: 4px;
        }

        .ublb-accordion-item {
          border: 1px solid var(--rr-border) !important;
          border-radius: 24px !important;
          overflow: hidden;
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%) !important;
        }

        .ublb-accordion-button {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%) !important;
          color: var(--rr-text-main) !important;
          box-shadow: none !important;
          border: none !important;
          padding: 22px 24px;
          align-items: flex-start;
        }

        .ublb-accordion-button:not(.collapsed) {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%) !important;
          color: var(--rr-text-main) !important;
          box-shadow: none !important;
        }

        .ublb-accordion-button:focus {
          box-shadow: none !important;
        }

        .ublb-accordion-button::after {
          margin-top: 8px;
        }

        .ublb-accordion-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .ublb-breadcrumb {
          font-size: 12px;
          font-weight: 700;
          color: var(--rr-text-muted);
          letter-spacing: 0.4px;
        }

        .ublb-section-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--rr-text-main);
          line-height: 1.2;
        }

        .ublb-section-subtitle {
          color: var(--rr-text-muted);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.7;
          max-width: 820px;
        }

        .ublb-accordion-body {
          padding: 20px;
          background: transparent;
        }

        .ublb-inner-panel {
          background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
        }

        .ublb-filter-panel {
          padding: 18px;
          margin-bottom: 18px;
        }

        .ublb-table-panel {
          padding: 0;
          overflow: hidden;
        }

        .ublb-table-head {
          padding: 18px 20px;
          border-bottom: 1px solid var(--rr-border);
          background: rgba(255, 255, 255, 0.02);
        }

        .ublb-table-title {
          color: var(--rr-text-main);
          font-size: 1.1rem;
          font-weight: 800;
        }

        .ublb-label {
          display: inline-block;
          margin-bottom: 8px;
          color: var(--rr-text-main);
          font-size: 13px;
          font-weight: 700;
        }

        .ublb-secondary-btn,
        .ublb-edit-btn,
        .ublb-icon-btn {
          border: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .ublb-secondary-btn {
          color: var(--rr-text-main);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--rr-border);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .ublb-edit-btn {
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
          min-width: 88px;
        }

        .ublb-secondary-btn:hover,
        .ublb-edit-btn:hover,
        .ublb-icon-btn:hover {
          transform: translateY(-1px);
        }

        /* Make table body scrollable */
        .ublb-table-wrap {
          max-height: 420px;   /* 👈 control height here */
          overflow-y: auto;
          border-radius: 0 0 20px 20px;
        }

        /* Keep header fixed */
        .ublb-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
        }

        /* Optional smooth scroll look */
        .ublb-table-wrap::-webkit-scrollbar {
          width: 6px;
        }

        .ublb-table-wrap::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }

        .ublb-table-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .ublb-table thead th {
          background: var(--rr-bg-soft);
          color: var(--rr-text-main);
          font-size: 12px;
          font-weight: 800;
          border-bottom: 1px solid #cbd5e1;
          border-right: 1px solid #cbd5e1;
          padding: 15px 14px;
          white-space: nowrap;
          text-align: center;
        }

        .ublb-table thead th:last-child {
          border-right: none;
        }

        .ublb-table tbody td {
          vertical-align: middle;
          color: var(--rr-text-main);
          font-size: 13px;
          font-weight: 500;
          padding: 16px 14px;
          background: transparent;
          border-bottom: 1px solid #cbd5e1;
          border-right: 1px solid #cbd5e1;
          text-align: center;
        }

        .ublb-table tbody td:last-child {
          border-right: none;
        }

        .ublb-table thead th:first-child,
        .ublb-table tbody td:first-child {
          text-align: left;
        }

        .ublb-table tbody tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .ublb-attribute-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ublb-attribute-name {
          font-weight: 800;
          color: var(--rr-text-main);
        }

        .ublb-attribute-type {
          display: inline-flex;
          width: fit-content;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.12);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 700;
        }

        .ublb-bound-box {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          justify-content: space-between;
        }

        .ublb-bound-left,
        .ublb-bound-right {
          flex: 1;
          min-width: 0;
        }

        .ublb-bound-value {
          display: inline-block;
          font-weight: 700;
          color: var(--rr-text-main);
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--rr-border);
          min-width: 120px;
          text-align: center;
        }

        .ublb-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ublb-input-group small {
          color: var(--rr-text-muted);
          font-size: 11px;
          font-weight: 700;
        }

        .ublb-input {
          min-height: 42px;
          border-radius: 12px;
          border: 1px solid var(--rr-border);
          background: rgba(255,255,255,0.03);
          color: var(--rr-text-main);
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          transition: all 0.2s ease;
        }

        .ublb-input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .ublb-action-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ublb-icon-btn {
          width: 40px;
          height: 40px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .ublb-icon-btn.success {
          background: rgba(22, 163, 74, 0.12);
          color: #22c55e;
          border: 1px solid rgba(22, 163, 74, 0.22);
        }

        .ublb-icon-btn.neutral {
          background: rgba(37, 99, 235, 0.10);
          color: #60a5fa;
          border: 1px solid rgba(37, 99, 235, 0.20);
        }

        .ublb-empty-state {
          padding: 26px;
          text-align: center;
          color: var(--rr-text-muted);
          font-weight: 700;
        }

          .ublb-select__control {
            min-height: 46px !important;
            border-radius: 14px !important;
            border: 1px solid var(--rr-border) !important;
            background: var(--rr-bg-soft) !important;
            box-shadow: none !important;
          }

          .ublb-select__value-container {
            color: var(--rr-text-main) !important;
          }

          .ublb-select__placeholder,
          .ublb-select__single-value,
          .ublb-select__input-container,
          .ublb-select__multi-value__label {
            color: var(--rr-text-main) !important;
          }
            
          .ublb-select__menu {
            background: var(--rr-bg-soft) !important;
            border: 1px solid var(--rr-border) !important;
            border-radius: 14px !important;
            overflow: hidden;
            z-index: 9999 !important;
            box-shadow: var(--rr-shadow) !important;
          }

          .ublb-select__menu-list {
            background: var(--rr-bg-soft) !important;
            max-height: 220px !important;
            padding: 6px !important;
          }

          .ublb-select__option {
            background: transparent !important;
            color: var(--rr-text-main) !important;
          }

          .ublb-select__option--is-focused {
            background: rgba(37, 99, 235, 0.08) !important;
            color: var(--rr-text-main) !important;
          }

          .ublb-select__option--is-selected {
            background: rgba(37, 99, 235, 0.16) !important;
            color: var(--rr-text-main) !important;
          }

        @media (max-width: 768px) {
          .ublb-accordion-button {
            padding: 18px;
          }

          .ublb-section-title {
            font-size: 1.45rem;
          }

          .ublb-accordion-body {
            padding: 16px;
          }

          .ublb-filter-panel {
            padding: 16px;
          }

          .ublb-table-head {
            padding: 16px;
          }

          .ublb-bound-box {
            flex-direction: column;
          }

          .ublb-edit-btn,
          .ublb-secondary-btn {
            width: 100%;
          }

          .ublb-table thead th,
          .ublb-table tbody td {
            white-space: nowrap;
          }
        }
      `}</style>
      </div>
    </>
  );
}

export default UbLbTable;