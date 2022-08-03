const express=require('express');

const {
    createNotification,
    viewNotifications,
    viewNotification
} = require('../controllers/notification');

const { protect, authorize } = require('../middleware/auth');
const router =express.Router({mergeParams: true});


router.route('/')
    .post(protect,createNotification);

router
    .route('/')
    .get(protect,viewNotifications);

    router
    .route('/:notificationid')
    .get(protect,viewNotification);
    
module.exports = router;
