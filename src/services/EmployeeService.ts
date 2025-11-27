import EmployeeRepository from '../repositories/EmployeeRepository.js'

class EmployeeService {
  static async getAllEmployees() {
    return await EmployeeRepository.getAllEmployees()
  }
}
export default EmployeeService
