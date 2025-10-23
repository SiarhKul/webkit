import type { Request, Response } from 'express'

const EmployeeService = require('../services/EmployeeService')
class EmployController {
    static getAllUsers = async (req: Request, res: Response) => {
        const empl = EmployeeService.getAllEmployees()
        res.json(empl)
    }
}

module.exports = EmployController
