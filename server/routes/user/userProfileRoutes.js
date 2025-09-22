import express from "express";
import { getUserProfileController, updateUserProfileController } from "../../controllers/user/userProfileController.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', getUserProfileController)
router.put('/:id', updateUserProfileController)

export default router