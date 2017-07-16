import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import WorkflowGraph from 'components/WorkflowGraph';
import NodeNav from './NodeNav';

export default ({ history, baseUrl, project = {} }) => {
  if (!project.workflow || !project.workflow.source) {
    return <Redirect to={`${baseUrl}/workflow/edit`} />;
  }

  return (
    <div className="ProjectPage-Body">
      <NodeNav
        className="ProjectPage-Sidebar"
        baseUrl={baseUrl}
        data={project.workflow.graph} />

      <div className="ProjectPage-Main">
        <Link className="EditButton btn btn-secondary btn-sm float-right mt-2 mr-2" to={`${baseUrl}/workflow/edit`}>
          <i className="fa fa-pencil" /> Edit Workflow
        </Link>

        <WorkflowGraph
          data={project.workflow.graph}
          onNodeClick={(event) => {
            const { id } = event.target.data();
            history.push(`${baseUrl}/workflow/node/${id}`);
          }}
        />
      </div>
    </div>
  );
}
