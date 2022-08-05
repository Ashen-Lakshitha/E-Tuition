const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');

//GET get all quizzes for subject
//URL /subject/:subjectid/quiz
//private teacher only
exports.getQuizzes = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);
        
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to view quiz`, 
                    401
                )
            );
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
//URL quiz/:quizid
//Private
exports.getQuiz = async (req,res,next)=>{
    try {
        let quiz;
        let isSubmitted = false;
        quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }

        if(req.user.role == 'student'){
            quiz.submissions.forEach(element => {
                if(element.student == req.user.id ){
                    isSubmitted = true;
                }
            });

            res.status(200).json({
                success: true, 
                data: {quiz, isSubmitted},
            });
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
            res.status(200).json({
                success: true, 
                data: quiz,
            });
        }


    } catch (error) {
        next(error);
    }
};

//GET get student answers
//URL quiz/:quizid/answers
//Private
exports.getMyAnswers = async (req,res,next)=>{
    try {
        let quiz;
        quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }

        let answers;
        let correctAnswers = [];
        let totalMarks = 0;
        quiz.submissions.forEach(element => {
            
            if(element.student == req.user.id ){
                answers = element.answers;
                for (let i = 0; i < answers.length; i++) {
                    for (let j = 0; j < quiz.questions.length; j++) {
                        console.log(answers[i],quiz.questions[j]);
                        if(answers[i]['question'] == quiz.questions[j]['_id']){
                            correctAnswers.push({
                                "question": quiz.questions[j],
                                "givenAns": answers[i]['answer'],
                            })
                            if(answers[i]['answer'] == quiz.questions[j]['correctAnswer']){
                                totalMarks += quiz.questions[j]['mark'];
                            }
                        }
                        
                    }
                    
                }
            }
        });

        res.status(200).json({
            success: true, 
            data: {correctAnswers, totalMarks},
        });

    } catch (error) {
        next(error);
    }
};

//GET get answers for a student
//URL quiz/:quizid/:stdid/answers
//Private
exports.getAnswers = async (req,res,next)=>{
    try {
        let quiz;
        quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }

        let answers;
        let correctAnswers = [];
        let totalMarks = 0;
        quiz.submissions.forEach(element => {
            if(element.student == req.params.stdid ){
                answers = element.answers;
                for (let i = 0; i < answers.length; i++) {
                    for (let j = 0; j < quiz.questions.length; j++) {
                        if(answers[i]['question'] == quiz.questions[j]['_id']){
                            correctAnswers.push({
                                "question": quiz.questions[j],
                                "givenAns": answers[i]['answer'],
                            })
                            if(answers[i]['answer'] == quiz.questions[j]['correctAnswer']){
                                totalMarks += quiz.questions[j]['mark'];
                            }
                        }
                        
                    }
                    
                }
            }
        });

        res.status(200).json({
            success: true, 
            data: {correctAnswers, totalMarks},
        });

    } catch (error) {
        console.log(error)
        next(error);
    }
};

//GET get submissions for single quiz
//URL quiz/:quizid/submit
//Private
exports.getSubmissions = async (req,res,next)=>{
    try {
        var quiz = await Quiz.findById(req.params.quizid).populate({
            path: 'submissions',
            populate:({
                path: 'student',
                select: 'name email'
            })
        });

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: {
                submissions: quiz.submissions,
                count: quiz.submissions.length
            },
        });
        
    } catch (error) {
        next(error);
    }
};

//POST create quiz
//URL /subjects/:subjectid/quiz
//Private teacher only
exports.createQuiz = async (req,res,next)=>{
    try {

        const subject = await Subject.findById(req.params.subjectid);
        if(!subject){
            return next(new ErrorResponse('Subject not found', 404));
        }
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to create quiz`, 
                    401
                )
            );
        }
        req.body.teacher = req.user._id;
        req.body.subject = req.params.subjectid
        await Quiz.create(req.body);
        
        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//PUT update quiz
//URL quiz/:quizid
//Private teacher only
exports.updateQuiz = async (req,res,next)=>{
    try {
        let quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found`, 404));
        }
        
        if(quiz.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(`User is not authorized to update quiz`, 401)
                    );
        }
        
        if(quiz.submissions != []){
            return next(new ErrorResponse(`Students have already submitted answers`, 404));
        }

        quiz = await Quiz.findByIdAndUpdate(req.params.quizid, req.body, {
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

//PUT submit quiz
//URL quiz/:quizid/submit
//Private student only
exports.submitQuiz = async (req,res,next)=>{
    try {
        let quiz = await Quiz.findById(req.params.quizid);

        if(!quiz){
            return next(new ErrorResponse(`Quiz not found id with ${req.params.quizid}`, 404));
        }
        
        req.body.student = req.user.id;
        await quiz.submissions.push(req.body);
        await quiz.save();
                
        res.status(200).json({
            success: true, 
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