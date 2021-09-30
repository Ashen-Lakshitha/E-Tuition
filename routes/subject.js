const express = require('express');
const {
    getSubjects, 
    getSubject
} = require('../controllers/subject');

const router = express.Router({mergeParams: true});

// const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getSubjects);
    // .post(protect, authorize('publisher', 'admin'), createCourse);
    
router
    .route('/:subjectid')
    .get(getSubject);
//     .put(protect, authorize('publisher', 'admin'), updateCourse)
//     .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;