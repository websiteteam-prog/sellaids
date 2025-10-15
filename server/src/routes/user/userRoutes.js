import express from "express";
import { userGetProfile, userUpdateProfile } from "../../controllers/user/userController.js";

const router = express.Router();

router.get("/", userGetProfile);
router.put("/", userUpdateProfile);

export default router;