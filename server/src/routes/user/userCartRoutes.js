import express from "express"
import { userAddAddressController, userGetAddressController, userChangeAddressController } from "../../controllers/user/userAddressController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

router.put("/register", isUserLoginIn, userAddAddressController)
router.get("/login", isUserLoginIn, userGetAddressController)
router.put("/logout", isUserLoginIn, userChangeAddressController)

export default router