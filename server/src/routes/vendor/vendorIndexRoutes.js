import express from "express"
import vendorAuthRoutes from "./vendorAuthRoutes.js"
import vendorSupportRoutes from './vendorSupportRoutes.js'

const router = express.Router()

router.use("/auth", vendorAuthRoutes)
router.use("/support", vendorSupportRoutes)

export default router