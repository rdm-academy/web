import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import watch from 'redux-watch';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import { startPersistingState, fetchPersistedState } from './persister';

import registerServiceWorker from './registerServiceWorker';

import configureStore from './store';
import initialState from './state';
import api from './api';

import App from 'containers/App';

const stateKeys = ['session'];
const persistedState = fetchPersistedState(stateKeys);

const browserHistory = createHistory();

const store = configureStore(
  Object.assign({}, initialState, persistedState),
  browserHistory,
);

// Set cilent token on session.
const session = store.getState().session;
api.client.setToken(session ? session.token : null);

// Listener for session state.
const sessionWatch = watch(store.getState, 'session');
store.subscribe(sessionWatch((s) => {
  api.client.setToken(s ? s.token : null);
}));

// Watch state changes and write them to localstorage.
startPersistingState(store, stateKeys);

// Entrypoint to application which renders.
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
