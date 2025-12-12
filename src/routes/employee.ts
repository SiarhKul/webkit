import express from 'express'
import { EmployController } from '../controllers/EmployController.js'

const employeeRouter = express.Router()

employeeRouter.get('/employees', EmployController.getAllEmployees)

export { employeeRouter }
