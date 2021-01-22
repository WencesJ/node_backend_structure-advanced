/* eslint-disable no-unused-vars */

require('./_globals');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './src/libraries/config/config.env' });

const { config: { database, env } } = _include('libraries/config');

// end of requiring core  and 3rd party modules


// starting express server and connecting to database
process.on('uncaughtException', (err) => {
  _logger.log('error', '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNCAUGHT EXCEPTION ERROR ⬇⬇⬇');
  const error = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  // log error to console
  _logger.log('error', error.stack);
  
  // send error to log file
  _logger.exception(error);

  setTimeout(() => {
    process.exit(1);
  }, 100);

});
// const DB = process.env.DB_AUTH_LOCAL.replace(
//     '<username>',
//     process.env.DB_USERNAME
// ).replace('<password>', process.env.DB_PASSWORD);

const PORT = env.PORT;

// const DATABASE = (process.env.NODE_ENV === 'development') ? database.LOCAL : config.DB;
const DATABASE = database.LOCAL 

mongoose
  .connect(DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    _logger.log('info', '✅✅✅ ➡ DATABASE CONNECTION IS SUCCESSFUL!'); 
  })
  .catch((err) => {
    // log to console
    _logger.log('error', '❌❌❌ ➡ ⬇⬇⬇ DATABASE CONNECTION FAILED --- ERROR CONNECTING TO DATABASE ⬇⬇⬇');

    // save to error log file
    _logger.error(err);
  });

// const db = mongoose.connection;

const app = require('./app');

const server = app.listen(PORT, async () => {
  _logger.log('info', `ℹℹℹ LISTENING TO SERVER http://127.0.0.1:${PORT} ON PORT ${PORT} ℹℹℹ`); 

});

// server.clearDatabase = () => {
//   mongoose.connection.db.dropDatabase();
// };

process.on('unhandledRejection', async(err) => {
  _logger.log('error', '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNHANDLED REJECTION ERROR ⬇⬇⬇');
  const error = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  // log error to console
  _logger.log('error', error);
  
  // send error to log file
  _logger.rejection(error);

  await server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
