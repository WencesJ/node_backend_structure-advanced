// NODE MODULES

// USER MODULES
const AdminModel = require('./Model');
const { ApiFeatures } = _include('libraries/shared/utils');
const compEmitter = _include('libraries/suscribers');
const { STATUS, MSG } = _include('libraries/shared/constants');

// end requiring the modules

class AdminService extends ApiFeatures{
  /**
   * Creates admin controller
   * @param {Object} [adminModel = AdminModel] - Instance of a Mongoose Schema of Announcement Model
   * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
   *
   */

  constructor(adminModel = AdminModel, eventEmitter = compEmitter) {
    super();
    this.AdminModel = adminModel;
    this.eventEmitter = eventEmitter;
  }

  /**
   * Creates an Admin.
   * @async
   * @param {Object} details - Details required to create a Admin.
   * @returns {Object} Returns the created Admin
   * @throws Mongoose Error
   */

  async create(details) {
    /**
     * @type {Object} - Holds the created data object.
     */

    if (!(await this.AdminModel.registerAsAdmin())) {
        return {
            error: {
                msg: 'You Cannot Register As An Admin!',
                code: STATUS.BAD_REQUEST
            }
        }
    }

    const admin = await this.AdminModel.create({ ...details });

    // emits an Event
    this.eventEmitter.emitEvent('New Admin', admin);

    return {
        value: {
            data: admin
        }
    };
  }

  async getAll(query) {
    const adminsQuery = this.api(this.AdminModel, query)
                                .filter()
                                .sort()
                                .limitFields()
                                .paginate();

    const admins = await adminsQuery.query.lean();

    return {
      value: {
        data: admins
      }
    }
  }


  /**
   * Finds one All Data matching a specified query but returns all if object is empty.
   * @async
   * @param {Object} query - finds data based on queries.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */

  async logIn({ email, password }) {

    const admin = await this.AdminModel.findByEmail(email);
    
    if (!admin || !(await admin.validPassword(password))) {
      return {
        error: {
          msg: 'Invalid Email or Password!',
          code: STATUS.BAD_REQUEST
        }
      }
    }

    return {
      value: {
        data: admin
      }
    };
  }

}

module.exports = AdminService;
