import stateReducer from "./reducer";
import dashboardReducer from "../../Components/Global_store/BrandmanagerDashboard/dashboardSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    app: stateReducer,
    dashboard: dashboardReducer
});

export default rootReducer;