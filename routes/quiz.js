const express = require('express');
const {
    getQuizzes, 
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getAnswers
} = require('../controllers/quiz');

const router = express.Router({mergeParams:true});
//include other routes
const ansRoute = require('./answer');

//re-route
router.use('/answers', ansRoute);

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize("teacher"), getQuizzes);
    
router.route('/')
    .post(protect, authorize("teacher"), createQuiz);
    
router
    .route('/:quizid')
    .get(protect, getQuiz)
    .put(protect, authorize('teacher'), updateQuiz)
    .delete(protect, authorize('teacher'), deleteQuiz);

router
    .route('/:quizid/submit')
    .put(protect, authorize('student'), submitQuiz);

router
    .route('/:quizid/answers')
    .get(protect, getAnswers);

module.exports = router;