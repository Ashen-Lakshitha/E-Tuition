const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    assignmentId: {
        type: String,
        trim: true,
        required:true
    },
    // subject:{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Suject',
    //     required: true
    // },
    submissions: [
        {
            //_id
            student: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now()
            },
            document:{
                id : String,
                name : String,
                mimeType : String,
                webViewLink : String,
                webContentLink : String
            }
        }
    ],
    // duration: Date,
    // closingDate: Date,
    // isClosed:{
    //     type: Boolean,
    //     default: false
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
});

module.exports = mongoose.model('Assignment', AssignmentSchema);