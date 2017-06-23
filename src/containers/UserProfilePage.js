import React from 'react';
import { connect } from 'react-redux';

class UserProfilePage extends React.Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4-md offset-md-4">
            <h3>{ profile.name }</h3>
            <p>Email: { profile.email }</p>
          </div>
        </div>
      </div>
    );
  }
}


UserProfilePage = connect(
  (state) => ({
    profile: state.session.profile,
  }),
)(UserProfilePage);


export default UserProfilePage;
