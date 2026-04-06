import React,{useState} from 'react'
import { useDispatch } from 'react-redux';
import getNotification from '../../Redux/Action/action';
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'

function VariableTableYearlyAtta({sampledataset,changesampledataset,originalset,changeoriginalset,originaldatasetforcolorcoding}) {
  const hidingvariablelist=ExceptionVariables?.hiddenvariables; 
  const today1 = new Date();
  const currentmonth15thdate = new Date(today1.getFullYear(), today1.getMonth(), 1);
  const isBefore15th = new Date() < currentmonth15thdate;
  const unblockeddate = isBefore15th?new Date(today1.getFullYear(), today1.getMonth()-3, 1):new Date(today1.getFullYear(), today1.getMonth()-2, 1);
  const MonthBeforeUnlockMonth = `${unblockeddate.getFullYear()}-${String(unblockeddate.getMonth()).padStart(2, "0")}`;
  

  //sampledataset?.sort((a, b) => a.attribute_name.localeCompare(b.attribute_name));
    const uniquetypes=Array.from(new Set(sampledataset?.map((item)=> item.type)))
    const dispatch=useDispatch()
    const [edit,setedit]=useState([])

   const updatedatasetdecimal = (variableIndex) => {
    const updatedDataset = [...sampledataset];
    const today1 = new Date();
    const today = new Date(today1.getFullYear(), today1.getMonth() - 1, 1);
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth()).padStart(2, "0")}`;
   
 
    updatedDataset[variableIndex].subtotal = (updatedDataset[
      variableIndex
    ].month_data.reduce((acc, item) => acc + (parseFloat(item.attribute_value) || 0), 0));
    const tvAttributes = updatedDataset
              .filter(item => item.attribute_name.startsWith("Aashirvaad"))
              .sort((a, b) => b.subtotal - a.subtotal);


              const otherAttributes = updatedDataset
              ?.filter(
                item =>
                  !item.attribute_name.startsWith("Aashirvaad") 
              )
              const arrangeddataset = [...otherAttributes, ...tvAttributes]
changesampledataset(arrangeddataset);
    changeoriginalset(arrangeddataset);
    let arr = [];
    setedit(arr);
    dispatch(getNotification({
      message: `Value updated for ${updatedDataset[variableIndex].attribute_name}`,
      type: "Success"
    }))

  }
  function hasAnyDifference(updatedDataset1, originalDatasetForColorCoding, variableIndex) {
    const updatedMonthData = updatedDataset1[variableIndex]?.month_data || [];
    const originalMonthData = originalDatasetForColorCoding[variableIndex]?.month_data || [];
    if (updatedMonthData.length !== originalMonthData.length) {
        return true;
    }
   
    for (let i = 0; i < updatedMonthData.length; i++) {
        if (updatedMonthData[i].attribute_value !== originalMonthData[i].attribute_value) {
            return true; 
        }
    }    return false; 
}

const changeelementsdecimal = (variableIndex, valueIndex, e) => {
  const updatedDataset = JSON.parse(JSON.stringify(sampledataset));
  const value = e.target.value;
  const isValidInput = /^-?\d*\.?\d*$/.test(value);
  if (!isValidInput) {
    dispatch(getNotification({ message: "Please enter a valid number", type: "warning" }));
    return;
  }

  // Parse the input value (default to 0 if empty)
  const inputValue = value !== "" ? value : 0;
    updatedDataset[variableIndex].month_data[valueIndex].attribute_value = inputValue;
 
    updatedDataset[variableIndex].subtotal = (updatedDataset[
      variableIndex
    ].month_data.reduce((acc, item) => acc + (parseFloat(item.attribute_value) || 0), 0));
  

updatedDataset[variableIndex]?.month_data[valueIndex].attribute_value!==originaldatasetforcolorcoding[variableIndex].month_data[valueIndex].attribute_value?
    updatedDataset[variableIndex].to_show_in=1:updatedDataset[variableIndex].to_show_in=0 
  changesampledataset(updatedDataset);
  };

  const changesubtotaldecimal = (e, variableIndex) => {

    const updatedDataset = JSON.parse(JSON.stringify(sampledataset))

    const today1 = new Date();
    const today = new Date(today1.getFullYear(), today1.getMonth() - 2, 1);
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth()).padStart(2, "0")}`;
  
    if (updatedDataset[variableIndex].frozen === 0) {
      const subtotalValue = e.target.value || 0;
      if (subtotalValue === "0" || subtotalValue === 0 || Number.isNaN(subtotalValue)) {

        updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map((item) => {
          if (item.frozen === 0 && item?.month_year > currentMonthYear) {
            return { ...item, attribute_value: 0 };
          }
          return item;
        });

        updatedDataset[variableIndex].subtotal = 0;
        //console.log(updatedDataset[variableIndex]);
        changesampledataset(updatedDataset);
        // updatedDataset[variableIndex].subtotal = 0;
        // changesampledataset(updatedDataset);
      }

      else {
        if (updatedDataset[variableIndex].subtotal === 0) {
          const nonFrozenArray = updatedDataset[variableIndex].month_data.filter(
            (it) => it?.frozen === 0 && it?.month_year > currentMonthYear
          );
          const numberOfNonFrozenMonths = nonFrozenArray.length;
          const FrozenArray=updatedDataset[variableIndex].month_data.filter(
            (it) => it?.frozen === 1 || it?.month_year < currentMonthYear
          );
         // console.log(FrozenArray)
          const sumFrozenArray=FrozenArray?.reduce((prev,next)=>{
            return prev+next
          },0)
        
          if (numberOfNonFrozenMonths > 0) {

            const validSubtotalValue = parseFloat(subtotalValue) || 0;
            // Distribute the entered value equally among non-frozen months
            const equalValue = validSubtotalValue / numberOfNonFrozenMonths;
            updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map(
              (item) => {
                if (item.frozen === 0 && item?.month_year > currentMonthYear) {
                  return {
                    ...item,
                    attribute_value: parseFloat(equalValue.toFixed(2)), // Ensure 2 decimal places
                  };
                }
                return item;
              }
            );

            updatedDataset[variableIndex].subtotal = validSubtotalValue;
            changesampledataset(updatedDataset);
          } else {
            console.warn("No non-frozen items to distribute the value.");
          }
        }
        else if (updatedDataset[variableIndex].subtotal - updatedDataset[variableIndex]?.month_data.reduce((prev, next) => {
          if (next?.frozen === 1 || next?.month_year < currentMonthYear) {
            return prev + parseFloat(next.attribute_value || 0);
          }
          return prev
        }, 0) === 0
        ) {
          const nonFrozenArray = updatedDataset[variableIndex].month_data.filter(
            (it) => it?.frozen === 0 && it?.month_year > currentMonthYear
          );
          const numberOfNonFrozenMonths = nonFrozenArray.length;
          const validSubtotalValue = parseFloat(subtotalValue) - updatedDataset[variableIndex].subtotal;
          if (numberOfNonFrozenMonths > 0) {
            // Distribute the entered value equally among non-frozen months
            const equalValue = validSubtotalValue / numberOfNonFrozenMonths;
            updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map(
              (item) => {
                if (item.frozen === 0 && item?.month_year > currentMonthYear) {
                  return {
                    ...item,
                    attribute_value: parseFloat(equalValue.toFixed(2)), // Ensure 2 decimal places
                  };
                }
                return item;
              }
            );

            updatedDataset[variableIndex].subtotal = validSubtotalValue;
            changesampledataset(updatedDataset);
          } else {
            console.warn("No non-frozen items to distribute the value.");
          }


          //console.log(updatedDataset[variableIndex]);

        }
        //         else
        //          if (
        //           updatedDataset[variableIndex].subtotal === 
        //           updatedDataset[variableIndex]?.month_data.reduce((prev, next) => {
        //             if (next?.frozen === 1 || next?.month_year < currentMonthYear) {
        //               return prev + parseFloat(next.attribute_value || 0); 
        //             }
        //             return prev
        //           }, 0)
        //         )
        //   {
        // dispatch(getNotification({
        //   message:"Total not valid",
        //   type:"danger"

        // }))
        // }
        else {

          const month_data = updatedDataset[variableIndex].month_data;
          const nonFrozenArray = updatedDataset[variableIndex].month_data.filter(
            (item) => { return item?.frozen === 0 && item?.month_year > currentMonthYear }
          );
          const FrozenArray = updatedDataset[variableIndex].month_data.filter(
            (item) => { return item?.frozen === 1 || item?.month_year <= currentMonthYear }
          );
          const subtotalFrozenValues = FrozenArray.reduce(
            (acc, item) => acc + item.attribute_value,
            0
          );

          const numberOfNonFrozenMonths = nonFrozenArray.length;
          if (numberOfNonFrozenMonths > 0) {
            const subtotalNonFrozenValues = nonFrozenArray.reduce(
              (acc, item) => acc + item.attribute_value,
              0
            );
            updatedDataset[variableIndex].month_data = month_data.map((item) => {
              if (item.frozen === 0 && item?.month_year > currentMonthYear) {
                const prorataValue =
                  (subtotalValue - subtotalFrozenValues) * (item.attribute_value / subtotalNonFrozenValues);
                return {
                  ...item,
                  attribute_value: parseFloat(prorataValue),
                };
              } else {
                return item;
              }
            });

            updatedDataset[variableIndex].subtotal = subtotalValue;
            changesampledataset(updatedDataset);
          }
        }
      }
    }
  };
  
  const handlecancel = (variableIndex) => {

    const updatedDataset1 = [...sampledataset];
    const updatedDataset2 = [...originalset];
    updatedDataset1[variableIndex].month_data = updatedDataset2[
      variableIndex
    ].month_data.map((it) => {
      return it;
    });
    updatedDataset1[variableIndex].subtotal = updatedDataset2[variableIndex].subtotal;
    updatedDataset1[variableIndex].frozen = 0;
    if(hasAnyDifference(updatedDataset1,originaldatasetforcolorcoding,variableIndex)){
      updatedDataset1[variableIndex].to_show_in=1
    }
    else{
      updatedDataset1[variableIndex].to_show_in=0
    }
    changesampledataset(updatedDataset1);
    //changesampledataset(originalset);
  };

  const clearAll = (variableIndex) => {
    const today1 = new Date();
    const today = new Date(today1.getFullYear(), today1.getMonth() - 2, 1);
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth()).padStart(2, "0")}`;
    const updatedDataset = JSON.parse(JSON.stringify(sampledataset));
    updatedDataset[variableIndex].month_data = updatedDataset[
      variableIndex
    ].month_data.map((item) => {
      if(`{04-${item.fy?.split("-")}`>currentMonthYear){
        return { ...item, attribute_value: 0, frozen: 0 };
      }
      else{
        return { ...item, attribute_value: 0, frozen: 0 };
      }
    }
  );
    updatedDataset[variableIndex].subtotal = 0;
    //console.log(updatedDataset[variableIndex]);
    changesampledataset(updatedDataset);
  };
  const togglelock = (variableIndex, valueIndex) => {
    const updatedDataset = JSON.parse(JSON.stringify(sampledataset))
    if (updatedDataset[variableIndex].month_data[valueIndex].frozen === 0) {
      updatedDataset[variableIndex].month_data[valueIndex].frozen = 1;
    } else if (
      updatedDataset[variableIndex].month_data[valueIndex].frozen === 1
    ) {
      updatedDataset[variableIndex].month_data[valueIndex].frozen = 0;
    }
    changesampledataset(updatedDataset);
  };
  const togglelocksubtotal = (variableIndex) => {
    const updatedDataset = [...sampledataset];
    if (updatedDataset[variableIndex].frozen === 0) {
      updatedDataset[variableIndex].frozen = 1;
    } else if (updatedDataset[variableIndex].frozen === 1) {
      updatedDataset[variableIndex].frozen = 0;
    }
    changesampledataset(updatedDataset);
  };
  return (
<div className='container'>
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
  <h2 class="accordion-header">
     <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
{ExceptionVariables?.variabletypes[0]}
     </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
    <div class="accordion-body "  >
                 
    <table className="mx-auto table table-sm table-striped-columns table-responsive-md table-responsive-lg" style={{ width: "98%", overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>

   <th>Media Type</th>
      <th>Attribute</th>
       <th>Key</th>
      {sampledataset[0].month_data?.map((it) => {
                        return <th className='text-center'>{it?.fy}</th>
        })}
    
      <th></th>
    </tr>
  </thead>
  <tbody>
    {(() => {
    
    let lastAttributeName = null; 
    return sampledataset?.map((item, variableIndex) => {
      if (item?.type !== ExceptionVariables?.variabletypes[0] || hidingvariablelist.some((variable) => variable === item.attribute_name || item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===0))) {
        return null; // Skip hidden variables
      }

      const showAttributeName = lastAttributeName !== item.attribute_name; // Check if we should display the attribute_name
      lastAttributeName = item.attribute_name; // Update lastAttributeName

      return (
        <tr key={`outside${variableIndex}`}>
          {/* Show attribute_name only for the first key of each group */}
          <td>{item.attribute_name?.startsWith("Aashirvaad")?"TV":"Digital"}</td>
          <td >
            {showAttributeName && (
              <b>
                {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                  ? ExceptionVariables?.spellingChanges[item.attribute_name]
                  : item.attribute_name}{" "}
                ({item?.units?.toUpperCase()})
              </b>
            )}
          </td>
          <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy}</td>
         
            {item?.month_data?.map((it, valueIndex) => {
              const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;

              return (
                <td className="text-end" key={valueIndex}>
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={it?.frozen ? "noborder" : ""}
                      style={{ width: "60px" }}
                      value={it.attribute_value ?? "-"}
                      disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth && it.attribute_value != null) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                 
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
            
            {/* Edit/Save Buttons */}
            <td>
              {edit[variableIndex] ? (
                <div className="d-flex">
                  <button
                    className="btn btn-sm checktickbtn"
                    onClick={() => {
                      item.allow_decimal !== 0
                        ? updatedatasetdecimal(variableIndex)
                        : updatedatasetdecimal(variableIndex);
                    }}
                  >
                    <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      clearAll(variableIndex);
                    }}
                  >
                    <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      let arr = [];
                      setedit(arr);
                      handlecancel(variableIndex);
                    }}
                  >
                    <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    changesampledataset(originalset)
                    let arr = [];
                    arr[variableIndex] = true;
                    setedit(arr);
                  }}
                >
                  <i className="fas fa-edit greentheme"></i>
                </button>
              )}
            </td>
          </tr>
        );
      });
    })()}
  </tbody>
</table>

                </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        {ExceptionVariables?.variabletypes[1]}
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
    <div class="accordion-body">
    <table className="mx-auto table table-sm table-striped-columns table-responsive-md table-responsive-lg" style={{ width: "98%", overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>
 <th>Attribute</th> <th>Key</th>    
      
      {sampledataset[0].month_data?.map((it) => {
                        return <th className='text-center'>{it?.fy}</th>
                      })}

      <th></th>
    </tr>
  </thead>
  <tbody>
    
      {(() => {
    
    let lastAttributeName = null; 
    return sampledataset?.map((item, variableIndex) => {
      if (item?.type !== ExceptionVariables?.variabletypes[3] || hidingvariablelist.some((variable) => variable === item.attribute_name || item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===0))) {
        return null; // Skip hidden variables
      }

      const showAttributeName = lastAttributeName !== item.attribute_name; // Check if we should display the attribute_name
      lastAttributeName = item.attribute_name; // Update lastAttributeName
      if (ExceptionVariables.onlyRegular.some(varName => varName === item.attribute_name)){
        return (
 
          item.prodhierarchy?.startsWith("REGULAR") &&  <tr key={`outside${variableIndex}`}>
          {/* Show attribute_name only for the first key of each group */}
          <td >
            {showAttributeName && (
              <b>
                {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                  ? ExceptionVariables?.spellingChanges[item.attribute_name]
                  : item.attribute_name}{" "}
                ({item?.units?.toUpperCase()})
              </b>
            )}
          </td>
          <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy}</td>
         
         {item?.month_data?.map((it, valueIndex) => {
              const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;

              return (
                <td className="text-end" key={valueIndex}>
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={it?.frozen ? "noborder" : ""}
                      style={{ width: "60px" }}
                      value={it.attribute_value ?? "-"}
                      disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth && it.attribute_value != null) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                  
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
          
            {/* Edit/Save Buttons */}
            <td>
              {edit[variableIndex] ? (
                <div className="d-flex">
                  <button
                    className="btn btn-sm checktickbtn"
                    onClick={() => {
                      item.allow_decimal !== 0
                        ? updatedatasetdecimal(variableIndex)
                        : updatedatasetdecimal(variableIndex);
                    }}
                  >
                    <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      clearAll(variableIndex);
                    }}
                  >
                    <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      let arr = [];
                      setedit(arr);
                      handlecancel(variableIndex);
                    }}
                  >
                    <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    changesampledataset(originalset)
                    let arr = [];
                    arr[variableIndex] = true;
                    setedit(arr);
                  }}
                >
                  <i className="fas fa-edit greentheme"></i>
                </button>
              )}
            </td>
          </tr>  );
      }
      return (
        <tr key={`outside${variableIndex}`}>
          {/* Show attribute_name only for the first key of each group */}
          <td >
            {showAttributeName && (
              <b>
                {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                  ? ExceptionVariables?.spellingChanges[item.attribute_name]
                  : item.attribute_name}{" "}
                ({item?.units?.toUpperCase()})
              </b>
            )}
          </td>
          <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy}</td>
         
         {item?.month_data?.map((it, valueIndex) => {
              const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;

              return (
                <td className="text-end" key={valueIndex}>
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={it?.frozen ? "noborder" : ""}
                      style={{ width: "60px" }}
                      value={it.attribute_value ?? "-"}
                      disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth && it.attribute_value != null) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                  
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
          
            {/* Edit/Save Buttons */}
            <td>
              {edit[variableIndex] ? (
                <div className="d-flex">
                  <button
                    className="btn btn-sm checktickbtn"
                    onClick={() => {
                      item.allow_decimal !== 0
                        ? updatedatasetdecimal(variableIndex)
                        : updatedatasetdecimal(variableIndex);
                    }}
                  >
                    <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      clearAll(variableIndex);
                    }}
                  >
                    <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      let arr = [];
                      setedit(arr);
                      handlecancel(variableIndex);
                    }}
                  >
                    <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    changesampledataset(originalset)
                    let arr = [];
                    arr[variableIndex] = true;
                    setedit(arr);
                  }}
                >
                  <i className="fas fa-edit greentheme"></i>
                </button>
              )}
            </td>
          </tr>
        );
      });
    })()}
  </tbody>
</table>
                </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
    {  ExceptionVariables?.variabletypes[2]}
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
    <div class="accordion-body">
    <table className="mx-auto table table-sm table-striped-columns table-responsive-md table-responsive-lg" style={{ width: "98%", overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>
 <th>Attribute</th><th>Key</th>     
      
      {sampledataset[0].month_data?.map((it) => {
                        return <th className='text-center'>{it?.fy}</th>
                      })}
    
      <th></th>
    </tr>
  </thead>
  <tbody>
  {(() => {
    
    let lastAttributeName = null; 
    return sampledataset?.map((item, variableIndex) => {
      if (item?.type !== ExceptionVariables?.variabletypes[2] || hidingvariablelist.some((variable) => variable === item.attribute_name || item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===0))) {
        return null; // Skip hidden variables
      }

      const showAttributeName = lastAttributeName !== item.attribute_name; // Check if we should display the attribute_name
      lastAttributeName = item.attribute_name; // Update lastAttributeName
      if (ExceptionVariables.onlyRegular.some(varName => varName === item.attribute_name)){
        return (
       item.prodhierarchy.includes("REGULAR") &&   <tr key={`outside${variableIndex}`}>
            {/* Show attribute_name only for the first key of each group */}
            <td >
              {showAttributeName && (
                <b>
                  {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                    ? ExceptionVariables?.spellingChanges[item.attribute_name]
                    : item.attribute_name}{" "}
                  ({item?.units?.toUpperCase()})
                </b>
              )}
            </td>
            <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy}</td>
           
          {item?.month_data?.map((it, valueIndex) => {
                const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;
  
                return (
                  <td className="text-end" key={valueIndex}>
                  {edit[variableIndex] ? (
                    <div>
                      <input
                        className={it?.frozen ? "noborder" : ""}
                        style={{ width: "60px" }}
                        value={it.attribute_value ?? "-"}
                        disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                        onChange={(e) => {
                          if (!isBeforeUnlockMonth && it.attribute_value != null) {
                            item.allow_decimal !== 0
                              ? changeelementsdecimal(variableIndex, valueIndex, e)
                              : changeelementsdecimal(variableIndex, valueIndex, e);
                          }
                        }}
                      />
                   
                    </div>
                  ) : it.attribute_value == null ? (
                    "-"
                  ) : Number.isInteger(it.attribute_value) ? (
                    Number(it.attribute_value).toLocaleString("en-IN")
                  ) : !isNaN(it.attribute_value) ? (
                    it.attribute_value > 10000
                      ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                      : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                  ) : (
                    it.attribute_value
                  )}
                </td>
                
                );
              })}
              {/* Subtotal Column */}
          
              {/* Edit/Save Buttons */}
              <td>
                {edit[variableIndex] ? (
                  <div className="d-flex">
                    <button
                      className="btn btn-sm checktickbtn"
                      onClick={() => {
                        item.allow_decimal !== 0
                          ? updatedatasetdecimal(variableIndex)
                          : updatedatasetdecimal(variableIndex);
                      }}
                    >
                      <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        clearAll(variableIndex);
                      }}
                    >
                      <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        let arr = [];
                        setedit(arr);
                        handlecancel(variableIndex);
                      }}
                    >
                      <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      changesampledataset(originalset)
                      let arr = [];
                      arr[variableIndex] = true;
                      setedit(arr);
                    }}
                  >
                    <i className="fas fa-edit greentheme"></i>
                  </button>
                )}
              </td>
            </tr>
          );
      }
      else if (ExceptionVariables.oneRowAtta.some(varName => varName === item.attribute_name)){
        return (
          item.prodhierarchy.includes("REGULAR_MP_0.5") &&      <tr key={`outside${variableIndex}`}>
            {/* Show attribute_name only for the first key of each group */}
            <td >
              {showAttributeName && (
                <b>
                  {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                    ? ExceptionVariables?.spellingChanges[item.attribute_name]
                    : item.attribute_name}{" "}
                  ({item?.units?.toUpperCase()})
                </b>
              )}
            </td>
            <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy?.split("_")?.slice(0,2)?.join("_")}</td>
           
          {item?.month_data?.map((it, valueIndex) => {
                const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;
  
                return (
                  <td className="text-end" key={valueIndex}>
                  {edit[variableIndex] ? (
                    <div>
                      <input
                        className={it?.frozen ? "noborder" : ""}
                        style={{ width: "60px" }}
                        value={it.attribute_value ?? "-"}
                        disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                        onChange={(e) => {
                          if (!isBeforeUnlockMonth && it.attribute_value != null) {
                            item.allow_decimal !== 0
                              ? changeelementsdecimal(variableIndex, valueIndex, e)
                              : changeelementsdecimal(variableIndex, valueIndex, e);
                          }
                        }}
                      />
                   
                    </div>
                  ) : it.attribute_value == null ? (
                    "-"
                  ) : Number.isInteger(it.attribute_value) ? (
                    Number(it.attribute_value).toLocaleString("en-IN")
                  ) : !isNaN(it.attribute_value) ? (
                    it.attribute_value > 10000
                      ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                      : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                  ) : (
                    it.attribute_value
                  )}
                </td>
                
                );
              })}
              {/* Subtotal Column */}
          
              {/* Edit/Save Buttons */}
              <td>
                {edit[variableIndex] ? (
                  <div className="d-flex">
                    <button
                      className="btn btn-sm checktickbtn"
                      onClick={() => {
                        item.allow_decimal !== 0
                          ? updatedatasetdecimal(variableIndex)
                          : updatedatasetdecimal(variableIndex);
                      }}
                    >
                      <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        clearAll(variableIndex);
                      }}
                    >
                      <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        let arr = [];
                        setedit(arr);
                        handlecancel(variableIndex);
                      }}
                    >
                      <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      changesampledataset(originalset)
                      let arr = [];
                      arr[variableIndex] = true;
                      setedit(arr);
                    }}
                  >
                    <i className="fas fa-edit greentheme"></i>
                  </button>
                )}
              </td>
            </tr>
          );
      }
            return (
        <tr key={`outside${variableIndex}`}>
          {/* Show attribute_name only for the first key of each group */}
          <td >
            {showAttributeName && (
              <b>
                {Object.keys(ExceptionVariables?.spellingChanges).some((key) => key === item.attribute_name)
                  ? ExceptionVariables?.spellingChanges[item.attribute_name]
                  : item.attribute_name}{" "}
                ({item?.units?.toUpperCase()})
              </b>
            )}
          </td>
          <td className={item.to_show_in === 1 ? "text-danger" : ""}>{item?.prodhierarchy}</td>
         
        {item?.month_data?.map((it, valueIndex) => {
              const isBeforeUnlockMonth = it?.month_year <= MonthBeforeUnlockMonth;

              return (
                <td className="text-end" key={valueIndex}>
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={it?.frozen ? "noborder" : ""}
                      style={{ width: "60px" }}
                      value={it.attribute_value ?? "-"}
                      disabled={isBeforeUnlockMonth || it?.frozen || it.attribute_value == null}
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth && it.attribute_value != null) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                 
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(1)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
        
            {/* Edit/Save Buttons */}
            <td>
              {edit[variableIndex] ? (
                <div className="d-flex">
                  <button
                    className="btn btn-sm checktickbtn"
                    onClick={() => {
                      item.allow_decimal !== 0
                        ? updatedatasetdecimal(variableIndex)
                        : updatedatasetdecimal(variableIndex);
                    }}
                  >
                    <i className="fa fa-check" style={{ color: "green", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      clearAll(variableIndex);
                    }}
                  >
                    <i className="fas fa-trash-alt" style={{ color: "red", fontSize: "16px" }}></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      let arr = [];
                      setedit(arr);
                      handlecancel(variableIndex);
                    }}
                  >
                    <i className="fa fa-arrow-circle-left greentheme" style={{ fontSize: "16px" }}></i>
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    changesampledataset(originalset)
                    let arr = [];
                    arr[variableIndex] = true;
                    setedit(arr);
                  }}
                >
                  <i className="fas fa-edit greentheme"></i>
                </button>
              )}
            </td>
          </tr>
        );
      });
    })()}
  </tbody>
</table>
                </div>
    </div>
  </div>
</div>
</div>

  )
}

export default VariableTableYearlyAtta