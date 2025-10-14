import express from "express";
import { createCategoryController, getAllCategoriesController } from "../../controllers/admin/adminCategoryController.js"
import { isAdminLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

router.post("/", isAdminLoginIn, createCategoryController);
router.get("/", getAllCategoriesController);

export default router;