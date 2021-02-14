const mongoose = require('mongoose');
const mongoConnect = require('connect-mongo');

const rateLimit = require('express-rate-limit');
const { config: { session, env:ENV } } = _include('libraries/config');

exports.rateLimiter = max =>
    rateLimit({
        max,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests! Please try again in one hour time'
    });

exports.selectProps = (obj, props) => {
    const newObj = {};

    props.forEach(el => {
        if (obj[el]) newObj[el] = obj[el];
    });

    return newObj;
};

exports.fieldplugout = (obj, props) => {
  const keys = Object.keys(obj);

  keys.forEach((el) => {
    if (props.includes(el)) delete obj[el];
  });

  return obj;
};

exports.corsOptions = {
  origin: true,

  credentials: true,

  allowHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization'
  ],

  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie']
}

exports.sessionParams = (expressSession) => {
  const MongoStore = mongoConnect(expressSession);
  const mongoStoreInstance = new MongoStore({
      mongooseConnection: mongoose.connection,
      secret: session.STORE_SECRET,
      ttl: parseInt(session.STORE_TTL),
  });

  const environment = ENV.NODE_ENV === ENV.PROD;

  return {
      secret: session.SECRET,
      name: session.NAME,
      cookie: {
          httpOnly: true,
          secure: environment,
          sameSite: environment ? 'none' : 'lax',
          maxAge: parseInt(session.COOKIE_MAX_AGE), // Time in milliseconds
      },
      saveUninitialized: false,

      resave: false,
      store: mongoStoreInstance,
      unset: 'destroy',
  };
};
