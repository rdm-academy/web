import 'whatwg-fetch';
import config from './config';


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

function handleError(resp) {
  if (resp.status >= 400) {  // fetch -> !resp.ok
    let err = new Error(resp.statusText || 'http error: ' + resp.status);
    err.type = 'fetch';
    err.status = resp.status;
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
  return JSON.parse(resp);
}

class Client {
  constructor() {
    this.root = config.api.url;
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
      .then(handleError)
      .then(parseData)
  }

  call = ({ path, body, handlers }) => {
    const url = this.root + path;
    return this.do({ url, body, handlers });
  }

  callForm = ({ path, body, handlers }) => {
    const data = new FormData();

    Object.keys(body).forEach((key) => (
      data.append(key, body[key])
    ));

    return this.call({ path, body: data, handlers });
  }
}

export default {
  client: new Client()
};
