import express from "express";
import { addCartUserController, getCartUserController, removeCartUserController } from "../../controllers/user/userCartController.js";

// define router object
const router = express.Router();

// define all routes
router.post("/", addCartUserController);
router.get("/:itemId", getCartUserController);
router.delete("/:itemId", removeCartUserController);

export default router;