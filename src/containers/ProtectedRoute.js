import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


let ProtectedRoute = ({ component: Component, session, ...rest }) => (
  session.token ? <Component {...rest} /> : (
    <Redirect to={{
      pathname: '/login',
      state: {
        from: rest.location,
      },
    }} />
  )
)

ProtectedRoute = connect(
  (state) => ({
    session: state.session,
  })
)(ProtectedRoute);


export default ProtectedRoute;
