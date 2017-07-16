import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CenteredPage from 'components/CenteredPage';

import * as actions from 'ducks/projectForm';

class NewProjectPage extends React.Component {
  handleClick = (event) => {
    event.preventDefault();

    this.props.dispatch(actions.createProject({
      name: this.refs.name.value,
      description: this.refs.description.value,
    }))
  }

  render() {
    const { pending, success, data, error } = this.props;

    if (success) {
      return (
        <Redirect
          to={`/projects/${data.id}`} />
      );
    }

    return (
      <CenteredPage>
        <h5>Create project</h5>

        <hr />
        { error ? <div className="alert alert-danger">{ error.message }</div> : undefined }

        <form>
          <div className="form-group">
            <label>Name</label>
            <input ref="name" className="form-control" type="text" />
          </div>

          <div className="form-group">
            <label>Description <small className="text-muted">(optional)</small></label>
            <textarea ref="description" className="form-control" />
          </div>

          <button
            onClick={this.handleClick}
            disabled={pending}
            className="btn btn-primary btn-sm">
              Create Project
          </button>
        </form>
      </CenteredPage>
    )
  }
}


NewProjectPage = connect(
  (state) => ({
    ...state.projectForm
  }),
)(NewProjectPage)

export default NewProjectPage;
