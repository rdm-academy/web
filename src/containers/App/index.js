import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SessionManager from 'containers/SessionManager';

import Header from 'containers/Header';
import Page from 'components/Page';
import ProtectedRoute from 'containers/ProtectedRoute';

import LandingPage from 'components/LandingPage';
import LoginPage from 'containers/LoginPage';

import ProfilePage from 'containers/ProfilePage';
import ProjectListPage from 'containers/ProjectListPage';
import NewProjectPage from 'containers/NewProjectPage';
import ProjectPage from 'components/ProjectPage';

import './style.css';


const App = () => (
  <SessionManager>
    <Header />

    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" render={() => (
        <LoginPage signup={true} />
      )} />

      <ProtectedRoute exact path="/profile" component={ProfilePage} />
      <ProtectedRoute exact path="/projects" component={ProjectListPage} />
      <ProtectedRoute exact path="/projects/new" component={NewProjectPage} />
      <ProtectedRoute path="/projects/:project" component={ProjectPage} />

      <Route render={({ location }) => (
        <Page>
          <h3>
            No resource at <code>{ location.pathname }</code>...
          </h3>
        </Page>
      )} />
    </Switch>
  </SessionManager>
);


export default App;
