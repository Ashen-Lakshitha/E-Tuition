const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//POST create user
//URL /auth/register
//Public
exports.createUser = async (req,res,next)=>{
    try {
        const user = await User.create(req.body);

        res.status(200).json({
            success: true, 
            data: teacher
        });

    } catch (error) {
        next(error);
    }
};

//POST Login User
//URL /auth/login
//Public
exports.loginUser = async (req,res,next)=>{
    try {
        const {email, password} = req.body;

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
        // const isMatch = await user.matchPwd(password);

        // if(!isMatch){
        //     return next(new ErrorResponse('Invalid credentials', 401));
        // }

        if(user.password !== password){
            return next(new ErrorResponse('Invalid Password', 401));
        }

        res
            .status(200)
            .json({
                success: true, 
        });
        // sendTokenResponse(user, 200, res); 
        // console.log(req.cookies);
    } catch (error) {
        next(error);
    }
};

//GET Logout user/clear token/cookie
//URL /auth/logout
//Private
exports.logout = async (req,res,next)=>{};

//GET Get current logged in user
//URL /auth/me
//Private
exports.getMe = async (req,res,next)=>{};

//PUT Update password
//URL /auth/updatepassword
//Private
exports.updatePassword = async (req,res,next)=>{};


//POST forgot pwd
//URL /auth/forgotpwd
//Public
exports.forgotPwd = async (req,res,next)=>{

    const user = await User.findOne({email: req.body.email});
    // const user = await User.findOne({_id: req.user});

    if(!user){
        return next(new ErrorResponse('There is no user with that email'), 404);
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    // console.log(resetToken);

    await user.save({validateBeforeSave: false});

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/auth /resetpassword/${resetToken}`;

    const message = `You are receiving this email because you has requested the reset of a password.Please make a PUT request to:\n\n${resetUrl}`;

    try {
        await sendMail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({success:true, data: 'Email sent'});
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse('Email could not be sent', 500));
    }
};


//PUT Reset password
//URL /auth/resetpassword/:resettoken
//Public
exports.resetPassword = async (req,res,next)=>{
    try {
        //get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt:Date.now()}
        });

        if(!user){
            return next(new ErrorResponse('Invalid token', 400));
        }

        //set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        sendTokenResponse(user, 200, res); 
    
    } catch (error) {
        next(error);
    }
};