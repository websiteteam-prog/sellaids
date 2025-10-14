import express from "express";
import { getAllUsersController  } from "../../controllers/admin/userManagementController.js";

const router = express.Router();

router.get("/", getAllUsersController );

export default router;