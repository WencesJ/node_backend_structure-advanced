// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const userCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

// const userCntrl = new UserController();


const router = express.Router();

router.get('/', userCntrl.getAllUsers);

router.post('/signup', reqValidate('createUser'), userCntrl.signUp);

router.post('/verify_me', reqValidate('verifyUser'), userCntrl.verifyMe);

router.post('/login', reqValidate('loginUser'), userCntrl.logIn);

router.post('/send_reset_password_token', reqValidate('sendResetPasswordTokenUser'), userCntrl.sendResetPasswordToken);

router.post('/verify_reset_password_token', reqValidate('verifyResetPasswordTokenUser'), userCntrl.verifyResetPasswordToken);

router.post('/reset_password', reqValidate('resetPasswordUser'), userCntrl.resetPassword);

router.post('/logout', userCntrl.logOut);

// NEEDS AUTHORIZATION
router.use(userCntrl.activeSession);

router.route('/me')
  .get(userCntrl.getUser)
  .patch(reqValidate('updateUser'), userCntrl.updateUser)

router.post('/change_password', reqValidate('changePasswordUser'), userCntrl.changePassword);

router

  .route('/:slug')

  .get(reqValidate('getUser'), userCntrl.getUser)

  .patch(reqValidate('updateUser'), userCntrl.updateUser);

// .delete(deleteUser);

module.exports = router;
