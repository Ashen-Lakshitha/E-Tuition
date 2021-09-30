const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    //bad id format
    if(err.name === 'CastError'){
        const msg = `Resource not found`;
        err = new ErrorResponse(msg, 404);
    }

    //duplicate fields
    if( err.code === 11000){
        const msg = `Duplicate field value entered`;
        err = new ErrorResponse(msg, 400);
    }

    //mongoose validation errors
    if( err.name === 'ValidationError'){
        const msg = Object.values(err.errors).map(val => val.message);
        err = new ErrorResponse(msg, 400);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Source not Found'
    })
}

module.exports = errorHandler;