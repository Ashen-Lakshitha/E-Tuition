const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');

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
 const { Server } = require("socket.io");
  
const app = express();
const port = process.env.PORT || 5000;
//var server = http.createServer(app);



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



const server = app.listen(port, console.log(`Server is running in port ${port}`));
const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET","POST "],
    },
});

io.on("connection",(socket)=>{
    console.log("User Connected :",socket.id);

    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room : ${data}`)
    });

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message", data);
        //console.log(data);
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected :",socket.id);
    })
})
//handle unhandled promise rejections
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
})