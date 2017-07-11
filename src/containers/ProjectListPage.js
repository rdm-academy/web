import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';

import CenteredPage from 'components/CenteredPage';
import Loader from 'components/Loader';
import ProjectList from 'components/ProjectList';

import * as actions from 'ducks/projectList';


class ProjectListPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.getProjects());
  }

  render() {
    const { match, projects } = this.props;

    let status;
    if (projects.loading) {
      status = <Loader />;
    } else if (projects.error) {
      status = (
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-circle" /> { projects.error.message }
        </div>
      );
    } else if (projects.data && projects.data.length === 0) {
      return <Redirect to={`${match.url}/new`} />;
    }

    return (
      <CenteredPage>
        <div>
          <Link to={`${match.url}/new`} className="btn btn-primary btn-sm float-right">
            <i className="fa fa-plus" /> New
          </Link>
          <h5>Projects</h5>
        </div>

        <hr />

        { status ? status : <ProjectList items={projects.data} /> }
      </CenteredPage>
    );
  }
}


export default withRouter(connect(
  (state) => ({
    projects: state.projectList
  }),
)(ProjectListPage));
