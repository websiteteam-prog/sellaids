import express from "express";
import { getAllVendorsController } from "../../controllers/admin/vendorManagementController.js";

const router = express.Router();

router.get("/", getAllVendorsController);

export default router;
