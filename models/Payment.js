const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    document: {
        id: String,
        name: String,
        mimeType : String,
        webViewLink : String,
        webContentLink : String
    },
    verified: {
        type: Boolean,
        default: false
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Payment', paymentSchema); 