const Payment = require('../models/Payment');
const Lms = require('../models/Lms');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const Answer = require('../models/Answer');
const {uploadFiles, deleteFile} = require('../utils/service');


//GET get payment details for a subject
//URL /subjects/:subjectid/payments
//Private teacher only
exports.getPayments = async (req,res,next)=>{
    try {
        let payments = await Payment.find({subject: req.params.subjectid});
        
        res.status(200).json({
            success: true, 
            data: payments
        });

    } catch (error) {
        next(error);
    }
};

//GET get payment details for a student
//URL /subjects/:subjectid/:stdid
//Private teacher only
exports.getUserPayment = async (req,res,next)=>{
    try {
        let payment = await Payment.findOne({subject: req.params.subjectid, student:req.params.stdid}).populate({
                path: 'student',
                select: 'name email photo '      
            });
        
        res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {
        next(error);
    }
};

//POST pay class
//URL /subjects/:subjectid/payments
//Private student only
exports.pay = async (req,res,next)=>{
    try {
        var result = await uploadFiles(req.file);

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
            req.body.student = req.user.id;
            req.body.subject = req.params.subjectid;
        }
        await Payment.create(req.body);

        res.status(200).json({
            success: true, 
        });

    } catch (error) {
        next(error);
    }
};


//DELETE payments
//URL /subjects/:subjectid/payments
//Private teacher only
exports.deletepayments = async (req,res,next)=>{
    try {
        const payments = await Payment.find({subject:req.params.subjectid});

        for(let payment of payments){
            await deleteFile(payment.document.id);
            await payment.remove();
        }

        res.status(200).json({
            success: true, 
            data: {}
        });
        
    } catch (error) {
        next(error);
    };
};