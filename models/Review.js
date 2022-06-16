const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    subject:{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true,
    },
    student:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    rating:{
        type:Number,
        min: 1,
        max: 5,
        required:true
    },
    comment:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

//unable user to submit more than one review for a class
ReviewSchema.index({ subject: 1, student: 1 }, { unique:true, dropDups: true });

//static method to get avg of ratings
ReviewSchema.statics.getAverageRating = async function(subjectid){
    const obj = await this.aggregate([
        {
            $match: {subject: subjectid}
        },
        {
            $group: {
                _id: '$subject',
                averageRating: {$avg: '$rating'}
            }
        }
    ]);
    try {
        await this.model('Subject').findByIdAndUpdate(subjectid, {
            averageRating: obj[0].averageRating 
        });
    } catch (error) {
        console.error(error);
    }
};

//calculate average after save courses
ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.subject);
});

//calculate average before remove courses
ReviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.subject);
});

module.exports = mongoose.model('Review', ReviewSchema); 