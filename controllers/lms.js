const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Lms = require('../models/Lms');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');

//GET get all class materials
///url/subject/:subjectid/lms
//URL /lms
exports.getLms = async (req,res,next)=>{

    try {
        const lms = await Lms.find({subject: req.params.subjectid});
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
exports.createLms = async (req,res,next)=>{
    try {
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

//PUT update LMS
//URL /lms/:lmsid
//Private teacher only
exports.updateLms = async (req,res,next)=>{
    try {
        const lms = await Lms.findByIdAndUpdate(req.params.lmsid, req.body,{
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

//PUT update classMaterials
//URL /:lmsid/lmsdoc/:docid
//Private teacher only
exports.updateClassMaterials = async (req,res,next)=>{
    try {
        const lms = await Lms.findByIdAndUpdate(req.params.docid, req.body,{
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

//POST create class materials
//URL /:lmsid/lmsdoc
//Private teacher only
exports.addClassMaterials = async (req, res, next) => {
    try{
        if(req.fileName){
            var result = await uploadFiles(req.fileName);
            if(result){
                var id = result.response['id'];
                var name = result.response['name'];
                var mimeType = result.response['mimeType'];
                var webViewLink = result.res['webViewLink'];
                var webContentLink = result.res['webContentLink'];

                req.body.document = {
                    id,
                    name,
                    mimeType,
                    webViewLink,
                    webContentLink
                };
                
            }
            var lms = await Lms.findById(req.params.lmsid);
            await lms.content.push(req.body);
            await lms.save();

            res.status(200).json({
                success: true, 
            });
        }
        
    }catch(error){
        console.log(error);
        next(error);
    }
};

// //DELETE delete lms
// //URL /lms/:lmsid
// //Private teacher only
exports.deleteLms = async (req,res,next)=>{
    try {
        const lms = await Lms.findById(req.params.lmsid).populate({
            path:'subject',
            select:'teacher'
        });

        if(!lms){
            return next(new ErrorResponse(`Not found}`, 404));
        }

        //make sure user is subject owner
        if(lms.subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized`, 
                    401
                )
            );
        }

        lms.content.forEach(async(element) =>{
            if(element.uploadType == 'assignment'){
                await Assignment.findOneAndDelete({assignmentId:element._id});
            }
            if(element.uploadType == 'quizzez'){
                await Quiz.findByIdAndDelete(element._id);
            }
        });
        await lms.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};

// //DELETE delete class
// //URL /subjects/:subjectid
// //Private teacher only
exports.deleteClassMaterials = async (req,res,next)=>{
    try {
        const lms = await Lms.findById(req.params.lmsid).populate({
            path:'subject',
            select:'teacher'
        });

        if(!lms){
            return next(new ErrorResponse(`Not found`, 404));
        }

        //make sure user is subject owner
        if(lms.subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized`, 
                    401
                )
            );
        }
        
        await Lms.findByIdAndUpdate({"_id": req.params.lmsid}, 
          {"$pull": {"content": {"_id": req.params.docid}}});

        await Assignment.findOneAndDelete({assignmentId:req.params.docid});

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};