import React from 'react';
import cytoscape from 'cytoscape';

// Make it global for the YAML linter.
import YAML from 'js-yaml';
window.jsyaml = YAML;

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
import 'codemirror/addon/lint/lint.css';

import WorkflowGraph from 'components/WorkflowGraph';

import './style.css';

const createGraph = (data = {}) => {
  if (typeof data !== 'object') {
    return cytoscape();
  }

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
        });
      });
    }
  }

  return cytoscape({
    elements: elems,
  });
}



const atLeastOneInput = (node) => {
  if (!node.input || node.input.length === 0) {
    return ['at least one input required'];
  }
}

const atLeastOneOutput = (node) => {
  if (!node.output || node.output.length === 0) {
    return 'at least one output required';
  }
}

const checkInputs = (node, elems) => {
  if (!node.input) return [];

  const errs = [];
  node.input.forEach((id) => {
    // Unknown node.
    if (!elems[id]) {
      errs.push(`unknown input: ${id}`);
      return;
    }

    // Non-data input.
    if (elems[id].type !== 'data') {
      errs.push(`input is not data: ${id}`);
    }
  });

  return errs;
}


const checkOutputs = (node, elems) => {
  if (!node.output) return [];

  const errs = [];
  node.output.forEach((id) => {
    // Unknown node.
    if (!elems[id]) {
      errs.push(`unknown output: ${id}`);
      return;
    }

    // Non-data output.
    if (elems[id].type !== 'data') {
      errs.push(`output is not data: ${id}`);
    }
  });

  return errs;
}

const noInputOrOutput = (node) => {
  if (node.input || node.output) {
    return ['data cannot declare input or output'];
  }
}

const validType = (node) => {
  if (!node.type) return;

  switch (node.type) {
    case 'data':
    case 'compute':
    case 'finding':
    case 'manual':
      break;
    default:
      return [`invalid type: ${node.type}`];
  }
}

const requiredProps = (node) => {
  const errs = [];

  if (!node.type) {
    errs.push('type required');
  }

  if (!node.title) {
    errs.push('title required');
  }

  return errs;
}

const nodeChecks = [
  requiredProps,
  validType,
];

const nodeTypeChecks = {
  compute: [
    atLeastOneInput,
    atLeastOneOutput,
    checkInputs,
    checkOutputs,
  ],
  finding: [
    atLeastOneInput,
    checkInputs,
  ],
  manual: [
    atLeastOneInput,
    checkInputs,
  ],
  data: [
    checkDataCycles,
    noInputOrOutput,
  ],
};

function checkForCycle(node, path = [], errs = []) {
  const id = node.id();

  node.outgoers('node').forEach((out) => {
    const oid = out.id();

    if (path.indexOf(oid) >= 0) {
      errs.push(`cycle exists: ${path.concat([id, oid]).join(' -> ')}`);
      return;
    }

    checkForCycle(out, path.concat([id]), errs)
  });

  return errs;
}


function checkDataCycles(node, _, graph) {
  const errs = [];

  graph.$id(node.id).forEach((n) => {
    const cerrs = checkForCycle(n);
    if (cerrs.length) [].push.apply(errs, cerrs);
  });

  return errs;
}

const graphChecks = [];

const validateGraph = (data, graph) => {
  const errors = {};
  let node, errs;

  for (let id in data) {
    node = data[id];
    node.id = id;

    errs = [];

    nodeChecks.forEach((check) => {
      const cerrs = check(node, data, graph);
      if (cerrs) [].push.apply(errs, cerrs);
    });

    if (nodeTypeChecks[node.type]) {
      nodeTypeChecks[node.type].forEach((check) => {
        const cerrs = check(node, data, graph);
        if (cerrs) [].push.apply(errs, cerrs);
      });
    }

    if (errs.length) {
      errors[`node: ${id}`] = errs;
    }
  }

  // Graph-wide checks.
  errs = [];
  graphChecks.forEach((check) => {
    const cerrs = check(graph);
    if (cerrs) [].push.apply(errs, cerrs);
  })

  if (errs.length) {
    errors['graph'] = errs;
  }

  return errors;
}


class WorkflowEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text || '',
    };
  }

  render() {
    const text = this.state.text;

    let elems, invalid, syntaxError;
    try {
      elems = YAML.safeLoad(text) || {};
    } catch (e) {
      syntaxError = e;
      invalid = true;
    }

    let output;
    if (syntaxError) {
      output = (
        <div className="text-danger"><strong>Parse error.</strong></div>
      );
    } else {
      if (Object.keys(elems).length > 0) {
        const graph = createGraph(elems);
        const errors = validateGraph(elems, graph);

        if (Object.keys(errors).length === 0) {
          output = <div className="text-success">Looks good!</div>
          this.elems = elems;
        } else {
          invalid = true;

          output = (
            <div className="text-danger">
              {
                Object.keys(errors).map((id) => (
                  <div key={id}>
                    <strong>{id}</strong>
                    <ul>
                      { errors[id].map((msg, i) => <li key={i}>{msg}</li>) }
                    </ul>
                  </div>
                ))
              }
            </div>
          );
        }
      }
    }

    return (
      <div className="WorkflowEditor">
        <div className="WorkflowEditor-editor">
          <CodeMirror
            value={text}
            onChange={(text) => {
              this.setState({
                text: text,
              });

              if (this.props.onChange) {
                this.props.onChange(text);
              }
            }}
            options={{
              mode: 'yaml',
              indentWithTabs: false,
              tabSize: 2,
              lineNumbers: true,
              inputStyle: 'contenteditable',
              autofocus: true,
              gutters: ["CodeMirror-lint-markers"],
              lint: true,
              extraKeys: {
                Tab: (cm) => {
                  const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                  cm.replaceSelection(spaces);
                }
              },
            }} />
        </div>

        <div className="WorkflowEditor-console">
          {output}
        </div>

        <div className={`WorkflowEditor-preview ${invalid ? 'invalid' : ''}`}>
          <WorkflowGraph data={elems} />
        </div>
      </div>
    );
  }
}


export default WorkflowEditor;
