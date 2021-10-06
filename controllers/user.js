const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all users by role
//URL /
//Private admin only
exports.getUsers = async (req,res,next)=>{

    const role = 'student';
    try {
        const users = await User.find().where({role: role});
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

//PUT update user
//URL /:userid
//Private
exports.updateUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.userid, req.body, {
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
//URL /:userid
//Private
exports.deleteUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.userid);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};