const mongoose = require('mongoose');

const lmsSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        // required: true
    },
    mtitle: {
        type: String,
        required: [true, 'Please add a title'],
    },
    content: [
    {
        stitle: {
            type: String,
            required: [true, 'Please add a title'],
        },
        document: {
            type: String,
            // required: [true, 'Please add a document'],
        }
    }
    ],
    description: {
        type: String,
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Lms', lmsSchema); 