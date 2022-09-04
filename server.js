const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const ErrorResponse = require('./utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require("./models/Message");

const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

//load routes
const subject = require('./routes/subject');
const auth = require('./routes/auth');
const users = require('./routes/user');
const quiz = require('./routes/quiz');
const submissions = require('./routes/submission');
const lms = require('./routes/lms');
const reviews = require('./routes/reviews');
const complain = require('./routes/complain');
const message = require('./routes/message');
const admin = require('./routes/admin');
const notification = require('./routes/notification');

const app = express();

const port = process.env.PORT || 5000;

//Body Parser
app.use(express.json())

//cookie parser
app.use(cookieParser());

//logger middleware
app.use(morgan('dev'));

//cors middleware
app.use(cors());

//Sanitize
app.use(mongoSanitize());

//router middleware
app.use('/subjects', subject);
app.use('/auth', auth);
app.use('/users', users);
app.use('/quiz', quiz);
app.use('/submissions', submissions);
app.use('/lms', lms);
app.use('/reviews', reviews);
app.use('/complain', complain);
app.use('/msges', message);
app.use('/admin', admin);
app.use('/notification', notification);

//errorHhandler middleware
app.use(errorHandler);


//socket connection
// io.on('connection', (socket) => {
//     console.log('a user connected');
// });

// let onlineUsers = [];

// const addNewUser = (userName , socketId) => {
//   !onlineUsers.some((user) => user.userName === userName) &&
//     onlineUsers.push({ userName, socketId });
//   console.log('this is username : ' + userName +' this is socket Id : '+ socketId);
//   console.log("in");
// }

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };


// const getUser = (userName) => {
//   return onlineUsers.find((user) => user.userName === userName);
// };

const server = app.listen(port, console.log(`Server is running in port ${port}`));

//socket.io
// const http = require('http');
// const server = http.createServer(app);
const io = require("socket.io")(6000, {
    cors:{
        origin:"*",
        // methods:["GET","POST "],
    },
});
// const msgIo = io.of('/msges');

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decode.id);
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
})



io.on('connection', (socket) => {
//   socket.on('newUser' , (userName) => {
//     addNewUser(userName, socket.id);
    console.log("connected new user" + socket.id)
//   });

    socket.on("viewChat", (subjectid) =>{
        viewUniqueChat(socket.user, subjectid).then(result => {
            socket.broadcast.emit("view",result)
        }).catch((error) => {
            console.log(error)
        })
        .catch(error => {
            console.log(error);
        })
        console.log("socket : " + socket.id);
    })

    // socket.on("sendMessage", (message) => {
    //     var messagex = new Messages(message);
    //     messagex.save();
    // })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log("User Removed!" + socket.id)
        console.log(onlineUsers)
    });
});

const viewUniqueChat = async (user, subjectid, next)=>{ 
    try{ 
        if(user.role == "student"){
            const chat = await Message.findOne({subject: subjectid, student: user._id}).populate({
                path: 'teacher',
                select: 'name'
            });

            if(!chat){
                return next(new ErrorResponse(`Chat not found `, 404));
            }
            
            return {
                success: true,
                data: chat.msg
            };
            
        }else{
            const chat = await Message.findOne({subject: subjectid, teacher: user._id}).populate({
                path: 'student',
                select: 'name'
            });

            if(!chat){
                return next(new ErrorResponse(`Chat not found `, 404));
            }

            return {
                success: true,
                data: chat.msg
            };
        }
    }catch(error) { 
        next(error); 
    } 
}

// const messageEventListener = messages.watch();
// messageEventListener.on('change', change => {
//   console.log(JSON.stringify(change))
// })
// messages.watch().on('change', (data) => {
//   console.log(data);
//   if (data.operationType.localeCompare("insert") == 0) {
//     Connections.findOne({ _id: data.fullDocument.connection }).then((res) => {
//     var receiver = null
//     var sender = null
//     //TODO:Change this != to == for actual receiver
//     if (res.user.toString().localeCompare(data.fullDocument.sender.toString()) == 0) {
//       receiver = res.user2
//       sender = res.user
//     } else {
//       receiver = res.user
//       sender = res.user2
//     }
//     //find receiver
//     var res_id = getUser(receiver.toString());
//     var se_res_id = getUser(sender.toString());
//     if (se_res_id != undefined && se_res_id != null) {
//       console.log("emitting to sender")
//       io.to(se_res_id.socketId).emit("incomingMessages", {
//         data: data.fullDocument,
//         status:res_id != undefined && res_id != null
//       })
//     }
//     if (res_id != undefined && res_id != null) {
//       console.log("emitting to receiver")
//       io.to(res_id.socketId).emit("incomingMessages", {
//         data: data.fullDocument,
//         status:se_res_id != undefined && se_res_id != null
//       })
//       Messages.updateOne({ _id: data.fullDocument._id }, { status: "delivered" }).then((res) => {
//         console.log("Delivery status updated!");
//       }).catch(error => {
//         console.log(error)
//       })
//     }
//   })
//   }
// })



// handle unhandled promise rejections
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
})