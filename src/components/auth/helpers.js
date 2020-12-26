const jwt = require('jsonwebtoken');

const { MSG } = require('../../libraries/shared/constants');

const signToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = (user, statusCode, res) => {
  const token = signToken(user._id, user.username);

  const cookieOPtions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOPtions.secure = true;
  }

  res.cookie('jwt', token, cookieOPtions);

  res.status(statusCode).json({
    status: MSG.SUCCESS,
    username: user.username,
    token,
  });
};
