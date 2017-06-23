const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export function login(payload) {
  return {
    type: LOGIN,
    payload: payload,
  }
}

export function logout() {
  return {
    type: LOGOUT,
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      if (action.error) {
        return {
          active: false,
          error: action.error,
        }
      }

      return {
        active: true,
        ...action.payload,
      };

    case LOGOUT:
      return {
        active: false,
      };

    default:
      return state;
  }
};
