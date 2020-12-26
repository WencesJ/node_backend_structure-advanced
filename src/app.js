const path = require('path');
const express = require('express');
const logger = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const expressSession = require('express-session');

// user custom modules
const { AppError, errorController: globalErrorHandler } = _include('libraries/error');

const { Router: userRouter } = _include('components/users');

const { Router: adminRouter } = _include('components/admin');

const { rateLimiter, sessionParams } = _include('libraries/shared/helpers');

const app = express();

// GLOBAL MIDDLEWARES

// TEMPLATE ENGINE INITIALIZATION
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, './libraries/views'));

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('tiny'));
}
// EXPRESS SESSION FOR PASSPORT
const sessionOptions = expressSession(sessionParams);

app.use(sessionOptions);

// PASSPORT INIT

app.use(passport.initialize());
app.use(passport.session());

// BODY-PARSER, READING DATA = body INTO req.body
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// GRABBING URL QUERIES
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// SET SECURITY HEADERS
app.use(helmet());

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, './libraries/views')));

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [],
  })
);

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// COMPRESSING TEXT RESPONSES
// app.use(compression()); // USED DURING PRODUCTION PHASE

app.use(cors());

// IMPLEMENTING RATE LIMITING
// TODO: Make Function Flexible by implementing parameter injection for rate limit expiration time
const limitUser = rateLimiter(50);

// ROUTES

// setting the rate limiters

app.use('/', limitUser);

// app.use('/view', viewRoutes);

// Would be moved to a seperate module

// Homepage

/* Grabs data = JSON dictionary */
if (process.env.NODE_ENV === 'test') {
  app.use('/api/v1/test', testRouter);
}

app.get('/', (req, res) => {
  res.render('index');
});

// MAINTAINANCE ENDPOINT
app.get('/maintainance', (req, res) => {
  res.status(200).send('<h1>We Are Currently Undergoing Maintance</h1>');
});

app.get('/api/v1', (req, res) => {
  res.status(200).send('<h1>Welcome to Sacrecords Api</h1>');
});

app.use('/api/v1/users', userRouter);

// app.use('/api/v1/admins', adminRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`Wrong url '${req.originalUrl}'. This url doesn't exist!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
