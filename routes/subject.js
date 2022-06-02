const express = require('express');
const {
    getSubjects, 
    getSubject,
    getMySubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    enrollStudent,
} = require('../controllers/subject');

const reviewRouter = require('./reviews');

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

router.use('/:subjectid/review',reviewRouter);

router
    .route('/')
    .get(protect, getSubjects)
    .post(protect, authorize('teacher'), createSubject);

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

    // router.post("/teachers/:teacherid/reviews", addReview);
// router.put("/teachers/:teacherid/reviews/:reviewid", updateReview);
// router.delete("/teachers/:teacherid/reviews/:reviewid", deleteReview);

module.exports = router;