import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as sessionActions from '../ducks/session';


const UserNav = ({ profile, onLogout }) => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link to="/projects" className="nav-link">Projects</Link>
      </li>
    </ul>

    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/profile" className="nav-link">Profile</Link>
      </li>
      <li className="nav-item">
        <button className="btn btn-secondary nav-link" onClick={onLogout}>Logout</button>
      </li>
    </ul>
  </div>
)

// Header has the branding and application-wide navigation.
const AnonymousNav = () => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
    </ul>

    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login" className="nav-link">Login/Signup</Link>
      </li>
    </ul>
  </div>
);

class Header extends Component {
  onLogout = () => {
    this.props.dispatch(sessionActions.logout());
    return false;
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
      <nav className="navbar navbar-light navbar-toggleable-sm fixed-top" style={{borderBottom: '1px solid #eee', backgroundColor: '#ffffff'}}>
        <Link to="/" className="navbar-brand"><i className="fa fa-fw fa-flask" /> RDM Academy</Link>
        {nav}
      </nav>
    );
  }
}


Header = connect(
  (state) => ({
    session: state.session,
  }),
)(Header);


export default Header;
