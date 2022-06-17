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
    deleteSubject,
} = require('../controllers/subject');

const reviewRouter = require('./reviews');

const router = express.Router({mergeParams: true});

const { protect, authorize, verify } = require('../middleware/auth');

router.use('/:subjectid/reviews',reviewRouter);

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
    .route('/:subjectid/post')
    .put(protect, authorize('teacher'), upload.single('post'), updateClassPoster);

router.route('/public/:subjectid').get(getSubjectPublic)

module.exports = router;