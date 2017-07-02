import { handleActions } from 'redux-actions';

import api from 'api';
import { asyncType, asyncDispatcher } from '../actions';

const GET_PROJECTS = asyncType("GET_PROJECTS");

export const getProjects = asyncDispatcher(GET_PROJECTS, api.client.getProjects);

export default handleActions({
  [GET_PROJECTS.REQUEST]: () => ({
    loading: true,
  }),

  [GET_PROJECTS.SUCCESS]: (_, action) => ({
    data: action.output,
  }),

  [GET_PROJECTS.ERROR]: (_, action) => ({
    error: action.error,
  })
}, {})
