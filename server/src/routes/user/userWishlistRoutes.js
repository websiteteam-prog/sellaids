import express from "express"
import { addWishlistController, removeWishlistController, getAllWishlistController } from "../../controllers/user/userWishlistController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

router.post("/", isUserLoginIn, addWishlistController)
router.get("/", isUserLoginIn, getAllWishlistController)
router.delete("/:productId", isUserLoginIn, removeWishlistController)

export default router