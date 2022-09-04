const Submission = require('../models/Submission');
const Subject = require('../models/Subject');
const Lms = require('../models/Lms');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');

//GET get all assignment submissions for teacher
//URL /assignment/:assignmentid/all;
//private
exports.getSubmissions = async (req,res,next)=>{
    try {

        var assignment = await Submission.findOne({assignmentId:req.params.assignmentid});
        const subject = await Subject.findById(req.params.subjectid)
        if(!assignment){
            res.status(200).json({
                success: true,
                data: {submissions:[]}
            });
        }else{

            assignment = await Submission.findOne({assignmentId:req.params.assignmentid}).populate({
                path:'submissions',
                populate:({
                    path:'student',
                    select:'name email photo'
                })
            });

            if(req.params.subjectid){
                res.status(200).json({
                    success: true,
                    data: {submissions:assignment.submissions, total:subject.enrolledStudents.length, count:assignment.submissions.length}
                });
            }else{
                res.status(200).json({
                    success: true,
                    data: {submissions:assignment.submissions, count:assignment.submissions.length}
                });
            }
        }
    } catch (error) {
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
//URL subjects/:subjectid/submissions/:submissionid
//Private teacher only
exports.createSubmission = async (req,res,next)=>{
    
    try {
        var lms = await Lms.findById(req.params.subjectid);
        var late = false;
        var date = new Date();
        lms.content.forEach(element => {
            if(element._id == req.params.assignmentid){
                if(element.dueDate<date.toISOString().substring(0,10)){
                    late = true;
                }
            }
        });

        if(late){
            return next(new ErrorResponse(`Late Submission`, 400));
        }else{
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
            
            const assignment = await Submission.findOne({assignmentId : req.params.assignmentid});
            
            if(assignment == null){
                req.body.assignmentId = req.params.assignmentid;
                const ass = await Submission.create(req.body);
                await ass.submissions.push({student:req.user.id, document})
                await ass.save();
            }else{
                await assignment.submissions.push({student:req.user.id, document})
                await assignment.save();
            }
            res.status(200).json({
                success: true, 
            });
        }
       
    } catch (error) {
        console.log(error)
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
                
        assignment = await Submission.findByIdAndUpdate(req.params.assignmentid, req.body, {
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
        const assignment = await Submission.findOne({assignmentId: req.params.assignmentid});
        if(!assignment){
            return next(new ErrorResponse(`assignment not found`, 404));
        }
    
        var submission = assignment.submissions.filter(sub => sub._id == req.params.submissionid);
        deleteFile(submission[0].document.id);

        await Submission.findOneAndUpdate({"assignmentId": req.params.assignmentid}, 
          {"$pull": {"submissions": {"_id": req.params.submissionid}}});
        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        console.log(error);
        next(error);
    };
};