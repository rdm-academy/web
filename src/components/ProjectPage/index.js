import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import * as cytoscape from 'cytoscape';
import * as cytoscapeDagre from 'cytoscape-dagre';

import Loader from 'components/Loader';
import * as actions from 'ducks/projectIndex';

import workflowGraph from './workflow.json';
import './style.css';

cytoscapeDagre(cytoscape);

class NodeDropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      show: false,
    }
  }

  componentWillMount() {
    window.addEventListener('click', this.closeDropdown);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeDropdown);
  }

  closeDropdown = (event) => {
    this.setState({
      show: false,
    });
  }

  toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const { onClick } = this.props;

    return (
      <div className={`dropdown ${this.state.show ? 'show' : ''}`}>
        <button className="btn btn-secondary dropdown-toggle" onClick={this.toggleDropdown}>Add node</button>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="#" onClick={() => onClick({ type: 'data' })}>
            <i className="fa fa-table" /> Data
          </a>
          <a className="dropdown-item" href="#" onClick={() => onClick({ type: 'compute' })}>
            <i className="fa fa-server" /> Compute
          </a>
          <a className="dropdown-item" href="#" onClick={() => onClick({ type: 'manual' })}>
            <i className="fa fa-user" /> Manual
          </a>
          <a className="dropdown-item" href="#" onClick={() => onClick({ type: 'finding' })}>
            <i className="fa fa-book" /> Finding
          </a>
        </div>
      </div>
    )
  }
}


class CytoscapeGraph extends React.Component {
  constructor() {
    super();
    this.renderCytoscape = this.renderCytoscape.bind(this);
  }

  renderCytoscape(elements) {
    this.cy = cytoscape({
      container: this.graph,
      elements: elements,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: true,
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
            height: '100px',
            shape: 'rectangle',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#ccc',
            padding: '20px',
            content: 'data(title)',
            color: '#111',
            fontFamily: 'Hack',
            fontSize: '16px',
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
            width: 4,
          },
        },
        {
          selector: 'node.Graph-node-data',
          style: {
            backgroundColor: 'aliceblue',
          },
        },
        {
          selector: 'node.Graph-node-compute',
          style: {
            backgroundColor: 'ivory',
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
            backgroundColor: 'honeydew',
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

  componentDidMount() {
    const elems = this.parseData(this.props.data || {});
    this.renderCytoscape(elems);
  }

  parseData(data) {
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

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50px',
          width: '100%',
          height: '100%',
        }}
        ref={(el) => { this.graph = el; }}
      />
    );
  }
}


class ProjectPage extends React.Component {
  constructor() {
    super();

    this.state = {
      nodes: [],
      edges: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.getProject({
      id: this.props.match.params.id,
    }));
  }

  addNode = ({ type }) => {
    // transition to create node form
  }

  render() {
    const { match, loading, data, error } = this.props;

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          Error loading project {error.message}
        </div>
      )
    }

    return (
      <div className="ProjectPage">
        <div className="ProjectPage-Sidebar">
        </div>
        <div className="ProjectPage-Main">
          <div className="float-right">
            <NodeDropdown onClick={this.addNode} />
          </div>
          <CytoscapeGraph data={workflowGraph} />
        </div>
      </div>
    );
  }
}


export default withRouter(connect(
  (state, props) => ({
    ...(state.projectIndex[props.match.params.id] || {})
  })
)(ProjectPage));
