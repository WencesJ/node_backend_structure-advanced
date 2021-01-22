/**
 *
 * @description subScribes for admin Feature
 */

const adminEvents = (eventEmitter) => {
  eventEmitter.on('New Admin', (admin) => {
    _logger.info(`✅✅✅ ➡ New Admin has been created!\nAdmin = ${admin}`);
  });

  return eventEmitter;
};

module.exports = adminEvents;
