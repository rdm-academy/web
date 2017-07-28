import React from 'react';
import cytoscape from 'cytoscape';
import cytoscapeDagre from 'cytoscape-dagre';

// Register Dagre layout algorithm.
cytoscapeDagre(cytoscape);

const defaultZoom = 0.8;


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
      classes: node.type,
      grabbable: false,
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
          classes: 'input',
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
          classes: 'output',
        });
      });
    }
  }

  return elems;
}

const renderCytoscape = (container, elements) => {
  const g = cytoscape({
    container: container,
    elements: elements,
    layout: {
      name: 'dagre',
      directed: true,
    },
    style: [
      {
        selector: 'core',
        style: {
          activeBgSize: 0,
        }
      },
      {
        selector: 'node',
        style: {
          backgroundColor: '#fff',
          width: '160px',
          height: '80px',
          shape: 'roundrectangle',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: '#aaa',
          padding: '20px',
          label: 'data(title)',
          color: '#111',
          fontFamily: '"Helvetica Neue"',
          fontSize: '18px',
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
        selector: 'node.data',
        style: {
          borderColor: '#0275d8',
          overlayColor: '#0275d8',
        },
      },
      {
        selector: 'node.compute',
        style: {
          borderColor: '#FFD700',
          overlayColor: '#FFD700',
        },
      },
      {
        selector: 'node.manual',
        style: {
        },
      },
      {
        selector: 'node.finding',
        style: {
          borderColor: '#8B4513',
          overlayColor: '#8B4513',
        },
      },
      {
        selector: 'node.data.inactive',
        style: {
          borderColor: '#8bc8fd',
        },
      },
      {
        selector: 'node.compute.inactive',
        style: {
          borderColor: '#ffef99',
        },
      },
      {
        selector: 'node.manual.inactive',
        style: {
          borderColor: '#ddd',
        },
      },
      {
        selector: 'node.finding.inactive',
        style: {
          borderColor: '#eeaf83',
        },
      },
      {
        selector: 'node.inactive',
        style: {
          color: '#999',
        },
      },
      {
        selector: 'node.active',
        style: {
          // borderColor: '#333333',
          // backgroundColor: '#f9f9f9',
          overlayOpacity: 0,
        },
      },
      {
        selector: 'edge.output',
        style: {
          lineStyle: 'dashed',
          targetArrowColor: '#777',
          targetArrowFill: 'filled',
          targetArrowShape: 'triangle',
        },
      },
      {
        selector: 'edge.hover',
        style: {
          color: '#111',
          textBackgroundColor: '#fff',
          textBackgroundOpacity: 0.8,
          textBackgroundPadding: '5px',
          fontFamily: '"Helvetica Neue"',
          fontSize: '16px',
          fontWeight: 400,
        },
      },
      {
        selector: 'edge.output.hover',
        style: {
          label: 'output',
        },
      },
      {
        selector: 'edge.input',
        style: {
          targetArrowShape: 'triangle',
          targetArrowColor: '#777',
          targetArrowFill: 'filled',
        },
      },
      {
        selector: 'edge.input.hover',
        style: {
          label: 'input',
        },
      },
    ],
  });

  g.$('edge')
    .on('mouseover', (evt) => {
      evt.target.addClass('hover');
    })
    .on('mouseout', (evt) => {
      evt.target.removeClass('hover');
    });

  return g
    .zoom(defaultZoom)
    .center()
    .pan({
      y: 20,
    });
}



class WorkflowGraph extends React.Component {
  focusNode = ({ id }) => {
    const node = this.cy.$id(id);

    const pos = node.renderedBoundingBox();
    const height = this.cy.height();
    const width = this.cy.width();;

    const panBy = {};
    const padding = 50;

    // Left and right.
    if (pos.x1 < 0) {
      panBy.x = -pos.x1 + padding;
    } else if (pos.x2 > width) {
      panBy.x = width - pos.x2 - padding;
    }

    // Top and bottom.
    if (pos.y1 < 0) {
      panBy.y = -pos.y1 + padding;
    } else if (pos.y2 > height) {
      panBy.y = height - pos.y2 - padding;
    }

    this.cy.batch(() => {
      this.cy.$('node.active')
        .removeClass('active');

      this.cy.$('node')
        .addClass('inactive');

      node.addClass('active').removeClass('inactive')

      if (panBy.x || panBy.y) {
        this.cy.animate({
          panBy: panBy,
          zoom: defaultZoom,
          duration: 350,
          easing: 'ease-in-out',
        });
      }
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
        });
      });
    }
  }

  componentDidUpdate(prevProps) {
    const dataChanged = this.props.data != prevProps.data
    if (dataChanged) {
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
    }

    if (this.props.node) {
      this.cy.ready(() => {
        this.focusNode({
          id: this.props.node,
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
