import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';

import Loader from 'components/Loader';
import * as actions from 'ducks/projectIndex';

import Header from './Header';
import Workflow from './Workflow';
import WorkflowEditor from './WorkflowEditor';
import NodeDetail from './NodeDetail';

import './style.css';


class ProjectPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.getProject({
      id: this.props.match.params.project,
    }));
  }

  render() {
    const { match, loading, data: project, error } = this.props;

    if (!project || loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          Error loading project {error.message}
        </div>
      )
    }

    // Project URL that node URLs are created from.
    const baseUrl = match.url;

    return (
      <div className="ProjectPage">
        <Header
          className="ProjectPage-Header"
          baseUrl={baseUrl}
          project={project} />

        <Switch>
          <Route exact path={baseUrl} render={({ history }) => (
            <Redirect to={`${baseUrl}/workflow`} />
          )} />

          <Route exact path={`${baseUrl}/workflow`} render={({ history, match }) => {
            if (!project.workflow.source) {
              return <Redirect to={`${baseUrl}/workflow/edit`} />;
            }

            return (
              <Workflow
                baseUrl={baseUrl}
                history={history}
                project={project} />
            );
          }} />

          <Route exact path={`${baseUrl}/workflow/edit`} render={({ history }) => (
            <WorkflowEditor
              dispatch={this.props.dispatch}
              baseUrl={baseUrl}
              history={history}
              project={project} />
          )} />

          <Route exact path={`${baseUrl}/workflow/node/:node`} render={({ history, match }) => (
            <NodeDetail
              baseUrl={baseUrl}
              history={history}
              project={project}
              url={match.url}
              className="ProjectPage-Body"
              id={match.params.node} />
          )} />
        </Switch>
      </div>
    );
  }
}


export default withRouter(connect(
  (state, props) => ({
    ...(state.projectIndex[props.match.params.project] || {})
  })
)(ProjectPage));
