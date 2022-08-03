const Complain = require('../models/Complain');
const ErrorResponse = require('../utils/errorResponse');

//GET get all complains
//URL /
//private admin only
exports.getComplains = async (req,res,next)=>{
    try {
        const complains = await Complain.find();
        res
            .status(200)
            .json({
                success: true, 
                count: complains.length,
                data: complains
            });
    } catch (error) {
        next(error);
    }
};

//GET get single complain
//URL /:complainid
//private
exports.getComplain = async (req,res,next)=>{
    try {
        const complain = await Complain.findById(req.params.complainid);
        if(req.user.role != 'admin'){
            if(complain.sender != req.user.id){
                return next(new ErrorResponse('User is not authorized', 400));
            }
        }
        res
            .status(200)
            .json({
                success: true, 
                count: complains.length,
                data: complains
            });
    } catch (error) {
        next(error);
    }
};

//POST create complain
//URL /
//private student and teacher
exports.createComplain = async (req,res,next)=>{
    try {
        await Complain.create(req.body);
        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//DELETE delete complain
//URL /:complainid
//Private
exports.deleteComplain = async (req,res,next)=>{
    try {
        await Complain.findByIdAndDelete(req.params.complainid);

        res.status(200).json({
            success: true, 
        });
        
    } catch (error) {
        next(error);
    };
};