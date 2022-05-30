const express = require('express');
const upload = require('../middleware/multer');

const {
    getSubjects,
    getSubject,
    getSubjectPublic,
    getMySubjects,
    createSubject,
    updateSubject,
    updateClassPoster,
    enrollStudent,
    unEnrollStudent,
    payClass,
    deleteSubject,
} = require('../controllers/subject');

const reviewRouter = require('./reviews');
const quizRouter = require('./quiz');
const chatRouter = require('./test');
const lmsRouter = require('./lms');

const router = express.Router({mergeParams: true});

const { protect, authorize, verify } = require('../middleware/auth');

//include other routes
const lmsRoute = require('./lms');

//re-route
router.use('/:subjectid/lms', lmsRoute);

router.use('/:subjectid/reviews',reviewRouter);
router.use('/:subjectid/quiz',quizRouter);
router.use('/:subjectid/msges', chatRouter);
router.use('/:subjectid/lms', lmsRouter);

router
    .route('/')
    .get(getSubjects)
    .post(protect, authorize('teacher'), upload.single('post'), verify, createSubject);

router
    .route('/mysubjects')
    .get(protect, authorize('teacher'), getMySubjects);
    
router
    .route('/:subjectid')
    .get(protect, getSubject)
    .put(protect, authorize('teacher'), updateSubject)
    .delete(protect, authorize('teacher'), deleteSubject);  

router
    .route('/:subjectid/enroll')
    .put(protect, authorize('student'), verify, enrollStudent);

router
    .route('/:subjectid/unenroll')
    .put(protect, authorize('student'), unEnrollStudent);

router
    .route('/:subjectid/pay')
    .put(protect, payClass);

router
    .route('/:subjectid/post')
    .put(protect, authorize('teacher'), upload.single('post'), updateClassPoster);

router.route('/public/:subjectid').get(getSubjectPublic)

module.exports = router;