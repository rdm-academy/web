const brand = {
  title: 'RDM Academy'
};

const raven = {
  dsn: window.__config.sentryDsn,
};

const api = {
  url: window.__config.apiUrl,
}

const auth0 = {
  client: window.__config.jwtClient,
  domain: window.__config.jwtDomain,
  config: {
    auth: {
      responseType: 'token',
      sso: true,
      params: {
        scope: 'openid profile email'
      }
    },
    languageDictionary: {
      title: '',
    },
    container: 'login-container',
    redirect: false,
    closable: false,
    allowSignup: false,
  },
};


export default {
  api,
  brand,
  auth0,
  raven
}
