import express from "express";
import { userContactFormController, vendorContactFormController } from "../controllers/contactFormController.js"
import { isVendorLoginIn } from "../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.post('/user', userContactFormController)
router.post('/vendor', isVendorLoginIn, vendorContactFormController)

export default router