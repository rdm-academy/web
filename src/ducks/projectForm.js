import { handleActions } from 'redux-actions';

import api from 'api';
import { asyncType, asyncDispatcher } from '../actions';

const CREATE_PROJECT = asyncType("CREATE_PROJECT");

export const createProject = asyncDispatcher(CREATE_PROJECT, api.client.createProject);

export default handleActions({
  [CREATE_PROJECT.REQUEST]: () => ({
    pending: true,
  }),

  [CREATE_PROJECT.SUCCESS]: (_, action) => ({
    success: true,
    data: action.output,
  }),

  [CREATE_PROJECT.ERROR]: (_, action) => ({
    error: action.error,
  })
}, {})
