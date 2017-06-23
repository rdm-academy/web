import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import projectsReducer from './projects';
import sessionReducer from './session';


// Root reducer.
export default combineReducers({
  router: routerReducer,
  session: sessionReducer,
  projects: projectsReducer,
});
