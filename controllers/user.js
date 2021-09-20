const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all teachers
//URL /teachers
//Private only admin
exports.getTeachers = async (req,res,next)=>{
    try {
        console.log(req);
        const teachers = await User.find().where({role:'teacher'});
        res
            .status(200)
            .json({
                success: true, 
                count: teachers.length,
                data: teachers
            });

    } catch (error) {
        next(error);
    }
};

//GET get single teacher
//URL teachers/:teacherid
//Private admin only
exports.getTeacher = async (req,res,next)=>{
    try {
        const teacher = await User.findById(req.params.teacherid);

        if(!teacher){
            return next(new ErrorResponse(`Teacher not found id with ${req.params.teacherid}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: teacher
        });

    } catch (error) {
        next(error);
    }
};

//POST create teacher
//URL teachers
//Private 
exports.createTeacher = async (req,res,next)=>{
    try {
        const teacher = await User.create(req.body);

        res.status(200).json({
            success: true, 
            data: teacher
        });

    } catch (error) {
        next(error);
    }
};

//PUT update teacher
//URL teachers/:teacherid
//Private
exports.updateTeacher = async (req,res,next)=>{
    try {
        const teacher = await User.findByIdAndUpdate(req.params.teacherid, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true, 
            data: teacher
        });

    } catch (error) {
        next(error);
    }
};

//DELETE delete teacher
//URL teachers/:teacherid
//Private
exports.deleteTeacher = async (req,res,next)=>{
    try {
        const teacher = await User.findByIdAndDelete(req.params.teacherid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};

//GET get all students
//URL /students
//Private only admin
exports.getStudents = async (req,res,next)=>{
    try {
        const students = await User.find().where({role:"student"});
        res
            .status(200)
            .json({
                success: true, 
                count: students.length,
                data: students
            });

    } catch (error) {
        next(error);
    }
};

//GET get single student
//URL students/:studentid
//Private admin only
exports.getStudent = async (req,res,next)=>{
    try {
        const student = await User.findById(req.params.studentid);

        if(!student){
            return next(new ErrorResponse(`User not found id with ${req.params.studentid}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: student
        });

    } catch (error) {
        next(error);
    }
};

//POST create student
//URL /students
//Private 
exports.createStudent = async (req,res,next)=>{
    try {
        const student = await User.create(req.body);

        res.status(200).json({
            success: true, 
            data: student
        });

    } catch (error) {
        next(error);
    }
};

//PUT update student
//URL students/:studentid
//Private
exports.updateStudent = async (req,res,next)=>{
    try {
        const student = await User.findByIdAndUpdate(req.params.studentid, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true, 
            data: student
        });

    } catch (error) {
        next(error);
    }
};

//DELETE delete student
//URL students/:studentid
//Private
exports.deleteStudent = async (req,res,next)=>{
    try {
        const student = await User.findByIdAndDelete(req.params.Userid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};