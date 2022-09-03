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
                data: [
                    {count: teachers.length,
                        name: "Teachers",
                        image: "https://i.ibb.co/kqHJxg0/vecteezyteacher-s-daybackground-YK0221-generated.jpg",},
                        {count: students.length,
                        name:  "Students",
                        image: "https://i.ibb.co/gFfns3n/vecteezy-happy-students-go-to-school.jpg",},
                        {count: subjects.length,
                        name: "Classes",
                        image: "https://i.ibb.co/jzfvWS9/4529183.jpg",}]
            });

    } catch (error) {
        next(error);
    }
};

//GET get subjects analytics
//URL admin/analytics
//Private admin only
exports.getAnalytics = async (req,res,next)=>{

    try {
        const subjects = await Subject.find();
        var science = subjects.filter(subject => subject.stream == "Science");
        var arts = subjects.filter(subject => subject.stream == "Art");
        var commerce = subjects.filter(subject => subject.stream == "Commerce");
        var tech = subjects.filter(subject => subject.stream == "Technology");
        var other = subjects.filter(subject => subject.stream == "Other");

        res
            .status(200)
            .json({
                success: true, 
                data: 
                {"science":science.length,
                "arts":arts.length,
                "commerce":commerce.length,
                "tech":tech.length,
                "other":other.length}
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