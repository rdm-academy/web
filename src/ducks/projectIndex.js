import { handleActions } from 'redux-actions';
import YAML from 'js-yaml';

import api from 'api';
import { asyncType, asyncDispatcher } from '../actions';

const GET_PROJECT = asyncType("GET_PROJECT");
const UPDATE_WORKFLOW = asyncType("UPDATE_WORKFLOW");

export const getProject = asyncDispatcher(GET_PROJECT, api.client.getProject);
export const updateWorkflow = asyncDispatcher(UPDATE_WORKFLOW, api.client.updateWorkflow);

const updateWorkflowReducer = handleActions({
  [UPDATE_WORKFLOW.REQUEST]: (state) => ({
    loading: true,
    ...state,
  }),

  [UPDATE_WORKFLOW.SUCCESS]: (state, action) => {
    let graph = {};
    if (action.input.source) {
      graph = YAML.safeLoad(action.input.source);
    }
    return {
      data: Object.assign({}, state.data, {
        workflow: {
          source: action.input.source,
          graph: graph,
        }
      }),
    }
  },

  [UPDATE_WORKFLOW.ERROR]: (state, action) => ({
    error: action.error,
    ...state,
  })
}, {})

const getProjectReducer = handleActions({
  [GET_PROJECT.REQUEST]: () => ({
    loading: true,
  }),

  [GET_PROJECT.SUCCESS]: (_, action) => {
    if (action.output.workflow.source) {
      action.output.workflow.graph = YAML.safeLoad(action.output.workflow.source);
    } else {
      action.output.workflow.graph = {};
    }
    return {
      data: action.output,
    };
  },

  [GET_PROJECT.ERROR]: (_, action) => ({
    error: action.error,
  })
}, {})

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_WORKFLOW.REQUEST:
    case UPDATE_WORKFLOW.SUCCESS:
    case UPDATE_WORKFLOW.ERROR:
      // Route based on the id being requested.
      return Object.assign({}, state, {
        [action.input.id]: updateWorkflowReducer(state[action.input.id], action)
      });

    case GET_PROJECT.REQUEST:
    case GET_PROJECT.SUCCESS:
    case GET_PROJECT.ERROR:
      // Route based on the id being requested.
      return Object.assign({}, state, {
        [action.input.id]: getProjectReducer(state[action.input.id], action)
      });

    default:
      return state;
  }
}
