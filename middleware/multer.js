const multer = require('multer');

const imagePath = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagePath);
    },
    filename: (req, file, cb) => {
        const name = file.originalname;
        req.fileName = name;
        cb(null, name);
    }
});

const imageUpload = multer({ storage: storage });

module.exports = imageUpload;