const express = require('express');
const imageUpload = require('../middleware/multer');

const {
    getSubjects,
    getSubject,
    getSubjectPublic,
    getMySubjects,
    createSubject,
    updateSubject,
    enrollStudent,
    unEnrollStudent,
    deleteSubject,
} = require('../controllers/subject');

const reviewRouter = require('./reviews');

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

router.use('/:subjectid/reviews',reviewRouter);

router
    .route('/')
    .get(getSubjects)
    .post(protect, authorize('teacher'), imageUpload.single('post'), createSubject);

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
    .put(protect, authorize('student'), enrollStudent);

router
    .route('/:subjectid/unenroll')
    .put(protect, authorize('student'), unEnrollStudent);

router.route('/public/:subjectid').get(getSubjectPublic)

module.exports = router;