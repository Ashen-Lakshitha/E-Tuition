const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
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
        let isEnrolled;
        let isInCart;
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
            //make sure user is subject teacher
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
}

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

        await Subject.create(req.body);

        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        console.log("error");
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
        
        // make sure user is subject owner
        if(subject.teacher.toString() !== req.user.id){
            return next(
                new ErrorResponse(
                    `User is not authorized to update this class`,401)
                    );
                }
                
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
        var result = await uploadFiles(req.fileName);

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
        var isEnrolled;
        const subject = await Subject.findById(req.params.subjectid);
        const user = await User.findById(req.user.id);

        req.body.subject = req.params.subjectid;
        req.body.student = req.user.id;

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }
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
        console.log(error);
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
        console.log(error);
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

        //make sure user is subject owner
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

        await subject.remove();

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};