import express from "express";
import { getUserProfileController, updateUserProfileController } from "../../controllers/user/userProfileController.js"
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', isUserLoginIn, getUserProfileController)
router.put('/:id', isUserLoginIn, updateUserProfileController)

export default router