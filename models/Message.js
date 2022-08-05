const mongoose =require('mongoose');

const MessageSchema = new mongoose.Schema({
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    student:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    subject:{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    },
    msg:[
        {
            role: String,
            text:{
                type: String,
                required:true
            },
            time:{
                type: Date,
                default: Date.now()
            },
            seen:Boolean,
            delivered:Boolean
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Message', MessageSchema); 