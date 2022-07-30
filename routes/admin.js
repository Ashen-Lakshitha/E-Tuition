const express = require('express');

const {
    getUsers,
    getTeachers,
    getStudents,
    getSignupReq,
    updateUser,
    verifyTeacher,
    deleteUser,
    deleteClass
} = require('../controllers/admin');

const router = express.Router();

//Security
const { protect, authorize } = require('../middleware/auth');

router.get("/", protect, authorize('admin'), getUsers );
router.get("/teachers", protect, authorize('admin'), getTeachers );
router.get("/students", protect, authorize('admin'), getStudents );
router.get('/req',protect, authorize("admin"), getSignupReq );

router.put('/:userid/verify', protect, authorize('admin'), verifyTeacher)
router.put('/:userid',protect, authorize('admin'), updateUser );

router.delete('/user/:userid', protect, authorize('admin'), deleteUser );

router.delete('/subject/:subjectid', protect, authorize('admin'), deleteClass);

module.exports = router;