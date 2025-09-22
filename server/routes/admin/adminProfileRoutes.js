import express from "express";
import { getAdminProfileController, updateAdminProfileController } from "../../controllers/admin/adminProfileController.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', getAdminProfileController)
router.put('/:id', updateAdminProfileController)

export default router