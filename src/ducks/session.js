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
          error: action.error,
        }
      }

      // Payload contains token and profile.
      return {
        ...action.payload,
      };

    case LOGOUT:
      return {};

    default:
      return state;
  }
};
