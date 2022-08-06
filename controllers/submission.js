const Submission = require('../models/Submission');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');

//GET get all assignment submissions for teacher
//URL /assignment/:assignmentid/al;
//private
exports.getSubmissions = async (req,res,next)=>{
    try {
        const assignment = await Submission.findOne({assignmentid:req.params.assignmentid}).populate({
            path:'submissions',
            populate:({
                path:'student',
                select:'name email photo'
            })
        });
        console.log(assignment)
        res.status(200).json({
            success: true,
            data: assignment.submissions
        });

    } catch (error) {
        console.log(error)
        next(error);
    }
};

//GET get single assignment
//URL assignment/:assignmentid/:submissionid
//Private
exports.getMySubmission = async (req,res,next)=>{
    try {

        var isSubmitted = false;
        const assignment = await Submission.findOne({assignmentId : req.params.assignmentid})

        if(!assignment){
            res.status(200).json({
                success: true, 
                data: {}
            });
        }else{
            assignment.submissions.forEach(element => {
            
                if(element.student == req.user.id){
                    isSubmitted = true;
                    res.status(200).json({
                        success: true, 
                        data: element
                    });
                }
            });

            if(!isSubmitted){
                res.status(200).json({
                    success: true, 
                    data: {}
                });
            }
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//POST create assignment
//URL /assignment/:assignmentid
//Private teacher only
exports.createSubmission = async (req,res,next)=>{
    
    try {
        var result = await uploadFiles(req.file);
        let document;
        
        if(result){
            var id = result.response['id'];
            var name = result.response['name'];
            var mimeType = result.response['mimeType'];
            var webViewLink = result.res['webViewLink'];
            var webContentLink = result.res['webContentLink'];
            
            document = {
                id,
                name,
                mimeType,
                webViewLink,
                webContentLink
            };
            
        }
        //check data row for given ass id
        const ass = await Submission.find({assignmentId : req.params.assignmentid})
        
        if(ass!= null){
            req.body.assignmentId = req.params.assignmentid;
            const ass = await Submission.create(req.body);
            await ass.submissions.push({student:req.user.id, document})
            await ass.save();
        }else{
            await ass.submissions.push({student:req.user.id, document})
            await ass.save();
        }
        // console.log("error");
        res.status(200).json({
            success: true, 
        });
       
    } catch (error) {
        // console.log(error);
        next(error);
    }
};

//PUT update assignment
//URL assignment/:assignmentid/:submissionid
//Private teacher only
exports.updateSubmission = async (req,res,next)=>{
    try {
        let assignment = await Submission.findById(req.params.assignmentid);

        if(!assignment){
            return next(new ErrorResponse(`Assignment not found id with ${req.params.assignmentid}`, 404));
        }
                
        assignment = await Assignment.findByIdAndUpdate(req.params.assignmentid, req.body, {
            new: true,
            runValidators: true
        });
                
        res.status(200).json({
            success: true, 
            data: assignment.submissions
        });

    } catch (error) {
        next(error);
    }
};

//DELETE delete assignment
//URL assignment/:assignmentid/:submissionid
//Private teacher only
exports.deleteSubmission = async (req,res,next)=>{
    try {
        const assignment = await Submission.findOne({assinmentId:req.params.assignmentid});
        if(!assignment){
            return next(new ErrorResponse(`assignment not found`, 404));
        }
        await Assignment.findOneAndUpdate({"assignmentId": req.params.assignmentid}, 
          {"$pull": {"submissions": {"_id": req.params.submissionid}}});
        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};