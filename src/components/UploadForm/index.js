import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import api from 'api';

import Loader from 'components/Loader';
import Dropzone from 'components/Dropzone';


class UploadForm extends Component {
  constructor() {
    super()

    this.state = {
      files: [],
      inProgress: false,
      progress: 0,
      error: null,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // Set the form as in progress.
    this.setState({
      inProgress: true,
    });

    api.client.nodeUploadFiles({
      project: this.props.project.id,
      id: this.props.node.id,
      files: this.state.files,
    }, {
      onProgress: (event) => (
        this.setState({
          progress: Math.round(event.loaded / event.total * 100),
        })
      )
    })
    .then(() => (
      this.setState({
        files: [],
        progress: 100,
        inProgress: false,
      })
    ))
    .catch((error) => (
      this.setState({
        inProcess: false,
        error: error,
      })
    ))
  }

  // Handler for file browser.
  handleFileChange = (event) => {
    const files = [].slice.call(this.input.files);

    if (!files) return;

    this.setState({
      files: files,
    });
  }

  // Handler for file drop.
  handleFileDrop = (event) => {
    const files = [].slice.call(event.dataTransfer.files);

    if (!files) return;

    this.setState({
      files: files,
    });
  }

  // Clear the file.
  handleClearFile = (event, file) => {
    event.preventDefault();

    const files = this.state.files.filter((f) => {
      return f.name !== file.name;
    });

    this.setState({
      files: files,
    });
  }

  render() {
    return (
      <div>
        { this.state.error ? <div className="text-danger">{this.state.error.message}</div> : undefined }
        <form onSubmit={this.handleSubmit}>
          <Dropzone
            onDrop={this.handleFileDrop}
            style={{
              border: '1px solid rgba(0,0,0,.15)',
              borderRadius: '.25rem',
              backgroundColor: '#f9f9f9',
            }}
            activeStyle={{
              border: '1px solid rgba(0,0,0,.15)',
              borderRadius: '.25rem',
              backgroundColor: 'lightyellow',
            }}>
            <label style={{
              marginBottom: '0',
              display: 'block',
              padding: '20px 15px',
            }}>
              <input
                multiple={true}
                hidden
                type='file'
                ref={(el) => this.input = el}
                onChange={(event) => { this.handleFileChange(event) }}
              />
              { this.state.files.length === 0 ? 'Click or drag and drop a file...' :
                this.state.files.map((file, idx) => {
                  return (
                    <div key={idx}>
                      <a
                        className="text-danger float-right"
                        style={{textDecoration: 'none'}}
                        onClick={(event) => this.handleClearFile(event, file)}
                        href="#"><i className="fa fa-remove" /> clear</a>
                      <span>{ file.name }</span>
                    </div>
                  )
                })
              }
            </label>
          </Dropzone>
          <br />
          <button disabled={this.state.inProgress} className="btn float-right btn-secondary btn-sm">
            {this.state.inProgress ? <Loader text={ this.state.progress < 100 ? this.state.progress + '% uploaded...' : 'Storing...' } /> : 'Upload' }
          </button>
        </form>
      </div>
    );
  }
}

export default UploadForm;
