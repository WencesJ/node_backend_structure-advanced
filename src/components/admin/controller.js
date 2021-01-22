// NODE MODULES
const passport = require('passport');


// USER MODULES
const AdminService = require('./service');

const { Service: UserService } = _include('components/users');

const { authHelpers : { signToken }, Authentication } = _include("components/auth");

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG, MISSING_DOCUMENT, INVALID_ID } = _include('libraries/shared/constants');

// end of requiring the modules
/**
/**
 * @type {Object.<AdminService>} - Instance of AdminService class
 */
const adminServiceInstance = new AdminService();
const userServiceInstance = new UserService();

// ADMIN AUTHENTICATION CONTROLLERS
/**
 * Admin Controller class
 * @class
 */

class AdminController {
  /**
   * @description Creates admin controller
   * @param {Object} [adminService = adminServiceInstance] - same as adminServiceInstance Object
   *
   */
  constructor(adminService = adminServiceInstance, userService = userServiceInstance) {
    /**
     * @type {Object}
     * @borrows adminService
     */
    this.AdminService = adminService;
    this.UserService = userService;
  }

  /**
   * Creates a Admin
   * @async
   * @route {POST} /admin/
   * @access protected
   */
  createAdmin = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields required for creating a Admin.
     */
    const adminDetails = { ...req.body };

    /**
     * @type {Object} - Holds the created data object.
     */
    const { error, value: { data: admin = {}} = {} } = await this.AdminService.create(adminDetails);

    if (error) {
      return next(new AppError(error.msg, error.code));
    }

    // Returns a json response
    res.status(STATUS.CREATED).json({
      status: MSG.SUCCESS,
      admin,
    });
  });

  getAllAdmins = catchAsync(async (req, res, next) => {
  
    /**
     * @type {Object} - An Object of fields to be queried.
     *
     * @empty - Returns Whole Data In Admins Collection
     */
    const queryFields = { ...req.query };
    /**
     * @type {Object|null} - Holds either the returned data object or null.
     */
    const { value: { data: admins = {}} = {} } = await this.AdminService.getAll(queryFields);

    // Returns a json response
    res.status(STATUS.OK).json({
      status: MSG.SUCCESS,
      admins,
    });
  });

}

const adminCntrl = new AdminController();
const authCntrl = new Authentication(adminServiceInstance);

adminCntrl.logIn = authCntrl.logIn;
adminCntrl.logOut = authCntrl.logOut;
adminCntrl.activeSession = authCntrl.activeSession;

module.exports = adminCntrl;
