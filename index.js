const auth = require('basic-auth');

// Handles all authentication related tasks.
class AuthenticationProvider {
  constructor(config) {
    this._config = {
      authentication: false,
      authentication_mode: 'all',
      credentials: {
        username: '',
        password: '',
      },
      // define route paths that require admin access
      routes: ['new', 'save', 'edit', 'delete', 'sync'],
      ...config,
    };
  }

  authenticate(req, res, next) {
    // first check if we need to authenticate
    if (!this._config.authentication) {
      return next();
    }

    // if authmode restricts only admin routes
    if (this._config.authentication_mode === 'admin') {
      // if we are navigating not to an admin route then skip authcheck
      const action = req.url.substr(req.url.lastIndexOf('/') + 1);
      if (this._config.routes.includes(action)) {
        return next();
      }
    }

    // if so, use basic auth
    const user = auth(req);

    // check user info
    if (!user || !user.name || !user.pass || user.name !== this._config.credentials.username || user.pass !== this._config.credentials.password) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.end('Access denied');

      return null;
    }

    // we are good, move on
    return next();
  }
}

module.exports = AuthenticationProvider;
