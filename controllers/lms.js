const Subject = require('../models/Subject');
const User = require('../models/User');
const Lms = require('../models/Lms');
const ErrorResponse = require('../utils/errorResponse');

//GET get all class materials
///url/subject/:subjectid/lms
//URL /lms
exports.getclassmaterials = async (req,res,next)=>{

    try {

        const lms = await Lms.find();
        res
            .status(200)
            .json({
                success: true, 
                count: lms.length,
                data: lms
            });

    } catch (error) {
        next(error);
    }
};
//POST create classMaterials
//URL /subject/:subjectid/lms
//Private teacher only
exports.createclassmaterials = async (req,res,next)=>{
    try {
        req.body.teacher = req.user.id;
        req.body.subject = req.params.subjectid;

        const lms = await Lms.create(req.body);

        res.status(200).json({
            success: true, 
            data: lms
        });

    } catch (error) {
        next(error);
    }
};

//PUT update class materials (teacher update classMaterials)
//URL lms/:lmsid
//Private teacher only
exports.updateclassmaterials = (req, res, next) => {
    // Validate Request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Note content can not be empty"
    //     });
    // }

    // Find note and update it with the request body
    Lms.findByIdAndUpdate(req.params.lmsid, {
        mtitle: req.body.mtitle || "Untitled class material",
        content: req.body.content,
        description: req.body.description
    }, {new: true})
    .then(lms => {
        if(!lms) {
            return res.status(404).send({
                message: "class material not found with id " + req.params.lmsid
            });
        }
        res.send(lms);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "class material not found with id " + req.params.lmsid
            });                
        }
        return res.status(500).send({
            message: "Error updating class material with id " + req.params.lmsid
        });
    });
};

// //DELETE delete class
// //URL /subjects/:subjectid
// //Private teacher only
exports.deleteclassmaterials = async (req,res,next)=>{
    try {
        const lms = await Lms.findById(req.params.lmsid);

        if(!lms){
            return next(new ErrorResponse(`class materials not found id with ${req.params.lmsid}`, 404));
        }

        //make sure user is subject owner
        if(lms.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete a class`, 
                    401
                )
            );
        }
        await lms.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};