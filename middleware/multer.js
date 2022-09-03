const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const name = file.originalname;
        req.fileName = name;
        cb(null, name);
    }
});

const imageUpload = multer({ storage: storage });

module.exports = imageUpload;