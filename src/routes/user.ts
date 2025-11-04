import express from 'express'
import { UserController } from '../controllers/UserController'

const userRouter = express.Router()

userRouter
  .route('/')
  .post(UserController.sighIn)
  .get(UserController.getAllUsers)

export { userRouter }
