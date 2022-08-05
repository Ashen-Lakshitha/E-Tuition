const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
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
    quiz:{
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            correctAns:Number

        }
    ],
    marks:Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Answer', AnswerSchema);