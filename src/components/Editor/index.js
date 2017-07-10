import React from 'react';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';

import Markdown from 'components/Markdown';

import './style.css';


class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      text: '',
      focused: false,
    };
  }

  render() {
    if (this.state.focused) {
      return (
        <CodeMirror
          className="Editor Editor-editor"
          value={this.state.text}
          onChange={(text) => {
            this.setState({
              text: text,
            });

            if (this.props.onChange) {
              this.props.onChange(text);
            }
          }}
          onFocusChange={(focused) => {
            if (!focused) {
              this.setState({
                focused: false,
              });
            }
          }}
          options={{
            mode: 'markdown',
            tabSize: 2,
            lineNumbers: false,
            inputStyle: 'contenteditable',
            autofocus: true,
          }} />
      );
    }

    return (
      <Markdown
        text={this.state.text}
        emptyText={this.props.emptyText}
        onClick={() => {
          this.setState({
            focused: true,
          });
        }}
        className="Editor Editor-preview" />
    );
  }
}


export default Editor;
