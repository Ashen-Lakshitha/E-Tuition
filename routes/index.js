const express=require('express');
//const router =express.Router();

const { protect, authorize } = require('../middleware/auth');
const {ChatMsg,SingleChat,UserMsg} =require('../models/chatmsg');
const User =require('../models/User');

const {
    createMessage,
    getSinglechat,
} = require('../controllers/chat');
const { apikeys } = require('googleapis/build/src/apis/apikeys');

const router =express.Router();

//get unique chat documents

router.post('/api/userchat',(req,res)=>{
    //const qurey={$or:[{"uniqeCID":"5d7a514b5d2c12c7449be0415c8a1d5b0190b214360dc031"},{"uniqeCID":"5c8a1d5b0190b214360dc0315d7a514b5d2c12c7449be041"}]};
    const qurey={$or:[{"uniqeCID": req.body.ab},{"uniqeCID":req.body.ba}]};

    UserMsg.find(qurey, (err,data)=>{
        if(!err){
            res.send(data);
            console.log(data.length);
        }else{
            console.log(err);
        }
        
    })
});

//create a message 
router.post('/api/msg/save',(req,res)=>{
    const msg = new UserMsg({
        uniqeCID :req.body.uniqeCID,
        sender:req.body.sender,
        receiver:req.body.receiver,
        msg:req.body.msg,
        time:req.body.time,
        seen:req.body.seen,
        delivered:req.body.delivered
    });
    msg.save((err,data)=>{
        res.status(200).json({code:200,msg:"msg saved succesfuly",msgData:data});
    })
});

//
router.put('/api/msg/update',async (req,res,next)=>{
    try {
        const msg = await UserMsg.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true, 
            data: msg
        });
        
    } catch (error) {
        next(error);
    }
});


//create a single chat
router.post('/api/msg/singlechat',(req,res)=>{
    const singlechat = new SingleChat({
        uniqchatid :req.body.uniqchatid,
        sender:req.body.sender,
        reciever:req.body.reciever,
        numUnreadmsg:req.body.numUnreadmsg,
        lastmsg:req.body.lastmsg,
        lastseentime:req.body.lastseentime,
        lastmsgtime:req.body.lastmsgtime
        
    });
    singlechat.save((err,data)=>{
        res.status(200).json({code:250,msg:"succesful",datamsg:data});
    })
});

//find a single chat
router.post('/api/msg/findSingleChat',
    async (req,res)=>{

        try {
            const findCaht = await SingleChat.find({"uniqchatid":req.body.id});
            res.status(200).json({
                success: true, 
                data: findCaht
            });
            console.log(findCaht.length);
    
        } catch (error) {
            next(error);
        }
});

//update singlechat
router.put('/api/msg/updatesinglechat',async (req,res,next)=>{
    try {
        const updatesinglechat = await SingleChat.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
            runValidators: true
        });
    
        res.status(200).json({
            success: true, 
            data: updatesinglechat
        });
        
    } catch (error) {
        next(error);
    }
});



// router
//     .route('/api/msg/save')
//     .post(protect,createMessage);

// router
//     .route('/api/userchat')
//     .get(protect,getSinglechat);

//Get All Msg
// router.get('/api/msgs',(req,res)=>{
//     UserMsg.find({},(err,data)=>{
//         if(!err){
//             res.send(data);
//            // res.send('Hi,I am responded');
//         }else{
//             console.log(err);
//         }
//     })
// });


//get teachers list
router.get('/api/getTeachers',
    async (req,res)=>{

        try {
            const users = await User.find({"role":"teacher"});
            res.send(users);
            console.log(users.length);
            // res
            //     .status(200)
            //     .json({
            //         success: true, 
            //         count: users.length,
            //         data: users
            //     });
    
        } catch (error) {
            next(error);
        }
});

//get students list
router.get('/api/getStudents',
    async (req,res)=>{

        try {
            const users = await User.find({"role":"student"});
            // res
            //     .status(200)
            //     .json({
            //         success: true, 
            //         count: users.length,
            //         data: users
            //     });
            res.send(users);
            console.log(users.length);
    
        } catch (error) {
            next(error);
        }
});




// router.post('/api/msg/add',(req,res)=>{
//     const msg = new ChatMsg({
//         name:req.body.name,
//         email:req.body.email,
//         age:req.body.age
//     });
//     msg.save((err,data)=>{
//         res.status(200).json({code:200,msg:"msg save succesfuly",msgData:data});
//     })
// });

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





module.exports = router;