import { Router } from 'express'
import { HealthCheck } from '../controllers/HealthCheck'

const healthRouter = Router()

// Liveness probe - checks if the process is alive
healthRouter.route('/health/live').get(HealthCheck.liveness as never)

// Readiness probe - checks if the app is ready to serve traffic
healthRouter.route('/health/ready').get(HealthCheck.readiness as never)

export { healthRouter }
