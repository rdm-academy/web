import React from 'react';
import { connect } from 'react-redux';

import CenteredPage from 'components/CenteredPage';


class ProfilePage extends React.Component {
  render() {
    const { profile } = this.props;

    // Parse subject to get the profile name and id.
    let [ provider ] = profile.sub.split('|', 2);

    if (provider === 'github') {
      provider = "GitHub";
    }

    return (
      <CenteredPage col={4} offset={4}>
        <h3 className="mb-4">Profile</h3>

        <table className="table table-sm table-bordered mb-4">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{ profile.name }</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{ profile.email }</td>
            </tr>
          </tbody>
        </table>

        <h5 className="mb-2">Linked Accounts</h5>

        <table className="table table-sm table-bordered">
          <tbody>
            <tr>
              <th>{ provider }</th>
              <td><a href={`https://github.com/${profile.nickname}`}>{ profile.nickname }</a></td>
            </tr>
          </tbody>
        </table>
      </CenteredPage>
    );
  }
}


ProfilePage = connect(
  (state) => ({
    profile: state.session.profile,
  }),
)(ProfilePage);


export default ProfilePage;
