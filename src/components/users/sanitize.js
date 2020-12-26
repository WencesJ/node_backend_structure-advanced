const Joi = require('joi');

const defaultStringValidate = Joi.string().lowercase().trim();

/**
 * @description Joi Schema Validation For User Feature
 */

module.exports = {
  createUser: {
    ordained: Joi.boolean(),
    parentsOrGuardian: [Joi.string()],
    christainName: defaultStringValidate,
    firstName: defaultStringValidate,
    middleName: defaultStringValidate,
    lastName: defaultStringValidate,
    DOB: Joi.date(),
    POB: defaultStringValidate,
    stateOfOrigin: defaultStringValidate,
    lga: defaultStringValidate,
    gender: defaultStringValidate,
    active: Joi.boolean(),
    alive: Joi.boolean(),
  },

  getUser: {
    _id: defaultStringValidate,
  },

  deleteUser: {
    _id: defaultStringValidate,
  },
  updateUser: {
    ordained: Joi.boolean(),
    parentsOrGuardian: [Joi.string()],
    christainName: defaultStringValidate,
    firstName: defaultStringValidate,
    middleName: defaultStringValidate,
    lastName: defaultStringValidate,
    DOB: Joi.date(),
    POB: defaultStringValidate,
    stateOfOrigin: defaultStringValidate,
    lga: defaultStringValidate,
    gender: defaultStringValidate,
    active: Joi.boolean(),
    alive: Joi.boolean(),
  },

  getAllUsers: {
    ordained: Joi.boolean(),
    parentsOrGuardian: [Joi.string()],
    christainName: defaultStringValidate,
    firstName: defaultStringValidate,
    middleName: defaultStringValidate,
    lastName: defaultStringValidate,
    DOB: Joi.date(),
    POB: defaultStringValidate,
    stateOfOrigin: defaultStringValidate,
    lga: defaultStringValidate,
    gender: defaultStringValidate,
    active: Joi.boolean(),
    alive: Joi.boolean(),
  },
};
