const express = require('express');
const {
    getclassmaterials,
    createclassmaterials,
    updateclassmaterials,
    deleteclassmaterials,
} = require('../controllers/lms');

const router = express.Router();

//Security
const { protect } = require('../middleware/auth');

router.get('/',protect, getclassmaterials);
router.post('/',protect,createclassmaterials);
router.put('/:lmsid',protect, updateclassmaterials );
router.delete('/:lmsid',protect, deleteclassmaterials );

// router.post('/',(req,res)=>{
//     const clsmat = new lmsSchema({
//         mtitle: req.body.mtitle,
//         content: req.body.stitle,
//         content : [{
//             stitle : req.body.stitle,
//             document : req.body.document,
//         }],
//         description: req.body.description,
//     });
//     clsmat.save((err,data)=>{
//         res.status(200).json({code:200,clsmat:"class materials save successfully",clsmatData:data});
//     })
// });




// router.get('/',(req,res)=>{
//     lmsSchema.find({},(err,data)=>{
//         if(!err){
//             res.send(data);
//             console.log(data.length);
//         }else{
//             console.log(err);
//         }
//     })
// });

module.exports = router;