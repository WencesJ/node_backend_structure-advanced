// importing the modules

// importing the modules

const express = require('express');

const UserController = require('./controller');

const { reqValidate } = _include('libraries/controllers');

const userCntrl = new UserController();

const router = express.Router();

// router.use('/:userId/baptism', baptismRouter);

router
  .route('/')

  .get(reqValidate('getAllUsers'), userCntrl.getAllUsers)

  .post(reqValidate('createUser'), userCntrl.createUser);

router

  .route('/:_id')

  .get(reqValidate('getUser'), userCntrl.getUser)

  .patch(reqValidate('updateUser'), userCntrl.updateUser);

// .delete(deleteUser);

module.exports = router;
