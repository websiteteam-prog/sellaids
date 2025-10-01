import express from "express";
import { getAllAdminProductController, getSingleAdminProductController, deleteAdminProductController, statusUpdateAdminProductController } from "../../controllers/admin/adminProductController.js";

// define router object
const router = express.Router();

// define all routes
router.get("/", getAllAdminProductController);
router.get("/:productId", getSingleAdminProductController);
router.delete("/:productId", deleteAdminProductController);
router.patch("/:productId/status", statusUpdateAdminProductController);

export default router;