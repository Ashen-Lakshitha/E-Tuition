const express = require('express');
const imageUpload = require('../middleware/multer');

const {
    getPayments,
    getUserPayment,
    pay,
} = require('../controllers/payment');

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

router.get('/',protect, getPayments);
router.get('/:stdid',protect, authorize('student'), getUserPayment);
router.post('/',protect, authorize('student'), imageUpload.single('payment'), pay );

module.exports = router;