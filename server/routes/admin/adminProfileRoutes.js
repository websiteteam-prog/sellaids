import express from "express";
import { getAdminProfileController, updateAdminProfileController } from "../../controllers/admin/adminProfileController.js"
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', isAdminLoginIn, getAdminProfileController)
router.put('/:id', isAdminLoginIn, updateAdminProfileController)

export default router