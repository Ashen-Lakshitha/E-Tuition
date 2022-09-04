const mongoose = require('mongoose');

const lmsSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    content: [
        {
            uploadType: String,
            document: {
                id: String,
                name: String,
                mimeType : String,
                webViewLink : String,
                webContentLink : String
            },
            dueDate: String,
            name: String,
            quiz: {
                type: mongoose.Schema.ObjectId,
                ref: 'Quiz',
            },
            text: String,
        }
    ],
    description: {
        type: String,
    },
});

module.exports = mongoose.model('Lms', lmsSchema); 