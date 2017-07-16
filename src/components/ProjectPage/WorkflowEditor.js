import React from 'react';

import WorkflowEditor from 'components/WorkflowEditor';

import * as actions from 'ducks/projectIndex';

const defaultWorkflow = `# Get started with your workflow!

# There are four types of node you can declare in a
# workflow: data, compute, manual, and finding.
# Compute and manual nodes must receive at least
# one data input and produce one output data.
# A finding node must point to at last one data input.

# Below is an example of a valid workflow to get you
# started. The console below shows validation errors
# as you type to keep you on track.

patient-record:
  type: data
  title: Patient record

chart-review-ai:
  type: compute
  title: Chart review AI
  input:
    - patient-record
  output:
    - ai-prediction

ai-prediction:
  type: data
  title: AI prediction

chart-reviewer:
  type: manual
  title: Expert chart reviewer
  input:
    - patient-record
  output:
    - expert-call

expert-call:
  type: data
  title: Expert call/result

comparison:
  type: finding
  title: AI vs. expert comparison
  input:
    - ai-prediction
    - expert-call
`

class WorkflowEditorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: props.project.workflow.source,
      invalid: false,
      saving: false,
    };
  }

  onChange = ({ source, invalid }) => {
    this.setState({
      source,
      invalid,
    });
  }

  onSave = (event) => {
    event.preventDefault();

    // Dispatch event.
    this.props.dispatch(actions.updateWorkflow({
      id: this.props.project.id,
      source: this.state.source || defaultWorkflow,
    }))
    .then(() => {
      this.props.history.push(`${this.props.baseUrl}/workflow`);
    });

    this.setState({
      saving: true,
    });
  }

  onCancel = (event) => {
    event.preventDefault();
    this.props.history.push(`${this.props.baseUrl}/workflow`);
  }

  render() {
    const { project } = this.props;
    const { source, invalid, saving } = this.state;

    return (
      <div className="ProjectPage-Body">
        <nav className="WorkflowEditor-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={invalid || saving}
            onClick={this.onSave}>Save</button>
          <button
            className="btn btn-danger btn-sm"
            onClick={this.onCancel}>Cancel</button>
        </nav>

        <WorkflowEditor
          source={source}
          defaultSource={defaultWorkflow}
          onChange={this.onChange} />
      </div>
    );
  }
}


export default WorkflowEditorContainer;
