import React from 'react';

import workflowImg from './workflow.png';
import workflowImg2x from './workflow@2x.png';


export default () => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-8 offset-2 mt-3 text-center">
        <h1 className="display-5">Reproducible research, made easy.</h1>

        <p className="lead">
          RDM Academy is a platform for enabling reproducible research. It
          is both a guide and a tool for following research data management best
          practices to achieve reproducible research.
        </p>
      </div>
    </div>

    <div className="row">
      <div className="col-8 offset-2 mt-5">
        <img alt='Workflow' style={{width: 'inherit'}} src={workflowImg} srcSet={`${workflowImg2x} 2x`} />
      </div>
    </div>

  </div>
);
