const Message = require("../models/Message");
const User = require('../models/User');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');

exports.myChats = async(req,res,next)=>{
    try {
        let chats;
        if(req.user.role == "student"){
            chats = await Message.find({student: req.user._id}).populate({
                path: 'teacher',
                select: 'name photo'
            }).populate({
                path: 'subject',
                select: 'subject'
            });
        }else{
            chats = await Message.find({teacher: req.user._id}).populate({
                path: 'student',
                select: 'name photo'
            }).populate({
                path: 'subject',
                select: 'subject'
            });
        }
        res.status(200).json({
            success: true,
            data: chats
        });
    } catch (error) {
        next(error);
    }
}

//Create messages ?
exports.createChat =  async(req,res,next)=>{
    try{
        if(req.user.role == 'student'){
            const chat = await Message.findOne({teacher: req.params.userid, student: req.user._id});
            if(chat == null){
                try {
                    const subject = await Subject.findById(req.params.subjectid);
                    req.body.teacher = subject.teacher;
                    req.body.student = req.user._id;
                    req.body.subject = req.params.subjectid;
                    req.body.msg.role = req.user.role;

                    await Message.create(req.body);
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                    next(error);
                }
            }else{
                try {
                    req.body.msg.role = req.user.role;
                    await chat.msg.push(req.body.msg);
                    await chat.save();
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                    next(error);
                }
            }
        }else{
            const chat = await Message.findOne({student: req.params.userid, teacher: req.user._id});
            console.log(chat);
            if(!chat){
                try {
                    const subject = await Subject.findById(req.params.subjectid);
                    req.body.teacher = req.user._id;
                    req.body.student = req.params.userid;
                    req.body.subject = req.params.subjectid;

                    var msg = await Message.create(req.body);
                    await msg.msg.push({"role": req.user.role, "msg": req.body.msg});
                    
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                    next(error);
                }
            }else{
                try {
                    req.body.msg.role = req.user.role;
                    await chat.msg.push(req.body.msg);
                    await chat.save();
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                    next(error);
                }
            }
        }
    } catch (error) {
        next(error);
    }
}

//get unique chat documents ?
exports.viewUniqueChat = async (req,res,next)=>{ 
    try{ 
        if(req.user.role == "student"){
            const chat = await Message.findOne({teacher: req.params.userid, student: req.user._id}).populate({
                path: 'teacher',
                select: 'name'
            });

            if(!chat){
                return next(new ErrorResponse(`Chat not found `, 404));
            }
            
            res.status(200).json({
                success: true,
                data: chat.msg
            })
            
        }else{
            const chat = await Message.findOne({student: req.params.userid, teacher: req.user._id}).populate({
                path: 'student',
                select: 'name'
            });

            if(!chat){
                return next(new ErrorResponse(`Chat not found `, 404));
            }

            res.status(200).json({
                success: true,
                data: chat.msg
            })
        }
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

exports.deleteChat = async (req,res,next)=>{
    try {
        await Message.findByIdAndDelete(req.params.chatid);
        
        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
}
