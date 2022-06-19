const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all users by role
//URL /
//Private admin only
exports.getUsers = async (req,res,next)=>{

    try {
        const teachers = await User.find({role: "teacher", isPendig: false});
        const students = await User.find({role: "student"});
        const subjects = await Subject.find();
        res
            .status(200)
            .json({
                success: true, 
                teacher: {teachers, count: teachers.length},
                student: {students, count: students.length},
                subject: {subjects, count: subjects.length}
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
        const student = await User.find({isPending: true});

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

//DELETE delete user
//URL /
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
