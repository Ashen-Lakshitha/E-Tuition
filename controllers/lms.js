const Lms = require('../models/Lms');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Submission = require('../models/Submission');
const {uploadFiles, deleteFile} = require('../utils/service');
const ErrorResponse = require('../utils/errorResponse');

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
        console.log(error)
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
//URL /:lmsid/lms
//Private teacher only
exports.addClassMaterials = async (req, res, next) => {
    console.log(req)
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
                lms.content.push(req.body);
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
                const quiz = await Quiz.findById(doc['quiz']);
                quiz.submissions = [];
                await quiz.save();
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

        var docs = lms.content.filter(doc =>  doc._id == req.params.docid );
        
        if(docs[0]['uploadType'] == 'classNotes'){
            await deleteFile(docs[0]['document']['id']);
        }
        else if(docs[0]['uploadType'] == 'assignments'){
            var submission = await Submission.findOne({assignmentId: docs[0]['_id']});
            for (const sub of submission.submissions) {
                deleteFile(sub.document['id']);
            }
            await deleteFile(docs[0]['document']['id']);
            await submission.remove();
        }
        else if(docs[0]['uploadType'] == 'quiz'){
            // await Quiz.findOneAndDelete({subject: docs[0]['quiz']});
            await lms.content.pull(docs[0]);
            const quiz = await Quiz.findById(docs[0]['quiz']);
            quiz.submissions = [];
            await quiz.save();
        }
            
        await Lms.findByIdAndUpdate({"_id": req.params.lmsid}, 
        {"$pull": {"content": {"_id": req.params.docid}}});

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        console.log(error)
        next(error);
    };
};