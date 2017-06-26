import jwtDecode from 'jwt-decode'
import React from 'react';
import { connect } from 'react-redux';
import * as sessionActions from '../ducks/session';


function isTokenExpired(token) {
  const decoded = jwtDecode(token)
  if (!decoded.exp) {
    return false
  }

  const date = new Date(decoded.exp * 1000)
  if (!date) {
    return false
  }

  return date <= new Date()
}


class SessionManager extends React.Component {
  componentWillMount() {
    const { dispatch, session } = this.props;

    if (session.token && isTokenExpired(session.token)) {
      dispatch(sessionActions.logout());
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

SessionManager = connect(
  (state) => ({
    session: state.session,
  })
)(SessionManager);


export default SessionManager;
