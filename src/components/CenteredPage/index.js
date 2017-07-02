import React from 'react';

import './style.css';


export default ({ col = '4', offset = '4', children }) => (
  <div className="container-fluid">
    <div className="row">
      <div className={`col-${col} offset-${offset}`}>
        <div className="CenteredPage">
          { children }
        </div>
      </div>
    </div>
  </div>
)
