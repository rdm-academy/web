import React from 'react';

import './style.css';

export default () => (
  <div className="Loader">
    <svg className="Loader-circular" viewBox="25 25 50 50">
      <circle className="Loader-path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
    </svg>
  </div>
)
