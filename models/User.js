const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Student', 'Mr.','Mrs.', 'Miss.', 'Ven.', 'Dr.', 'Prof.', 'Lecturer'],
        required: [true, 'Please add a title']
    },
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
    gender:{
        type: String,
        enum: ['Male', 'Female', 'None'],
        required: [true, 'Please add a gender']
    },
    birthday: Date,
    photo: {
        id : {
            type:String,
            default:null
        },
        name : String,
        mimeType : String,
        webViewLink : String,
        webContentLink : String
    },
    phone: {
        type: String,
        required:[true, 'Please add a contact number']
    },
    whatsapp: String,
    telegram: String,
    address: String,
    qualifications: String,
    verification: {
        id : String,
        name : String,
        mimeType : String,
        webViewLink : String,
        webContentLink : String
    },
    school: String,
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
    enrolledSubjects:[
        {
            subject: {
                type: mongoose.Schema.ObjectId,
                ref: 'Subject'
            },
            payment: [
                {
                    date: Date,
                    month: Date,
                    year: Date,
                    isPaid:{
                        type : Boolean,
                        default: false
                    },
                    amount: Number
                }
            ],
            isEnrolled: {
                type: Boolean,
                default: true
            },
            enrolledDate:{
                type: Date,
                default: Date.now()
            },
        }
    ],
    cart: [
        {
            subject: {
                type: mongoose.Schema.ObjectId,
                ref: 'Subject',
            }
        }
    ],
    isPending:{
        type:Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    expireAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 60 },
      },
},{timestamps: true});

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