import express from "express";
import { getAllUsersController, getAllVendorsController } from "../../controllers/admin/adminManagementController.js";

const router = express.Router();

router.get("/user", getAllUsersController);
router.get("/vendor", getAllVendorsController);
// router.get("/product", getAllProductsController);

export default router;
