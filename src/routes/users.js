import express from 'express'
import EmployController from '../controllers/EmployController.js'
const router = express.Router()
router.get('/', EmployController.getAllUsers)
export default router
//# sourceMappingURL=users.js.map
