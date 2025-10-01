import express from "express";
import { getAllAdminWatchlistProductController } from "../../controllers/admin/adminWatchlistController.jss";
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.get("/", isAdminLoginIn, getAllAdminWatchlistProductController);

export default router;