import React,{useState} from 'react'
import { useDispatch } from 'react-redux';
import getNotification from '../../Redux/Action/action';

import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import { a } from 'react-spring';

function VariableTableAtta({sampledataset,changesampledataset,originalset,changeoriginalset,originaldatasetforcolorcoding,endDate}) {
  console.log(endDate)
    //sampledataset?.sort((a, b) => a.attribute_name.localeCompare(b.attribute_name));
  const today1 = new Date();
  const currentmonth15thdate = new Date(today1.getFullYear(), today1.getMonth(), 1);
  const isBefore15th = new Date() < currentmonth15thdate;
  const unblockeddate = isBefore15th?new Date(today1.getFullYear(), today1.getMonth()-3, 1):new Date(today1.getFullYear(), today1.getMonth()-2, 1);
  //const MonthBeforeUnlockMonth = `${unblockeddate.getFullYear()}-${String(unblockeddate.getMonth()).padStart(2, "0")}`;
  const MonthBeforeUnlockMonth = endDate;
    // const uniquetypes=Array.from(new Set(sampledataset?.map((item)=> item.type)))
    const hidingvariablelist=ExceptionVariables?.hiddenvariables; 
    const dispatch=useDispatch()

    const [edit,setedit]=useState([])

   const updatedatasetdecimal = (variableIndex) => {
    const updatedDataset = [...sampledataset];
  
// if(updatedDataset[variableIndex]?.type==="Core"){
//   const frozenCells=updatedDataset[variableIndex]?.month_data?.filter((it)=>
//      it?.month_year < MonthBeforeUnlockMonth
//   )
//      updatedDataset[variableIndex].subtotal =
//   ( updatedDataset[
//     variableIndex
//   ].month_data.reduce((acc, value) => acc + parseFloat(value.attribute_value), 0))/12;
// }
if(ExceptionVariables?.maxVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name || ExceptionVariables?.zeroOrOneVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name))){
  updatedDataset[variableIndex].subtotal = Math.max(...updatedDataset[
    variableIndex
  ].month_data.map(( item) => item.attribute_value));
}
else if(ExceptionVariables?.lastPriceAvailableVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name)){
  const latestMonthData = updatedDataset[variableIndex].month_data
  .sort((a, b) => (a.month_year > b.month_year ? 1 : -1)) // Sort by month_year in ascending order
  .slice() // Create a copy of the sorted array
  .reverse() // Reverse to iterate from the latest to the earliest
  .find((item) => item.attribute_value !== 0);

 updatedDataset[variableIndex].subtotal = latestMonthData ? latestMonthData.attribute_value : 0;
}
else{ 
 
if(updatedDataset[variableIndex].type===ExceptionVariables?.variabletypes[2]){

  updatedDataset[variableIndex].subtotal = updatedDataset[
    variableIndex
  ].month_data.reduce((acc, value) => {
    if (value.attribute_value !== null) {
      return acc + parseFloat(value.attribute_value); // Correctly add the value
    }
    return acc; 
  }, 0);

}

else{

  updatedDataset[variableIndex].subtotal = updatedDataset[
    variableIndex
  ].month_data.reduce((acc, value) => {
    if (value.attribute_value !== null) {
      return acc + parseFloat(value.attribute_value); 
    }
    return acc; 
  }, 0);

}

}
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
 
 const changeelementsdecimal = (variableIndex, valueIndex, e) => {
  const updatedDataset = JSON.parse(JSON.stringify(sampledataset));
  const value = e.target.value;
  const isValidInput = /^-?\d*\.?\d*$/.test(value);
  if (!isValidInput) {
    dispatch(getNotification({ message: "Please enter a valid number", type: "warning" }));
    return;
  }

  const inputValue = value !== "" ? value : 0;
    updatedDataset[variableIndex].month_data[valueIndex].attribute_value = inputValue;
  if (ExceptionVariables?.maxVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name || 
    ExceptionVariables?.zeroOrOneVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name)))
     {
 
    if (true) {
      if (true) {
        updatedDataset[variableIndex].subtotal = Math.max(...updatedDataset[
          variableIndex
        ].month_data?.filter(item=>item.attribute_value!==null)?.map(( item) => item.attribute_value));
      } 
     
    }  
   }
else if (ExceptionVariables?.lastPriceAvailableVariables?.some(variable => variable === updatedDataset[variableIndex]?.attribute_name)) {
  
    if (updatedDataset[variableIndex].month_data[valueIndex].frozen === 0) {
      if (updatedDataset[variableIndex].frozen === 0) {
        let latestMonthData;
         if(updatedDataset[variableIndex].month_data[0]?.quaterly){
          latestMonthData = updatedDataset[variableIndex].month_data
         .sort((a, b) => (a.quaterly  > b.quaterly  ? 1 : -1)) // Sort by month_year in ascending order
         .slice() // Create a copy of the sorted array
         .reverse() // Reverse to iterate from the latest to the earliest
         .find((item) => item.attribute_value !== 0 && item.attribute_value !== null);
       }
       else if(updatedDataset[variableIndex].month_data[0]?.hy){
        latestMonthData = updatedDataset[variableIndex].month_data
       .sort((a, b) => (a.hy  > b.hy  ? 1 : -1)) // Sort by month_year in ascending order
       .slice() // Create a copy of the sorted array
       .reverse() // Reverse to iterate from the latest to the earliest
       .find((item) => item.attribute_value !== 0 && item.attribute_value !== null);
     }
        else{
          latestMonthData = updatedDataset[variableIndex].month_data
          .sort((a, b) => (a.month_year  > b.month_year  ? 1 : -1)) // Sort by month_year in ascending order
          .slice() // Create a copy of the sorted array
          .reverse() // Reverse to iterate from the latest to the earliest
          .find((item) => item.attribute_value !== 0 && item.attribute_value !== null);}
    
     
       updatedDataset[variableIndex].subtotal = latestMonthData ? latestMonthData.attribute_value : 0;
      } 
      else if (
        updatedDataset[variableIndex].frozen === 1 &&
        updatedDataset[variableIndex].subtotal === 0
      ) {
        dispatch(
          getNotification({
            message: "Entry is not valid!",
            type: "danger",
          })
        );
      } 
    }  
   }
  else{

      if(updatedDataset[variableIndex].type===ExceptionVariables?.variabletypes[2]){
      
        if (true) {
            if (true) {
             
              const frozenCells=updatedDataset[variableIndex]?.month_data?.filter((it)=>
                it?.month_year < MonthBeforeUnlockMonth
             )
          
             updatedDataset[variableIndex].subtotal = updatedDataset[
              variableIndex
            ].month_data.reduce((acc, value) => {
              if (value.attribute_value !== null) {
                return acc + parseFloat(value.attribute_value); // Correctly add the value
              }
              return acc; 
            }, 0);
      
         }}
        
      }
   
    else {
 
      if (true) {
       
         updatedDataset[variableIndex].subtotal = updatedDataset[
              variableIndex
            ].month_data.reduce((acc, value) => {
              if (value.attribute_value !== null) {
                return acc + parseFloat(value.attribute_value); // Correctly add the value
              }
              return acc; 
            }, 0);
      
         
      } else if (
        updatedDataset[variableIndex].frozen === 1 &&
        updatedDataset[variableIndex].subtotal === 0
      ) {
        dispatch(
          getNotification({
            message: "Entry is not valid!",
            type: "danger",
          })
        );
      } else {
        
       
        const subtotalFrozenValues = updatedDataset[
          variableIndex
        ].month_data.reduce((acc, item) => {
          if (item.frozen === 1 || item?.month_year <= MonthBeforeUnlockMonth) {
            return acc + (parseFloat(item.attribute_value) || 0);
          } else {
            return acc;
          }
        }, 0);
    
        const subtotalValueforprorata =
          updatedDataset[variableIndex].subtotal - inputValue - subtotalFrozenValues;

        if (subtotalValueforprorata < 0) {
          dispatch(getNotification({ message: "Values not valid", type: "danger" }));
        } else {
          const nonFrozenArray = updatedDataset[
            variableIndex
          ].month_data.filter((item, index) => {
            return index !== valueIndex && item?.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth;
          });

          const numberOfNonFrozenMonths = nonFrozenArray.length;
          if (numberOfNonFrozenMonths > 0) {
            const subtotalNonFrozenValues = nonFrozenArray.reduce(
              (acc, item) => acc + (parseFloat(item.attribute_value) || 0),
              0
            );

            updatedDataset[variableIndex].month_data =
              updatedDataset[variableIndex].month_data.map((item, index) => {
                if (
                  item.frozen === 0 &&
                  index !== valueIndex &&
                  item?.month_year > MonthBeforeUnlockMonth
                ) {
                  const prorataValue =
                    subtotalValueforprorata *
                    ((parseFloat(item.attribute_value) || 0) / subtotalNonFrozenValues);

                  return {
                    ...item,
                    attribute_value: parseFloat(prorataValue) || 0,
                  };
                } else {
                  return item;
                }
              });
          }
        }
      }
    }
   
  }


updatedDataset[variableIndex]?.month_data[valueIndex].attribute_value!==originaldatasetforcolorcoding[variableIndex].month_data[valueIndex].attribute_value?
    updatedDataset[variableIndex].to_show_in=1:updatedDataset[variableIndex].to_show_in=0 
  changesampledataset(updatedDataset);
  };

const changesubtotaldecimal = (e, variableIndex) => {

    const updatedDataset = JSON.parse(JSON.stringify(sampledataset))

  
    if (updatedDataset[variableIndex].frozen === 0) {
      const subtotalValue = e.target.value || 0;
      if (subtotalValue === "0" || subtotalValue === 0 || Number.isNaN(subtotalValue)) {

        updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map((item) => {
          if (item.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth) {
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
            (it) => it?.frozen === 0 && it?.month_year > MonthBeforeUnlockMonth
          );
          const numberOfNonFrozenMonths = nonFrozenArray.length;
          const FrozenArray=updatedDataset[variableIndex].month_data.filter(
            (it) => it?.frozen === 1 || it?.month_year < MonthBeforeUnlockMonth
          );
          console.log(FrozenArray)
          const sumFrozenArray=FrozenArray?.reduce((prev,next)=>{
            return prev+next
          },0)
        
          if (numberOfNonFrozenMonths > 0) {

            const validSubtotalValue = parseFloat(subtotalValue) || 0;
            // Distribute the entered value equally among non-frozen months
            const equalValue = validSubtotalValue / numberOfNonFrozenMonths;
            updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map(
              (item) => {
                if (item.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth) {
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
          if (next?.frozen === 1 || next?.month_year < MonthBeforeUnlockMonth) {
            return prev + parseFloat(next.attribute_value || 0);
          }
          return prev
        }, 0) === 0
        ) {
          const nonFrozenArray = updatedDataset[variableIndex].month_data.filter(
            (it) => it?.frozen === 0 && it?.month_year > MonthBeforeUnlockMonth
          );
          const numberOfNonFrozenMonths = nonFrozenArray.length;
          const validSubtotalValue = parseFloat(subtotalValue) - updatedDataset[variableIndex].subtotal;
          if (numberOfNonFrozenMonths > 0) {
            // Distribute the entered value equally among non-frozen months
            const equalValue = validSubtotalValue / numberOfNonFrozenMonths;
            updatedDataset[variableIndex].month_data = updatedDataset[variableIndex].month_data.map(
              (item) => {
                if (item.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth) {
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
        //             if (next?.frozen === 1 || next?.month_year < MonthBeforeUnlockMonth) {
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
            (item) => { return item?.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth }
          );
          const FrozenArray = updatedDataset[variableIndex].month_data.filter(
            (item) => { return item?.frozen === 1 || item?.month_year <= MonthBeforeUnlockMonth }
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
              if (item.frozen === 0 && item?.month_year > MonthBeforeUnlockMonth) {
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

  };

  const clearAll = (variableIndex) => {

    const updatedDataset = JSON.parse(JSON.stringify(sampledataset));

    updatedDataset[variableIndex].month_data = updatedDataset[
      variableIndex
    ].month_data.map((item) => {
      if(item?.attribute_value!==null && item?.month_year>MonthBeforeUnlockMonth){
        return { ...item, attribute_value: 0};
      }
      else{
        return item;
      }
    });
    updatedDataset[variableIndex].subtotal = 0;
    if(hasAnyDifference(updatedDataset,originaldatasetforcolorcoding,variableIndex)){
      updatedDataset[variableIndex].to_show_in=1
    }
    else{
      updatedDataset[variableIndex].to_show_in=0
    }
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
    <>
  <div class="accordion" id="accordionExample">
  <div class="accordion-item">
  <h2 class="accordion-header">
     <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
{ExceptionVariables?.variabletypes[0]}
     </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
    <div class="accordion-body " style={{overflowX:"scroll"}} >
                 

                  <table className="mx-auto table table-sm table-striped-columns table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl" style={{ width: "80%",  overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>
      <th>Media Type</th>
    <th>Attribute</th>
     <th>Key</th>
     
     {sampledataset[0].month_data?.map((it) => {
                        return <th className="text-end " >{it?.month_year?it?.month_year :it?.half_yearly?it?.half_yearly: `${it?.quarterly}`}</th>
                      })}
      <th className="text-end ">Total</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {(() => {
    
    let lastAttributeName = null; 
    return sampledataset?.map((item, variableIndex) => {
      if (item?.type !== ExceptionVariables?.variabletypes[0] || hidingvariablelist.some((variable) => variable === item.attribute_name || item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===undefined || it.attribute_value===0))) {
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
                      disabled={isBeforeUnlockMonth || it?.frozen }
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth ) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                    <button
                      className="btn btn-sm my-2"
                      onClick={() => {
                        if (!isBeforeUnlockMonth ) {
                          togglelock(variableIndex, valueIndex);
                        }
                      }}
                      disabled={isBeforeUnlockMonth }
                    >
                      
               {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                    </button>
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
            <td className="text-end">
              {edit[variableIndex] ? (
                <div>
                  <input
                    className={item.frozen ? "noborder ml-1" : ""}
                    style={{ width: "60px" }}
                    defaultValue={item.subtotal}
                    disabled
                    value={item.subtotal}
                    onChange={(e) => {
                      item.allow_decimal !== 0
                        ? changesubtotaldecimal(e, variableIndex)
                        : changesubtotaldecimal(e, variableIndex);
                    }}
                  />
                </div>
              ) : Number.isInteger(item.subtotal) ? (
                Number(item.subtotal).toLocaleString("en-IN")
              ) : !isNaN(item.subtotal) ? (
                item.subtotal > 10000
                  ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                  : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
              ) : (
                item.subtotal
              )}
            </td>
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
    <div class="accordion-body " style={{overflowX:"scroll"}} >
                 

                 <table className="mx-auto table table-sm table-striped-columns table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl" style={{ width: "80%",  overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>
    <th>Attribute</th>
     <th>Key</th>
     
     {sampledataset[0].month_data?.map((it) => {
                        return <th className="text-end ">{it?.month_year?it?.month_year :it?.half_yearly?it?.half_yearly: `Q${it?.quaterly}`}</th>
                      })}
      <th className="text-end ">Total</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {(() => {
    
    let lastAttributeName = null; 
    return sampledataset?.map((item, variableIndex) => {
      if (item?.type !== ExceptionVariables?.variabletypes[3] || hidingvariablelist.some((variable) => variable === item.attribute_name || item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===undefined || it.attribute_value===0))) {
        return null; // Skip hidden variables
      }

      const showAttributeName = lastAttributeName !== item.attribute_name; // Check if we should display the attribute_name
      lastAttributeName = item.attribute_name; // Update lastAttributeName
      if (ExceptionVariables.onlyRegular.some(varName => varName === item.attribute_name)){
        return (
 
          item.attribute_name==="trade_wholesale" && item.prodhierarchy?.startsWith("REGULAR") &&    <tr key={`outside${variableIndex}`}>
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
                       disabled={isBeforeUnlockMonth || it?.frozen }
                       onChange={(e) => {
                         if (!isBeforeUnlockMonth ) {
                           item.allow_decimal !== 0
                             ? changeelementsdecimal(variableIndex, valueIndex, e)
                             : changeelementsdecimal(variableIndex, valueIndex, e);
                         }
                       }}
                     />
                     <button
                       className="btn btn-sm my-2"
                       onClick={() => {
                         if (!isBeforeUnlockMonth ) {
                           togglelock(variableIndex, valueIndex);
                         }
                       }}
                       disabled={isBeforeUnlockMonth }
                     >
                      {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                     </button>
                   </div>
                 ) : it.attribute_value == null ? (
                   "-"
                 ) : Number.isInteger(it.attribute_value) ? (
                   Number(it.attribute_value).toLocaleString("en-IN")
                 ) : !isNaN(it.attribute_value) ? (
                   it.attribute_value > 10000
                     ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                     : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                 ) : (
                   it.attribute_value
                 )}
               </td>
               
               );
             })}
             {/* Subtotal Column */}
             <td className="text-end">
               {edit[variableIndex] ? (
                 <div>
                   <input
                     className={item.frozen ? "noborder ml-1" : ""}
                     style={{ width: "60px" }}
                     defaultValue={item.subtotal}
                     disabled
                     value={item.subtotal}
                     onChange={(e) => {
                       item.allow_decimal !== 0
                         ? changesubtotaldecimal(e, variableIndex)
                         : changesubtotaldecimal(e, variableIndex);
                     }}
                   />
                 </div>
               ) : Number.isInteger(item.subtotal) ? (
                 Number(item.subtotal).toLocaleString("en-IN")
               ) : !isNaN(item.subtotal) ? (
                 item.subtotal > 10000
                   ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                   : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
               ) : (
                 item.subtotal
               )}
             </td>
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
      else{
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
                       disabled={isBeforeUnlockMonth || it?.frozen }
                       onChange={(e) => {
                         if (!isBeforeUnlockMonth ) {
                           item.allow_decimal !== 0
                             ? changeelementsdecimal(variableIndex, valueIndex, e)
                             : changeelementsdecimal(variableIndex, valueIndex, e);
                         }
                       }}
                     />
                     <button
                       className="btn btn-sm my-2"
                       onClick={() => {
                         if (!isBeforeUnlockMonth ) {
                           togglelock(variableIndex, valueIndex);
                         }
                       }}
                       disabled={isBeforeUnlockMonth }
                     >
                      {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                     </button>
                   </div>
                 ) : it.attribute_value == null ? (
                   "-"
                 ) : Number.isInteger(it.attribute_value) ? (
                   Number(it.attribute_value).toLocaleString("en-IN")
                 ) : !isNaN(it.attribute_value) ? (
                   it.attribute_value > 10000
                     ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                     : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                 ) : (
                   it.attribute_value
                 )}
               </td>
               
               );
             })}
             {/* Subtotal Column */}
             <td className="text-end">
               {edit[variableIndex] ? (
                 <div>
                   <input
                     className={item.frozen ? "noborder ml-1" : ""}
                     style={{ width: "60px" }}
                     defaultValue={item.subtotal}
                     disabled
                     value={item.subtotal}
                     onChange={(e) => {
                       item.allow_decimal !== 0
                         ? changesubtotaldecimal(e, variableIndex)
                         : changesubtotaldecimal(e, variableIndex);
                     }}
                   />
                 </div>
               ) : Number.isInteger(item.subtotal) ? (
                 Number(item.subtotal).toLocaleString("en-IN")
               ) : !isNaN(item.subtotal) ? (
                 item.subtotal > 10000
                   ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                   : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
               ) : (
                 item.subtotal
               )}
             </td>
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
    <div class="accordion-body " style={{overflowX:"scroll"}} >
                 

                 <table className="mx-auto table table-sm table-striped-columns table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl" style={{ width: "80%",  overflowX: "scroll" }}>
  <thead className="bg-secondary text-white">
    <tr>
    <th>Attribute</th>
     <th>Key</th>
     
      
     {sampledataset[0].month_data?.map((it) => {
                        return <th className="text-end ">{it?.month_year?it?.month_year :it?.half_yearly?it?.half_yearly: `Q${it?.quaterly}`}</th>
                      })}
      <th className="text-end ">Total</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {(() => {
    
    let lastAttributeName = null; 
      return sampledataset?.map((item, variableIndex) => {
        if (item?.type !== ExceptionVariables?.variabletypes[2] || hidingvariablelist.some((variable) => variable === item.attribute_name ||item?.month_data.every((it)=>it.attribute_value===null || it.attribute_value===undefined || it.attribute_value===0))) {
          return null; // Skip hidden variables
        }

        const showAttributeName = lastAttributeName !== item.attribute_name; // Check if we should display the attribute_name
        lastAttributeName = item.attribute_name; // Update lastAttributeName
        if (ExceptionVariables.onlyRegular.some(varName => varName === item.attribute_name)){
          return (
           item.prodhierarchy.includes("REGULAR") &&  <tr key={`outside${variableIndex}`}>
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
                        disabled={isBeforeUnlockMonth || it?.frozen }
                        onChange={(e) => {
                          if (!isBeforeUnlockMonth ) {
                            item.allow_decimal !== 0
                              ? changeelementsdecimal(variableIndex, valueIndex, e)
                              : changeelementsdecimal(variableIndex, valueIndex, e);
                          }
                        }}
                      />
                      <button
                        className="btn btn-sm my-2"
                        onClick={() => {
                          if (!isBeforeUnlockMonth ) {
                            togglelock(variableIndex, valueIndex);
                          }
                        }}
                        disabled={isBeforeUnlockMonth }
                      >
                       {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                      </button>
                    </div>
                  ) : it.attribute_value == null ? (
                    "-"
                  ) : Number.isInteger(it.attribute_value) ? (
                    Number(it.attribute_value).toLocaleString("en-IN")
                  ) : !isNaN(it.attribute_value) ? (
                    it.attribute_value > 10000
                      ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                      : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                  ) : (
                    it.attribute_value
                  )}
                </td>
                
                );
              })}
              {/* Subtotal Column */}
              <td className="text-end">
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={item.frozen ? "noborder ml-1" : ""}
                      style={{ width: "60px" }}
                      defaultValue={item.subtotal}
                      disabled
                      value={item.subtotal}
                      onChange={(e) => {
                        item.allow_decimal !== 0
                          ? changesubtotaldecimal(e, variableIndex)
                          : changesubtotaldecimal(e, variableIndex);
                      }}
                    />
                  </div>
                ) : Number.isInteger(item.subtotal) ? (
                  Number(item.subtotal).toLocaleString("en-IN")
                ) : !isNaN(item.subtotal) ? (
                  item.subtotal > 10000
                    ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
                ) : (
                  item.subtotal
                )}
              </td>
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
           item.prodhierarchy.includes("REGULAR_MP_0.5") &&  <tr key={`outside${variableIndex}`}>
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
                        disabled={isBeforeUnlockMonth || it?.frozen }
                        onChange={(e) => {
                          if (!isBeforeUnlockMonth ) {
                            item.allow_decimal !== 0
                              ? changeelementsdecimal(variableIndex, valueIndex, e)
                              : changeelementsdecimal(variableIndex, valueIndex, e);
                          }
                        }}
                      />
                      <button
                        className="btn btn-sm my-2"
                        onClick={() => {
                          if (!isBeforeUnlockMonth ) {
                            togglelock(variableIndex, valueIndex);
                          }
                        }}
                        disabled={isBeforeUnlockMonth }
                      >
                       {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                      </button>
                    </div>
                  ) : it.attribute_value == null ? (
                    "-"
                  ) : Number.isInteger(it.attribute_value) ? (
                    Number(it.attribute_value).toLocaleString("en-IN")
                  ) : !isNaN(it.attribute_value) ? (
                    it.attribute_value > 10000
                      ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                      : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                  ) : (
                    it.attribute_value
                  )}
                </td>
                
                );
              })}
              {/* Subtotal Column */}
              <td className="text-end">
                {edit[variableIndex] ? (
                  <div>
                    <input
                      className={item.frozen ? "noborder ml-1" : ""}
                      style={{ width: "60px" }}
                      defaultValue={item.subtotal}
                      disabled
                      value={item.subtotal}
                      onChange={(e) => {
                        item.allow_decimal !== 0
                          ? changesubtotaldecimal(e, variableIndex)
                          : changesubtotaldecimal(e, variableIndex);
                      }}
                    />
                  </div>
                ) : Number.isInteger(item.subtotal) ? (
                  Number(item.subtotal).toLocaleString("en-IN")
                ) : !isNaN(item.subtotal) ? (
                  item.subtotal > 10000
                    ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
                ) : (
                  item.subtotal
                )}
              </td>
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
                      disabled={isBeforeUnlockMonth || it?.frozen }
                      onChange={(e) => {
                        if (!isBeforeUnlockMonth ) {
                          item.allow_decimal !== 0
                            ? changeelementsdecimal(variableIndex, valueIndex, e)
                            : changeelementsdecimal(variableIndex, valueIndex, e);
                        }
                      }}
                    />
                    <button
                      className="btn btn-sm my-2"
                      onClick={() => {
                        if (!isBeforeUnlockMonth ) {
                          togglelock(variableIndex, valueIndex);
                        }
                      }}
                      disabled={isBeforeUnlockMonth }
                    >
                     {isBeforeUnlockMonth ?       <i className="fa fa-lock text-secondary"></i>:<i className="fa fa-unlock text-warning"></i>}
                    </button>
                  </div>
                ) : it.attribute_value == null ? (
                  "-"
                ) : Number.isInteger(it.attribute_value) ? (
                  Number(it.attribute_value).toLocaleString("en-IN")
                ) : !isNaN(it.attribute_value) ? (
                  it.attribute_value > 10000
                    ? parseFloat(Number(it.attribute_value).toFixed(0)).toLocaleString("en-IN")
                    : parseFloat(Number(it.attribute_value).toFixed(2)).toLocaleString("en-IN")
                ) : (
                  it.attribute_value
                )}
              </td>
              
              );
            })}
            {/* Subtotal Column */}
            <td className="text-end">
              {edit[variableIndex] ? (
                <div>
                  <input
                    className={item.frozen ? "noborder ml-1" : ""}
                    style={{ width: "60px" }}
                    defaultValue={item.subtotal}
                    disabled
                    value={item.subtotal}
                    onChange={(e) => {
                      item.allow_decimal !== 0
                        ? changesubtotaldecimal(e, variableIndex)
                        : changesubtotaldecimal(e, variableIndex);
                    }}
                  />
                </div>
              ) : Number.isInteger(item.subtotal) ? (
                Number(item.subtotal).toLocaleString("en-IN")
              ) : !isNaN(item.subtotal) ? (
                item.subtotal > 10000
                  ? parseFloat(Number(item.subtotal).toFixed(0)).toLocaleString("en-IN")
                  : parseFloat(Number(item.subtotal).toFixed(2)).toLocaleString("en-IN")
              ) : (
                item.subtotal
              )}
            </td>
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
 </>
  )
}

export default VariableTableAtta