import express from "express";
import { getAllAdminWatchlistProductController, removeAdminWatchlistController } from "../../controllers/admin/adminWatchlistController.js";
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.get("/", isAdminLoginIn, getAllAdminWatchlistProductController);
router.delete("/:watchlistId", isAdminLoginIn, removeAdminWatchlistController);


export default router;