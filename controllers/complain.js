const Complain = require('../models/Complain');
const ErrorResponse = require('../utils/errorResponse');

//GET get all complains
//URL /
//private admin only
exports.getComplains = async (req,res,next)=>{
    try {
        const complains = await Complain.find().populate({
            path:'sender',
            select: 'name email'
        });
        res
            .status(200)
            .json({
                success: true, 
                data: complains
            });
    } catch (error) {
        next(error);
    }
};

//GET get my complains
//URL /my
//private student only
exports.getMyComplains = async (req,res,next)=>{
    try {
        const complains = await Complain.find({sender: req.user.id}).populate({
            path:'sender',
            select: 'name email'
        });
        res
            .status(200)
            .json({
                success: true, 
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
        req.body.sender = req.user.id
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