const Joi = require('joi');

const defaultStringValidate = Joi.string().lowercase().trim();


/**
 * @description Joi Schema Validation For Admin Feature
 */

module.exports = {
  createAdmin: {
    name: defaultStringValidate.required().min(3).max(30),

    email: defaultStringValidate.email().required(),

    password: defaultStringValidate.required().min(6).max(30)
    
  },
  loginAdmin: {
    email: defaultStringValidate.email().required(),

    password: defaultStringValidate.required().min(6).max(30),
  },

  updateCurrentStage: {
    stage: Joi.string().trim().valid('firstStage', 'secondStage', 'thirdStage').required(),

    votes: Joi.number().min(1)
  },

  stageWinners: {
    stage: Joi.string().trim().valid('firstStage', 'secondStage', 'thirdStage').required(),

    limit: Joi.number().min(1)
  }
};
