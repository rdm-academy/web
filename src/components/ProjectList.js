import React from 'react';

import Project from 'components/Project';


export default ({ items = [] }) => (
  <div>
    {items
      .sort((a, b) => {
        if (a.modified < b.modified) return 1;
        if (a.modified > b.modified) return -1;
        return 0;
      })
      .map((props) => (
        <Project
          key={props.id}
          {...props} />
      ))}
  </div>
);
