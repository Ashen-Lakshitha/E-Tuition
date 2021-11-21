const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next)=>{
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }else if(req.cookies.token){
            token = req.cookies.token;
        }

        //make sure token exists
        if(!token){
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }

        try {
            //verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
        
            req.user = await User.findById(decode.id);
            // console.log(req.user);
            next();
        } catch (error) {
            return next(new ErrorResponse('Token Expired', 401));
        }
    } catch (error) {
        next(error);
    }
}

//Grant access to specific roles
exports.authorize = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} not authorize to access this route`, 403));
        }
        next();
    }
}