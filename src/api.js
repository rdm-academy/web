import 'whatwg-fetch';
import config from './config';

class ConnectionRefusedError extends Error {
  message = 'Server refused the connection.';
}

class UnknownError extends Error {
  message = 'Unknown error';
}


function futch(url, opts={}, onProgress) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);

    for (let k in opts.headers||{}) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }

    xhr.onload = (event) => {
      return res(event.target);
    }

    xhr.onerror = rej;

    if (xhr.upload && onProgress) {
      // event.loaded / event.total * 100 ; //event.lengthComputable
      xhr.upload.onprogress = onProgress;
    }

    xhr.send(opts.body);
  });
}

function handleError({ target: xhr }) {
  if (xhr.status === 0) {
    throw new ConnectionRefusedError();
  }
  throw new UnknownError();
}

function handleStatusError(resp) {
  if (resp.status >= 400) {  // fetch -> !resp.ok
    let err = new Error(resp.statusText || 'http error: ' + resp.status);
    err.type = 'fetch';
    err.status = resp.status;
    err.message = JSON.parse(resp.responseText).message;
    err.response = resp;
    err.url = resp.url;
    throw err;
  }

  return resp.responseText;
}

function parseData(resp) {
  /* fetch
  return resp.json().then(function(data) {
    return data;
  });
  */
  try {
    return JSON.parse(resp);
  } catch (e) {}
}

class Client {
  constructor() {
    this.url = config.api.url;

    // Remove trailing slash.
    const pos = this.url.length-1;
    if (this.url.charAt(pos) === '/') {
      this.url = this.url.slice(0, pos);
    }

    this.token = null;
  }

  setToken = (token) => {
    this.token = token;
  }

  // do actually constructs and sends the request.
  do = ({ url, method, body, headers = {}, handlers = {}}) => {
    const options = {
      headers: headers,
      credentials: 'include',
    };

    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json';
    }

    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`
    }

    if (body) {
      // Default to JSON.
      if (!options.headers['Content-Type']) {
        if (!(body instanceof FormData)) {
          options.headers['Content-Type'] = 'application/json';
        }
      }

      if (options.headers['Content-Type'] === 'application/json') {
        options.body = JSON.stringify(body);
      } else {
        options.body = body;
      }

      if (!method) {
        method = 'POST';
      }
    } else if (!method) {
      method = 'GET';
    }

    options.method = method;

    // Perform the fetch and check for unexpected errors.
    return futch(url, options, handlers.onProgress)
      .catch(handleError)
      .then(handleStatusError)
      .then(parseData);
  }

  call = ({ method, path, body, handlers }) => {
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }

    const url = this.url + path;
    return this.do({ method, url, body, handlers });
  }

  callForm = ({ path, data, handlers }) => {
    const body = new FormData();

    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (val.length !== undefined) {
        data[key].forEach((val) => {
          body.append(key, val);
        });
        return;
      }
      body.append(key, val);
    });

    return this.call({
      path,
      body,
      handlers
    });
  }

  //
  // Public API
  //

  login = ({ token }) => {
    this.token = token;

    return this.call({
      method: 'PUT',
      path: '/account',
      body: {},
    })
  }

  getProjects = () => (
    this.call({
      path: '/projects'
    })
  )

  getProject = ({ id }) => (
    this.call({
      path: `/projects/${id}`
    })
  )

  getLog = ({ id }) => (
    this.call({
      path: `/projects/${id}/log`,
    })
  )

  getLogPending = ({ id }) => (
    this.call({
      path: `/projects/${id}/log/pending`,
    })
  )

  commitLog = ({ id, msg }) => (
    this.call({
      path: `/projects/${id}/log`,
      body: {
        msg,
      }
    })
  )

  updateWorkflow = ({ id, source }) => (
    this.call({
      method: 'PUT',
      path: `/projects/${id}/workflow`,
      body: {
        source,
      }
    })
  )

  createProject = ({ name, description }) => (
    this.call({
      path: '/projects',
      body: {
        name,
        description,
      },
    })
  )
}

export default {
  client: new Client()
};
