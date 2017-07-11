import React from 'react';

import screenshot from './screen.png';


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
      <div className="col-6 offset-3 mt-3">
        <h5 className="text-center">Get notified when we open the public beta.</h5>

        <form action="//academy.us5.list-manage.com/subscribe/post?u=1df3590d58d316841ab348fbb&amp;id=40a057f6e0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank">
          <div id="mce-responses" className="clear">
            <div className="response" id="mce-error-response" style={{display: 'none'}} />
            <div className="response" id="mce-success-response" style={{display: 'none'}} />
          </div>

          <div style={{position: 'absolute', left: '-5000px'}}>
            <input type="text" name="b_1df3590d58d316841ab348fbb_40a057f6e0" tabIndex="-1" />
          </div>

          <div className="input-group">
            <input type="email" id="mce-EMAIL" name="EMAIL" placeholder="Email address..." className="form-control" />
            <span className="input-group-btn">
              <input type="submit" value="Get Notified" name="subscribe" id="mc-embedded-subscribe" className="btn btn-primary" />
            </span>
          </div>
        </form>
      </div>
    </div>

    <div className="row">
      <div className="col-8 offset-2 mt-5">
        <img alt='Workflow'
          style={{
            width: 'inherit',
            backgroundColor: '#fff',
            padding: '15px',
            boxShadow: '1px 1px 3px #ccc',
            marginBottom: '10px',
          }} src={screenshot} srcSet={`${screenshot} 2x`} />
      </div>
    </div>

  </div>
);
