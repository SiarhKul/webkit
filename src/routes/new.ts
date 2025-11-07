import { Router } from 'express'
import { UserController } from '../controllers/UserController'

const userRouter = Router()

userRouter.get('/users', UserController.getAllUsers)
userRouter.post('/users', UserController.sighIn)
userRouter.delete('/users/:id', UserController.deleteUserBy)

export { userRouter }
