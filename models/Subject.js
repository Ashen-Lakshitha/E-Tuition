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
    period:[
        {
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
        }
    ],
    maxStudents: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: Number,
    review: [
        {
            text: String,
            rate:{
                type: Number,
                min: 1,
                max: 10
            },
            student:{
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ],
    enrolledStudents:[
        {
            student: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            isPaid: {
                type : Boolean,
                default: false
            },
            isEnrolled:{
                type : Boolean,
                default: true
            },
            enrolledDate:Date,
            paidDate:{
                type: Date,
                default: Date.now
            },
            paidMonth:String
        }
    ]
});


// //static method to get avg of course tuitions
// CourseSchema.statics.getAverageCost = async function(bootcampId){
//     const obj = await this.aggregate([
//         {
//             $match: {bootcamp: bootcampId}
//         },
//         {
//             $group: {
//                 _id: '$bootcamp',
//                 averageCost: {$avg: '$tuition'}
//             }
//         }
//     ]);
//     try {
//         await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
//             averageCost: Math.ceil(obj[0].averageCost / 10) *10
//         });
//     } catch (error) {
//         console.error(error);
//     }
// };

// //calculate average after save courses
// CourseSchema.post('save', function(){
//     this.constructor.getAverageCost(this.bootcamp);
// });

// //calculate average before remove courses
// CourseSchema.pre('remove', function(){
//     this.constructor.getAverageCost(this.bootcamp);
// });

module.exports = mongoose.model('Subject', SubjectSchema);