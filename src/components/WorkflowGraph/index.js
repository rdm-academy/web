import React from 'react';
import cytoscape from 'cytoscape';
import cytoscapeDagre from 'cytoscape-dagre';

// Register Dagre layout algorithm.
cytoscapeDagre(cytoscape);


const parseData = (data = {}) => {
  if (typeof data !== 'object') return [];

  const elems = [];

  let node;
  for (let id in data) {
    node = data[id];

    elems.push({
      group: 'nodes',
      data: {
        id: id,
        type: node.type,
        title: node.title,
      },
      classes: `Graph-node Graph-node-${node.type}`,
    });

    // Inputs this compute, manual, or finding node requires.
    // This is a directed edge from this node to the input.
    if (node.input) {
      node.input.forEach((iid) => {
        elems.push({
          group: 'edges',
          data: {
            id: `${iid}-${id}`,
            source: iid,
            target: id,
          },
          classes: 'Graph-edge Graph-edge-input',
        });
      });
    }

    if (node.output) {
      node.output.forEach((oid) => {
        elems.push({
          group: 'edges',
          data: {
            id: `${id}-${oid}`,
            source: id,
            target: oid,
          },
          classes: 'Graph-edge Graph-edge-output',
        });
      });
    }
  }

  return elems;
}

const renderCytoscape = (container, elements) => {
  return cytoscape({
    container: container,
    elements: elements,
    layout: {
      name: 'dagre',
      directed: true,
    },
    style: [
      {
        selector: 'node',
        style: {
          backgroundColor: '#fff',
          width: '160px',
          height: '80px',
          shape: 'roundrectangle',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: '#ccc',
          padding: '20px',
          content: 'data(title)',
          color: '#111',
          fontFamily: '"Helvetica Neue"',
          fontSize: '16px',
          fontWeight: 400,
          textHalign: 'center',
          textValign: 'center',
          textWrap: 'wrap',
          textMaxWidth: '160px',
        },
      },
      {
        selector: 'edge',
        style: {
          curveStyle: 'bezier',
          lineColor: '#777',
          arrowScale: 2,
          width: 2,
        },
      },
      {
        selector: 'node.Graph-node-active',
        style: {
          borderStyle: 'dashed',
        },
      },
      {
        selector: 'node.Graph-node-data',
        style: {
          borderColor: '#0275d8',
        },
      },
      {
        selector: 'node.Graph-node-compute',
        style: {
          borderColor: 'gold',
        },
      },
      {
        selector: 'node.Graph-node-manual',
        style: {
        },
      },
      {
        selector: 'node.Graph-node-finding',
        style: {
          borderColor: 'saddlebrown',
        },
      },
      {
        selector: 'edge.Graph-edge-output',
        style: {
          lineStyle: 'dashed',
          targetArrowColor: '#777',
          targetArrowFill: 'filled',
          targetArrowShape: 'triangle',
        },
      },
      {
        selector: 'edge.Graph-edge-input',
        style: {
          sourceArrowShape: 'triangle',
          sourceArrowColor: '#777',
          sourceArrowFill: 'filled',
        },
      }
    ],
  });
}



class WorkflowGraph extends React.Component {
  focusNode = ({ id, initial }) => {
    const node = this.cy.$id(id);

    this.cy.batch(() => {
      this.cy.$('.Graph-node-active')
        .removeClass('Graph-node-active');

      node.addClass('Graph-node-active');

      this.cy
        .zoom(0.7)
        .fit(node, 200)
        .panBy({x: -200});
    });
  }

  componentDidMount() {
    this.cy = renderCytoscape(
      this.el,
      parseData(this.props.data)
    );

    if (this.props.onNodeClick) {
      this.cy.on('tap', 'node', (event) => {
        this.props.onNodeClick(event);
      });
    }

    if (this.props.onEdgeClick) {
      this.cy.on('tap', 'edge', (event) => {
        this.props.onEdgeClick(event);
      });
    }

    if (this.props.onReady) {
      this.cy.ready(this.props.onReady);
    }

    if (this.props.node) {
      this.cy.ready(() => {
        this.focusNode({
          id: this.props.node,
          initial: true,
        });
      });
    }
  }

  componentDidUpdate() {
    this.cy = renderCytoscape(
      this.el,
      parseData(this.props.data)
    );

    if (this.props.onNodeClick) {
      this.cy.on('tap', 'node', (event) => {
        this.props.onNodeClick(event);
      });
    }

    if (this.props.onEdgeClick) {
      this.cy.on('tap', 'edge', (event) => {
        this.props.onEdgeClick(event);
      });
    }

    if (this.props.node) {
      this.cy.ready(() => {
        this.focusNode({
          id: this.props.node,
          initial: true,
        });
      });
    }
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}} ref={(el) => { this.el = el; }} />
    );
  }
}

export default WorkflowGraph;
