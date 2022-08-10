const express = require('express');
const upload = require('../middleware/multer');

const {
    getSubjects,
    getSubject,
    getSubjectPublic,
    getMySubjects,
    getPayments,
    createSubject,
    updateSubject,
    updateClassPoster,
    enrollStudent,
    unEnrollStudent,
    enrollStudentByTeacher,
    payClass,
    temporaryPaid,
    deleteSubject,
} = require('../controllers/subject');

const reviewRouter = require('./reviews');
const quizRouter = require('./quiz');
const chatRouter = require('./message');
const lmsRouter = require('./lms');
const notiRouter = require('./notification');

const router = express.Router({mergeParams: true});

const { protect, authorize, verify } = require('../middleware/auth');

//re-route
router.use('/:subjectid/lms', lmsRouter);
router.use('/:subjectid/reviews',reviewRouter);
router.use('/:subjectid/quiz',quizRouter);
router.use('/:subjectid/msges', chatRouter);
router.use('/:subjectid/notification', notiRouter);

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
    .route('/:subjectid/getpayments')
    .get(protect, authorize('teacher'), getPayments);

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
    .route('/:subjectid/pay/:userid')
    .put(protect, temporaryPaid);

router
    .route('/:subjectid/post')
    .put(protect, authorize('teacher'), upload.single('post'), updateClassPoster);

router
    .route('/:subjectid/:userid/enroll')
    .put(protect, authorize('teacher'), enrollStudentByTeacher);

router.route('/public/:subjectid').get(getSubjectPublic)

module.exports = router;