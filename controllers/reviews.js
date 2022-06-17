const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Subject = require('../models/Subject');

//GET get all reviews for a subject
//URL /subjects/:subjectid/review
//Public
exports.getReviews = async (req,res,next)=>{
    try {
        const reviews = await Review.find({ subject : req.params.subjectid}).populate({
            path: 'student',
            select: 'name photo'
        });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    }catch (error) {
        next(error);
    }
};

//Add review
//URL subjects/:subjectid/reviews
//Private only students
exports.addReview = async (req, res, next) => {
    try {
        req.body.subject = req.params.subjectid;
        req.body.student = req.user.id;

        const subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`No subject found`, 404));
        }
        
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true, 
            data:review
        });
        
    }catch (error) {
        next(error);
    }
};

//PUT update review
//URL /reviews/:id
//Private only students
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if(!review){
            return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
        }

        if(review.student.toString() !== req.user.id){
            return next(new ErrorResponse(`Not Authorize to update the review`, 404));
        }
        
        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true, 
            data:review
        });
        
    }catch (error) {
        next(error);
    }
};

//DELETE delete review
//URL /reviews/:id
//Private only students
exports.deleteReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if(!review){
            return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
        }

        if(review.student.toString() !== req.user.id){
            return next(new ErrorResponse(`Not Authorize to delete the review`, 404));
        }
        
        await Review.remove();

        res.status(200).json({
            success: true, 
            data:{}
        });
        
    }catch (error) {
        next(error);
    }
};