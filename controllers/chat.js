const chatmsg = require('../models/chatmsg');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');

const { UserMsg , SingleChat } = require("../models/chatmsg");

//Create messages ?
exports.createMsg =  async(req,res,next)=>{
    try{
        const msg = new UserMsg({
            uniqeCID :req.body.uniqeCID,
            sender:req.body.sender,
            receiver:req.body.receiver,
            msg:req.body.msg,
            time:req.body.time,
            seen:req.body.seen,
            delivered:req.body.delivered
        });
        const respnse = await msg.save((err,data)=>{
            res.status(200).json({code:200,msg:"msg saved succesfuly",msgData:data});
        })
        

        //    const msgDate = req.body;

        //    await msgDate.save((data)=>{
        //             res.status(200).json({
        //                 success: true,
        //                 data: msgDate
        //             });
        //     });

        // req.body.user = req.user.id;
        //  const messages = await chatmsg.create(req.body);
    
        // res.status(200).json(message);

        // let id  = req.params
        // const message = await UserMsg.find( {uniqeCID : id});
        // console.log(message);

    } catch (error) {
        console.log(error);
        next(error);
    }
}

//get unique chat documents ?
exports.findUniqueChat = async (req,res,next)=>{ 
    try{ 
        const qurey={$or:[{"uniqeCID": req.body.ab},{"uniqeCID":req.body.ba}]}; 
 
        const response = await UserMsg.find(qurey); 

        res.send(response); 
                console.log(response.length); 

     }catch(error) { 
         next(error); 
     } 
}

//update  msg for delivered
exports.updateMsg = async (req,res,next)=>{
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
}

//create a single chat ?
exports.createSingleChat = async (req,res,next)=>{
    try{
        //const singlechat = req.body;
        const singlechat = new SingleChat({
            uniqchatid :req.body.uniqchatid,
            sender:req.body.sender,
            reciever:req.body.reciever,
            numUnreadmsg:req.body.numUnreadmsg,
            lastmsg:req.body.lastmsg,
            lastseentime:req.body.lastseentime,
            lastmsgtime:req.body.lastmsgtime
            
        });

        const respnse = await singlechat.save((err,data)=>{
            res.status(200).json({code:250,msg:"succesful",datamsg:data});
        })
        
    }catch(error) {
        next(error);
    }
}

//find a single chat
exports.findSinglechatDoc = async (req,res,next)=>{
    try {
        const findCaht = await SingleChat.find({"uniqchatid":req.body.id});
        // console.log(findCaht);
        // if(findCaht == []){
        //     res.status(200).json({
        //         success: true, 
        //         data: findCaht,
        //         datahave: false
        //     });
        // }else{
        //     res.status(200).json({
        //         success: true, 
        //         data: findCaht,
        //         datahave: true
        //     });

        // }

        res.status(200).json({
            success: true, 
            data: findCaht,
            datahave: findCaht.length
        });
        
        console.log(findCaht.length);

    } catch (error) {
        next(error);
    }
}

//update singlechat
exports.updatesinglechat = async (req,res,next)=>{
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
    }}


//get teachers list
exports.getTeacherList = async (req,res,next)=>{
    try {
        const users = await User.find({"role":"teacher"});
        res.send(users);
        console.log(users.length);
    } catch (error) {
        
        console.log(error);
        next(error);
    }
}

//get students list
exports.getStudentList = async (req,res,next)=>{
    try {
        const users = await User.find({"role":"student"});
        res.send(users);
        console.log(users.length);    
    } catch (error) {
        
        console.log(error);
        next(error);
    }
}






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
// }
