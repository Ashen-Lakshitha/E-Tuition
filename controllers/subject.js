const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all subjects(student home page)
//URL /subjects
//GET get all subjects for a teacher(teacher home page)
//URL /users/:userid/subjects
//Public
exports.getSubjects = async (req,res,next)=>{
    try {
        let query;
        if(req.params.userid){
            query = Subject.find({ teacher : req.params.userid}).populate({
                path: 'teacher',
                select: 'name photo',
                
            });
        }
        else{
            query = Subject.find().populate({    //populate - nested data
                path: 'teacher',
                select: 'name photo '      //show only name and description
            });
        }

        const subjects = await query;

        res.status(200).json({
            success: true,
            count: subjects.length, 
            data: subjects
        });

    } catch (error) {
        next(error);
    }
};

//GET get single subject(student class details)
//URL subjects/:subjectid
//Public
exports.getSubject = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid).populate({    //populate - nested data
            path: 'teacher',
            select: 'name email phone about'      //show only name and description
        });

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//POST create subject(teacher add class)
//URL /subjects
//Private teacher only
exports.createSubject = async (req,res,next)=>{
    try {
        req.body.teacher = req.user.id;

        const subject = await Subject.create(req.body);

        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//PUT update subject(teacher update class)
//URL subjects/:subjectid
//Private teacher only
exports.updateSubject = async (req,res,next)=>{
    try {
        let subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }
        
        // make sure user is subject owner
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update a class with id ${req.params.subjectid}`, 
                    401
                    )
                    );
                }
                
        subject = await Subject.findByIdAndUpdate(req.params.subjectid, req.body, {
            new: true,
            runValidators: true
        });
                
        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//PUT enroll to subject
//URL subjects/:subjectid/enroll
//Private students only
exports.enrollStudent = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.user.id);

        req.body.subject = req.params.subjectid;
        req.body.student = req.user.id;

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }
        
        await user.enrolledSubjects.push(req.body);
        await user.save();
        
        await subject.enrolledStudents.push(req.body);
        await subject.save();

        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//DELETE delete class
//URL /subjects/:subjectid
//Private teacher only
exports.deleteSubject = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }

        //make sure user is subject owner
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete a class`, 
                    401
                )
            );
        }


        await subject.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};