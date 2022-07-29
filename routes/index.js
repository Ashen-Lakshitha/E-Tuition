const express=require('express');

const {
    myChats,
    createChat, //post(chatmsg)
    viewUniqueChat, //post(chatmsg)
    updateMsg,  ///put(chatmsg)
    createSingleChat, //post(singlechat)
    findSinglechatDoc, //post(singlechat)
    updatesinglechat, //put(singlechat)  
    getTeacherList, //get(User)
    getStudentList   //get(User)
} = require('../controllers/chat');

const { protect, authorize } = require('../middleware/auth');
const router =express.Router({mergeParams: true});


router.route('/mychats')
    .get(protect, myChats)
    .post(protect,createChat);

router
    .route('/viewChat')
    .get(protect,viewUniqueChat);

router
    .route('/api/msg/update')
    .put(protect,updateMsg);

router
    .route('/api/msg/singlechat')
    .post(protect,createSingleChat);

router
    .route('/api/msg/findSingleChat')
    .post(protect,findSinglechatDoc);

router
    .route('/api/msg/updatesinglechat')
    .put(protect,updatesinglechat);

router
    .route('/api/getTeachers')
    .get(protect,authorize('student'),getTeacherList);

router
    .route('/api/getStudents')
    .get(protect,authorize('teacher'),getStudentList);

module.exports = router;
