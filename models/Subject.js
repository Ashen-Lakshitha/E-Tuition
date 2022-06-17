const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    stream:{
        type:String,
        enum:[
            'Science',
            'Technology',
            'Art',
            'Commerce'
        ]
    },
    subject: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: 50
    },
    post:{
        id : String,
        name : String,
        mimeType : String,
        webViewLink : String,
        webContentLink : String
    },
    subtopic: {
        type: String,
        trim : true
    },
    type:{
        type: String,
        enum:[
            "Mass class",
            "Individual class",
            "Group class",
            "Revision",
            "Paper class"
        ]
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    fee: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    period:{
        type: String,
        enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ]
    },
    maxStudents: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: Number,
    enrolledStudents:[
        {
            student: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            payment: [
                {
                    date: Date,
                    month: Date,
                    year: Date,
                    isPaid:{
                        type : Boolean,
                        default: false
                    }
                }
            ],
            isEnrolled:{
                type : Boolean,
                default: true
            },
            enrolledDate:{
                type: Date,
                default: Date.now()
            },
        }
    ]
});

module.exports = mongoose.model('Subject', SubjectSchema);