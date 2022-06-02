const express = require('express');
const {
    getReviews,   
} = require('../controllers/reviews');

const router = express.Router({mergeParams: true});
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get( getReviews);


module.exports = router;