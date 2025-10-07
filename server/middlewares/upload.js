import multer from "multer"
import path from "path"



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/vendors/products");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage })
export const uploadFields = upload.fields([
    { name: 'frontPhoto', maxCount: 1 },
    { name: 'backPhoto', maxCount: 1 },
    { name: 'labelPhoto', maxCount: 1 },
    { name: 'insidePhoto', maxCount: 1 },
    { name: 'buttonPhoto', maxCount: 1 },
    { name: 'wearingPhoto', maxCount: 1 },
    { name: 'invoicePhoto', maxCount: 1 },
    { name: 'repairPhoto', maxCount: 1 },
    { name: 'moreImages', maxCount: 10 } // multiple allowed
]);
export default upload