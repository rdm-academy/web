import React from 'react';
import { NavLink } from 'react-router-dom';

import timeSince from 'utils/time';


export default ({ baseUrl, project = {}, pending = 0, className = '' }) => (
  <nav className={`${className}`}>
    <div>
      <h5 className="mr-3" style={{display: 'inline-block'}}>{ project.name }</h5> <small className="text-muted">{ project.description }</small>

      <small className="navbar-text float-right text-muted">
        <i className="fa fa-clock-o" /> {timeSince(new Date(project.modified * 1000))}
      </small>
    </div>

    <ul className="nav nav-pills">
      <li className="nav-item">
        <NavLink to={`${baseUrl}/workflow`} exact={false} className="nav-link">
          <i className="fa fa-sitemap" /> Workflow
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to={`${baseUrl}/log`} exact={false} className="nav-link">
          <i className="fa fa-clock-o" /> Changelog
        </NavLink>
      </li>
    </ul>
  </nav>
);
