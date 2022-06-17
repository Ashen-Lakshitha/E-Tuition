const mongoose =require('mongoose');

const SingleChat =mongoose.model('SingleChat',{
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
    numUnreadmsg:{
        type:Number,
        required:false
    },
    lastmsg:{
        type:String,
        required:false
    },
    lastseentime:{
        type:Number,
        required:false
    },
    lastmsgtime:{
        type:Number,
        required:false
    }
    

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
module.exports ={UserMsg,SingleChat}

// module.exports ={ChatMsg,ChatUniq,UserMsg}

// const mongoose =require('mongoose');



// const UserMsg = new mongoose.Schema({

//     teacher:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//     },
//     student:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//     },
//     msg:[
//         {
//             role: String,
//             text:{
//                 type: String,
//                 required:true
//             },
//             time:{
//                 type: Date,
//                 default: Date.now()
//             },
//             seen:Boolean,
//             delivered:Boolean
//         }
//     ],
//     createdAt:{
//         type: Date,
//         default: Date.now()
//     },
// })

// module.exports = mongoose.model("chatmsg",UserMsg);