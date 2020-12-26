const { MSG, STATUS, MISSING_DOCUMENT, INVALID_ID } = require('./responseConstants');

const ENV = require('./appConstants');

const MONGOOSE_ERROR = require('./errorConstants');

module.exports = {
  MSG,
  STATUS,
  MISSING_DOCUMENT,
  INVALID_ID,
  ENV,
  MONGOOSE_ERROR,
};
