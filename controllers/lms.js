const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Lms = require('../models/Lms');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');

//GET get all class materials
///url/subject/:subjectid/lms
//URL /lms
exports.getLms = async (req,res,next)=>{

    try {
        if(req.user.role == 'student'){
            var user = await User.findById(req.user.id);
            var subjects = user.enrolledSubjects.filter(subject => subject.subject== req.params.subjectid);
           
            var subject = await Subject.findById(req.params.subjectid);
            var students = subject.enrolledStudents.filter(student => student.student == req.user.id);

            
            var date = new Date();
            var currentMonth = date.toLocaleString('default', { month: 'long' });
            var currentYear = date.getFullYear();

            const lms = await Lms.find({subject: req.params.subjectid});

            var list = subjects[0].payment.filter(payment => 
                currentMonth.startsWith(payment.date.toString().split(' ')[1]) && payment.date.toString().split(' ')[3] == currentYear.toString()
            )

            if(parseInt(subjects[0].subject.payDate) > date.getMonth()){

                if(list.length > 0){
                    res
                        .status(200)
                        .json({
                            success: true, 
                            data: {
                                "isPaid":"true",
                                "fee": subject.fee,
                                lms
                            }
                        });
                }else{
                    if(subject[0].temporaryAccess){
                        res
                            .status(200)
                            .json({
                                success: true, 
                                data: {
                                    "isPaid":"temp",
                                    "fee": subject.fee,
                                    lms
                                }
                            });
                    }else{
                        
                        subjects[0].arrears = true;
                        await user.save();
        
                        students[0].arrears = true;
                        await subject.save();
    
                        res.status(200)
                        .json({
                            success: true, 
                            data: {
                                "isPaid":"arrears",
                                "fee": subject.fee,
                                "lms":[]
                            }
                        });
                    }
                }


            }else{
                if(subjects[0].arrears){
                    res
                    .status(200)
                    .json({
                        success: true, 
                        data: {
                            "isPaid":"arrears",
                            "fee": subject.fee,
                            "lms":[]
                        }
                    });
                }else if(subjects[0].temporaryAccess){
                    res
                    .status(200)
                    .json({
                        success: true, 
                        data: {
                            "isPaid":"temp",
                            "fee": subject.fee,
                            lms
                        }
                    });
                }else{
                    if(list.length > 0){
                        res
                            .status(200)
                            .json({
                                success: true, 
                                data: {
                                    "isPaid":"true",
                                    "fee": subject.fee,
                                    lms
                                }
                        });
                    }else{
                        res
                        .status(200)
                        .json({
                            success: true, 
                            data: {
                                "isPaid":"false",
                                "fee": subject.fee,
                                lms
                            }
                        });
                    }
                }
            }
        }else{
            const lms = await Lms.find({subject: req.params.subjectid});
            res.status(200).json({
                success: true, 
                data: lms
            });
        }

    } catch (error) {
        console.log(error);
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
            var result = await uploadFiles(req.file);
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
                var lms = await Lms.findById(req.params.lmsid);
                await lms.content.push(req.body);
                await lms.save();

                res.status(200).json({
                    success: true, 
                });
            }
            
        }else{
            var lms = await Lms.findById(req.params.lmsid);
            var isInLms = false;
            if(req.body.uploadType == 'quiz'){
                lms.content.forEach((element) =>{
                    if(element.quiz == req.body.quiz){
                        isInLms = true;
                    }
                });

                if(!isInLms){
                    await lms.content.push(req.body);
                    await lms.save();
                    res.status(200).json({
                        success: true, 
                    });
                }else{
                    next(new ErrorResponse(`Quiz already added`, 400));
                }
            }else{
                await lms.content.push(req.body);
                await lms.save();

                res.status(200).json({
                    success: true, 
                });
            }
        }
        
    }catch(error){
        console.log(error);
        next(error);
    }
};

//DELETE delete lms
//URL /lms/:lmsid
//Private teacher only
exports.deleteLms = async (req,res,next)=>{
    try {
        const lms = await Lms.findById(req.params.lmsid).populate({
            path:'subject',
            select:'teacher'
        });

        if(!lms){
            return next(new ErrorResponse(`Not found}`, 404));
        }

        if(lms.subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized`, 
                    401
                )
            );
        }
        
        lms.content.forEach(async (doc) => {
            if(doc['uploadType'] == 'assignments'){
                await Submission.findOneAndDelete({assignmentId: doc['_id']});
                await deleteFile(doc['document']['id']);
            }
            if(doc['uploadType'] == 'quiz'){
                await Quiz.findOneAndDelete({subject: doc['_id']});
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

//DELETE delete class materials
//URL /lms/:lmsid/lmsdoc/:docid
//Private teacher only
exports.deleteClassMaterials = async (req,res,next)=>{
    try {
        const lms = await Lms.findById(req.params.lmsid).populate({
            path:'subject',
            select:'teacher'
        });

        if(!lms){
            return next(new ErrorResponse(`Not found`, 404));
        }

        if(lms.subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized`, 
                    401
                )
            );
        }
        
        lms.content.forEach(async (doc) => {
            if(doc['uploadType'] == 'assignments'){
                await Submission.findOneAndDelete({assignmentId: doc['_id']});
                await deleteFile(doc['document']['id']);
            }
            if(doc['uploadType'] == 'quiz'){
                await Quiz.findOneAndDelete({subject: doc['_id']});
                await lms.content.pull(doc);
                const quiz = await Quiz.findById(doc['quiz']);
                quiz.submissios = [];
                await quiz.save();
            }
        });


        await Lms.findByIdAndUpdate({"_id": req.params.lmsid}, 
          {"$pull": {"content": {"_id": req.params.docid}}});

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};