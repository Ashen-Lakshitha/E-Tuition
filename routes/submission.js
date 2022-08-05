const express = require('express');
const imageUpload = require('../middleware/multer');
const {
    getSubmissions,
    getMySubmission,
    createSubmission,
    updateSubmission,
    deleteSubmission,
} = require('../controllers/submission');

const router = express.Router({mergeParams:true});

const { protect, authorize } = require('../middleware/auth');

router
    .route('/:assignmentid/all')
    .get(protect, authorize('teacher'), getSubmissions);
    
router
    .route('/:assignmentid')
    .get(protect, authorize('student'), getMySubmission)
    .post(protect, authorize('student'), imageUpload.single('documents'), createSubmission);
    
router
    .route('/:assignmentid/:submissionid')
    .put(protect, authorize('student'), updateSubmission)
    .delete(protect, deleteSubmission);

module.exports = router;