const express = require('express');
const {
    getSubjects, 
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    enrollStudent
} = require('../controllers/subject');

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getSubjects)
    .post(protect, authorize('teacher'), createSubject);
    
router
    .route('/:subjectid')
    .get(getSubject)
    .put(protect, authorize('teacher'), updateSubject)
    .delete(protect, authorize('teacher'), deleteSubject);

router
    .route('/:subjectid/enroll')
    .put(protect, authorize('student'), enrollStudent);

    // router.post("/teachers/:teacherid/reviews", addReview);
// router.put("/teachers/:teacherid/reviews/:reviewid", updateReview);
// router.delete("/teachers/:teacherid/reviews/:reviewid", deleteReview);

module.exports = router;