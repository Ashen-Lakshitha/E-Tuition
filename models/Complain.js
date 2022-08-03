const mongoose = require('mongoose');

const ComplainSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
    },
},{timestamps: true});

module.exports = mongoose.model('Complain', ComplainSchema);