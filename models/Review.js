const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    student:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    subject:{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    rating:{
        type:Number,
        required:true
    },
    Comment:{
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Review', ReviewSchema); 