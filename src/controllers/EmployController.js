import EmployeeService from '../services/EmployeeService.js'
class EmployController {
    static getAllUsers = async (req, res) => {
        const empl = EmployeeService.getAllEmployees()
        res.json(empl)
    }
}
export default EmployController
//# sourceMappingURL=EmployController.js.map
