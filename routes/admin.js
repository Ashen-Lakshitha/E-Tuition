const express = require('express');

const {
    getUsers,
    getSignupReq,
    updateUser,
    deleteUser,
} = require('../controllers/admin');

const router = express.Router();

//Security
const { protect, authorize } = require('../middleware/auth');

router.get("/", protect, authorize('admin'), getUsers );
router.get('/req',protect, authorize("admin"), getSignupReq );

router.put('/:userid',protect, authorize('admin'), updateUser );

router.delete('/:userid', protect, authorize('admin'), deleteUser );

module.exports = router;