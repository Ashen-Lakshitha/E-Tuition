const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        trim: true,
        required:true
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    subject:{
        type: mongoose.Schema.ObjectId,
        ref: 'Suject',
        required: true
    },
    questions:[
        {
            question: {
                type: String,
                required: [true, 'Please add a question'],
                trim: true,
            },
            options: [
                {
                    opt: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true,
                        default: false
                    }
                }
            ]
        }
    ],
    submissions: [
        {
            student: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    duration: Date,
    closingDate: Date,
    isClosed:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);