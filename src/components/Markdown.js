import React from 'react';
import marked from 'marked';

// TODO: add highlighting and latex support.
marked.setOptions({
});

export default ({ text, emptyText = '', className = 'markdown', ...props }) => {
  if (!text) {
    return <div className={className} {...props}>{emptyText}</div>;
  }

  return (
    <div className={className} {...props} dangerouslySetInnerHTML={{__html: marked(text)}} />
  );
};
