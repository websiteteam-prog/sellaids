import express from "express";
import { getAdminProfileController, updateAdminProfileController } from "../../controllers/admin/adminProfileController.js"
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.get('/', isAdminLoginIn, getAdminProfileController)
router.put('/', isAdminLoginIn, updateAdminProfileController)

export default router