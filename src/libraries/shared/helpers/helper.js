const rateLimit = require('express-rate-limit');
const { session } = _include('libraries/config');

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

exports.sessionParams = {
  secret: session.SECRET,
  resave: false,
  saveUninitialized: false,
};
