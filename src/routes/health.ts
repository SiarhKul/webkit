import { Router } from 'express'
import { HealthCheck } from '../controllers/HealthCheck'

const healthRouter = Router()

healthRouter.route('/health/live').get(HealthCheck.liveness)

healthRouter.route('/health/ready').get(HealthCheck.readiness)

export { healthRouter }
