import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Auth0Lock from 'auth0-lock'

import config from '../config';
import * as sessionActions from '../ducks/session';

import './LoginPage.css';


// Login is used to authenticate a user.
class Login extends Component {
  constructor() {
    super();

    this.lock = new Auth0Lock(
      config.auth0.client,
      config.auth0.domain,
      config.auth0.config,
  );

    this.lock.on('authenticated', this.onAuthenticated);
    this.lock.on('authorization_error', this.onAuthorizationError);
  }

  // Note: the data is parsed from the URL and populated in this result automatically.
  onAuthenticated = (result) => {
    const { dispatch } = this.props;

    this.lock.hide();

    dispatch(sessionActions.login({
      token: result.idToken,
      profile: result.idTokenPayload,
    }));
  }

  onAuthorizationError = (error) => {
    const { dispatch } = this.props;

    dispatch(sessionActions.login({
      error: error,
    }));
  }

  componentDidMount() {
    this.lock.show();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/projects' } };

    if (this.props.session.active) {
      return <Redirect to={from} />;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4-md offset-md-4">
            <h3 className="text-center">Login/Signup</h3>

            <div id="login-container"></div>
          </div>
        </div>
      </div>
    );
  }
}

Login = withRouter(connect(
  (state) => ({
    session: state.session,
  }),
)(Login));


export default Login;
