const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
// const mongoSanitize = require('express-mongo-sanitize');

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
// const review = require('./routes/review');

const app = express();
const port = 5000;

//Body Parser
app.use(express.json())

//cookie parser
app.use(cookieParser());

//logger middleware
app.use(morgan('dev'));

//cors middleware
app.use(cors());

// //Sanitize
// app.use(mongoSanitize());

//router middleware
app.use('/subjects', subject);
app.use('/auth', auth);
app.use('/users', users);
app.use('/quizzes', quiz);
// app.use('/review', review);

//errorHhandler middleware
app.use(errorHandler);

const server = app.listen(port, console.log(`Server is running in port ${port}`));

//handle unhandled promise rejections
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
})