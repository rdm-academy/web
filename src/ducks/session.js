import { asyncType, asyncDispatcher } from '../actions';
import api from '../api';

const LOGIN = asyncType('LOGIN');
const LOGOUT = 'LOGOUT';

export const login = asyncDispatcher(LOGIN, api.client.login);

export function logout() {
  return {
    type: LOGOUT,
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN.REQUEST:
    case LOGIN.SUCCESS:
      return {
        ...action.input,
      };

    case LOGIN.ERROR:
      return {
        error: action.error,
      };

    case LOGOUT:
      return {};

    default:
      return state;
  }
};
