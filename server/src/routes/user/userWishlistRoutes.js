import express from "express"
import { userAddAddressController, userGetAddressController, userChangeAddressController } from "../../controllers/user/userWishlistController.js"
// import { sessionMiddleware } from "../../config/session.js"
// import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// router.add("/", isUserLoginIn, userAddAddressController)
// router.get("/", isUserLoginIn, userGetAddressController)
// router.delete("/", isUserLoginIn, userChangeAddressController)
router.add("/", userAddAddressController)
router.get("/", userGetAddressController)
router.delete("/", userChangeAddressController)

export default router