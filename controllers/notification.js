// const notification = require("../models/Notification");
// const Subject = require('../models/Subject');

// //create notification
// exports.createNotification =  async(req,res,next)=>{
//     try{
//         //if(req.user.role == 'teacher'){
//             const notificationList = await notification.findOne({subjectid: req.params.subjectid});
//             if(notificationList == null){
//                 try {
//                     // const subject = await Subject.findById(req.params.subjectid);
//                     req.body.teacherId = req.user.id;
//                     req.body.subjectId = req.params.subjectid;
                   
//                     await notification.create(req.body);
//                     res.status(200).json({
//                         success: true
//                     });
//                 } catch (error) {
//                     next(error);
//                 }
//             }else{a
//                 try {
//                     await notificationList.notifications.push(req.body.notification);
//                     await notificationList.save();
//                     res.status(200).json({
//                         success: true
//                     });
//                 } catch (error) {
//                     next(error);
//                 }
//             }
//         //} 
//     }catch (error) {
//         next(error);
//     }
// }

// //get notification
// exports.viewNotification = async (req, res, next) => {
//     try {
//      if(req.user.role == 'teacher'){
//        const notifications = await notification.find({teacherid: req.user._id});
//         // const notifications = await notification.find({teacherid: '5d7a514b5d2c12c7449be042'});

//         res.status(200).json({
//            success: true,
//            data: notifications
//         });
//     }else{
        
//     }  
//     } catch (error) {
//         next(error);
//     }
// };

const Notification = require("../models/notification");

//create notification
exports.createNotification =  async(req,res,next)=>{
    try{
        //if(req.user.role == 'teacher'){
            const notificationList = await Notification.findOne({subjectid: req.params.subjectid});
            console.log(notificationList);
            if(notificationList == null){
                try {
                    req.body.teacherId = req.user.id;
                    req.body.subjectId = req.params.subjectid;
                    console.log("notification");
                    // let notification = {"title" : req.body.notification.title,
                    //     "description": req.body.notification.description};
                        
                    const noti = await Notification.create(req.body);
                    await noti.notifications.push(req.body);
                    await noti.save();
                   
                    
                    res.status(200).json({
                        success: true
                    });
                } catch (error) {
                    console.log(error);
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
        //} 
    }catch (error) {
        console.log(error);
                next(error);
    }
}

//get notification  subject/:subid/noti/
//no/noid
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
        console.log(error);
        next(error);
    }
};

exports.viewNotification = async (req, res, next) => {
    try {
     
       const notification = await Notification.findById(req.params.notificationid);

        res.status(200).json({
           success: true,
           data: notification
        });
    } catch (error) {
        next(error);
    }
};