import express from "express"
import adminAuthRoutes from "./adminAuthRoutes.js"
import adminCategoryRoutes from "./adminCategoryRoutes.js"
// import userManagementRoutes from "./userManagementRoutes.js"
// import vendorManagementRoutes from "./vendorManagementRoutes.js"
import adminManagementRoutes from "./adminManagementRoutes.js"

const router = express.Router()

router.use("/auth", adminAuthRoutes)
router.use("/category", adminCategoryRoutes)
// router.use("/user", userManagementRoutes)
// router.use("/management", vendorManagementRoutes)
router.use("/management", adminManagementRoutes)

export default router