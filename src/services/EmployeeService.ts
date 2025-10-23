const EmployeeRepository = require('../repositories/EmployeeRepository')

class EmployeeService {
    static getAllEmployees() {
        return EmployeeRepository.getAllEmployees()
    }
}
module.exports = EmployeeService
