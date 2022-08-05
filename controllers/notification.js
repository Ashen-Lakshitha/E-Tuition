const Notification = require("../models/notification");
const ErrorResponse = require('../utils/errorResponse');

//GET get all notification for a teacher
//URL /notification
//GET get all notification for a subject
//URL subject/:subjectid/notification
//Private
exports.viewNotifications = async (req, res, next) => {
    try {
     if(req.params.subjectid){
       const notificationList = await Notification.findOne({subjectid: req.params.subjectid});
        if(notificationList){
            res.status(200).json({
                success: true,
                data: notificationList.notifications
             });
        }else{
            res.status(200).json({
                success: true,
                data: []
             });
        }
    }else{
        if(req.user.role == "teacher"){
            const notificationList = await Notification.findOne({teacherid: req.user.id});

            res.status(200).json({
           success: true,
           data: notificationList.notifications
        });
        }else{
            var notificationList;
            var all = [];
            req.user.enrolledSubjects.forEach(async element => {
                notificationList = await Notification.findOne({subjectId: element.subject});
                if(notificationList != null){
                    all.push(notificationList.notifications);
                }
                
            });
            
            
            res.status(200).json({
           success: true,
           data: all
        });
        }
        
    }  
    } catch (error) {
        next(error);
    }
};

//GET get single notification
//URL /notification/notificationid
//Private
exports.viewNotification = async (req, res, next) => {
    try {
     
        const notification = await Notification.findById(req.params.notificationid);
        if(!notification){
            return next(new ErrorResponse(`Notification not found`, 404));
        }

        res.status(200).json({
           success: true,
           data: notification
        });
    } catch (error) {
        next(error);
    }
};

//POST create notification
//URL /notification
//Private
exports.createNotification =  async(req,res,next)=>{
    try{
        const notificationList = await Notification.findOne({subjectid: req.params.subjectid});
        if(notificationList == null){
            try {
                req.body.teacherId = req.user.id;
                req.body.subjectId = req.params.subjectid;
             
                const noti = await Notification.create(req.body);
                await noti.notifications.push(req.body);
                await noti.save();
                
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        }else{
            try {
                await notificationList.notifications.push(req.body);
                await notificationList.save();
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        }
    }catch (error) {
        next(error);
    }
}

//POST delete notification
//URL /notification/:notificationid
//Private
exports.deleteNotification =  async(req,res,next)=>{
    try{
        const notificationList = await Notification.findOne({teacherId: req.user.id});
        if(!notificationList){
            return next(new ErrorResponse(`Notification not found`, 404));
        }else{
            try {
                await Notification.findOneAndUpdate({"teacherId": req.user.id}, 
                {"$pull": {"notifications": {"_id": req.params.notificationid}}});
                
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        }
    }catch (error) {
        next(error);
    }
}