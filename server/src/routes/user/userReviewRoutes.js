// routes/review/reviewRoutes.js
import express from "express";
import {
  addReviewController,
  getProductReviewsController,
  deleteReviewController,
} from "../../controllers/user/userReviewController.js";
import { isUserLoginIn, isAdminLoginIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", isUserLoginIn, addReviewController);

router.get("/product/:productId", getProductReviewsController);

router.delete("/:reviewId", isAdminLoginIn, deleteReviewController);

export default router;