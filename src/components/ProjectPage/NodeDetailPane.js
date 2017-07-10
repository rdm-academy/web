import React from 'react';
import { NavLink } from 'react-router-dom';

import Editor from 'components/Editor';


export default ({ node, url, baseUrl, history, ...props }) => (
  <div {...props}>
    <h5>
      <div className="float-right" style={{cursor: 'pointer'}} onClick={(event) => {
        event.preventDefault();
        history.push(baseUrl);
      }}>
        <span>&times;</span>
      </div>

      {node.title}
    </h5>

    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink to={url} className="nav-link">
          <i className="fa fa-align-left" /> Notes
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to={`${url}/discuss`} className="nav-link">
          <i className="fa fa-comments" /> Discuss
        </NavLink>
      </li>
    </ul>

    <div className="Notes">
      <Editor emptyText="Click to write some notes..." />
    </div>
  </div>
)
