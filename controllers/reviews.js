const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Subject = require('../models/Subject');

//GET get all reviews
//GET get all reviews for a course
//URL /review
//URL /subjects/:subjectid/review
//Public
exports.getReviews = async (req,res,next)=>{
    try {
        //let q = req.query.subject;
        //let query;
        if(req.params.subjectid){
            const reviews = Review.find({ subject : req.params.subjectid});

            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        }
        else{
        res.status(200).json({
            success: true,
        });
    } 
    }catch (error) {
        next(error);
    }
};


//POST create review to the teacher
//URL /:userid/reviews
//Private only students
//exports.addReview = async (req, res, next) => {};

//PUT update review
//URL /:userid/reviews/:reviewid
//Private only students
//exports.updateReview = async (req, res, next) => {}

//DELETE delete review
//URL /:userid/reviews/:reviewid
//Private only students
//exports.deleteReview = async (req, res, next) => {}