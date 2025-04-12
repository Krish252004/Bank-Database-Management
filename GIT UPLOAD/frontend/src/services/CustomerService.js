import api from "./api"

// Get all customers
export const getCustomers = async () => {
  try {
    const response = await api.get("/customers")
    return response.data
  } catch (error) {
    console.error("Error fetching customers:", error)
    throw error
  }
}

// Get customer by ID
export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error)
    throw error
  }
}

// Get customer by email
export const getCustomerByEmail = async (email) => {
  try {
    const response = await api.get(`/customers/email/${email}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching customer with email ${email}:`, error)
    return null
  }
}

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/customers", customerData)
    return response.data
  } catch (error) {
    console.error("Error creating customer:", error)
    throw error
  }
}

// Update a customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error)
    throw error
  }
}

// Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error)
    throw error
  }
}

// Authenticate customer
export const authenticateCustomer = async (email, password) => {
  try {
    const response = await api.post("/auth/customer/login", { email, password })
    return response.data
  } catch (error) {
    console.error("Authentication failed:", error)
    return null
  }
}
