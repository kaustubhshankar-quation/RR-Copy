import React,{useState} from 'react'
import ExceptionVariables from '../JSON Files/ExceptionVariables.json'
import { useDispatch } from 'react-redux';
import getNotification from '../../Redux/Action/action';

function UbLbTable({originalsetublboriginal,sampledataset2,originalset2,handleoriginaldataset2change,handlesampledataset2change}) {

const hidingvariablelist=ExceptionVariables?.hiddenvariables;
const [addminuspercentagelb,setaddminuspercentagelb]=useState([])
const [addminuspercentageub,setaddminuspercentageub]=useState([])
const [edit,setedit]=useState([])
const dispatch=useDispatch()
const table2edit = (e, variableIndex, type) => { 
  const updatedDataset = [...sampledataset2];
  const enteredvalue = e.target.value || 0;

  if (type === "lb") {
      let arr = [...addminuspercentagelb];
      const percentageChange = ((enteredvalue - originalsetublboriginal[variableIndex].lower_limit) / originalsetublboriginal[variableIndex].lower_limit * 100)?.toFixed(2);
      arr[variableIndex] =percentageChange==="Infinity"?0: percentageChange;
  updatedDataset[variableIndex].lower_limit = enteredvalue; 
      setaddminuspercentagelb(arr);

    
  } 
    else if (type === "ub") {
      let arr = [...addminuspercentagelb];
      const percentageChange = ((enteredvalue - originalsetublboriginal[variableIndex].upper_limit) / originalsetublboriginal[variableIndex].upper_limit * 100)?.toFixed(2);
      arr[variableIndex] =percentageChange==="Infinity"?0: percentageChange;

      
      updatedDataset[variableIndex].upper_limit = enteredvalue;
      setaddminuspercentageub(arr);
    
  }

  handlesampledataset2change(updatedDataset);
};

  const table2editpercetnagebasis = (e, variableIndex, type) => { 
      const updatedDataset = [...sampledataset2];
      const enteredValue = parseFloat(e.target.value)||0;
        if (false) {
          dispatch(
              getNotification({
                  message: "Entered value must be between -25% and 25%.",
                  type: "danger", 
              })
          );
          return; 
      }
  
      // Helper function to update percentage arrays
      const updatePercentage = (array, index, value, isLowerLimit) => {
          const updatedArray = [...array];
          updatedArray[index] = value;
          isLowerLimit 
              ? setaddminuspercentagelb(updatedArray) 
              : setaddminuspercentageub(updatedArray);
      };
  
      // Update the respective limits
      if (type === "lb") {
          updatePercentage(addminuspercentagelb, variableIndex, enteredValue, true);
 
          updatedDataset[variableIndex].lower_limit =Number(
          originalsetublboriginal[variableIndex].lower_limit * (1 + enteredValue / 100))?.toFixed(2);
      } else if (type === "ub") {
          updatePercentage(addminuspercentageub, variableIndex, enteredValue, false);
       
          updatedDataset[variableIndex].upper_limit =Number(
          originalsetublboriginal[variableIndex].upper_limit * (1 + enteredValue / 100))?.toFixed(2);
      }
  
      // Update the original dataset
      handlesampledataset2change(updatedDataset);
      // handlesampledataset2change(updatedDataset)
  };
  
const handlecancel=(variableIndex)=>{
  const updatedDataset1 = [...sampledataset2];
  const updatedDataset2 = [...originalset2];
 
  let arr1=[...addminuspercentagelb]
  let arr2=[...addminuspercentageub]
  let percentageChangelb=(updatedDataset2[variableIndex].lower_limit-originalsetublboriginal[variableIndex].lower_limit)/originalsetublboriginal[variableIndex].lower_limit*100
  let percentageChangeub=(updatedDataset2[variableIndex].upper_limit-originalsetublboriginal[variableIndex].upper_limit)/originalsetublboriginal[variableIndex].upper_limit*100
  arr1[variableIndex] =percentageChangelb==="Infinity"?0: percentageChangelb?.toFixed(0);
  arr2[variableIndex] =percentageChangeub==="Infinity"?0: percentageChangeub?.toFixed(0);
  setaddminuspercentagelb(arr1)
  setaddminuspercentageub(arr2)
 updatedDataset1[variableIndex].upper_limit = updatedDataset2[variableIndex].upper_limit;
  updatedDataset1[variableIndex].lower_limit = updatedDataset2[variableIndex].lower_limit; 
handlesampledataset2change(updatedDataset1)
}
const handleupdate = (variableIndex) => {
  const updatedDataset1 = [...sampledataset2];
  const updatedDataset2 = [...originalset2];
  let arr1 = [...addminuspercentagelb];
  let arr2 = [...addminuspercentageub];

  // Avoid division by zero
  let lowerLimitBase = originalsetublboriginal[variableIndex].lower_limit || 1;
  let upperLimitBase = originalsetublboriginal[variableIndex].upper_limit || 1;

  let percentageChangelb = ((updatedDataset1[variableIndex].lower_limit - originalsetublboriginal[variableIndex].lower_limit) / lowerLimitBase) * 100;
  let percentageChangeub = ((updatedDataset1[variableIndex].upper_limit - originalsetublboriginal[variableIndex].upper_limit) / upperLimitBase) * 100;

  // Ensure percentage changes are finite
  percentageChangelb = isFinite(percentageChangelb) ? percentageChangelb.toFixed(0) : 0;
  percentageChangeub = isFinite(percentageChangeub) ? percentageChangeub.toFixed(0) : 0;

  if (
    percentageChangelb <= 25 &&
    percentageChangelb >= -25 &&
    percentageChangeub <= 25 &&
    percentageChangeub >= -25
  ) {

    if(Number(updatedDataset1[variableIndex].upper_limit) < Number( updatedDataset1[variableIndex].lower_limit)){
      
      dispatch(
        getNotification({
          message: `Upper Bound is less than lower bound!`,
          type: "danger",
        })
      );
    }
    else{
      arr1[variableIndex] = percentageChangelb;
      arr2[variableIndex] = percentageChangeub;
  
      setaddminuspercentagelb(arr1);
      setaddminuspercentageub(arr2);
      updatedDataset2[variableIndex].upper_limit = updatedDataset1[variableIndex].upper_limit;
      updatedDataset2[variableIndex].lower_limit = updatedDataset1[variableIndex].lower_limit;
      
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

   else if (
    percentageChangelb > 25 ||
    percentageChangelb < -25 ||
    percentageChangeub > 25 ||
    percentageChangeub < -25
  ) {
 let confirmedbounds= window.confirm("Entered change percentage is not within -25% to 25% range.Do you wish to continue?")
 console.log(confirmedbounds,updatedDataset1[variableIndex].upper_limit,updatedDataset1[variableIndex].lower_limit)  
 if(confirmedbounds){
  if(Number(updatedDataset1[variableIndex].upper_limit) < Number( updatedDataset1[variableIndex].lower_limit)){
      
//  console.log(confirmedbounds,updatedDataset1[variableIndex].upper_limit,updatedDataset1[variableIndex].lower_limit)  

      dispatch(
        getNotification({
          message: `Upper Bound is less than lower bound!`,
          type: "danger",
        })
      );
    }
// if(false){}
    else{
      arr1[variableIndex] = percentageChangelb;
      arr2[variableIndex] = percentageChangeub;
  
      setaddminuspercentagelb(arr1);
      setaddminuspercentageub(arr2);
      updatedDataset2[variableIndex].upper_limit = updatedDataset1[variableIndex].upper_limit;
      updatedDataset2[variableIndex].lower_limit = updatedDataset1[variableIndex].lower_limit;
      
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
  }
};

  return (
    <div> 
        {/* <button className="btngreentheme p-2 my-1" onClick={()=>modifyublbtable()}>Update Table</button> */}
        <table className="table table-striped table-bordered">
  <thead className="bg-secondary text-white">
    <tr>
      <th>Attribute</th>
      <th>Lower Bound (Weekly)</th>
      <th>Upper Bound (Weekly)</th>
      <th>Edit</th>
    </tr>
  </thead>
  <tbody>
    {sampledataset2?.map((item, variableIndex) => {
      const isHidden = hidingvariablelist.some((variable) => variable === item.variables);

      if (isHidden) return null;

      return (
        <tr key={`row-${variableIndex}`}>
          <td>
            <b>{item.variables}</b> ({item.type})
          </td>
          <td>
            <div className="d-flex  justify-content-between">
                <span className="">  
              {edit[variableIndex] ? 
                <div className='d-flex flex-column  w-50'> <small>Bound</small>
                  <input
                    className="p-1 my-auto"
                    
                    placeholder="Lower Limit"
                    value={item.lower_limit}
                    onChange={(e) => table2edit(e, variableIndex, "lb")}
                    style={{ fontSize: "0.7rem" }}
                  /></div>:
             <span>  { Number(item.lower_limit)?.toFixed(2)}</span>
                }
                </span>
              {edit[variableIndex] && (
                <div className="d-flex flex-column  w-50">
                   <small>Percentage Change</small>
                  <input
                    className="p-1 my-auto"
             type="number"
                    placeholder="% increase/decrease"
                    value={addminuspercentagelb[variableIndex]}
                    onChange={(e) => table2editpercetnagebasis(e, variableIndex, "lb")}
                    style={{ fontSize: "0.7rem" }}
                  />
        
                </div>
              )}
            </div>
          </td>
          <td>
            <div className="d-flex  justify-content-between">
                <span className="">  
              {edit[variableIndex] ? 
         <div className='d-flex flex-column  w-50'> <small>Bound</small>
                  <input
                    className="p-1 my-auto"
                    placeholder="Upper Limit"
                    value={item.upper_limit}
                    onChange={(e) => table2edit(e, variableIndex, "ub")}
                    style={{ fontSize: "0.7rem" }}
                  /></div>:
             <span>  { Number(item.upper_limit)?.toFixed(2)}</span>
                }
                </span>
              {edit[variableIndex] && (
                <div className="d-flex flex-column  w-50">
                   <small>Percentage Change</small>
                  <input
                    className="p-1 my-auto"
                    type="number"
                    placeholder="% increase/decrease"
                    value={addminuspercentageub[variableIndex]}
                    onChange={(e) => table2editpercetnagebasis(e, variableIndex, "ub")}
                    style={{ fontSize: "0.7rem" }}
                  />
        
                </div>
              )}
            </div>
          </td>
          <td>
            {edit[variableIndex] ? (
              <div className="d-flex align-items-center">
                    <button
                                  className="btn btn-sm checktickbtn"
                                  onClick={() => {
                                   handleupdate(variableIndex)
                                  }}
                                >
                                  <i
                                    className="fa fa-check"
                                    style={{ color: "green", fontSize: "16px" }}
                                  ></i>
                                </button>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => {
                                    let arr = [];
                                    setedit(arr);
                                    handlecancel(variableIndex);
                                  }}
                                >
                                  <i
                                    className="fa fa-arrow-circle-left greentheme"
                                    style={{ fontSize: "16px" }}
                                  ></i>
                                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  let arr = [];
                  arr[variableIndex] = true;
                  setedit(arr);
                }}
              >
                <i className="fas fa-edit"></i> 
              </button>
            )}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>


    </div>
  )
}

export default UbLbTable