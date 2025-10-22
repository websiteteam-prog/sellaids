import express from "express"
import userAuthRoutes from "./userAuthRoutes.js"
import userAddressRoutes from "./userAddressRoutes.js"
import userCartRoutes from './userCartRoutes.js'
import userWishlistRoutes from './userWishlistRoutes.js'
import userOrderRoutes from './userOrderRoutes.js'
import userSupportRoutes from './userSupportRoutes.js'
import userRoutes from './userRoutes.js'
import userDashboardRoutes from "./userDashboardRoutes.js"

const router = express.Router()

router.use("/auth", userAuthRoutes)
router.use("/address", userAddressRoutes)
router.use("/cart", userCartRoutes)
router.use("/wishlist", userWishlistRoutes)
router.use("/order", userOrderRoutes)
router.use("/support", userSupportRoutes)
router.use("/profile", userRoutes)
router.use("/dashboard", userDashboardRoutes)

export default router