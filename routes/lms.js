const express = require('express');
const imageUpload = require('../middleware/multer');

const {
    getLms,
    createLms,
    addClassMaterials,
    updateLms,
    updateClassMaterials,
    deleteClassMaterials,
    deleteLms
} = require('../controllers/lms');

//get subject's " const lmsRoute = require('./lms')" "
const router = express.Router({mergeParams: true});
//Security
const { protect, authorize } = require('../middleware/auth');

router.get('/',protect, getLms);
router.post('/',protect,createLms);
router.post('/:lmsid/lmsdoc',protect, imageUpload.single('documents'), addClassMaterials );
router.put('/:lmsid', protect, updateLms);
router.put('/:lmsid/lmsdoc/:docid', protect, updateClassMaterials);
router.delete('/:lmsid/lmsdoc/:docid', protect, authorize('teacher'), deleteClassMaterials)
router.delete('/:lmsid',protect, deleteLms);

module.exports = router;