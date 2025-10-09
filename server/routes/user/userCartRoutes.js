import express from "express";
import { addCartUserController, getAllCartUserController, getCartUserController, updateCartQuantityController, removeCartUserController } from "../../controllers/user/userCartController.js";
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/", isUserLoginIn, addCartUserController);
router.get("/", isUserLoginIn, getAllCartUserController);
router.get("/:cartId", isUserLoginIn, getCartUserController);
router.patch("/:cartId/quantity", isUserLoginIn, updateCartQuantityController);
router.delete("/:cartId", isUserLoginIn, removeCartUserController);

export default router;