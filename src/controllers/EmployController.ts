import type { Request, Response } from 'express'
import EmployeeService from '../services/EmployeeService.js'

export class EmployController {
    static getAllEmployees = async (req: Request, res: Response) => {
        const empl = EmployeeService.getAllEmployees()
        res.json(empl)
    }
}
