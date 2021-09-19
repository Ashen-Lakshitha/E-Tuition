const express = require('express');
const {
    getTeachers, 
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacher');

//include other routes
const subjectRoute = require('./subject');

const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');

//re-route
router.use('/:teacherid/subjects', subjectRoute);

router.get("/", getTeachers);
router.post("/", createTeacher);

router.get('/:teacherid', getTeacher );
router.put('/:teacherid', updateTeacher );
router.delete('/:teacherid', deleteTeacher);

module.exports = router;