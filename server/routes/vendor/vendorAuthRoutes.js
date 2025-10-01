import express from "express"
import { registerVendorController, loginVendorController, logoutVendorController } from "../../controllers/vendor/vendorAuthController.js"
// import { vendorUpload } from "../../middlewares/upload.js"
import upload from "../../middlewares/upload.js"

// define router object
const router = express.Router()

// define all routes
router.post('/register', upload.fields([
  { name: 'gstCertificateDocument', maxCount: 1 },
  { name: 'panCardDocument', maxCount: 1 },
  { name: 'businessLicenseDocument', maxCount: 1 },
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 },
  { name: 'bankDocument', maxCount: 1 }
]), registerVendorController)
router.post('/login', loginVendorController)
router.post('/logout', logoutVendorController)

export default router