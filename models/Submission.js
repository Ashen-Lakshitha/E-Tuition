const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: String,
        trim: true,
        required:true
    },
    submissions: [
        {
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
});

module.exports = mongoose.model('Submission', SubmissionSchema);