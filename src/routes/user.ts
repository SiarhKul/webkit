import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { validateParameter } from '../middlewares/validateParameter'

const userRouter = Router()

userRouter.get('/user', UserController.getAllUsers)
userRouter.post('/user', UserController.sighIn)
userRouter.delete(
  '/user/:id',
  validateParameter('id'),
  UserController.deleteUserBy
)

export { userRouter }
