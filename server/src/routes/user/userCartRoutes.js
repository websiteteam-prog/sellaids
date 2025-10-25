import express from "express"
import { addCartController, getCartController, removeCartController, updateCartQuantityController, getCartItemController } from "../../controllers/user/userCartController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// router.post("/", isUserLoginIn, addCartController)
// router.get("/", isUserLoginIn, getCartController)
// router.delete("/:productId", isUserLoginIn, removeCartController)

// router.post("/", isUserLoginIn, addCartController);
// router.post("/decrease", isUserLoginIn, decreaseCartController);
// router.delete("/:productId", isUserLoginIn, removeCartController);
// router.get("/", isUserLoginIn, getCartController);

router.post("/add", isUserLoginIn, addCartController);
router.put("/:cartId", isUserLoginIn, updateCartQuantityController); // action: increase/decrease
router.delete("/:cartId", isUserLoginIn, removeCartController);
router.get("/", isUserLoginIn, getCartController);
router.get("/:cartId", isUserLoginIn, getCartItemController);

export default router