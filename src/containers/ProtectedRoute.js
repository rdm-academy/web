import jwtDecode from 'jwt-decode'
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
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


class ProtectedRoute extends Component {
  componentWillMount() {
    const { dispatch, session } = this.props;
    if (session.token && isTokenExpired(session.token)) {
      dispatch(sessionActions.logout());
    }
  }

  render() {
    const { component: Component, session, ...rest } = this.props

    if (!session.token) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {
            from: rest.location,
          },
        }} />
      );
    }

    return <Component {...rest} />;
  }
}

ProtectedRoute = withRouter(connect(
  (state) => ({
    session: state.session,
  })
)(ProtectedRoute));


export default ProtectedRoute;
