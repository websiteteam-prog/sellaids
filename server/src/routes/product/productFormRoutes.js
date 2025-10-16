import express from "express";
import { addProductController, getCategories, getProductTypes, getAllProductsController, getProductByIdController, getDashboardController, getEarningsController } from "../../controllers/product/productFormController.js";
import { isVendorLoginIn } from "../../middlewares/authMiddlewares.js";
import { upload } from "../../middlewares/productUpload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "front_photo", maxCount: 1 },
  { name: "back_photo", maxCount: 1 },
  { name: "label_photo", maxCount: 1 },
  { name: "inside_photo", maxCount: 1 },
  { name: "button_photo", maxCount: 1 },
  { name: "wearing_photo", maxCount: 1 },
  { name: "invoice_photo", maxCount: 1 },
  { name: "repair_photo", maxCount: 1 },
  { name: "more_images", maxCount: 10 },
]);

// For Form Apis of Vendor
router.post("/add", isVendorLoginIn, uploadFields, addProductController);
router.get("/categories-list", getCategories);
router.get("/", getProductTypes);

// For Fetch Products Apis for vendors
router.get("/products-list", isVendorLoginIn, getAllProductsController); 
router.get("/products/:id", getProductByIdController); 

// Dashboard API For vendors
router.get("/dashboard", isVendorLoginIn, getDashboardController);

// Earnings API For vendors
router.get("/earnings", getEarningsController);


export default router;