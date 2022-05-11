const express = require('express');
const {
    getQuizzes, 
    getQuiz,
    createQuiz,
    updateQuiz,
    updateQuestion,
    deleteQuiz,
    deleteQuestion
} = require('../controllers/quiz');

const router = express.Router({mergeParams:true});
//include other routes
const ansRoute = require('./answer');

//re-route
router.use('/answers', ansRoute);

const { protect, authorize } = require('../middleware/auth');

router
    .route('/sub/:subjectid')
    .get(protect, getQuizzes);
    
router.route('/')
    .post(protect, authorize('teacher'), createQuiz);
    
router
    .route('/:quizid')
    .get(protect, getQuiz)
    .put(protect, authorize('teacher'), updateQuiz)
    .delete(protect, authorize('teacher'), deleteQuiz);

router
    .route('/:quizid/:questionid')
    .put(protect, authorize('teacher'), updateQuestion)
    .delete(protect, authorize('teacher'), deleteQuestion);

module.exports = router;