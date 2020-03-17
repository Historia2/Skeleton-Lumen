import { combineReducers } from 'redux';

import dashboardReducer from './dashboard.reducer';
import popupReducer from './popup.reducer';
import insightReducer from './insight.reducer';
import overviewReducer from './overview.reducer';
import appReducer from './app.reducer';

export default combineReducers({
    dashboardReducer,
    popupReducer,
    insightReducer,
    overviewReducer,
    appReducer
})