const UserModel = require('./Model');

// end requiring the modules
const compEmitter = _include('libraries/suscribers');

class UserService {
  /**
   * Creates user controller
   * @param {Object} [userModel = UserModel] - Instance of a Mongoose Schema of Announcement Model
   * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
   *
   */

  constructor(userModel = UserModel, eventEmitter = compEmitter) {
    this.UserModel = userModel;
    this.eventEmitter = eventEmitter;
  }

  /**
   * Creates an User.
   * @async
   * @param {Object} details - Details required to create a User.
   * @returns {Object} Returns the created User
   * @throws Mongoose Error
   */

  async createUser(details) {
    /**
     * @type {Object} - Holds the created data object.
     */
    const user = await this.UserModel.create({ ...details });

    // emits an Event
    this.eventEmitter.emitEvent('New User', user);

    return user;
  }

  /**
   * Finds one User Data by it's id or Slug.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */
  async getUser(query, populateOptions = {}) {
    const userQuery = this.UserModel.findOne({ ...query });
    // TODO: Populate populateOptions
    // if (populateOptions) userQuery = userQuery.populate(populateOptions);
    // else userQuery = userQuery.lean();

    const user = await userQuery;

    return user;
  }

  /**
   * Finds one All Data matching a specified query but returns all if object is empty.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */
  async getAllUsers(query) {
    const user = await this.UserModel.find({ ...query }).lean();

    return user;
  }

  /**
   * Deletes one User Data by it's id or Slug.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {} Returns null
   * @throws Mongoose Error
   */
  async deleteUser(query) {
    const user = await this.UserModel.findOneAndDelete({ ...query });

    this.eventEmitter.emitEvent('Deleted User', user);

    return user;
  }

  /**
   * Updates one Announcement Data by it's id.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */
  async updateUser(params, query) {
    const user = await this.UserModel.findOneAndUpdate(
      params,
      { ...query },
      {
        new: true,
        runValidators: true,
      }
    );

    this.eventEmitter.emitEvent('Updated User', user);

    return user;
  }
}

module.exports = UserService;
