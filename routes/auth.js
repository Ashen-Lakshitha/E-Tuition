const express = require('express');
const { 
    createUser, 
    loginUser, 
    getMe, 
    forgotPwd,
    resetCode,
    resetPassword,
    updatePassword,
    logout
} = require('../controllers/auth');

const router = express.Router();

const{ protect } = require('../middleware/auth');

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/me').get(getMe);
router.route('/forgotpwd').post(forgotPwd);
router.route('/reset').put(resetCode);
router.route('/resetpassword/:userid').put(resetPassword);
router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;