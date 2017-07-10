import React from 'react';
import cytoscape from 'cytoscape';
import YAML from 'js-yaml';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
import 'codemirror/addon/lint/lint.css';

import WorkflowGraph from 'components/WorkflowGraph';
import debounce from 'utils/debounce';

import './style.css';

// Make it global for the YAML linter.
window.jsyaml = YAML;


function isObject(o) {
  return o && typeof o === 'object' && !Object.hasOwnProperty(o, 'length');
}

function parseSource(s) {
  const obj = YAML.safeLoad(s);

  if (!isObject(obj)) return {};

  Object.keys(obj).forEach((id) => {
    let node = obj[id];
    if (!isObject(node)) {
      obj[id] = {};
      return;
    }
  });

  return obj;
}


const createGraph = (data = {}) => {
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
        // Skip edges to unknown nodes.
        if (!data[iid]) return;

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
        // Skip edges to unknown nodes.
        if (!data[oid]) return;

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



const atLeastOneInput = ({ node }) => {
  if (!node.input || node.input.length === 0) {
    return ['at least one input required'];
  }
}

const atLeastOneOutput = ({ node }) => {
  if (!node.output || node.output.length === 0) {
    return ['at least one output required'];
  }
}

const checkInputs = ({ node, data }) => {
  if (!node.input) return [];

  const errs = [];
  node.input.forEach((id) => {
    // Unknown node.
    if (!data[id]) {
      errs.push(`unknown input: ${id}`);
      return;
    }

    // Non-data input.
    if (data[id].type !== 'data') {
      errs.push(`input is not data: ${id}`);
    }
  });

  return errs;
}


const checkOutputs = ({ node, data }) => {
  if (!node.output) return [];

  const errs = [];
  node.output.forEach((id) => {
    // Unknown node.
    if (!data[id]) {
      errs.push(`unknown output: ${id}`);
      return;
    }

    // Non-data output.
    if (data[id].type !== 'data') {
      errs.push(`output is not data: ${id}`);
    }
  });

  return errs;
}

const noInputOrOutput = ({ node }) => {
  if (node.input || node.output) {
    return ['data cannot declare input or output'];
  }
}

const validType = ({ node }) => {
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

const typeChange = ({ node, inputData }) => {
  const inode = inputData[node.id];
  if (!inode) return;
  if (inode.type !== node.type) {
    return [`cannot change type: ${inode.type} => ${node.type}`]
  }
}

const requiredProps = ({ node }) => {
  const errs = [];

  if (!node.type) {
    errs.push('type required');
  }

  if (!node.title) {
    errs.push('title required');
  }

  return errs;
}

const checkForCycle = (node, path = [], errs = []) => {
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

const checkDataCycles = ({ node, graph }) => {
  const errs = [];

  graph.$id(node.id).forEach((n) => {
    const cerrs = checkForCycle(n);
    if (cerrs.length) [].push.apply(errs, cerrs);
  });

  return errs;
}

const nodeChecks = [
  requiredProps,
  validType,
  typeChange,
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

const graphChecks = [];

const validateGraph = (data, inputData) => {
  const graph = createGraph(data);
  if (!graph) return;

  const errors = {};
  let node, errs, args;

  for (let id in data) {
    node = data[id];
    node.id = id;

    errs = [];
    args = { node, data, graph, inputData };

    nodeChecks.forEach((check) => {
      const cerrs = check(args);
      if (cerrs && cerrs.length) errs.push.apply(errs, cerrs);
    });

    if (nodeTypeChecks[node.type]) {
      nodeTypeChecks[node.type].forEach((check) => {
        const cerrs = check(args);
        if (cerrs && cerrs.length) errs.push.apply(errs, cerrs);
      });
    }

    if (errs.length) {
      errors[`node: ${id}`] = errs;
    }
  }

  // Graph-wide checks.
  errs = [];
  args = { data, graph, inputData };

  graphChecks.forEach((check) => {
    const cerrs = check(args);
    if (cerrs && cerrs.length) errs.push.apply(errs, cerrs);
  })

  if (errs.length) {
    errors['graph'] = errs;
  }

  if (Object.keys(errors).length === 0) {
    return;
  }

  return errors;
}


class WorkflowEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: props.source || '',
      inputSource: props.source || '',
      inputElems: parseSource(props.source || ''),
      elems: {},
      syntaxError: null,
      validationErrors: null,
    };

    this.onChange = debounce(this.onChange, 100);
  }

  componentWillMount() {
    this.validate(this.state.source);
  }

  onChange = ( source ) => {
    const invalid = this.validate(source);

    if (this.props.onChange) {
      this.props.onChange({
        source,
        invalid,
      });
    }
  }

  validate = (source) => {
    let elems = null,
      syntaxError = null;

    try {
      elems = parseSource(source);
    } catch (e) {
      syntaxError = e;
    }

    if (syntaxError) {
      this.setState({
        source,
        syntaxError,
        invalid: true,
        validationErrors: null,
      });

      return true;
    }

    const validationErrors = validateGraph(elems, this.state.inputElems);

    if (validationErrors) {
      this.setState({
        source,
        validationErrors,
        invalid: true,
        syntaxError: null,
      });

      return true;
    }

    this.setState({
      source,
      elems,
      invalid: false,
      validationErrors: null,
      syntaxError: null,
    });

    return false;
  }

  render() {
    const { source, elems, invalid, validationErrors, syntaxError } = this.state;

    let output;

    if (syntaxError) {
      output = (
        <div className="text-danger">
          <strong>Parse error.</strong>
        </div>
      );
    } else if (validationErrors) {
      output = (
        <div className="text-danger">
          {
            Object.keys(validationErrors).map((id) => (
              <div key={id}>
                <strong>{id}</strong>
                <ul>
                  { validationErrors[id].map((msg, i) => (
                    <li key={i}>{msg}</li>
                  )) }
                </ul>
              </div>
            ))
          }
        </div>
      );
    } else {
      output = (
        <div className="text-success">Looks good!</div>
      );
    }

    return (
      <div className="WorkflowEditor">
        <div className="WorkflowEditor-editor">
          <CodeMirror
            value={source}
            onChange={this.onChange}
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
