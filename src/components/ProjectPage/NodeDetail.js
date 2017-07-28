import React from 'react';
import { withRouter } from 'react-router-dom';

import api from 'api';

import Loader from 'components/Loader';
import WorkflowGraph from 'components/WorkflowGraph';

import NodeNav from './NodeNav';
import NodeDetailPane from './NodeDetailPane';


class NodeContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  fetch = ({ project, id }) => {
    this.setState({
      loading: true,
    });

    api.client.getNode({
      project: project.id,
      id: id,
    })
    .then((resp) => (
      this.setState({
        loading: false,
        data: resp,
      })
    ))
    .catch((err) => (
      this.setState({
        loading: false,
        error: err,
      })
    ));
  }

  componentDidMount() {
    this.fetch(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.project.id != prevProps.project.id || this.props.id != prevProps.id) {
      this.fetch(this.props);
    }
  }

  render() {
    if (this.state.loading) {
      return <div />;
    }

    if (this.state.error) {
      return <div className="alert alert-danger">{this.state.error.message}</div>;
    }

    return this.props.render({
      node: this.state.data,
      project: this.props.project,
    });
  }
}

export default ({ id, history, baseUrl, project }) => (
  <div className="ProjectPage-Body">
    <NodeNav
      baseUrl={baseUrl}
      data={project.workflow.graph}
      className="ProjectPage-Sidebar" />

    <div className="ProjectPage-Main">
      <div className="NodeDetail-Workflow">
        <WorkflowGraph
          node={id}
          data={project.workflow.graph}
          onNodeClick={(event) => {
            const { id } = event.target.data();
            history.push(`${baseUrl}/workflow/node/${id}`);
          }}
        />
      </div>

      <div className="ProjectPage-Details">
        <NodeContainer
          project={project}
          id={id}
          render={({ node }) => (
            <NodeDetailPane
              node={node}
              project={project}
              baseUrl={baseUrl} />
          )} />
      </div>
    </div>
  </div>
);
