const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//POST create user
//URL /auth/register
//Public
exports.createUser = async (req,res,next)=>{
    try {
        const user = await User.create(req.body);

        // res.status(200).json({
        //     success: true, 
        //     data: user
        // });
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};

//GET get all users
//URL /
//Private admin only
exports.getUsers = async (req,res,next)=>{

    try {
        const users = await User.find();
        res
            .status(200)
            .json({
                success: true, 
                count: users.length,
                data: users
            });

    } catch (error) {
        next(error);
    }
};

//GET get single user
//URL /:userid
//Private admin only
exports.getUser = async (req,res,next)=>{
    try {
        const user = await User.findById(req.params.userid);
        
        if(!user){
            return next(new ErrorResponse(`User not found id with ${req.params.userid}`, 404));
        }
        
        res.status(200).json({
            success: true, 
            data: user
        });
        
    } catch (error) {
        next(error);
    }
};

//GET get all enrolled classes for a student
//URL /myclasses
//Private student only
exports.getMyEnrolledClasses = async (req, res, next) => {
    try {
        const student = await User.findById(req.user.id).populate({
            path: 'enrolledSubjects',
            populate:({
                path:'subject',
                select: 'stream fee subject subtopic type', 
            })
        });
        // console.log(student.enrolledSubjects);

        res.status(200).json({
           success: true,
           data: student.enrolledSubjects
        });
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}

//PUT update user
//URL /
//Private
exports.updateUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true, 
            data: user
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
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};

const sendTokenResponse = (user, statusCode, res)=>{
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now() + 1000 * 60 * 60 * 6),
        httpOnly: true,
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true, 
            token,
            role: user.role
        });
}