const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');

//GET get all quizzes for teacher
//URL /quizzes/sub/:subjectid/
//private
exports.getQuizzes = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);
        if(req.user.role == 'teacher'){
            if(subject.teacher.toString() !== req.user.id){
                return next(
                    new ErrorResponse(
                        `User is not authorized to view quiz`, 
                        401
                    )
                );
            }
        }

        const quizzes = await Quiz.find({subject:req.params.subjectid});

        res.status(200).json({
            success: true,
            count: quizzes.length, 
            data: quizzes
        });

    } catch (error) {
        next(error);
    }
};

//GET get single quiz
//URL quizzes/:quizid
//Private
exports.getQuiz = async (req,res,next)=>{
    try {
        let quiz;

        quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }

        if(req.user.role == 'teacher'){
            if(quiz.teacher.toString() !== req.user.id){
                return next(
                    new ErrorResponse(
                        `User is not authorized to view quiz`, 
                        401
                    )
                );
            }
        }

        res.status(200).json({
            success: true, 
            data: quiz,
        });

    } catch (error) {
        next(error);
    }
};

//POST create quiz
//URL /quizzes
//Private teacher only
exports.createQuiz = async (req,res,next)=>{
    try {
        
        req.body.teacher = req.user.id;
        
        let quiz = await Quiz.create(req.body);
        
        res.status(200).json({
            success: true, 
            data: quiz
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//PUT update quiz
//URL quizzes/:quizid
//Private teacher only
exports.updateQuiz = async (req,res,next)=>{
    try {
        let quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }
        
        // make sure user is quiz owner
        if(quiz.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update a quiz with id ${req.params.quizid}`, 
                    401
                    )
                    );
                }
                
        quiz = await Quiz.findByIdAndUpdate(req.params.quizid, req.body, {
            new: true,
            runValidators: true
        });
                
        res.status(200).json({
            success: true, 
            data: quiz
        });

    } catch (error) {
        next(error);
    }
};

//PUT update single question
//URL quizzes/:quizid/:questionid
//Private teacher only
exports.updateQuestion = async (req,res,next)=>{
    try {
        let quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }
        
        // make sure user is quiz owner
        if(quiz.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update a quiz with id ${req.params.quizid}`, 
                    401
                )
            );
        }

        let question = quiz.questions.id(req.params.questionid);
        question.set(req.body);
        await quiz.save();
        
        res.status(200).json({
            success: true, 
            data: question
        });

    } catch (error) {
        next(error);
    }
};


//DELETE delete quiz
//URL /quiz/:quizid
//Private teacher only
exports.deleteQuiz = async (req,res,next)=>{
    try {
        const quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found`, 404));
        }

        //make sure user is subject owner
        if(quiz.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to delete a quiz`, 
                    401
                )
            );
        }


        await quiz.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};

//DELETE delete single question
//URL /quiz/:quizid/:qustionid
//Private teacher only
exports.deleteQuestion = async (req,res,next)=>{
    try {
        const quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found`, 404));
        }

        //make sure user is subject owner
        if(quiz.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to delete a quiz`, 
                    401
                )
            );
        }


        await quiz.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};