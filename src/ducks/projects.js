import api from '../api';
import { asyncType, asyncDispatcher } from '../actions';

export const GET_PROJECT = asyncType("GET_PROJECT");

export const get = asyncDispatcher(GET_PROJECT, ({ id }) => (
  api.client.call({
    path: `/projects/${id}`,
  })
));

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PROJECT.REQUEST:
      return Object.assign(state, {
        [action.input.id]: {
          loading: true,
        }
      });

    case GET_PROJECT.SUCCESS:
      return Object.assign(state, {
        [action.input.id]: {
          data: action.output,
        }
      });

    case GET_PROJECT.ERROR:
      return Object.assign(state, {
        [action.input.id]: {
          error: action.error,
        }
      });
  }

  return state;
}
