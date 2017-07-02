import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import sessionReducer from './session';
import projectListReducer from './projectList';
import projectFormReducer from './projectForm';
import projectIndexReducer from './projectIndex';


// Root reducer.
export default combineReducers({
  router: routerReducer,
  session: sessionReducer,
  projectList: projectListReducer,
  projectForm: projectFormReducer,
  projectIndex: projectIndexReducer,
});
