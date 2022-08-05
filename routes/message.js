const express=require('express');

const {
    myChats,
    viewUniqueChat,
    createChat, 
    deleteChat,  
} = require('../controllers/message');

const { protect, authorize } = require('../middleware/auth');
const router =express.Router({mergeParams: true});


router.route('/')
    .get(protect, myChats);

router
    .route('/viewchat')
    .get(protect,viewUniqueChat);

router.route('/mychats/:userid')
    .post(protect,createChat);

router.route('/:chatid')
    .delete(protect,deleteChat);


module.exports = router;
