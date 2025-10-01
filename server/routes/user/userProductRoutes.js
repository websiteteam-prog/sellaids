import express from "express";
import { getAllUserProductController, getSingleUserProductController } from "../../controllers/user/userProductController.js";

// define router object
const router = express.Router();

// define all routes
router.get("/", getAllUserProductController);
router.get("/:productId", getSingleUserProductController);

export default router;