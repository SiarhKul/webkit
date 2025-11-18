import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { validateParameter } from '../middlewares/validateParameter'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.
})

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
