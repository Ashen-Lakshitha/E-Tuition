const Test = require("../models/chatmsg");
const User = require('../models/User');
const Subject = require('../models/Subject');
// const ErrorResponse = require('../utils/errorResponse');
// const {uploadFiles, deleteFile} = require('../utils/service');


exports.myChats = async(req,res,next)=>{
    try {
        let chats;
        if(req.user.role == "student"){
            chats = await Test.find({student: req.user._id}).populate({
                path: 'teacher',
                select: 'name photo'
            }).populate({
                path: 'subject',
                select: 'subject'
            });
        }else{
            chats = await Test.find({teacher: req.user._id}).populate({
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
            const chat = await Test.findOne({subject: req.params.subjectid, student: req.user._id});
            if(chat == null){
                try {
                    const subject = await Subject.findById(req.params.subjectid);
                    req.body.teacher = subject.teacher;
                    req.body.student = req.user._id;
                    req.body.subject = req.params.subjectid;
                    req.body.msg.role = req.user.role;

                    await Test.create(req.body);
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
            const chat = await Test.findOne({subject: req.params.subjectid, teacher: req.user._id});
            if(chat == null){
                try {
                    const subject = await Subject.findById(req.params.subjectid);
                    req.body.teacher = req.user._id;
                    // req.body.student = req.user._id;
                    req.body.subject = req.params.subjectid;
                    req.body.msg.role = req.user.role;

                    await Test.create(req.body);
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
    console.log("Step1");
    try{ 
        if(req.user.role == "student"){
            console.log("Step2");
            const chat = await Test.findOne({subject: req.params.subjectid, student: req.user._id}).populate({
                path: 'teacher',
                select: 'name'
            });
            res.status(200).json({
                success: true,
                data: chat.msg
            })
            
        }else{
            console.log("Step3");
            const chat = await Test.findOne({subject: req.params.subjectid, teacher: req.user._id}).populate({
                path: 'student',
                select: 'name'
            });
            res.status(200).json({
                success: true,
                data: chat.msg
            })
        }
     }catch(error) { 
        console.log(error)
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