import React from 'react';
import { NavLink } from 'react-router-dom';


export default ({ baseUrl, data = {}, ...props }) => {
  const lists = {
    data: [],
    finding: [],
    compute: [],
    manual: [],
    other: [],
  };

  Object.keys(data).sort((ak, bk) => {
      const a = data[ak];
      const b = data[bk];
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    })
    .forEach((k) => {
      const { type, title } = data[k];

      lists[type || 'other'].push(
        <li key={k}>
          <NavLink to={`${baseUrl}/workflow/node/${k}`}>
            {title}
          </NavLink>
        </li>
      );
    });

  const sections = [];

  if (lists.compute.length) {
    sections.push(
      <div key="compute">
        <h6><i className="fa fa-fw fa-microchip" /> Compute</h6>
        <ul className="list-unstyled">
          {lists.compute}
        </ul>
      </div>
    )
  }

  if (lists.data.length) {
    sections.push(
      <div key="data">
        <h6><i className="fa fa-fw fa-table" /> Data</h6>
        <ul className="list-unstyled">
          {lists.data}
        </ul>
      </div>
    )
  }

  if (lists.manual.length) {
    sections.push(
      <div key="manual">
        <h6><i className="fa fa-fw fa-user" /> Manual</h6>
        <ul className="list-unstyled">
          {lists.manual}
        </ul>
      </div>
    )
  }

  if (lists.finding.length) {
    sections.push(
      <div key="finding">
        <h6><i className="fa fa-fw fa-book" /> Findings</h6>
        <ul className="list-unstyled">
          {lists.finding}
        </ul>
      </div>
    )
  }

  if (lists.other.length) {
    sections.push(
      <div key="other">
        <h6><i className="fa fa-fw fa-circle" /> Other</h6>
        <ul className="list-unstyled">
          {lists.other}
        </ul>
      </div>
    )
  }

  return (
    <div {...props}>
      {sections}
    </div>
  );
}
