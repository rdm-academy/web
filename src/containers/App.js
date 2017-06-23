import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from 'containers/Header';
import Page from 'components/Page';

import LandingPage from 'components/LandingPage';
import LoginPage from 'containers/LoginPage';

import ProtectedRoute from 'containers/ProtectedRoute';
import UserProfilePage from 'containers/UserProfilePage';
import ProjectListPage from 'containers/ProjectListPage';

const App = () => (
  <div>
    <Header />

    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/login" component={LoginPage} />

      <ProtectedRoute path="/profile" component={UserProfilePage} />
      <ProtectedRoute path="/projects" component={ProjectListPage} />

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
