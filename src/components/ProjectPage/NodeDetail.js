import React from 'react';

import WorkflowGraph from 'components/WorkflowGraph';

import NodeNav from './NodeNav';
import NodeDetailPane from './NodeDetailPane';


export default ({ id, url, history, baseUrl, project = {} }) => {
  const node = project.workflow.graph[id];

  return (
    <div className="ProjectPage-Body">
      <NodeNav
        baseUrl={baseUrl}
        data={project.workflow.graph}
        className="ProjectPage-Sidebar" />

      <div className="ProjectPage-Main">
        <WorkflowGraph
          node={id}
          data={project.workflow.graph}
          onNodeClick={(event) => {
            const { id } = event.target.data();
            history.push(`${baseUrl}/workflow/node/${id}`);
          }}
        />
      </div>

      <NodeDetailPane
        className="ProjectPage-Details"
        node={node}
        history={history}
        baseUrl={baseUrl}
        url={url} />
    </div>
  );
}
