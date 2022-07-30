const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
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
            option_1: {
                    optId: {
                        type: Number,
                        required: true
                    },
                    answer: {
                        type: String,
                        required: true,
                    }
            },
            option_2: {
                    optId: {
                        type: Number,
                        required: true
                    },
                    answer: {
                        type: String,
                        required: true,
                    }
            },
            option_3: {
                    optId: {
                        type: Number,
                        required: true
                    },
                    answer: {
                        type: String,
                        required: true,
                    }
            },
            option_4: {
                    optId: {
                        type: Number,
                        required: true
                    },
                    answer: {
                        type: String,
                        required: true,
                    }
            },
            correctAnswer: {
                type: Number,
                required: true
            },
            mark:{
                type: Number,
                required: true
            }
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
            },
            answers: [
                {
                    question: String,
                    answer: Number
                }
            ],
            totalMarks:Number
        }
    ],
    description:{
        type: String,
        default: null
    },
    duration: Number,
    closingDate: Date,
    isClosed:{
        type: Boolean,
        default: false
    },
},{timestamps:true});

module.exports = mongoose.model('Quiz', QuizSchema);