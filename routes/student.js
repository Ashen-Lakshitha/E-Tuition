const express = require('express');
const {
    getStudents, 
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/student');

const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');

router.get("/", getStudents);
router.post("/", createStudent);

router.get('/:studentid', getStudent );
router.put('/:studentid', updateStudent );
router.delete('/:studentid', deleteStudent);
// localhost:5000/students/17879446161

module.exports = router;