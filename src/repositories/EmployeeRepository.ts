class EmployeeRepository {
  static getAllEmployees() {
    return Promise.resolve([{ id: 1 }, { id: 2 }])
  }
}

export default EmployeeRepository
