/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
const passport = require('passport');

const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const createSendToken = require('./helpers');

const { catchAsync, AppError } = require('../../libraries/error');

const { MSG, STATUS } = require('../../libraries/shared/constants');
// end requiring the modules

module.exports = class Auth {
  constructor(model) {
    this.Model = model;
  }

  signUp = catchAsync(async (req, res, next) => {
    const newStaff = new this.Model({
      name: req.body.name,

      email: req.body.email,

      username: req.body.username,

      role: req.body.role,
    });

    await this.Model.register(newStaff, req.body.password, (err, user) => {
      if (err) {
        return next(new AppError(err, STATUS.BAD_REQUEST));
      }

      return res.status(STATUS.CREATED).json({
        status: MSG.SUCCESS,
        data: {
          user,
        },
      });
    });
  });

  login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError('Invalid Email Or Password', STATUS.UNAUTHORIZED));
    }

    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }, (error, user) => {
      if (error) {
        return next(new AppError(error, STATUS.BAD_REQUEST));
      }

      req.login(user, (err) => {
        if (!user) {
          return next(new AppError('Username Or Password Incorrect', STATUS.UNAUTHORIZED));
        }
        if (err) {
          return next(new AppError(err, STATUS.BAD_REQUEST));
        }
        return createSendToken(user, STATUS.OK, res);
      });
    })(req, res);
  });

  resetPassword = catchAsync(async (req, res, next) => {
    const { username, oldPassword, newPassword, passwordConfirm } = req.body;
    if (!oldPassword || !newPassword || !passwordConfirm || !username) {
      return next(new AppError('Incomplete Credentials', STATUS.BAD_REQUEST));
    }

    const user = await this.Model.findOne({ username });

    if (!user) {
      return next(new AppError('User Not Found in Records', STATUS.NOT_FOUND));
    }

    if (newPassword !== passwordConfirm) {
      return next(new AppError('Passwords Dont Match', STATUS.BAD_REQUEST));
    }

    await user.changePassword(oldPassword, newPassword, (err) => {
      if (err) {
        return next(new AppError(err, STATUS.BAD_REQUEST));
      }
      return createSendToken(user, STATUS.OK, res);
    });
  });

  setPassword = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    if (!password || !username) {
      return next(new AppError('Incomplete Credentials', STATUS.BAD_REQUEST));
    }

    const staff = await this.Model.findOne({ username });

    if (!staff) {
      return next(new AppError('Staff Not Found in Records', STATUS.NOT_FOUND));
    }

    if (password.length < 5) {
      return next(new AppError('Passwords Too Short', STATUS.BAD_REQUEST));
    }

    await staff.setPassword(password, async (err) => {
      if (err) {
        return next(new AppError(err, STATUS.BAD_REQUEST));
      }
      await staff.save();
      return createSendToken(staff, STATUS.OK, res);
    });
  });

  restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You Do Not Have The Permission To Perform The Specified Task', 401));
      }
      next();
    };
  };

  protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!req.isAuthenticated() && !req.originalUrl.startsWith('/api')) {
      return next();
    }

    if (!req.isAuthenticated()) {
      console.log(req.user);
      return next(new AppError('You Are Not Logged In ! Please Log In To Get Access!', 401));
    }

    // token verification

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentStaff = await this.Model.findById(decoded.id);

    if (!currentStaff) {
      return next(new AppError('The User Belonging To This Token No Longer Exist!', 401));
    }

    res.locals.staff = currentStaff;

    next();
  });

  logout = (req, res) => {
    req.logout();

    return res.status(200).json({ status: MSG.SUCCESS });
  };
};
