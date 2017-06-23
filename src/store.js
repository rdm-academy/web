import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import unhandledAction from 'redux-unhandled-action';
import RavenMiddleware from 'redux-raven-middleware';

import rootReducer from './ducks';
import config from './config';

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

function configureStore(initialState, browserHistory) {
  let middleware = compose(
    applyMiddleware(thunk),
    applyMiddleware(unhandledAction()),
    applyMiddleware(routerMiddleware(browserHistory)),
    devTools,
  )

  if (config.raven.dsn) {
    middleware = compose(middleware, applyMiddleware(RavenMiddleware(config.raven.dsn)));
  }

  return createStore(rootReducer, initialState, middleware);
}

export default configureStore;
