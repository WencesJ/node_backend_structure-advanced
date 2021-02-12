const Joi = require('joi');

const defaultStringValidate = Joi.string().lowercase().trim();


/**
 * @description Joi Schema Validation For Admin Feature
 */

module.exports = {
  createAdmin: {
    params: {

    },

    body: {      
      name: defaultStringValidate.required().min(3).max(30),
  
      email: defaultStringValidate.email().required(),
  
      password: defaultStringValidate.required().min(6).max(30)
      
    }
  },
  loginAdmin: {
    params: {

    },

    body: {
      email: defaultStringValidate.email().required(),
  
      password: defaultStringValidate.required().min(6).max(30),
    }
  },
};
