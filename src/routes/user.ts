import { Router } from 'express'
import { UserController } from '../controllers/UserController'

const userRouter = Router()

userRouter.get('/user', UserController.getAllUsers)
userRouter.post('/user', UserController.sighIn)
userRouter.delete('/user/:id', UserController.deleteUserBy)

export { userRouter }
