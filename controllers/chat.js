// const chatmsg = require('../models/chatmsg');
// const User = require('../models/User');
// const ErrorResponse = require('../utils/errorResponse');

//create messages
// exports.createMessage =  async(req,res,next)=>{
//     try{
//         req.body.user = req.user.id;
//         const messages = await chatmsg.create(req.body);
    
//         res.status(200).json({
//             success: true, 
//             data: messages
//         });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }


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


//get a single chat
// exports.getSinglechat = async (req,res,next)=>{
//     try {
//         const singlechat = await User.findById(req.user.id);

//         res.status(200).json({
//            success: true,
//            data: subjects
//         });
        
//     } catch (error) {
//         next(error);
//     }
//}