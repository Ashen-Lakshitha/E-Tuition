const express=require('express');

const { protect, authorize } = require('../middleware/auth');
const {SingleChat,UserMsg} =require('../models/chatmsg');
//const {SingleChat,UserMsg} =require('../models/singlechat');
const User =require('../models/User');

const {
    createMsg, //post(chatmsg)
    findUniqueChat, //post(chatmsg)
    updateMsg,  ///put(chatmsg)
    createSingleChat, //post(singlechat)
    findSinglechatDoc, //post(singlechat)
    updatesinglechat, //put(singlechat)  
    getTeacherList, //get(User)
    getStudentList   //get(User)
} = require('../controllers/chat');

const { apikeys } = require('googleapis/build/src/apis/apikeys');
const { get } = require('mongoose');

const router =express.Router();

router
    .route('/api/msg/save')
    .post(protect,createMsg);

router
    .route('/api/userchat')
    .post(protect,findUniqueChat);

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


// //create a message  
// router.post('/api/msg/save',(req,res)=>{
//     const msg = new UserMsg({
//         uniqeCID :req.body.uniqeCID,
//         sender:req.body.sender,
//         receiver:req.body.receiver,
//         msg:req.body.msg,
//         time:req.body.time,
//         seen:req.body.seen,
//         delivered:req.body.delivered
//     });
//     msg.save((err,data)=>{
//         res.status(200).json({code:200,msg:"msg saved succesfuly",msgData:data});
//     })
// });

// //get unique chat documents
// router.post('/api/userchat',(req,res)=>{
//     //const qurey={$or:[{"uniqeCID":"5d7a514b5d2c12c7449be0415c8a1d5b0190b214360dc031"},{"uniqeCID":"5c8a1d5b0190b214360dc0315d7a514b5d2c12c7449be041"}]};
//     const qurey={$or:[{"uniqeCID": req.body.ab},{"uniqeCID":req.body.ba}]};

//     UserMsg.find(qurey, (err,data)=>{
//         if(!err){
//             res.send(data);
//             console.log(data.length);
//         }else{
//             console.log(err);
//         }
        
//     })
// });

// //update  msg for delivered
// router.put('/api/msg/update',async (req,res,next)=>{
//     try {
//         const msg = await UserMsg.findByIdAndUpdate(req.body.id, req.body, {
//             new: true,
//             runValidators: true
//         });
        
//         res.status(200).json({
//             success: true, 
//             data: msg
//         });
        
//     } catch (error) {
//         next(error);
//     }
// });


// //create a single chat
// router.post('/api/msg/singlechat',(req,res)=>{
//     const singlechat = new SingleChat({
//         uniqchatid :req.body.uniqchatid,
//         sender:req.body.sender,
//         reciever:req.body.reciever,
//         numUnreadmsg:req.body.numUnreadmsg,
//         lastmsg:req.body.lastmsg,
//         lastseentime:req.body.lastseentime,
//         lastmsgtime:req.body.lastmsgtime
        
//     });
//     singlechat.save((err,data)=>{
//         res.status(200).json({code:250,msg:"succesful",datamsg:data});
//     })
// });

// //find a single chat 
// router.post('/api/msg/findSingleChat',
//     async (req,res,next)=>{

//         try {
//             const findCaht = await SingleChat.find({"uniqchatid":req.body.id});
//             res.status(200).json({
//                 success: true, 
//                 data: findCaht
//             });
            
//             console.log(findCaht.length);
    
//         } catch (error) {
//             next(error);
//         }
// });

// //update singlechat
// router.put('/api/msg/updatesinglechat',async (req,res,next)=>{
//     try {
//         const updatesinglechat = await SingleChat.findByIdAndUpdate(req.body.id, req.body, {
//             new: true,
//             runValidators: true
//         });
    
//         res.status(200).json({
//             success: true, 
//             data: updatesinglechat
//         });
        
//     } catch (error) {
//         next(error);
//     }
// });

// //get teachers list
// router.get('/api/getTeachers',
//     async (req,res)=>{

//         try {
//             const users = await User.find({"role":"teacher"});
//             res.send(users);
//             console.log(users.length);
//         } catch (error) {
//             next(error);
//         }
// });

// //get students list
// router.get('/api/getStudents',
//     async (req,res)=>{

//         try {
//             const users = await User.find({"role":"student"});
//             res.send(users);
//             console.log(users.length);    
//         } catch (error) {
//             next(error);
//         }
// });

module.exports = router;

// router.get('/api/getmessage',protect,
//     async (req,res)=>{

//         try {
//             const users = await User.findById(req.user.id);
//             res.send(users);
//             console.log(users.length);
//             // res
//             //     .status(200)
//             //     .json({
//             //         success: true, 
//             //         count: users.length,
//             //         data: users
//             //     });
    
//         } catch (error) {
//             next(error);
//         }
// });

