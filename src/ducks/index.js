import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import sessionReducer from './session';


// Root reducer.
export default combineReducers({
  router: routerReducer,
  session: sessionReducer,
});
