import watch from 'redux-watch';

const namespace = 'rdmacademy.';

const startPersistingState = (store, keys) => {
  // Given the Redux store and a collection of top-level store keys,
  // create a watcher for each part of the store to persist it.

  for (const key of keys) {
    const watcher = watch(store.getState, key);
    const namespacedKey = namespace + key;
    store.subscribe(watcher((substate) => {
      localStorage.setItem(namespacedKey, JSON.stringify(substate));
    }))
  }
}

const fetchPersistedState = (keys) => {
  const obj = {};
  for (const key of keys) {
    const namespacedKey = namespace + key;
    const item = localStorage.getItem(namespacedKey);
    obj[key] = (item !== null) ? JSON.parse(item) : {};
  }
  return obj;
}

export {
  startPersistingState,
  fetchPersistedState,
};
