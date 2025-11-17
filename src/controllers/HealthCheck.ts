import { SuccessResponse } from '../sharable/jsend/SuccessResponse'
import { Request, Response, NextFunction } from 'express'

export class HealthCheck {
  static healthCheck = (_req: Request, res: Response, _: NextFunction) => {
    return res.status(200).json(new SuccessResponse<string>('Server is life'))
  }
}
