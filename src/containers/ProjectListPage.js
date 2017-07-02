import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

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

    return (
      <CenteredPage>
        <div>
          <Link to={`${match.url}/new`} className="btn btn-primary btn-sm float-right">
            <i className="fa fa-plus" /> New
          </Link>
          <h5>Projects</h5>
        </div>

        <hr />

        { projects.loading ? <Loader /> : (
            <ProjectList items={projects.data} />
          )
        }
      </CenteredPage>
    );
  }
}


export default withRouter(connect(
  (state) => ({
    projects: state.projectList
  }),
)(ProjectListPage));
