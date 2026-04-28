import React from 'react'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'

function AfterOptimizationTableAtta({ filteredplotdata1 }) {
  const hidingvariablelist = ExceptionVariables?.hiddenvariables;
  return (
    <>
      <table className="container my-2 table table-striped table-bordered">
        <thead className="text-white bg-secondary ">
          <th >Total</th>
          <th className='text-right'>Planned  </th>
          <th className='text-right'>Optimized   </th>
          <th className='text-right'>Diff (%)</th>
        </thead>
        <tbody>

          <tr >
            <td className=" ">Total Spends (Lacs)</td>

            <td className="text-right"> {(filteredplotdata1?.filter((it) => it.campaign_name !== "sales")?.reduce((prev, next) => prev + next.planned_spends, 0) / 100000)?.toFixed(2)}</td>
            <td className="text-right">{(filteredplotdata1?.filter((it) => it.campaign_name !== "sales")?.reduce((prev, next) => prev + next.optimized_spends, 0) / 100000)?.toFixed(2)}</td>

            <td className="text-right">
              {((
                (
                  (filteredplotdata1
                    ?.filter((it) => it.campaign_name !== "sales")
                    ?.reduce((prev, next) => prev + next.optimized_spends, 0) -
                    filteredplotdata1
                      ?.filter((it) => it.campaign_name !== "sales")
                      ?.reduce((prev, next) => prev + next.planned_spends, 0)
                  ) /
                  filteredplotdata1
                    ?.filter((it) => it.campaign_name !== "sales")
                    ?.reduce((prev, next) => prev + next.planned_spends, 0)
                ) * 100)?.toFixed(2))}%
            </td>

          </tr>
          <tr >
            <td  className="">Total Sales (Tonnes)</td>

            <td className="text-right">{(filteredplotdata1?.filter((it) => it.campaign_name === "sales")[0]?.planned_spends / 1000)?.toFixed(2)}</td>
            <td className="text-right">{(filteredplotdata1?.filter((it) => it.campaign_name === "sales")[0]?.optimized_spends / 1000)?.toFixed(2)}</td>
            <td className='text-right'>
              {

                ((
                  Number(filteredplotdata1?.filter((it) => it.campaign_name === "sales")[0]?.optimized_spends) -
                  Number(filteredplotdata1?.filter((it) => it.campaign_name === "sales")[0]?.planned_spends))
                  / filteredplotdata1?.filter((it) => it.campaign_name === "sales")[0]?.planned_spends * 100)?.toFixed(2)
              }%
            </td>



          </tr>

        </tbody>
      </table>
      <table className="container my-2 table table-striped table-bordered" style={{ fontSize: "2vh" }}>
        <thead className="text-white bg-secondary ">
          <th >Marketing Variables</th>
          <th className='text-right'>Planned Spends (Lacs)</th>
          <th className='text-right'>Optimized Spends (Lacs)</th>
          <th className='text-right'>Change(%)</th>
        </thead>

        <tbody>
          {filteredplotdata1?.sort((a,b)=>a.campaign_name.localeCompare(b.campaign_name))?.map((item) => {
            return !hidingvariablelist.some((variable) => variable === item?.campaign_name) && item?.campaign_name !== "sales" && <tr >
              <td className={item.campaign_name === "sales" ? "bg-success text-white " : " "}>{item?.campaign_name}</td>
              <td className={item.campaign_name === "sales" ? "bg-success text-white text-right" : " text-right"}>{(item?.planned_spends / 100000?.toFixed(2))?.toLocaleString("en-IN")}</td>
              <td className={item.campaign_name === "sales" ? "bg-success text-white text-right" : " text-right"}>{(item?.optimized_spends / 100000?.toFixed(2))?.toLocaleString("en-IN")}</td>
              <td className={item.campaign_name === "sales" ? "bg-success text-white text-right" : " text-right"}>
                {item?.percentage_difference ? item?.percentage_difference?.toFixed(1) : item.planned_spends !== 0 ? ((item.optimized_spends - item.planned_spends) / (item.planned_spends) * 100).toFixed(1) : 0}%
                </td>
            </tr>
          })}
        </tbody>
      </table>
    </>
  )
}

export default AfterOptimizationTableAtta