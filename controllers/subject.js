const Subject = require('../models/Subject');
const Lms = require('../models/Lms');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const Answer = require('../models/Answer');
const {uploadFiles, deleteFile} = require('../utils/service');


//GET get all subjects(student home page)
//URL /subjects
//Public
exports.getSubjects = async (req,res,next)=>{
    try {
        let subjects = await Subject.find().populate({
                path: 'teacher',
                select: 'title name photo '      
            });
        
        res.status(200).json({
            success: true,
            count: subjects.length, 
            data: subjects
        });

    } catch (error) {
        next(error);
    }
};

//GET get single subject by subject id
//URL subjects/:subjectid
//Private
exports.getSubject = async (req,res,next)=>{
    try {
        let isEnrolled = false;
        let isInCart = false;
        let subject = await Subject.findById(req.params.subjectid).populate({
            path: 'teacher',
            select: "title name email phone school qualifications photo"
            }).populate({
                path: 'enrolledStudents',
                populate: {
                    path:  'student',
                    select: "name email phone school photo"}
            });

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

        const user = await User.findById(req.user.id);
        if(user.role == "teacher"){
            if(subject.teacher.id.toString() != req.user.id){
                return next(
                    new ErrorResponse(
                        `User is not authorized to view subject`, 
                        401
                    )
                );
            }
            res.status(200).json({
                success: true, 
                data: subject,
            });
        }else{

            user.cart.forEach(element => {
                if(req.params.subjectid == element.subject){
                    isInCart = true;
                }
            });

            user.enrolledSubjects.forEach(element => {
                if(element.subject == req.params.subjectid){
                    isEnrolled = true;
                }
            });

            const teacher = subject.teacher;
            let classes = await Subject.find({
                    _id: {$ne: req.params.subjectid},
                    teacher:teacher
                });

            res.status(200).json({
                    success: true, 
                    data: {subject,classes,isEnrolled,isInCart},
                });
            }
        

    } catch (error) {
        next(error);
    }
};

//GET get single subject(public)
//URL public/:subjectid
//Public
exports.getSubjectPublic = async (req,res,next)=>{
    try {

        let subject = await Subject.findById(req.params.subjectid).populate({
            path: 'teacher',
            select: "title name email phone school qualifications photo"
            });
    
        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }
        
        const teacher = subject.teacher;
        let query = await Subject.find({
                _id: {$ne: req.params.subjectid},
                teacher:teacher
            });
        res.status(200).json({
            success: true, 
            data: {subject,classes : query },
        });

    } catch (error) {
        next(error);
    }
};

//GET get all subjects for a teacher(teacher home page)
//URL subjects/myclasses
//Private teacher only
exports.getMySubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find({teacher: req.user._id}, '-enrolledStudents');

        res.status(200).json({
           success: true,
           data: subjects
        });
        
    } catch (error) {
        next(error);
    }
};

//GET get payments in the class
//URL /subjects/:subjectid/getpayments
//Private teacher only
exports.getPayments = async (req,res,next)=>{
    try {
        let students = [];
        let pcount = 0;
        let month = req.query.date.split("-")[1];
        let year = req.query.date.split("-")[0];

        const subject = await Subject.findById(req.params.subjectid).populate({
            path: 'enrolledStudents',
            populate: {
                path:  'student',
                select: "name email "}
        });
        var date = new Date();
        var currentMonth = date.toLocaleString('default', { month: 'long' });
        var currentYear = date.getFullYear();

        if(month == currentMonth && year == currentYear){
            subject['enrolledStudents'].forEach(student => {
                const payed =student.payment.filter(pay => month.startsWith(pay.date.toString().split(' ')[1]) && pay.date.toString().split(' ')[3] == year.toString());
                pcount += payed.length;
                payed.length == 0 ? students.push({id:student.student['_id'], name:student.student['name'],email:student.student['email'],payment:{}}) : students.push({id:student.student['_id'], name:student.student['name'],email:student.student['email'],payment:payed[0]});
            
            });

            res
                .status(200)
                .json({
                    success: true, 
                    data: {
                        students: students, 
                        total: subject['enrolledStudents'].length, 
                        pcount}
                });
        }else{
            subject['enrolledStudents'].forEach(element => {
                element.payment.forEach((payment) => {
                    if(month.startsWith(payment.date.toString().split(' ')[1]) && payment.date.toString().split(' ')[3] == year.toString()){
                        students.push({_id:element['student']['_id'], name:element['student']['name'], email: element['student']['email'], payment});
                    }
                });
            });
    
            res
                .status(200)
                .json({
                    success: true, 
                    data: {
                        students, 
                        total: students.length, 
                        pcount: students.length}
                });
        }
        
    } catch (error) {
        console.log(error)
        next(error);
    }
};

//POST create subject(teacher add class)
//URL /subjects
//Private teacher only
exports.createSubject = async (req,res,next)=>{
    try {
        var result = await uploadFiles(req.fileName);

        if(result){
            var id = result.response['id'];
            var name = result.response['name'];
            var mimeType = result.response['mimeType'];
            var webViewLink = result.res['webViewLink'];
            var webContentLink = result.res['webContentLink'];

            req.body.post = {
                id,
                name,
                mimeType,
                webViewLink,
                webContentLink
            };
            req.body.teacher = req.user.id;
        }
        req.body.period = {'day': req.body.day, 'time': req.body.time};
        await Subject.create(req.body);

        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//PUT update subject(teacher update class)
//URL subjects/:subjectid
//Private teacher only
exports.updateSubject = async (req,res,next)=>{
    try {
        let subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }
        
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to update this class`,401)
                    );
                }
                
        req.body.period = {'day': req.body.day, 'time': req.body.time};
        subject = await Subject.findByIdAndUpdate(req.params.subjectid, req.body, {
            new: true,
            runValidators: true
        });
                
        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//PUT update class poster
//URL /:subjectid/post
//Private
exports.updateClassPoster = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);
        await deleteFile(subject.post.id);
        var result = await uploadFiles(req.file);

        if(result){
            var id = result.response['id'];
            var name = result.response['name'];
            var mimeType = result.response['mimeType'];
            var webViewLink = result.res['webViewLink'];
            var webContentLink = result.res['webContentLink'];

            req.body.photo = {
                id,
                name,
                mimeType,
                webViewLink,
                webContentLink
            };
        }
        subject.post = req.body.photo;
        await subject.save();
        
        res.status(200).json({
            success: true, 
        });
        
    } catch (error) {
        next(error);
    }
};

//PUT enroll to subject
//URL subjects/:subjectid/enroll
//Private students only
exports.enrollStudent = async (req,res,next)=>{
    try {
        var isEnrolled = false;
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.user.id);

        req.body.subject = req.params.subjectid;
        req.body.student = req.user.id;

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

        if(subject.enrolledStudents.length >= subject.maxStudents){
            return next(new ErrorResponse(`Class is full`, 400));
        }

        // if(Date.getDate() > subject.payDate){
        //     return next(new ErrorResponse(`You have to pay`, 400));
        // }

        user.enrolledSubjects.forEach(element => {
            if(element.subject == req.params.subjectid){
               isEnrolled = true;
            }
        });

        if(!isEnrolled){
            await user.enrolledSubjects.push(req.body);
            await user.save();

            await User.findByIdAndUpdate({"_id": req.user.id}, 
            {"$pull": {"cart": {"subject": req.params.subjectid}}});
            
            await subject.enrolledStudents.push(req.body);
            await subject.save();

            res.status(200).json({
                success: true, 
            });
        }else if(isEnrolled){
            return next(new ErrorResponse(`User is already enrolled`, 400));
        }

    } catch (error) {
        next(error);
    }
};


//PUT enroll to subject
//URL subjects/:subjectid/:userid/enroll
//Private teachers only
exports.enrollStudentByTeacher = async (req,res,next)=>{
    try {
        var isEnrolled = false;
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.params.userid);

        req.body.subject = req.params.subjectid;
        req.body.student = req.params.userid;

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

        if(subject.enrolledStudents.length >= subject.maxStudents){
            return next(new ErrorResponse(`Class is full`, 400));
        }

        // if(Date.now() > subject.payDate){
        //     return next(new ErrorResponse(`You have to pay`, 400));
        // }

        user.enrolledSubjects.forEach(element => {
            if(element.subject == req.params.subjectid){
               isEnrolled = true;
            }
        });

        if(!isEnrolled){
            await user.enrolledSubjects.push(req.body);
            await user.save();

            await User.findByIdAndUpdate({"_id": req.user.id}, 
            {"$pull": {"cart": {"subject": req.params.subjectid}}});
            
            await subject.enrolledStudents.push(req.body);
            await subject.save();

            res.status(200).json({
                success: true, 
            });
        }else if(isEnrolled){
            return next(new ErrorResponse(`User is already enrolled`, 400));
        }

    } catch (error) {
        next(error);
    }
};


//PUT enroll to subject
//URL subjects/:subjectid/:userid/enroll
//Private teachers only
exports.enrollStudentByTeacher = async (req,res,next)=>{
    try {
        var isEnrolled = false;
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.params.userid);

        req.body.subject = req.params.subjectid;
        req.body.student = req.params.userid;

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

        if(subject.enrolledStudents.length >= subject.maxStudents){
            return next(new ErrorResponse(`Class is full`, 400));
        }

        // if(Date.now() > subject.payDate){
        //     return next(new ErrorResponse(`You have to pay`, 400));
        // }

        user.enrolledSubjects.forEach(element => {
            if(element.subject == req.params.subjectid){
               isEnrolled = true;
            }
        });

        if(!isEnrolled){
            await user.enrolledSubjects.push(req.body);
            await user.save();

            await User.findByIdAndUpdate({"_id": req.user.id}, 
            {"$pull": {"cart": {"subject": req.params.subjectid}}});
            
            await subject.enrolledStudents.push(req.body);
            await subject.save();

            res.status(200).json({
                success: true, 
            });
        }else if(isEnrolled){
            return next(new ErrorResponse(`User is already enrolled`, 400));
        }

    } catch (error) {
        next(error);
    }
};

//PUT unenroll from subject
//URL subjects/:subjectid/unenroll
//Private students only
exports.unEnrollStudent = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.user.id);

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }
        await User.findByIdAndUpdate({"_id": req.user.id}, 
          {"$pull": {"enrolledSubjects": {"subject": req.params.subjectid}}});

        await Subject.findByIdAndUpdate({"_id": req.params.subjectid}, 
          {"$pull": {"enrolledStudents": {"student": req.user.id}}});
        
        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//PUT pay for class
//URL /:subjectid/pay
//Private
exports.payClass = async(req,res,next) => {
    try{
        var isEnrolled = false;
        var subject = await Subject.findById(req.params.subjectid);
        var user = await User.findById(req.user._id);

        req.body.subject = req.params.subjectid;
        req.body.student = req.user._id;

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }
        
        user.enrolledSubjects.forEach(element => {
            if(element.subject == req.params.subjectid){
               isEnrolled = true;
            }
        });

        if(subject.enrolledStudents.length >= subject.maxStudents){
            return next(new ErrorResponse(`Class is full`, 400));
        }


        if(!isEnrolled){
            req.body.subject = req.params.subjectid;
            req.body.student = req.user.id;
            await user.enrolledSubjects.push(req.body);
            await user.save();

            await User.findByIdAndUpdate({"_id": req.user.id}, 
            {"$pull": {"cart": {"subject": req.params.subjectid}}});
            
            await subject.enrolledStudents.push(req.body);
            await subject.save();

            user.enrolledSubjects.forEach(async (element) => {
                if(element.subject == req.params.subjectid){
                    await element.payment.push(req.body);
                    await user.save();
                }
            });
            subject.enrolledStudents.forEach(async (element) => {
                if(element.student == req.user._id){
                    await element.payment.push(req.body);
                    await subject.save();
                }
            });

            res.status(200).json({
                success: true, 
            });

        }else if(isEnrolled){
            user.enrolledSubjects.forEach(async (element) => {
                if(element.subject == req.params.subjectid){
                    await element.payment.push(req.body);
                    await user.save();
                }
            });
            subject.enrolledStudents.forEach(async (element) => {
                if(element.student == req.user.id){
                    await element.payment.push(req.body);
                    await subject.save();
                }
            });
        
            res.status(200).json({
                success: true, 
            });
            
        }

    }catch(error){
        next(error);
    }
};

//DELETE delete class
//URL /subjects/:subjectid
//Private teacher only
exports.deleteSubject = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to delete this class`, 
                    401
                )
            );
        }

        if(subject.enrolledStudents.length > 0){
            return next(new ErrorResponse(`Cannot delete class with enrolled students`, 400));
        }

        var lms = await Lms.find({subject: req.params.subjectid});
        if(lms){
            lms.forEach(async (element) => {
                element.content.forEach(async (doc) => {
                    if(doc['uploadType'] == 'assignments'){
                        await Submission.findOneAndDelete({assignmentId: doc['_id']});
                        await deleteFile(doc['document']['id']);
                    }
                    if(doc['uploadType'] == 'quiz'){
                        await Quiz.findOneAndDelete({subject: doc['_id']});
                    }
                });
            });

            await lms.remove();
        }

        await Review.findOneAndDelete({subject: req.params.subjectid});

        var users = await User.find();
        users.forEach(async (user) => {
            user.enrolledSubjects.forEach(async (subj) => {
                if(subj.subject == req.params.subjectid){
                    user.enrolledSubjects.pull(subj);
                    await user.save();
                }
            });
            user.cart.forEach(async (subj) => {
                if(subj.subject == req.params.subjectid){
                    user.cart.pull(subj);
                    await user.save();
                }
            });
        });

        await Answer.findOneAndDelete({subject: req.params.subjectid});
        await deleteFile(subject.post.id);

        await subject.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};