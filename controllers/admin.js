const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all users count by role
//URL /
//Private admin only
exports.getUsers = async (req,res,next)=>{

    try {
        const teachers = await User.find({role: "teacher"});
        const students = await User.find({role: "student"});
        const subjects = await Subject.find();
        res
            .status(200)
            .json({
                success: true, 
                data: [
                {count: teachers.length},
                {count: students.length},
                {count: subjects.length}]
            });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//GET get all teachers
//URL /teachers
//Private admin only
exports.getTeachers = async (req,res,next)=>{

    try {
        const teachers = await User.find({role: "teacher"});
        res
            .status(200)
            .json({
                success: true, 
                data: teachers
            });

    } catch (error) {
        next(error);
    }
};

//GET get all students
//URL /students
//Private admin only
exports.getStudents = async (req,res,next)=>{

    try {
        const students = await User.find({role: "student"});
        res
            .status(200)
            .json({
                success: true, 
                data: students
            });

    } catch (error) {
        next(error);
    }
};

//GET get all requests when sign up
//URL /req
//Private admin only
exports.getSignupReq = async (req, res, next) => {
    try {
        const student = await User.find({role: 'teacher', isPending: true});

        res.status(200).json({
           success: true,
           data: student
        });
        
    } catch (error) {
        next(error);
    }
}

//PUT update user
//URL /:userid
//Private admin only
exports.updateUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.userid, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true, 
        });
        
    } catch (error) {
        next(error);
    }
};

//PUT update user
//URL /:userid/verify
//Private admin only
exports.verifyTeacher = async (req,res,next)=>{
    try {
        req.body.isPending = false;
        await User.findByIdAndUpdate(req.params.userid, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true, 
        });
        
    } catch (error) {
        next(error);
    }
};

//DELETE delete user
//URL /user/:userid
//Private
exports.deleteUser = async (req,res,next)=>{
    try {
        await User.findByIdAndDelete(req.params.userid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};

//DELETE delete subject
//URL /subject/:subjectid
//Private
exports.deleteClass = async (req,res,next)=>{
    try {
        await Subject.findByIdAndDelete(req.params.subjectid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};

