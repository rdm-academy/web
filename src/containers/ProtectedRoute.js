import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


let ProtectedRoute = ({ component: Component, session, ...rest }) => (
  <Route {...rest} render={props => (
    session.token ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location },
      }} />
    )
  )} />
)

ProtectedRoute = connect(
  (state) => ({
    session: state.session,
  })
)(ProtectedRoute);


export default ProtectedRoute;
