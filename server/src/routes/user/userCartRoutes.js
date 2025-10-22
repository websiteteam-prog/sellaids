import express from "express"
import { addToCartController } from "../../controllers/user/userCartController.js"
// import { sessionMiddleware } from "../../config/session.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()


router.post("/", isUserLoginIn, addToCartController);

export default router