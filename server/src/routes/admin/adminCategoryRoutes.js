import express from "express";
import { createCategoryController } from "../../controllers/admin/adminCategoryController.js"
import { isAdminLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

router.post("/", isAdminLoginIn, createCategoryController);

export default router;
