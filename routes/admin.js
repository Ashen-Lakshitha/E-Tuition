const express = require('express');

const {
    getUsers,
    getAnalytics,
    getTeachers,
    getStudents,
    getSignupReq,
    updateUser,
    verifyTeacher,
    deleteUser,
} = require('../controllers/admin');

const subjectRouter = require('./subject');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use('/subjects', protect, authorize('admin'), subjectRouter);

router.get("/", protect, authorize('admin'), getUsers );
router.get("/analytics", protect, authorize('admin'), getAnalytics );
router.get("/teachers", protect, authorize('admin'), getTeachers );
router.get("/students", protect, authorize('admin'), getStudents );
router.get('/req',protect, authorize("admin"), getSignupReq );

router.put('/:userid/verify', protect, authorize('admin'), verifyTeacher)
router.put('/:userid',protect, authorize('admin'), updateUser );

router.delete('/user/:userid', protect, authorize('admin'), deleteUser );

module.exports = router;