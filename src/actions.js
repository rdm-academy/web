// asyncType takes a type name and returns an object
// representing an async type with state properties
// for request, success, and error.
export function asyncType(type) {
  const result = {
    type,
    REQUEST: `${type}_REQUEST`,
    SUCCESS: `${type}_SUCCESS`,
    ERROR: `${type}_ERROR`
  };

  result.contains = (other) => {
    if (other === result.REQUEST) return true;
    if (other === result.SUCCESS) return true;
    if (other === result.ERROR) return true;
    return false;
  }

  return result;
}

// asyncDispatcher takes an async type and function and returns
// and action creator that expects a single input (an object) and
// handles the standard async workflow. It relies on the Redux
// thunk middleware.
export function asyncDispatcher(type, func) {
  return (input, handlers) => (dispatch) => {
    // Dispatch action request.
    dispatch({
      type: type.REQUEST,
      input,
    });

    // Execute the async call.
    return func(input, handlers)
      .then((output) => (
        // Successful call.
        dispatch({
          type: type.SUCCESS,
          input,
          output,
        })
      ))
      .catch((error) => (
        // Error occurred.
        dispatch({
          type: type.ERROR,
          input,
          error,
        })
      ))
  };
}
