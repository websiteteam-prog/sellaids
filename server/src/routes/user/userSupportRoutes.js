import express from "express"
import { userCreateTicketController } from "../../controllers/user/userSupportController.js"
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

// ticket rased 
router.post("/", isUserLoginIn, userCreateTicketController)

export default router