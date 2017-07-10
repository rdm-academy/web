import React from 'react';

import WorkflowEditor from 'components/WorkflowEditor';

import * as actions from 'ducks/projectIndex';


class WorkflowEditorContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      source: '',
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
      source: this.state.source,
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
    const { invalid, saving } = this.state;

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
          source={project.workflow.source}
          onChange={this.onChange} />
      </div>
    );
  }
}


export default WorkflowEditorContainer;
