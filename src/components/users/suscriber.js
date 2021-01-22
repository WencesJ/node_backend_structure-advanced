const { Email } = _include('libraries/shared/utils');

/**
 *
 * @description subScribes for user Feature
 */

const userEvents = (eventEmitter) => {
  eventEmitter.on('New User', (user) => {
    _logger.info(`✅✅✅ ➡ New User has been created!\nUser = ${user}`);
  });

  eventEmitter.on('Updated User', (user) => {
    _logger.info(`✅✅✅ ➡ User has been updated!\nUser = ${user}`);
  });

  eventEmitter.on('Deleted User', (user) => {
    _logger.info(`✅✅✅ ➡ User has been updated!\nUser = ${user}`);
  });

  return eventEmitter;
};

module.exports = userEvents;
