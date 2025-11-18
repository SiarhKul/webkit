import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { validateParameter } from '../middlewares/validateParameter'
import { limiter } from '../middlewares/rateLimiter'
import { speedLimiter } from '../middlewares/speedLimiter'
const userRouter = Router()

userRouter.use(limiter)
userRouter.use(speedLimiter)

userRouter.get('/user', UserController.getAllUsers)
userRouter.post('/user', UserController.sighIn)
userRouter.get('/user/:id', validateParameter('id'), UserController.getUserById)
userRouter.put('/user/:id', validateParameter('id'), UserController.updateUser)
userRouter.delete(
  '/user/:id',
  validateParameter('id'),
  UserController.deleteUserBy
)

export { userRouter }
