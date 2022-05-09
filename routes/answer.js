const express = require('express');
const {
    viewQuizzes, 
    // getSubject,
    // getMySubjects,
    submitAns,
    // updateSubject,
    // deleteSubject,
    // enrollStudent,
} = require('../controllers/answer');

const router = express.Router({mergeParams:true});

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, viewQuizzes)
    .post(protect, authorize('teacher'), submitAns);

// router
//     .route('/mysubjects')
//     .get(protect, authorize('teacher'), getMySubjects);
    
// router
//     .route('/:subjectid')
//     .get(protect, getSubject)
//     .put(protect, authorize('teacher'), updateSubject)
//     .delete(protect, authorize('teacher'), deleteSubject);

// router
//     .route('/:subjectid/enroll')
//     .put(protect, authorize('student'), enrollStudent);

    // router.post("/teachers/:teacherid/reviews", addReview);
// router.put("/teachers/:teacherid/reviews/:reviewid", updateReview);
// router.delete("/teachers/:teacherid/reviews/:reviewid", deleteReview);

module.exports = router;