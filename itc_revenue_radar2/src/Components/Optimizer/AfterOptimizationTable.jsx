import React from 'react'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
const XLSX = require("xlsx");
function AfterOptimizationTable({ salesAgg, resultValue, haloResults, filteredplotdata1, corevalue, distributionvalue, distributionvaluecontri, objectiveName }) {
  filteredplotdata1 = filteredplotdata1?.sort((a, b) => a.variable.localeCompare(b.variable))
  const hidingvariablelist = ExceptionVariables?.hiddenvariables;

  const downloadtabledata = () => {
    const data = [];

    const headers = [];

    //headers.push("Scenario")
    headers.push("Variables")
    headers.push("Planned")
    headers.push("Optimized")
    headers.push("Change(%)")
    headers.push("Unit")


    data.push(headers);
    const totalspends = [
      {
        variable: "Total Spends (Lacs)",
        planned_spends: (filteredplotdata1?.filter((it) => it.variable !== "sales")?.reduce((prev, next) => prev + next.planned_spends, 0) / 100000)?.toFixed(3),
        optimized_spends: (filteredplotdata1?.filter((it) => it.variable !== "sales")?.reduce((prev, next) => prev + next.optimized_spends, 0) / 100000)?.toFixed(3),
        percentage_difference: `${((
          (
            (filteredplotdata1
              ?.filter((it) => it.variable !== "sales")
              ?.reduce((prev, next) => prev + next.optimized_spends, 0) -
              filteredplotdata1
                ?.filter((it) => it.variable !== "sales")
                ?.reduce((prev, next) => prev + next.planned_spends, 0)
            ) /
            filteredplotdata1
              ?.filter((it) => it.variable !== "sales")
              ?.reduce((prev, next) => prev + next.planned_spends, 0)
          ) * 100)?.toFixed(3))}%`
      },


    ]
    const totalsales = [{
      variable: "Total Sales(Tonnes)",
      planned_spends: (salesAgg[0]?.planned_spends / 1000)?.toFixed(3),
      optimized_spends: (salesAgg[0]?.optimized_spends / 1000)?.toFixed(3),
      percentage_difference: ` ${((
        Number(salesAgg[0]?.optimized_spends) -
        Number(salesAgg[0]?.planned_spends))
        / salesAgg[0]?.planned_spends * 100)?.toFixed(3)
        }%`
    }]
    totalspends?.map((row) => {
      const variables = row.variable;
      const unit = "Lacs"
      const planned = row.planned_spends;
      const optimized = row.optimized_spends;
      const differencepercentage = row.percentage_difference;

      data.push([variables, planned, optimized, differencepercentage, unit]);
    })
    totalsales?.map((row) => {
      const variables = row.variable;
      const unit = "Kg Tonnes"
      const planned = row.planned_spends;
      const optimized = row.optimized_spends;
      const differencepercentage = row.percentage_difference;

      data.push([variables, planned, optimized, differencepercentage, unit]);
    })
    filteredplotdata1?.map((row) => {
      const variables = row.variable;
      const unit = "Lacs"
      const planned = (row.planned_spends / 100000).toFixed(3);
      const optimized = (row.optimized_spends / 100000).toFixed(3);
      const differencepercentage = `${row?.percentage_difference ? row?.percentage_difference?.toFixed(1) : row.planned_spends !== 0 ? ((row.optimized_spends - row.planned_spends) / (row.planned_spends) * 100).toFixed(1) : 0}%`;

      data.push([variables, planned, optimized, differencepercentage, unit]);
    })
    corevalue?.map((row) => {
      const variables = row.core_incremental_media;
      const unit = "Lacs"
      const planned = (row.planned_spends / 100000).toFixed(3);
      const optimized = (row.optimized_spends / 100000).toFixed(3);
      const differencepercentage = `${row?.percentage_difference ? row?.percentage_difference?.toFixed(1) : row.planned_spends !== 0 ? ((row.optimized_spends - row.planned_spends) / (row.planned_spends) * 100).toFixed(1) : 0}%`;

      data.push([variables, planned, optimized, differencepercentage, unit]);
    })

    distributionvalue?.length > 0 &&
      distributionvalue?.map((row) => {
        const variables = row.variable_name;
        const unit = "Number"
        const planned = row.attribute_value;
        const optimized = row.attribute_value;
        const differencepercentage = `${row?.percentage_difference ? row?.percentage_difference?.toFixed(1) : row !== 0 ? ((row.attribute_value - row.attribute_value) / (row.attribute_value) * 100).toFixed(1) : 0}%`;

        data.push([variables, planned, optimized, differencepercentage, unit]);
      })
    distributionvaluecontri?.length > 0 &&
      distributionvaluecontri?.map((row) => {
        const variables = row.variable_name;
        const unit = "Kg Tonnes"
        const planned = row.planned / 1000;
        const optimized = row.optimized / 1000;
        const differencepercentage = `${row?.percentage_difference ? row?.percentage_difference?.toFixed(1) : row.planned !== 0 ? ((row.optimized - row.planned) / (row.planned) * 100).toFixed(1) : 0}%`;
        // const brand= row.brand;
        //   const market = row.market;
        //   const lastfy = row.lastfy;
        //   const lastmape =`${(row.lastmape*100).toFixed(1)}%`;
        //   const currentfy =row.currentfy;
        //   const currentmape=`${(row.currentmape*100).toFixed(1)}%`;
        data.push([variables, planned, optimized, differencepercentage, unit]);
      })
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet and add data to it
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert JSON to sheet and add as second sheet
    const worksheet2 = XLSX.utils.json_to_sheet(resultValue);
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Scenario Comparison");

    // Write the workbook to binary Excel format
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

    // Create blob
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OptimizationResults.xlsx`;
    link.click();


  }
return (
  <>
    <div className="aftopt-page mt-3">
      <div className="accordion aftopt-accordion" id="aftoptAccordion" style={{ userSelect: "none" }}>
        <div className="accordion-item aftopt-accordion-item">
          <h2 className="accordion-header" id="aftoptHeading">
            <button
              className="accordion-button aftopt-accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#aftoptCollapse"
              aria-expanded="true"
              aria-controls="aftoptCollapse"
            >
              <div className="aftopt-accordion-title-wrap">
                <div className="aftopt-breadcrumb">Optimization / Results Summary</div>
                <div className="aftopt-section-title">
                  Optimized Spend Summary for Objective:{" "}
                  <span className="aftopt-objective-pill">{objectiveName}</span>
                </div>
                <div className="aftopt-section-subtitle">
                  Review total spends, sales movement, variable-wise optimized values,
                  halo contribution, and distribution impact in a single premium summary table.
                </div>
              </div>
            </button>
          </h2>

          <div
            id="aftoptCollapse"
            className="accordion-collapse collapse show"
            aria-labelledby="aftoptHeading"
            data-bs-parent="#aftoptAccordion"
          >
            <div className="accordion-body aftopt-accordion-body">
              <>
                {filteredplotdata1?.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                      <button
                        className="aftopt-icon-action"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Download Excel"
                        onClick={downloadtabledata}
                      >
                        <i className="fa fa-download me-1"></i> Download
                      </button>

                      <button
                        className="aftopt-icon-action secondary"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Copy all tables with formatting"
                        onClick={() => {
                          const accordionBody = document.querySelector("#aftoptCollapse .accordion-body");
                          if (accordionBody) {
                            const tables = accordionBody.querySelectorAll("table");
                            let htmlToCopy = "";

                            tables.forEach((table) => {
                              const clonedTable = table.cloneNode(true);

                              const headers = clonedTable.querySelectorAll("thead th");
                              headers.forEach((th) => {
                                th.style.fontWeight = "bold";
                                th.style.backgroundColor = "#475569";
                                th.style.color = "#fff";
                                th.style.border = "1px solid #000";
                                th.style.padding = "6px";
                              });

                              const cells = clonedTable.querySelectorAll("td");
                              cells.forEach((td) => {
                                td.style.border = "1px solid #000";
                                td.style.padding = "6px";
                              });

                              clonedTable.style.borderCollapse = "collapse";
                              clonedTable.style.marginBottom = "20px";
                              clonedTable.style.width = "100%";

                              htmlToCopy += clonedTable.outerHTML + "<br/><br/>";
                            });

                            const blob = new Blob([htmlToCopy], { type: "text/html" });
                            const data = [new ClipboardItem({ "text/html": blob })];

                            navigator.clipboard.write(data).then(() => {
                              alert("All tables copied with formatting! Paste into Excel/Word.");
                            });
                          }
                        }}
                      >
                        <i className="fa fa-copy me-1"></i> Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* TOTAL SUMMARY */}
                <div className="aftopt-inner-panel aftopt-table-panel mb-4">
                  <div className="aftopt-table-head">
                    <h5 className="aftopt-table-title mb-0">Overall Summary</h5>
                  </div>

                  <div className="table-responsive aftopt-table-wrap">
                    <table className="table aftopt-table align-middle mb-0">
                      <colgroup>
                        <col style={{width: '40%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Total</th>
                          <th className="text-center">Planned</th>
                          <th className="text-center">Optimized</th>
                          <th className="text-center">Diff (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="aftopt-variable-cell">
                              <span className="aftopt-variable-name">Total Spends (Lacs)</span>
                              <span className="aftopt-variable-tag">Summary</span>
                            </div>
                          </td>
                          <td className="text-center">
                            {(
                              filteredplotdata1
                                ?.filter(
                                  (it) =>
                                    it.variable !== "sales" &&
                                    !it.variable.startsWith("Halo") &&
                                    !it.variable.startsWith("HALO") &&
                                    !it.variable.startsWith("halo")
                                )
                                ?.reduce((prev, next) => prev + next.planned_spends, 0) / 100000
                            )?.toFixed(3)}
                          </td>
                          <td className="text-center">
                            {(
                              filteredplotdata1
                                ?.filter(
                                  (it) =>
                                    it.variable !== "sales" &&
                                    !it.variable.startsWith("Halo") &&
                                    !it.variable.startsWith("HALO") &&
                                    !it.variable.startsWith("halo")
                                )
                                ?.reduce((prev, next) => prev + next.optimized_spends, 0) / 100000
                            )?.toFixed(3)}
                          </td>
                          <td className="text-center">
                            {(
                              (
                                (filteredplotdata1
                                  ?.filter((it) => it.variable !== "sales")
                                  ?.reduce((prev, next) => prev + next.optimized_spends, 0) -
                                  filteredplotdata1
                                    ?.filter((it) => it.variable !== "sales")
                                    ?.reduce((prev, next) => prev + next.planned_spends, 0)) /
                                filteredplotdata1
                                  ?.filter((it) => it.variable !== "sales")
                                  ?.reduce((prev, next) => prev + next.planned_spends, 0)
                              ) *
                              100
                            )?.toFixed(3)}
                            %
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div className="aftopt-variable-cell">
                              <span className="aftopt-variable-name">Total Sales (Tonnes)</span>
                              <span className="aftopt-variable-tag sales">Sales</span>
                            </div>
                          </td>
                          <td className="text-center">{(salesAgg[0]?.planned_sales / 1000)?.toFixed(3)}</td>
                          <td className="text-center">{(salesAgg[0]?.optimized_sales / 1000)?.toFixed(3)}</td>
                          <td className="text-center">
                            {(
                              ((Number(salesAgg[0]?.optimized_sales) - Number(salesAgg[0]?.planned_sales)) /
                                salesAgg[0]?.planned_sales) *
                              100
                            )?.toFixed(3)}
                            %
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* VARIABLE WISE */}
                <div className="aftopt-inner-panel aftopt-table-panel mb-4">
                  <div className="aftopt-table-head">
                    <h5 className="aftopt-table-title mb-0">Variable Wise Optimization</h5>
                  </div>

                  <div className="table-responsive aftopt-table-wrap">
                    <table className="table aftopt-table align-middle mb-0">
                      <colgroup>
                        <col style={{width: '40%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Variable</th>
                          <th className="text-center">Planned</th>
                          <th className="text-center">Optimized</th>
                          <th className="text-center">Change (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredplotdata1?.map((item, idx) => {
                          return (
                            !hidingvariablelist.some((variable) => variable === item.variable) &&
                            item.variable !== "sales" &&
                            !item.variable.startsWith("Halo") &&
                            !item.variable.startsWith("HALO") &&
                            !item.variable.startsWith("halo") && (
                              <tr key={`var-${idx}`}>
                                <td>
                                  <div className="aftopt-variable-cell">
                                    <span className="aftopt-variable-name">{item?.variable}</span>
                                    <span className="aftopt-variable-tag">Media</span>
                                  </div>
                                </td>
                                <td className="text-center">
                                  {((item?.planned_spends / 100000)?.toFixed(3))?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-center">
                                  {((item?.optimized_spends / 100000)?.toFixed(3))?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-center">
                                  {(() => {
                                    const val = item?.percentage_difference
                                      ? item?.percentage_difference?.toFixed(1)
                                      : item.planned_spends !== 0
                                      ? ((item.optimized_spends - item.planned_spends) / item.planned_spends).toFixed(1) * 100
                                      : 0;
                                    return (
                                      <span className={`aftopt-change-badge ${Number(val) > 0 ? 'positive' : Number(val) < 0 ? 'negative' : 'neutral'}`}>
                                        {val}%
                                      </span>
                                    );
                                  })()}
                                </td>
                              </tr>
                            )
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CORE */}
                <div className="aftopt-inner-panel aftopt-table-panel mb-4">
                  <div className="aftopt-table-head">
                    <h5 className="aftopt-table-title mb-0">Core / Incremental Summary</h5>
                  </div>

                  <div className="table-responsive aftopt-table-wrap">
                    <table className="table aftopt-table align-middle mb-0">
                      <colgroup>
                        <col style={{width: '40%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                        <col style={{width: '20%'}} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Variable</th>
                          <th className="text-center">Planned</th>
                          <th className="text-center">Optimized</th>
                          <th className="text-center">Change (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corevalue?.length > 0 ? (
                          corevalue?.map((item, idx) => {
                            return (
                              !hidingvariablelist.some((variable) => variable === item.variable) &&
                              item.variable !== "sales" && (
                                <tr key={`core-${idx}`}>
                                  <td>
                                    <div className="aftopt-variable-cell">
                                      <span className="aftopt-variable-name">{item?.core_incremental_media}</span>
                                      <span className="aftopt-variable-tag core">Core</span>
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    {((item?.planned_spends / 100000)?.toFixed(3))?.toLocaleString("en-IN")}
                                  </td>
                                  <td className="text-center">
                                    {((item?.planned_spends / 100000)?.toFixed(3))?.toLocaleString("en-IN")}
                                  </td>
                                  <td className="text-center">
                                    {item?.percentage_difference
                                      ? item?.percentage_difference?.toFixed(1)
                                      : item.planned_spends !== 0
                                      ? ((item.planned_spends - item.planned_spends) / item.planned_spends).toFixed(1) * 100
                                      : 0}
                                    %
                                  </td>
                                </tr>
                              )
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4">
                              <div className="aftopt-empty-state">No core values available.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* HALO */}
                {haloResults?.length > 0 && (
                  <div className="aftopt-inner-panel aftopt-table-panel mb-4">
                    <div className="aftopt-table-head">
                      <h5 className="aftopt-table-title mb-0">Halo Summary</h5>
                    </div>

                    <div className="table-responsive aftopt-table-wrap">
                      <table className="table aftopt-table align-middle mb-0">
                        <colgroup>
                          <col style={{width: '40%'}} />
                          <col style={{width: '20%'}} />
                          <col style={{width: '20%'}} />
                          <col style={{width: '20%'}} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Variable</th>
                            <th className="text-center">Planned</th>
                            <th className="text-center">Optimized</th>
                            <th className="text-center">Change (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[haloResults.reduce(
                            (acc, item) => {
                              acc.planned_scenario += item.planned_scenario;
                              acc.optimized_scenario += item.optimized_scenario;
                              return acc;
                            },
                            {
                              variable: "HALO",
                              fy: haloResults[0].fy,
                              variable_type: "media",
                              planned_scenario: 0,
                              optimized_scenario: 0,
                            }
                          )].map((item, idx) => (
                            <tr key={`halo-${idx}`}>
                              <td>
                                <div className="aftopt-variable-cell">
                                  <span className="aftopt-variable-name">{item?.variable}</span>
                                  <span className="aftopt-variable-tag halo">Halo</span>
                                </div>
                              </td>
                              <td className="text-center">
                                {(item?.planned_scenario / 100000).toFixed(3).toLocaleString("en-IN")}
                              </td>
                              <td className="text-center">
                                {(item?.optimized_scenario / 100000).toFixed(3).toLocaleString("en-IN")}
                              </td>
                              <td className="text-center">
                                {item?.percentage_difference
                                  ? item?.percentage_difference?.toFixed(1)
                                  : item.planned_scenario !== 0
                                  ? (((item.optimized_scenario - item.planned_scenario) / item.planned_scenario) * 100).toFixed(1)
                                  : 0}
                                %
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* DISTRIBUTION */}
                {(distributionvalue?.length > 0 || distributionvaluecontri?.length > 0) && (
                  <div className="aftopt-inner-panel aftopt-table-panel">
                    <div className="aftopt-table-head">
                      <h5 className="aftopt-table-title mb-0">Distribution Summary</h5>
                    </div>

                    <div className="table-responsive aftopt-table-wrap">
                      <table className="table aftopt-table align-middle mb-0">
                        <colgroup>
                          <col style={{width: '40%'}} />
                          <col style={{width: '20%'}} />
                          <col style={{width: '20%'}} />
                          <col style={{width: '20%'}} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Variable</th>
                            <th className="text-center">Planned</th>
                            <th className="text-center">Optimized</th>
                            <th className="text-center">Change (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {distributionvalue?.length > 0 &&
                            distributionvalue?.map((item, idx) => {
                              return (
                                !hidingvariablelist.some((variable) => variable === item.variable) &&
                                item.variable !== "sales" && (
                                  <tr key={`dist-${idx}`}>
                                    <td>
                                      <div className="aftopt-variable-cell">
                                        <span className="aftopt-variable-name">{item?.variable_name}</span>
                                        <span className="aftopt-variable-tag distribution">Distribution</span>
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      {(item?.attribute_value?.toFixed(3))?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="text-center">
                                      {(item?.attribute_value?.toFixed(3))?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="text-center">
                                      {item?.percentage_difference
                                        ? item?.percentage_difference?.toFixed(1)
                                        : item.attribute_value !== 0
                                        ? (((item.attribute_value - item.attribute_value) / item.attribute_value) * 100).toFixed(1)
                                        : 0}
                                      %
                                    </td>
                                  </tr>
                                )
                              );
                            })}

                          {distributionvaluecontri?.length > 0 &&
                            distributionvaluecontri?.map((item, idx) => {
                              return (
                                !hidingvariablelist.some((variable) => variable === item.variable) &&
                                item.variable !== "sales" && (
                                  <tr key={`distc-${idx}`}>
                                    <td>
                                      <div className="aftopt-variable-cell">
                                        <span className="aftopt-variable-name">
                                          {item?.variable_name} (Kg Tonnes)
                                        </span>
                                        <span className="aftopt-variable-tag contrib">Contribution</span>
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      {((item?.planned / 1000)?.toFixed(3))?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="text-center">
                                      {((item?.optimized / 1000)?.toFixed(3))?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="text-center">
                                      {item?.percentage_difference
                                        ? item?.percentage_difference?.toFixed(1)
                                        : item.planned_spends !== 0
                                        ? (((item.optimized - item.planned) / item.planned) * 100).toFixed(1)
                                        : 0}
                                      %
                                    </td>
                                  </tr>
                                )
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>

        <style>{`
          .aftopt-page {
            color: var(--rr-text-main);
          }

          .aftopt-accordion {
            margin-top: 4px;
          }

          .aftopt-accordion-item {
            border: 1px solid var(--rr-border) !important;
            border-radius: 24px !important;
            overflow: hidden;
            background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%) !important;
          }

          .aftopt-accordion-button {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%) !important;
            color: var(--rr-text-main) !important;
            box-shadow: none !important;
            border: none !important;
            padding: 22px 24px;
            align-items: flex-start;
          }

          .aftopt-accordion-button:not(.collapsed) {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%) !important;
            color: var(--rr-text-main) !important;
            box-shadow: none !important;
          }

          .aftopt-accordion-button:focus {
            box-shadow: none !important;
          }

          .aftopt-accordion-button::after {
            margin-top: 8px;
          }

          .aftopt-accordion-title-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-align: left;
          }

          .aftopt-breadcrumb {
            font-size: 12px;
            font-weight: 700;
            color: var(--rr-text-muted);
            letter-spacing: 0.4px;
          }

          .aftopt-section-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--rr-text-main);
            line-height: 1.25;
          }

          .aftopt-objective-pill {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 999px;
            background: linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(22,163,74,0.12) 100%);
            color: var(--rr-text-main);
            font-size: 0.95rem;
            font-weight: 800;
            margin-left: 6px;
          }

          .aftopt-section-subtitle {
            color: var(--rr-text-muted);
            font-size: 13px;
            font-weight: 500;
            line-height: 1.7;
            max-width: 900px;
          }

          .aftopt-accordion-body {
            padding: 20px;
            background: transparent;
          }

          .aftopt-inner-panel {
            background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
            border: 2px solid var(--rr-border);
            border-radius: 20px;
            overflow: hidden;
          }

          .aftopt-toolbar-panel {
            padding: 16px 18px;
          }

          .aftopt-icon-action {
            border: none;
            border-radius: 12px;
            padding: 11px 16px;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            background: #2563eb;
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
            transition: all 0.25s ease;
          }

          .aftopt-icon-action.secondary {
            color: var(--rr-text-main);
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--rr-border);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
          }

          .aftopt-icon-action:hover {
            transform: translateY(-1px);
          }

          .aftopt-table-panel {
            padding: 0;
          }

          .aftopt-table-head {
            padding: 18px 20px;
            border-bottom: 1px solid var(--rr-border);
            background: rgba(3, 25, 72, 0.81) !important;
          }

          .aftopt-table-title {
            color: #fff;
            font-size: 1.05rem;
            font-weight: 800;
          }

          .aftopt-table-wrap {
            max-height: 420px;
            overflow-y: auto;
            border-radius: 0 0 20px 20px;
          }

          .aftopt-table-wrap::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .aftopt-table-wrap::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
          }

          .aftopt-table-wrap::-webkit-scrollbar-track {
            background: transparent;
          }

          .aftopt-table {
            table-layout: fixed;
            width: 100%;
          }

          .aftopt-table thead th {
            position: sticky;
            top: 0;
            z-index: 2;
            background: var(--rr-bg-soft);
            color: var(--rr-text-main);
            font-size: 12px;
            font-weight: 800;
            border-bottom: 1px solid #cbd5e1;
            border-right: 1px solid #cbd5e1;
            padding: 15px 14px;
            white-space: nowrap;
          }

          .aftopt-table thead th:last-child {
            border-right: none;
          }

          .aftopt-table tbody td {
            vertical-align: middle;
            color: var(--rr-text-main);
            font-size: 13px;
            font-weight: 500;
            padding: 16px 14px;
            border-bottom: 1px solid #cbd5e1;
            border-right: 1px solid #cbd5e1;
            background: transparent;
          }

          .aftopt-table tbody td:last-child {
            border-right: none;
          }

          .aftopt-table tbody tr:last-child td {
            border-bottom: none;
          }

          .aftopt-table tbody tr:hover td {
            background: rgba(255,255,255,0.02);
          }

          .aftopt-variable-cell {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
          }

          .aftopt-variable-name {
            font-weight: 800;
            color: var(--rr-text-main);
          }

          .aftopt-variable-tag {
            display: inline-flex;
            width: fit-content;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(37, 99, 235, 0.12);
            color: #0424f5;
            font-size: 11px;
            font-weight: 700;
          }

          .aftopt-variable-tag.sales {
            background: rgba(22, 163, 74, 0.12);
            color: #026123;
          }

          .aftopt-variable-tag.core {
            background: rgba(168, 85, 247, 0.14);
            color: #8318ee;
          }

          .aftopt-variable-tag.halo {
            background: rgba(245, 158, 11, 0.14);
            color: #fbbf24;
          }

          .aftopt-variable-tag.distribution {
            background: rgba(14, 165, 233, 0.14);
            color: #0b4df4;
          }

          .aftopt-variable-tag.contrib {
            background: rgba(236, 72, 153, 0.14);
            color: #f9a8d4;
          }

          .aftopt-empty-state {
            padding: 26px;
            text-align: center;
            color: var(--rr-text-muted);
            font-weight: 700;
          }

          .aftopt-change-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            min-width: 70px;
            text-align: center;
          }

          .aftopt-change-badge.positive {
            background: rgba(22, 163, 74, 0.15);
            color: #16a34a;
          }

          .aftopt-change-badge.negative {
            background: rgba(220, 38, 38, 0.15);
            color: #dc2626;
          }

          .aftopt-change-badge.neutral {
            background: rgba(100, 116, 139, 0.12);
            color: var(--rr-text-muted);
          }

          @media (max-width: 768px) {
            .aftopt-accordion-button {
              padding: 18px;
            }

            .aftopt-section-title {
              font-size: 1.4rem;
            }

            .aftopt-accordion-body {
              padding: 16px;
            }

            .aftopt-table-head {
              padding: 16px;
            }

            .aftopt-table thead th,
            .aftopt-table tbody td {
              white-space: nowrap;
            }

            .aftopt-icon-action {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </div>
  </>
);
}

export default AfterOptimizationTable