import express from 'express'
import { UserController } from '../controllers/UserController'

const userRouter = express.Router()

userRouter
  .route('/users')
  .post(UserController.sighIn)
  .get(UserController.getAllUsers)

export { userRouter }
