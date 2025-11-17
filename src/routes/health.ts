import { Router } from 'express'
import { HealthCheck } from '../controllers/HealthCheck'

const healthRouter = Router()

healthRouter.route('/health').get(HealthCheck.healthCheck)

export { healthRouter }
