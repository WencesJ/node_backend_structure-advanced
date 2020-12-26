const UserService = require('./service');

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG, MISSING_DOCUMENT, INVALID_ID } = require('../../libraries/shared/constants');

// end of requiring the modules

/**
 * @type {Object.<UserService>} - Instance of UserService class
 */
const userServiceInstance = new UserService();

/**
 * User Controller class
 * @class
 */

class UserController {
  /**
   * @description Creates user controller
   * @param {Object} [userService = userServiceInstance] - same as userServiceInstance Object
   *
   */
  constructor(userService = userServiceInstance) {
    /**
     * @type {Object}
     * @borrows userService
     */
    this.UserService = userService;
  }

  /**
   * Creates a User
   * @async
   * @route {POST} /user/
   * @access protected
   */
  createUser = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields required for creating a User.
     */
    const userDetails = { ...req.value };

    /**
     * @type {Object} - Holds the created data object.
     */
    const user = await this.UserService.createUser(userDetails);

    // Returns a json response
    res.status(STATUS.CREATED).json({
      message: MSG.SUCCESS,
      user,
    });
  });

  /**
   * Gets one User Data
   * @async
   * @route {GET} /user/:slug or :/id
   * @access public
   */
  getUser = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields to be queried.
     */
    const queryFields = { ...req.params };
    /**
     * @type {Object|null} - Holds either the returned data object or null.
     *
     * @describtion Use Either a mongodbUniqueId Or Slug to Search
     */

    let user = await this.UserService.getUser({ slug: queryFields._id });

    if (!user) {
      user = await this.UserService.getUser(queryFields);
    }

    // Checks if data returned is null
    if (!user) {
      return next(new AppError(`${INVALID_ID}`, STATUS.BAD_REQUEST));
    }

    // Returns a json response
    res.status(STATUS.OK).json({
      message: MSG.SUCCESS,
      user,
    });
  });

  /**
   * Gets All User Datas
   * @async
   * @route {GET} /users/
   * @access public
   */
  getAllUsers = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields to be queried.
     *
     * @empty - Returns Whole Data In Users Collection
     */
    const queryFields = { ...req.params };
    /**
     * @type {Object|null} - Holds either the returned data object or null.
     */
    const user = await this.UserService.getAllUsers(queryFields);

    // Checks if data returned is null
    if (!user) {
      return next(new AppError(`${req.params.slug || req.params._id} ${MISSING_DOCUMENT}`, STATUS.BAD_REQUEST));
    }

    // Returns a json response
    res.status(STATUS.OK).json({
      message: MSG.SUCCESS,
      user,
    });
  });

  deleteUser = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields to be queried.
     */
    const queryFields = { ...req.params };
    /**
     * @type {Object|null} - Holds either the returned data object or null.
     *
     * @describtion Use Either a mongodbUniqueId Or Slug to Search
     */
    let user = await this.UserService.deleteUser({ slug: queryFields._id });

    if (!user) {
      user = await this.UserService.deleteUser(queryFields);
    }

    // Checks if data returned is null
    if (!user) {
      return next(new AppError(`${MISSING_DOCUMENT}`, STATUS.BAD_REQUEST));
    }

    // Returns a json response
    res.status(STATUS.NO_CONTENT).json({
      message: MSG.SUCCESS,
    });
  });

  /**
   * @route {GET} - /users/:id or /:slug
   */

  updateUser = catchAsync(async (req, res, next) => {
    /**
     * @type {Object} - An Object of fields to be queried.
     */
    const queryParams = { ...req.params };

    const queryFields = { ...req.value };
    /**
     * @type {Object|null} - Holds either the returned data object or null.
     *
     * @describtion Use Either a mongodbUniqueId Or Slug to Search
     */
    let user = await this.UserService.updateUser({ slug: queryParams._id }, queryFields);

    if (!user) {
      user = await this.UserService.updateUser(queryParams, queryFields);
    }

    // Checks if data returned is null
    if (!user) {
      return next(new AppError(`${MISSING_DOCUMENT}`, STATUS.BAD_REQUEST));
    }

    // Returns a json response
    res.status(STATUS.ACCEPTED).json({
      message: MSG.SUCCESS,
      user,
    });
  });
}

module.exports = UserController;
