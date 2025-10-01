import express from "express";
import { contactFormController } from "../controllers/contactFormController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/', contactFormController)

export default router