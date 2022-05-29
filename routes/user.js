const express = require('express');
const imageUpload = require('../middleware/multer');

const {
    createTeacher,
    createStudent,
    getUsers,
    getUser,
    updateUser,
    updateProfilePicture,
    deleteUser,
    getMyEnrolledClasses,
    getCart,
    addToCart,
    removeFromCart,
} = require('../controllers/user');

const router = express.Router();

//include other routes
const subjectRoute = require('./subject');

//Security
const { protect, authorize } = require('../middleware/auth');

//re-route
router.use('/:userid/subjects', subjectRoute);

router.get("/", getUsers );
router.get('/myclasses',protect, authorize("student"), getMyEnrolledClasses );
router.get('/cart',protect, authorize("student"), getCart );
router.get('/:userid',protect, authorize("admin", "teacher"), getUser );

router.post('/register',imageUpload.single('verifications'), createTeacher);
router.post('/regstudent', createStudent);

router.put('/',protect, updateUser );
router.put('/pic', protect, imageUpload.single('image'), updateProfilePicture);
router.put('/cart/:subjectid', protect, authorize("student"), addToCart );

router.delete('/', protect, deleteUser );
router.delete('/cart/:subjectid', protect, authorize("student"), removeFromCart );

// router.post("/teachers/:teacherid/reviews", addReview);
// router.put("/teachers/:teacherid/reviews/:reviewid", updateReview);
// router.delete("/teachers/:teacherid/reviews/:reviewid", deleteReview);

module.exports = router;