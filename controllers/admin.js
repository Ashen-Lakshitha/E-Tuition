const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all users count by role
//URL admin/
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
                success: true, 
                data: [
                {count: teachers.length,
                name: "Teachers",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOEuaL14xHFILfpNxSISzrJE3bnBckLdpHvA&usqp=CAU",},
                {count: students.length,
                name:  "Students",
                image: "https://img.freepik.com/free-vector/noisy-big-megaphone_74855-7630.jpg?w=2000",},
                {count: subjects.length,
                name: "Classes",
                image: "https://img.freepik.com/free-vector/focused-tiny-people-reading-books_74855-5836.jpg?w=2000",}]
            });

    } catch (error) {
        next(error);
    }
};

//GET get all teachers
//URL admin/teachers
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
//URL admin/students
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
//URL admin/req
//Private admin only
exports.getSignupReq = async (req, res, next) => {
    try {
        const teachers = await User.find({role: 'teacher', isPending: true});

        res.status(200).json({
           success: true,
           data: teachers
        });
        
    } catch (error) {
        next(error);
    }
}

//PUT update user by admin
//URL admin/:userid
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

//PUT verify teacher
//URL admin/:userid/verify
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
//Private admin only
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