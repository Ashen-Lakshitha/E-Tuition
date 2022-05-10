const mongoose =require('mongoose');

const ChatMsg =mongoose.model('Chat',{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    }

});

const ChatUniq =mongoose.model('UniqeChat',{
    uniqchatid:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    reciever:{
        type:String,
        required:true
    },

});

const UserMsg = mongoose.model('UserMsg',{
    uniqeCID:{
        type: String,
        required:true
    },
    sender:{
        type: String,
        required:true
    },
    receiver:{
        type: String,
        required:true
    },
    msg:{
        type: String,
        required:true
    },
    time:{
        type: String,
        required:true
    },
    seen:{
        type: String,
        required:true
    },
    delivered:{
        type: String,
        required:true
    },
})

module.exports ={ChatMsg,ChatUniq,UserMsg}