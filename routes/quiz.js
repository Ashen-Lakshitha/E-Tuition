const express = require('express');
const {
    getQuizzes, 
    getQuiz,
    getSubmissions,
    createQuiz,
    updateQuiz,
    closeQuiz,
    deleteQuiz,
    submitQuiz,
    getMyAnswers,
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

router.route('/:quizid/close')
    .put(protect, authorize('teacher'), closeQuiz);

router
    .route('/:quizid/submit')
    .get(protect, authorize('teacher'), getSubmissions)
    .put(protect, authorize('student'), submitQuiz);

router
    .route('/:quizid/answers')
    .get(protect, getMyAnswers);

router
    .route('/:quizid/:stdid/answers')
    .get(protect, getAnswers);

module.exports = router;