import { SuccessResponse } from '../sharable/jsend/SuccessResponse'
import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../integrations/postgress/data-source'
import { config } from '../integrations/config'

const startTime = Date.now()

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'up' | 'down'
      responseTime?: number
    }
    loki?: {
      status: 'up' | 'down'
      responseTime?: number
    }
  }
}

export class HealthCheck {
  static liveness = (_req: Request, res: Response) => {
    return res.status(200).json(
      new SuccessResponse({
        status: 'alive',
        timestamp: new Date().toISOString(),
      })
    )
  }

  static readiness = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const healthStatus: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
        checks: {
          database: { status: 'down' },
        },
      }

      // Check database connectivity
      try {
        const dbStartTime = Date.now()
        if (AppDataSource.isInitialized) {
          await AppDataSource.query('SELECT 1')
          healthStatus.checks.database = {
            status: 'up',
            responseTime: Date.now() - dbStartTime,
          }
        } else {
          healthStatus.checks.database.status = 'down'
          healthStatus.status = 'unhealthy'
        }
      } catch {
        healthStatus.checks.database.status = 'down'
        healthStatus.status = 'unhealthy'
      }

      // Check Loki connectivity
      if (config.LOG_TO_LOKI && config.LOKI_HOST) {
        try {
          const lokiStartTime = Date.now()
          const response = await fetch(`${config.LOKI_HOST}/ready`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
          })
          healthStatus.checks.loki = {
            status: response.ok ? 'up' : 'down',
            responseTime: Date.now() - lokiStartTime,
          }
          if (!response.ok) {
            healthStatus.status = 'unhealthy'
          }
        } catch {
          healthStatus.checks.loki = { status: 'down' }
          healthStatus.status = 'unhealthy'
        }
      }

      const statusCode = healthStatus.status === 'healthy' ? 200 : 503
      res.status(statusCode).json(new SuccessResponse(healthStatus))
    } catch (error) {
      next(error)
    }
  }
}
