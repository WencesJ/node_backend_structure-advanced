
// importing the modules

const express = require('express');

const adminCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const router = express.Router();


router.post('/', reqValidate('createAdmin'), adminCntrl.createAdmin);

router.post('/login', reqValidate('loginAdmin'), adminCntrl.logIn);

router.use(adminCntrl.activeSession);

router.get('/', adminCntrl.getAllAdmins);

router.post('/logout', adminCntrl.logOut);


module.exports = router;
