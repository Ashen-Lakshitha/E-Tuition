const mongoose =require('mongoose');
const NotificationSchema = new mongoose.Schema({
   
    teacherId:{
        type: String,
    },
    subjectId:{
        type: String,
    },
    notifications:[
        {
            title:{
                type: String,
                required:true
            },
            
            description:{
                type: String,
                required:true
            },
            time:{
                type: Date,
                default: Date.now()
            },
            
        }
    ],
})

module.exports = mongoose.model('Notification', NotificationSchema); 