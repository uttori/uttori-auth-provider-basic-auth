const test = require('ava');
const sinon = require('sinon');
const AuthenticationProvider = require('../index.js');

test('Authentication Provider: constructor(config): sets up config and routes', (t) => {
  const a = new AuthenticationProvider();

  const config = {
    authentication: false,
    authentication_mode: 'all',
    credentials: {
      username: '',
      password: '',
    },
    routes: [
      'new',
      'save',
      'edit',
      'delete',
      'sync',
    ],
  };

  t.deepEqual(a._config, config);
});

// NOTE: Not sure about testing these, terrible tests.
test('Authentication Provider: authenticate(req, res, next): returns when disabled', (t) => {
  const spy = sinon.spy();
  const a = new AuthenticationProvider({ authentication: false });
  a.authenticate(null, null, spy);

  t.true(spy.calledOnce);
});

test('Authentication Provider: authenticate(req, res, next): checks authomode and restricts only admin routes when in admin mode', (t) => {
  const spy = sinon.spy();
  const a = new AuthenticationProvider({ authentication: true, authentication_mode: 'admin' });

  const setHeader = sinon.stub().returns(true);
  const end = sinon.stub().returns(true);


  a.authenticate({ url: '/new', headers: {} }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();

  a.authenticate({ url: '/save', headers: {} }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();

  a.authenticate({ url: '/edit', headers: {} }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();

  a.authenticate({ url: '/delete', headers: {} }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();

  a.authenticate({ url: '/sync', headers: {} }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();

  a.authenticate({ url: '/fake', headers: {} }, { end, setHeader }, spy);
  t.false(spy.calledOnce);
});

test('Authentication Provider: authenticate(req, res, next): checks authorization headers', (t) => {
  const spy = sinon.spy();
  const a = new AuthenticationProvider({
    authentication: true,
    authentication_mode: 'all',
    credentials: {
      username: 'foo',
      password: 'bar',
    },
  });

  const setHeader = sinon.stub().returns(true);
  const end = sinon.stub().returns(true);


  a.authenticate({ url: '/new', headers: { authorization: 'basic Zm9vOmJhcg==' } }, { end, setHeader }, spy);
  t.true(spy.calledOnce);
  spy.resetHistory();
});
