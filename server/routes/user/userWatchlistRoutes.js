import express from "express";
import { addUserWatchlistController, getAllUserWatchlistController, removeUserWatchlistController } from "../../controllers/user/userWatchlistController.js";
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/", isUserLoginIn, addUserWatchlistController);
router.get("/", isUserLoginIn, getAllUserWatchlistController);
router.delete("/:itemId", isUserLoginIn, removeUserWatchlistController);

export default router;