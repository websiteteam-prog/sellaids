import multer from "multer"
import path from "path"
import fs from "fs"

// Map for different document types
const folderMap = {
    gstCertificateDocument: "uploads/gst",
    panCardDocument: "uploads/pan",
    businessLicenseDocument: "uploads/businessLicense",
    aadhaarFront: "uploads/aadhaar",
    aadhaarBack: "uploads/aadhaar",
    bankDocument: "uploads/bank"
  };

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, "uploads/vendors/");
    // },
    destination: (req, file, cb) => {
        const folder = folderMap[file.fieldname] || "uploads/other";
        const dir = path.join(process.cwd(), folder);

        // Agar folder exist nahi karta, to bana do
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage })
export default upload