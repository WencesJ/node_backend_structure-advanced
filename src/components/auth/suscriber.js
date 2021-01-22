const { Email } = _include('libraries/shared/utils');

/**
 *
 * @description subScribes for user Feature
 */

const authEvents = (eventEmitter) => {

  eventEmitter.on('Send Password Reset Token', async ({ user, result }) => {
    try {
      
      await new Email({ email: user.email, firstName: user.firstName }, user.token).sendPasswordResetToken();
    
    } catch (error) {
      _logger.error(`Error While Sending Mail => ${error}`);
      
      return result.success;
    }

    _logger.info(`✅✅✅ ➡ Password Reset Token Successfully Sent To = ${user.email}`);

    result.success = true;
  });

  eventEmitter.on('Send Welcome Verification Mail', async ({ user, result }) => {
    try {
      
      await new Email({ email: user.email, firstName: user.firstName }, user.token).sendWelcome();
    
    } catch (error) {
      _logger.error(`Error While Sending Mail => ${error}`);
      
      return result.success;
    }

    _logger.info(`✅✅✅ ➡ Welcome Mail Successfully Sent To = ${user.email}`);

    result.success = true;
  })

  return eventEmitter;
};

module.exports = authEvents;
