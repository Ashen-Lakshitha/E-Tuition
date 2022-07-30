const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    stream:{
        type:String,
        enum:[
            'Science',
            'Technology',
            'Art',
            'Commerce'
        ],
        required:[true, 'Please add a stream']
    },
    subject: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: 50
    },
    post:{
        id : {
            type:String,
            default: null
        },
        name : String,
        mimeType : String,
        webViewLink : String,
        webContentLink : String
    },
    subtopic: {
        type: String,
        default: null,
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
        ],
        required:[true, 'Please add a type']
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
            day: {
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
            time: String
    },
    payDate: {
        type:String,
        required: [true, 'Please add a pay date']
    },
    maxStudents: {
        type: Number,
        required: [true, 'Please add a max students']
    },
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
                    date:{ 
                        type: Date,
                        default: Date()
                    },
                    isPaid:{
                        type : Boolean,
                        default: true
                    },
                    amount: Number,
                    paymentType:String
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