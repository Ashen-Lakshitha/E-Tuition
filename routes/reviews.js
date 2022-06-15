const express = require('express');
const {
    getReviews,
    addReview,
    updateReview,
    deleteReview  
} = require('../controllers/reviews');

const router = express.Router({mergeParams: true});
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get( getReviews )
    .post(protect, authorize('student'),addReview );

router
    .route('/:id')
    .put(protect, authorize('student'),updateReview )
    .delete(protect, authorize('student'),deleteReview);

module.exports = router;