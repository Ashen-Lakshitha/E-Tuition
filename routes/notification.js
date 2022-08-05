const express=require('express');

const {
    viewNotifications,
    viewNotification,
    createNotification,
    deleteNotification
} = require('../controllers/notification');

const { protect, authorize } = require('../middleware/auth');
const router =express.Router({mergeParams: true});

router
    .route('/')
    .get(protect,viewNotifications);

router
    .route('/:notificationid')
    .get(protect,viewNotification);

router.route('/')
    .post(protect, authorize('teacher'), createNotification);

router
    .route('/:notificationid')
    .delete(protect, authorize('teacher'), deleteNotification);
    
module.exports = router;
