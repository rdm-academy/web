import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import *  as projectListActions from '../ducks/projectList';


class ProjectListPage extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4-md offset-md-4">
            <h3>Projects</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    );
  }
}


ProjectListPage = withRouter(connect(
  (state) => ({
    projects: state.projects
  }),
)(ProjectListPage));


export default ProjectListPage;
