// const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

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
    averageRating: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    review: [
        {
            text: String,
            rate:{
                type: Number,
                min: 1,
                max: 10
            }
        }
    ],
    enrolledSubjects:[
        {
            subject: {
                type: mongoose.Schema.ObjectId,
                ref: 'Subject'
            },
            isPaid: Boolean
        }
    ]
});

// UserSchema.pre('save', async function(next){
//     if(!this.isModified('password')){
//         next();
//     }
    
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// UserSchema.methods.getSignedJwtToken = function(){
//     return jwt.sign({id: this.id}, 'hshshshshshshahhaha', {
//         expiresIn : '30d'
//     });
// }


// //generate and hash password token
// UserSchema.methods.getResetPasswordToken = function(){
//     //generate token
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     //hash token and set to resetPasswordToken field
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     //set expire
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// }

//match user entered password with hashed password
UserSchema.methods.matchPwd = async function(enteredPwd){
    return await bcrypt.compare(enteredPwd, this.password);
}

module.exports = mongoose.model('User', UserSchema);