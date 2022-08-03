const User = require('../models/User');
const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');
const {uploadFiles, deleteFile} = require('../utils/service');
const path = require('path');
const sendMail = require('../utils/sendEmail');

//GET get all teachers
//URL /teachers
//Public
exports.getTeachers = async (req,res,next)=>{
    try {
        if(req.query.name == null){
            const teachers = await User.find({role : 'teacher',isPending: false});
            res
                .status(200)
                .json({
                    success: true, 
                    count: teachers.length,
                    data: teachers
                });
        }else{
            const teachers = await User.find({name: { $regex : req.query.name, $options : 'i'}, role : 'teacher', isPending: false}).select('name');
            res
                .status(200)
                .json({
                    success: true, 
                    count: teachers.length,
                    data: teachers
                });
        }
    } catch (error) {
        next(error);
    }
};

//GET get all students
//URL /students
//Private teacher and admin only
exports.getStudents = async (req,res,next)=>{
    try {
        if(req.query.name == null){
            const students = await User.find({isPending: false,role : 'student'});
            res
                .status(200)
                .json({
                    success: true, 
                    count: students.length,
                    data: students
                });
        }else{
            const students = await User.find({name: { $regex : req.query.name, $options : 'i'}, role : 'student', isPending: false}).select('name');
            res
                .status(200)
                .json({
                    success: true, 
                    count: students.length,
                    data: students
                });
        }
    } catch (error) {
        next(error);
    }
};
 
//GET get single user
//URL /:userid
//Private admin teacher only
exports.getUser = async (req,res,next)=>{
    try {
        if(req.user.role == 'admin'){
            const user = await User.findById(req.params.userid);

            if(user.role == 'teacher'){
                const subjects = await Subject.find({teacher: req.params.id});
                res.status(200).json({
                    success: true, 
                    data: [user, subjects]
                });
            }else{
                res.status(200).json({
                    success: true, 
                    data: user
                });
            }
            
        }else{
            const user = await User.findById(req.params.userid).where({isPending: false});
        
            if(!user){
                return next(new ErrorResponse(`User not found`, 404));
            }
            
            res.status(200).json({
                success: true, 
                data: user
            });
        }   
    } catch (error) {
        next(error);
    }
};

//GET get all enrolled classes for a student
//URL /myclasses
//Private student only
exports.getMyEnrolledClasses = async (req, res, next) => {
    try {
        const student = await User.findById(req.user.id).populate({
            path: 'enrolledSubjects',
            populate:({
                path:'subject',
                select: 'stream subject subtopic type fee post', 
            })
        });

        res.status(200).json({
           success: true,
           data: student.enrolledSubjects
        });
        
    } catch (error) {
        next(error);
    }
}

//GET classes in cart
//URL /cart
//Private students only
exports.getCart = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart',
            populate:({
                path:'subject',
                select: 'stream subject subtopic type fee post', 
            })
        });

        res.status(200).json({
            success: true,
            count: user.cart.length, 
            data: user.cart
        });

    } catch (error) {
        next(error);
    }
}

//Get payment details
//URL /payments
//Private
exports.getPayments = async (req,res,next)=>{
    try {   
        const user = await User.findById(req.user.id).populate({
            path: 'enrolledSubjects',
            populate:({
                path:'subject',
                select: 'stream subject subtopic type fee post', 
            })
        });

        res.status(200).json({
            success: true,
            data: user.enrolledSubjects
        });
    }catch (error) {
        next(error);
    }
};

//POST create Teacher
//URL /regteacher
//Public
exports.createTeacher = async (req,res,next)=>{
    try {
        var result = await uploadFiles(req.fileName);

        if(result){
            var id = result.response['id'];
            var name = result.response['name'];
            var mimeType = result.response['mimeType'];
            var webViewLink = result.res['webViewLink'];
            var webContentLink = result.res['webContentLink'];

            req.body.verification = {
                id,
                name,
                mimeType,
                webViewLink,
                webContentLink
            };
            req.body.isPending = true;
        }

        await User.create(req.body);

        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};

//POST create Student
//URL /regstudent
//Public
exports.createStudent = async (req,res,next)=>{
    try {
        req.body.isPending = true;
        // req.body.expireAt.index.expires = '5m';
        var user = await User.create(req.body);
        const requestUrl = `${req.protocol}://${req.get('host')}/users/${user._id}`;
        const message = `Hi ${user.name},\n\nClick the following link to verify your account\n\n${requestUrl}`;

        await sendMail({
            email: user.email,
            subject: 'E-mail verification',
            message
        });

        res.status(200).json({
            success: true, 
            data: 'Email sent'
        });

    } catch (error) {
        next(error);
    }
};

//PUT update user
//URL /
//Private
exports.updateUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true, 
            data: user
        });
        
    } catch (error) {
        next(error);
    }
};

//PUT update user profile picture
//URL /pic
//Private
exports.updateProfilePicture = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id);
        if(user.photo.id != null){
            await deleteFile(user.photo.id);
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
            user.photo = req.body.photo;
            await user.save();
        }else{
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
            user.photo = req.body.photo;
            await user.save();
        }
        res.status(200).json({
            success: true, 
        });
        
    } catch (error) {
        console.log(error)
        next(error);
    }
};

//PUT add subjects to cart
//URL /cart/:subjectid
//Private students only
exports.addToCart = async (req,res,next)=>{
    try {
        var isEnrolled;
        var isInCart;
        var user = await User.findById(req.user.id);
        var subject = await Subject.findById(req.params.subjectid);

        if(!subject){
            return next(new ErrorResponse(`Subject not found`, 404));
        }

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

        if(!isEnrolled && !isInCart){
            req.body.subject = req.params.subjectid;

            await user.cart.push(req.body);
            await user.save();
            
            res.status(200).json({
                success: true, 
                data: user.cart,
            });
        }else if(isEnrolled){
            return next(new ErrorResponse(`Already enrolled`, 400));
        }else if(isInCart){
            return next(new ErrorResponse(`Subject already in cart`, 400));
        }
        
    } catch (error) {
        next(error);
    }
};

//PUT update user
//URL /
//Private
exports.verifyUser = async (req,res,next)=>{
    try {
        req.body.isPending = false;
        const user = await User.findByIdAndUpdate(req.params.userid, req.body, {
            new: true,
            runValidators: true
        });
        if(!user){
            res.status(404).sendFile(path.join(process.cwd()+'/utils/error.html'));
        }
        res.status(200).sendFile(path.join(process.cwd()+'/utils/index.html'));
        
    } catch (error) {
        res.status(404).sendFile(path.join(process.cwd()+'/utils/error.html'));
    }
};

//DELETE delete user
//URL /
//Private
exports.deleteUser = async (req,res,next)=>{
    try {
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true, 
            data: {} 
        });
        
    } catch (error) {
        next(error);
    };
};

//PUT remove from cart
//URL /cart/:subjectid
//Private students only
exports.removeFromCart = async (req,res,next)=>{
    try {
        const subject = await Subject.findById(req.params.subjectid);

        if(!subject){
                return next(new ErrorResponse(`Subject not found`, 404));
        }

        const user = await User.findById(req.user.id);
        user.cart.forEach(element => {
            if(element.subject != req.params.subjectid){
                return next(new ErrorResponse(`Subject is not in cart`, 400));
            }
        });
        
        await User.findByIdAndUpdate({"_id": req.user.id}, 
          {"$pull": {"cart": {"subject": req.params.subjectid}}});

        res.status(200).json({
                success: true, 
            });
        
        } catch (error) {
                next(error);
    }
};