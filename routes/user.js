const express = require('express');
const {
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getStudents, 
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/user');

//include other routes
const subjectRoute = require('./subject');

const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');

//re-route
router.use('/teachers/:teacherid/subjects', subjectRoute);

router.get("/teachers", getTeachers);
router.post("/teachers", createTeacher);
router.get('/teachers/:teacherid', getTeacher );
router.put('/teachers/:teacherid', updateTeacher );
router.delete('/teachers/:teacherid', deleteTeacher);

router.get("/students", getStudents);
router.post("/", createStudent);

router.get('/students/:studentid', getStudent );
router.put('/students/:studentid', updateStudent );
router.delete('/students/:studentid', deleteStudent);

module.exports = router;