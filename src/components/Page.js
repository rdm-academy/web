import React from 'react';


export default ({ children }) => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-4 offset-md-4 text-center">
        { children }
      </div>
    </div>
  </div>
)
