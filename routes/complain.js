const express = require('express');

const {
    getComplains,
    getComplain,
    createComplain,
    deleteComplain,
} = require('../controllers/complain');

const router = express.Router();

const { protect, authorize, verify} = require('../middleware/auth');

router.get("/", protect, authorize('admin'), getComplains );
router.get('/:complainid', protect, getComplain );

router.post('/',protect, authorize('teacher, student'), verify, createComplain);

router.delete('/:complainid', protect, authorize('teacher', 'student'), deleteComplain );

module.exports = router;