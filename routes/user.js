const express = require('express');
const upload = require('../middleware/multer');

const {
    getUser,
    getTeachers,
    getStudents,
    getPayments,
    getMyEnrolledClasses,
    getCart,
    createTeacher,
    createStudent,
    updateUser,
    openToEnroll,
    verifyUser,
    addToCart,
    updateProfilePicture,
    deleteUser,
    removeFromCart,
} = require('../controllers/user');

const router = express.Router();

//include other routes
const subjectRoute = require('./subject');

//Security
const { protect, authorize, verify } = require('../middleware/auth');

//re-route
router.use('/:userid/subjects', subjectRoute);

router.get("/teachers", getTeachers );
router.get("/students", protect, authorize("admin", "teacher"), getStudents);
router.get('/myclasses',protect, authorize("student"), getMyEnrolledClasses );
router.get('/cart',protect, authorize("student"), getCart );
router.get('/payments',protect, getPayments );
router.get('/:userid',protect, getUser );
router.get('/verify/:userid', verifyUser );

router.post('/regteacher',upload.single('verifications'), createTeacher);
router.post('/regstudent', createStudent);

router.put('/',protect, updateUser );
router.put('/opentoenroll',protect, openToEnroll );
router.put('/pic', protect, upload.single('image'), updateProfilePicture);
router.put('/cart/:subjectid', protect, verify, authorize("student"), addToCart );

router.delete('/', protect, deleteUser );
router.delete('/cart/:subjectid', protect, authorize("student"), removeFromCart );

module.exports = router;