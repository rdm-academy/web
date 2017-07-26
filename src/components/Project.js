import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import timeSince from 'utils/time';


const Project = ({ match, id, name, modified, description }) => (
  <div className="mb-2">
    <div>
      <Link to={`/project/${id}`}>
        <strong>{ name }</strong>
      </Link>
    </div>

    { description ? (
        <p className="text-muted mb-0">
          <small>{ description }</small>
        </p>
      ) : undefined
    }

    <small className="text-muted"><i className="fa fa-clock-o" /> {timeSince(new Date(modified * 1000))}</small>
  </div>
);

export default withRouter(Project);
