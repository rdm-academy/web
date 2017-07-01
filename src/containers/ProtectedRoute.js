import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const ProtectedRoute = ({
  component: Component,
  fallback: Fallback,
  redirect = '/login',
  session,
  ...rest
}) => (
  <Route {...rest} render={props => (
    session.token ? (
      <Component {...props} />
    ) : (
      redirect ? (
        <Redirect to={{
          pathname: redirect,
          state: { from: props.location },
        }} />
      ) : (
        <Fallback {...props} />
      )
    )
  )} />
);

export default connect(
  (state) => ({
    session: state.session,
  })
)(ProtectedRoute);
