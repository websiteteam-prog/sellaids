import express from "express";
import { userContactFormController, vendorContactFormController } from "../controllers/contactFormController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/user', userContactFormController)
router.post('/vendor', vendorContactFormController)

export default router