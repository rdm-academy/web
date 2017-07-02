import { handleActions } from 'redux-actions';

import api from 'api';
import { asyncType, asyncDispatcher } from '../actions';

const GET_PROJECT = asyncType("GET_PROJECT");

export const getProject = asyncDispatcher(GET_PROJECT, api.client.getProject);

const instanceReducer = handleActions({
  [GET_PROJECT.REQUEST]: () => ({
    loading: true,
  }),

  [GET_PROJECT.SUCCESS]: (_, action) => ({
    data: action.output,
  }),

  [GET_PROJECT.ERROR]: (_, action) => ({
    error: action.error,
  })
}, {})

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PROJECT.REQUEST:
    case GET_PROJECT.SUCCESS:
    case GET_PROJECT.ERROR:
      // Route based on the id being requested.
      return Object.assign({}, state, {
        [action.input.id]: instanceReducer(state[action.input.id], action)
      });
    default:
      return state;
  }
}
