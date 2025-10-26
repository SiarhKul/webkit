import EmployeeRepository from '../repositories/EmployeeRepository.js'

class EmployeeService {
    static async getAllEmployees() {
        return EmployeeRepository.getAllEmployees()
    }
}
export default EmployeeService
