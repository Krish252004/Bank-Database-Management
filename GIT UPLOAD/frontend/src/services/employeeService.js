import api from "./api"

// Get all employees
export const getEmployees = async () => {
  try {
    const response = await api.get("/employees")
    return response.data
  } catch (error) {
    console.error("Error fetching employees:", error)
    throw error
  }
}

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error)
    throw error
  }
}

// Get employee by email
export const getEmployeeByEmail = async (email) => {
  try {
    const response = await api.get(`/employees/email/${email}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching employee with email ${email}:`, error)
    return null
  }
}

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employees/add", employeeData)
    return response.data
  } catch (error) {
    console.error("Error creating employee:", error)
    throw error
  }
}

// Update an existing employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error)
    throw error
  }
}

// Delete an employee
export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error)
    throw error
  }
}

// Authenticate employee
export const authenticateEmployee = async (email, password) => {
  try {
    const response = await api.post("/auth/employee/login", { email, password })
    return response.data
  } catch (error) {
    console.error("Authentication failed:", error)
    return null
  }
}
