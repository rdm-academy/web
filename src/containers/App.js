import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from 'containers/Header';
import Page from 'components/Page';
import LandingPage from 'components/LandingPage';

const App = () => (
  <div>
    <Header />

    <Switch>
      <Route exact path="/" component={LandingPage} />

      <Route render={({ location }) => (
        <Page>
          <h3>
            No resource at <code>{ location.pathname }</code>...
          </h3>
        </Page>
      )} />
    </Switch>
  </div>
);


export default App;
