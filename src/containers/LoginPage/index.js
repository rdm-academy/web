import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Auth0Lock from 'auth0-lock'

import CenteredPage from 'components/CenteredPage';

import config from 'config';
import * as actions from 'ducks/session';

import './style.css';


// Login is used to authenticate a user.
class Login extends Component {
  // Note: the data is parsed from the URL and populated in this result automatically.
  onAuthenticated = (result) => {
    const { dispatch } = this.props;

    this.lock.hide();

    // This is an async request that ensures the user is registered
    // with the server. Since this occurs every time the user re-authenticates
    // with the identity provider, we assume it succeeds and only redirects
    // if it fails.
    dispatch(actions.login({
      token: result.idToken,
      profile: result.idTokenPayload,
    }))
  }

  onAuthorizationError = (error) => {
    const { dispatch } = this.props;

    dispatch(actions.login({
      error: error,
    }));
  }

  componentDidMount() {
    this.lock = new Auth0Lock(
      config.auth0.client,
      config.auth0.domain,
      Object.assign(config.auth0.config, {
        rememberLastLogin: this.props.signup ? false : true,
      }),
    );

    this.lock.on('authenticated', this.onAuthenticated);
    this.lock.on('authorization_error', this.onAuthorizationError);

    this.lock.show();
  }

  render() {
    const { signup } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/projects' } };

    if (this.props.session.token) {
      return <Redirect to={from} />;
    }

    return (
      <CenteredPage>
        <h5 className="mb-4 text-center">{ signup ? 'Signup' : 'Login' }</h5>
        <div id="login-container"></div>
      </CenteredPage>
    );
  }
}

export default withRouter(connect(
  (state) => ({
    session: state.session,
  }),
)(Login));
