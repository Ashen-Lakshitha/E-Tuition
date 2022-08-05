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

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

router.get('/',protect, getLms);
router.post('/',protect, authorize('teacher'), createLms);
router.post('/:lmsid/lmsfiles',protect, authorize('teacher'), imageUpload.single('documents'), addClassMaterials );
router.post('/:lmsid/lmsdoc',protect, authorize('teacher'), addClassMaterials );
router.put('/:lmsid', protect, authorize('teacher'), updateLms);
router.put('/:lmsid/lmsdoc/:docid', protect, authorize('teacher'), updateClassMaterials);
router.delete('/:lmsid/lmsdoc/:docid', protect, authorize('teacher'), deleteClassMaterials)
router.delete('/:lmsid',protect, authorize('teacher'), deleteLms);

module.exports = router;