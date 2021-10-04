const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    fee: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
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
            }
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