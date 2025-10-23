import express, { type Router } from 'express'
import EmployController from '../controllers/EmployController.js'

const employeeRouter: Router = express.Router()

employeeRouter.get('/', EmployController.getAllUsers)

export { employeeRouter }
