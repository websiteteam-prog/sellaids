import express from "express";
import { createProductController, getSingleProductController, getAllProductController, updateProductController, deleteProductController } from "../../controllers/user/productController.js"

// define router object
const router = express.Router();

// define all routes
router.post("/", createProductController);
router.get("/:id", getSingleProductController);
router.get("/", getAllProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;
