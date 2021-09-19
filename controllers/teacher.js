const Teacher = require('../models/User');
// const User = require('../models/Teacher');
const ErrorResponse = require('../utils/errorResponse');

//GET get all teachers
//URL /teachers
//Private only admin
exports.getTeachers = async (req,res,next)=>{
    try {
        console.log(req);
        const teachers = await Teacher.find();
        res
            .status(200)
            .json({
                name:"saji",
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
        const teacher = await Teacher.findById(req.params.teacherid);

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
        const teacher = await Teacher.create(req.body);

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
        const teacher = await Teacher.findByIdAndUpdate(req.params.teacherid, req.body, {
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
        const teacher = await Teacher.findByIdAndDelete(req.params.teacherid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};