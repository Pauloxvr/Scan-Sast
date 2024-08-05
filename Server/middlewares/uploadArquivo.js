const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/upload')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const extensaoArq = ['application/zip', '','application/x-zip-compressed'].find
        (formatoAceito => formatoAceito == file.mimetype);

        if(extensaoArq){
            return cb(null, true);           

        }

        return cb(null, false);
    }
}));