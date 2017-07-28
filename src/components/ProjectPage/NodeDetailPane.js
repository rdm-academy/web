import React from 'react';
import { withRouter, Switch, Route, NavLink } from 'react-router-dom';

import api from 'api';
import config from 'config';

import Editor from 'components/Editor';
import UploadForm from 'components/UploadForm';


class NotesPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changed: false,
      text: props.node.notes || '',
      editorText: '',
    };
  }

  onEditorChange = (text) => {
    this.setState({
      editorText: text,
      changed: true,
    });
  }

  saveNotes = () => {
    if (this.state.text.trim() === this.state.editorText.trim()) return;

    const notes = this.state.editorText.trim();

    api.client.updateNode({
      project: this.props.project.id,
      id: this.props.node.id,
      notes: notes,
    })
    .then(() => {
      this.setState({
        text: notes,
      });
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  onEditorFocusChange = (focused) => {
    if (this.state.changed && !focused) {
      this.saveNotes();
    }
  }

  render() {
    return (
      <div className="Notes">
        { this.state.error ? <p className="text-danger">{ this.state.error.message }</p> : undefined }
        <Editor
          text={this.state.text}
          emptyText="Click to write some notes..."
          onChange={this.onEditorChange}
          onFocusChange={this.onEditorFocusChange} />
      </div>
    );
  }
}

const FilesPanel = ({ project, node }) => (
  <div>
    { node.files && node.files.length ?
      <ul>
        { node.files.map((f) => (
            <li key={f.id}>
              <a target="_blank" href={`${config.api.url}/projects/${project.id}/files/${f.id}/download`}>{ f.name }</a>
            </li>
          ))
        }
      </ul> : null
    }
    <UploadForm project={project} node={node} />
  </div>
)

class NodeDetailPane extends React.Component {
  render() {
    const { node, project, baseUrl, match, history, className } = this.props;

    return (
      <div className={className}>
        <h5>
          <div className="float-right" style={{cursor: 'pointer'}} onClick={(event) => {
            event.preventDefault();
            history.push(baseUrl);
          }}>
            <span>&times;</span>
          </div>

          {node.title}
        </h5>

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink exact to={match.url} className="nav-link">
              <i className="fa fa-align-left" /> Notes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to={`${match.url}/files`} className="nav-link">
              <i className="fa fa-file" /> Files
            </NavLink>
          </li>
        </ul>

        <Switch>
          <Route exact path={match.url} render={() => {
            return <NotesPanel project={project} node={node} />
          }} />
          <Route exact path={`${match.url}/files`} render={() => {
            return (
              <FilesPanel project={project} node={node} />
            );
          }} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(NodeDetailPane);
