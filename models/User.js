const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        'Please use a valid email']
    },
    phone: {
        type: String,
        required:[true, 'Please add a contact number']
    },
    address: {
        type: String,
    },
    qualifications: {
        type: String,
    },
    school: {
        type: String,
    }, 
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student','teacher']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now()
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    enrolledSubjects:[
        {
            subject: {
                type: mongoose.Schema.ObjectId,
                ref: 'Subject'
            },
            isPaid: {
                type: Boolean,
                default: false
            },
            isEnrolled: {
                type: Boolean,
                default: true
            },
            createdAt:{
                type: Date,
                default: Date.now()
            },
        }
    ],
    aboutMe: String,
    whatspp: String,
    telegram: String
});

//hash the password when create  or update a document
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//match user entered password with hashed password
UserSchema.methods.matchPwd = async function(enteredPwd){
    return await bcrypt.compare(enteredPwd, this.password);
};

//create token when login/signup
UserSchema.methods.getSignedJwtToken = function(){
        return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
                expiresIn : '6h'
    });
}


//generate and hash password token
UserSchema.methods.getResetPasswordCode = function(){
    //generate token
    const resetCode = (Math.floor(100000 + Math.random() * 900000)).toString();

    //hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetCode;
}


module.exports = mongoose.model('User', UserSchema);