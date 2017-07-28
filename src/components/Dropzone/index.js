import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Dropzone extends Component {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    activeStyle: PropTypes.object,
    style: PropTypes.object,
  };

  constructor() {
    super();

    this.state = {
      active: false
    }
  }

  onEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ active: true });
  }

  onExit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ active: false });
  }

  onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ active: false });

    if (this.props.onDrop) {
      this.props.onDrop(event);
    }
  }

  render() {
    return (
      <div style={this.state.active ? this.props.activeStyle : this.props.style }
        onDragEnter={this.onEnter}
        onDragOver={this.onEnter}
        onDragExit={this.onExit}
        onDragLeave={this.onExit}
        onDrop={this.onDrop}>
        {this.props.children}
      </div>
    );
  }
}


export default Dropzone;
