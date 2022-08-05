const express = require('express');
const {
    viewQuizzes, 
    submitAns,
} = require('../controllers/answer');

const router = express.Router({mergeParams:true});

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, viewQuizzes)
    .post(protect, authorize('teacher'), submitAns);

module.exports = router;