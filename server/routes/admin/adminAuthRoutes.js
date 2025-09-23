import express from "express";
import { registerAdminController, loginAdminController, logoutAdminController } from "../../controllers/admin/adminAuthController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/register', registerAdminController)
router.post('/login', loginAdminController)
router.post('/logout', logoutAdminController)

export default router