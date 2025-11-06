import express from 'express'
import { UserController } from '../controllers/UserController'

const userRouter = express.Router()

userRouter
  .route('/user')
  .post(UserController.sighIn)
  .get(UserController.getAllUsers)

export { userRouter }
