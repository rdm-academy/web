import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from 'ducks/session';

import './style.css';

const BrandLink = ({ url }) => (
  <Link to={url} className="navbar-brand">
    <i className="fa fa-flask" /> <strong>RDM</strong>ACADEMY
  </Link>
)

const UserNav = ({ profile, onLogout }) => (
  <div className="collapse navbar-collapse">
    <BrandLink url="/" />

    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <a className="nav-link" href="https://learn.rdm.academy" target="_blank" rel="noopener noreferrer">Learn</a>
      </li>
      <li className="nav-item">
        <Link to="/projects" className="nav-link">Projects</Link>
      </li>
    </ul>

    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/profile" className="nav-link">Profile</Link>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link" onClick={onLogout}>Logout</a>
      </li>
    </ul>
  </div>
)

// Header has the branding and application-wide navigation.
const AnonymousNav = () => (
  <div className="collapse navbar-collapse">
    <BrandLink url="/" />

    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <a className="nav-link" href="https://learn.rdm.academy" target="_blank" rel="noopener noreferrer">Learn</a>
      </li>
    </ul>

    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login" className="nav-link">Login</Link>
      </li>
      <li className="nav-item">
        <Link to="/signup" className="nav-link">Signup</Link>
      </li>
    </ul>
  </div>
);

class Header extends Component {
  onLogout = (event) => {
    event.preventDefault();
    this.props.dispatch(actions.logout());
  }

  render() {
    const { session } = this.props;

    const nav = session.token ? (
      <UserNav
        profile={session.profile}
        onLogout={this.onLogout} />
    ) : (
      <AnonymousNav />
    );

    return (
      <nav className="Header navbar navbar-light navbar-toggleable-sm fixed-top">
        {nav}
      </nav>
    );
  }
}

export default connect(
  (state) => ({
    session: state.session,
  }),
)(Header);
