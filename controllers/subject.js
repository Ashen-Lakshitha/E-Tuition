const Subject = require('../models/Subject');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

//GET get all subjects
//URL /subjects
//GET get all subjects for a teacher
//URL /teachers/:teacherid/subjects
//Public
exports.getSubjects = async (req,res,next)=>{
    try {
        let query;
        if(req.params.teacherid){
            query = Subject.find({ teacher : req.params.teacherid}).populate({
                path: 'teacher',
                select: 'name email phone'
            });
        }
        else{
            query = Subject.find().populate({    //populate - nested data
                path: 'teacher',
                select: 'name email phone '      //show only name and description
            });
        }

        const subjects = await query;

        res.status(200).json({
            success: true,
            count: subjects.length, 
            data: subjects
        });

    } catch (error) {
        next(error);
    }
};

//GET get single subject
//URL subjects/:subjectid
//Public
exports.getSubject = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid).populate({    //populate - nested data
            path: 'teacher',
            select: 'name email phone'      //show only name and description
        });

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//POST create subject
//URL teachers/:teacherid/subject
//Private
exports.createSubject = async (req,res,next)=>{
    try {
        req.body.teacher = req.params.teacherid;
        // req.body.user = req.user.id;

        const teacher = await Teacher.findById(req.params.teacherid);

        if(!teacher){
            return next(
                new ErrorResponse(
                    `Teacher not found id with ${req.params.teacherid}`, 
                    404
                )
            );
        }

        //make sure user is subject owner
        // if(subject.user.toString() !== req.user.id && req.user.role !== 'admin'){
        //     return next(
        //         new ErrorResponse(
        //             `User ${req.user.id} is not authorized to update a subject in bootcamp${bootcamp._id}`, 
        //             401
        //         )
        //     );
        // }

        const subject = await Subject.create(req.body);

        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

//PUT update subject
//URL subjects/:subjectid
//Private
exports.updateSubject = async (req,res,next)=>{
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.subjectid, req.body, {
            new: true,
            runValidators: true
        });

        if(!subject){
            return next(new ErrorResponse(`Subject not found id with ${req.params.subjectid}`, 404));
        }

        //make sure user is subject owner
        // if(subject.user.toString() !== req.user.id && req.user.role !== 'admin'){
        //     return next(
        //         new ErrorResponse(
        //             `User ${req.user.id} is not authorized to update a subject in bootcamp${bootcamp._id}`, 
        //             401
        //         )
        //     );
        // }

        res.status(200).json({
            success: true, 
            data: subject
        });

    } catch (error) {
        next(error);
    }
};

// //DELETE delete course
// //Private
// exports.deleteCourse = async (req,res,next)=>{
//     try {
//         const course = await Course.findById(req.params.id);

//         if(!course){
//             return next(new ErrorResponse(`Course not found id with ${req.params.id}`, 404));
//         }

//         //make sure user is course owner
//         if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
//             return next(
//                 new ErrorResponse(
//                     `User ${req.user.id} is not authorized to delete a course in bootcamp${bootcamp._id}`, 
//                     401
//                 )
//             );
//         }


//         await course.remove();

//         res.status(200).json({
//             success: true, 
//             data: {}
//         });
        
//     } catch (error) {
//         next(error);
//     };
// };