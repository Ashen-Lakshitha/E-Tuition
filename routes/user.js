const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyClasses
} = require('../controllers/user');

const router = express.Router();

//include other routes
const subjectRoute = require('./subject');

//Security
const { protect } = require('../middleware/auth');

//re-route
router.use('/:userid/subjects', subjectRoute);

router.get("/",protect, getUsers );
router.get('/myclasses',protect, getMyClasses );
router.get('/:userid',protect, getUser );
router.put('/',protect, updateUser );
router.delete('/',protect, deleteUser );

module.exports = router;