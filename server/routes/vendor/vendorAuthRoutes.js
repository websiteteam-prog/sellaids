import express from "express"
import { registerVendorController, loginVendorController, logoutVendorController } from "../../controllers/vendor/vendorAuthController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/register', registerVendorController)
router.post('/login', loginVendorController)
router.post('/logout', logoutVendorController)

export default router