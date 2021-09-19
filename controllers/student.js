const Student = require('../models/Student');
// const User = require('../models/Teacher');
const ErrorResponse = require('../utils/errorResponse');

//GET get all students
//URL localhost:5000/students
//Private only admin
exports.getStudents = async (req,res,next)=>{
    try {
        const students = await Student.find();
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
        const student = await Student.findById(req.params.studentid);

        if(!student){
            return next(new ErrorResponse(`Student not found id with ${req.params.studentid}`, 404));
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
//URL students
//Private 
exports.createStudent = async (req,res,next)=>{
    try {
        const student = await Student.create(req.body);

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
        const student = await Student.findByIdAndUpdate(req.params.studentid, req.body, {
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
        const student = await Student.findByIdAndDelete(req.params.studentid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};