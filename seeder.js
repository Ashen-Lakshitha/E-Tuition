const fs = require('fs');
const mongoose = require('mongoose');

//load models
// const Bootcamp = require('./models/Bootcamp');
const Subject = require('./models/Subject');
const User = require('./models/User');
// const Review = require('./models/Review');

//connect database
mongoose.connect('mongodb+srv://ashen123:ashen123@cluster0.aipej.mongodb.net/etuition?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//read JSON
// const bootcamps = JSON.parse(
//     fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8')
// );

const subjects = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/subjects.json`,'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8')
);

// const reviews = JSON.parse(
//     fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8')
// );

//import data to database
const importData = async () => {
    try {
        // await Bootcamp.create(bootcamps);
        await User.create(users);
        // await Review.create(reviews);
        // await Teacher.create(teachers);
        // await Student.create(students);
        console.log('Data imported');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

//delete all data
const deleteData = async () => {
    try {
        // await Bootcamp.deleteMany();
        // await Course.deleteMany();
        await User.deleteMany();
        // await Review.deleteMany();
        console.log('Data deleted');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}