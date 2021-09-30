const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user');

const router = express.Router();

//include other routes
const subjectRoute = require('./subject');

//Security
// const { protect, authorize } = require('../middleware/auth');

//re-route
router.use('/:userid/subjects', subjectRoute);

router.get("/", getUsers );
router.get('/:userid', getUser );
router.put('/:userid', updateUser );
router.delete('/:userid', deleteUser );

// router.post("/teachers/:teacherid/reviews", addReview);
// router.put("/teachers/:teacherid/reviews/:reviewid", updateReview);
// router.delete("/teachers/:teacherid/reviews/:reviewid", deleteReview);

module.exports = router;