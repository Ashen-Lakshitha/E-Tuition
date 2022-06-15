const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const Crypto = require('crypto');
const sendMail = require('../utils/sendEmail');

//POST Login User
//URL /auth/login
//Public
exports.loginUser = async (req,res,next)=>{
    try {
        const {email, password} = req.body;
        console.log(email);
        //validate email and password
        if(!email){
            return next(new ErrorResponse('Please enter an email', 401));
        }
        if(!password){
            return next(new ErrorResponse('Please enter a password', 401));
        }

        //check for user
        const user = await User.findOne({email}).select('+password');

        if(!user){
            return next(new ErrorResponse('Invalid e-mail', 401));
        }

        //match password
        const isMatch = await user.matchPwd(password);

        if(!isMatch){
            return next(new ErrorResponse('Invalid Password', 401));
        }

        sendTokenResponse(user, 200, res); 

    } catch (error) {
        next(error);
    }
};

//GET Logout user/clear token/cookie
//URL /auth/logout
//Private
exports.logout = async (req,res,next)=>{
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now()+ 10*1000),
            httpOnly: true
        });
        res
            .status(200)
            .json({
                success: true, 
                data: {}
            });
    
    } catch (error) {
        next(error);
    }
};

//GET Get current logged in user
//URL /auth/me
//Private only user
exports.getMe = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    }catch(error){
        next(error);
    }
};

//PUT Update password
//URL /auth/updatepassword
//Private only user
exports.updatePassword = async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
};


//POST forgot pwd
//URL /auth/forgotpwd
//Public
exports.forgotPwd = async (req,res,next)=>{

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorResponse('There is no user with that email'), 404);
    }

    //get reset token
    const resetCode = user.getResetPasswordCode(); 

    //save the user
    await user.save({validateBeforeSave: false});

    const message = `Hi ${user.name},\n\nYou are receiving this email because you has requested the reset of a password.This is your password reset code\n\n${resetCode}`;

    try {
        await sendMail({
            email: user.email,
            // email:'nadunnethsara456@gmail.com',
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({success:true, data: 'Email sent'});

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse(error, 500));
    }
};

//PUT Reset password
//URL /auth/resetpassword
//Public
exports.resetPassword = async (req,res,next)=>{
    try {
        const code = toString(req.body.resetCode);
        const resetPasswordCode = Crypto.createHash('sha256').update(code).digest('hex');
        const user = await User.findOne({
            resetPasswordCode,
            resetPasswordExpire: {$gt:Date.now()}
        });

        if(!user){
            return next(new ErrorResponse('Invalid code', 400));
        }
        
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        sendTokenResponse(user, 200, res); 
    
    } catch (error) {
        next(error);
    }
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
            role: user.role,
            cart: user.cart.length
        });
}