import express from "express";
import { createProductCategoryController, getAllProductCategoryController } from "../../controllers/admin/adminProductCategoryController.js"
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/", isAdminLoginIn, createProductCategoryController);
router.get("/", isAdminLoginIn, getAllProductCategoryController);

export default router;