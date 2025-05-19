import api from "./api"

// Get all accounts or accounts by customer ID
export const getAccounts = async (customerId = null) => {
  try {
    let url = "/accounts"
    if (customerId) {
      url += `?customerId=${customerId}`
    }

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching accounts:", error)

    // Return empty array on error to prevent UI crashes
    return []
  }
}

// Get account by ID
export const getAccountById = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching account:", error)
    return null
  }
}

// Create a new account
export const createAccount = async (accountData) => {
  try {
    console.log("Creating account with data:", accountData);
    const response = await api.post("/accounts", accountData);
    console.log("Account creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    if (error.response) {
      console.error("Server error response:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
}

// Update an account
export const updateAccount = async (id, accountData) => {
  try {
    const response = await api.put(`/accounts/${id}`, accountData)
    return response.data
  } catch (error) {
    console.error("Error updating account:", error)
    throw error
  }
}

// Delete an account
export const deleteAccount = async (id) => {
  try {
    const response = await api.delete(`/accounts/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}

// Get account balance
export const getAccountBalance = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}/balance`)
    return response.data
  } catch (error) {
    console.error("Error fetching account balance:", error)
    return null
  }
}

// Get account statement (transactions)
export const getAccountStatement = async (accountId, startDate = null, endDate = null) => {
  try {
    let url = `/accounts/${accountId}/transactions`
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching account statement:", error)
    return null
  }
}

// Get available account types
export const getAccountTypes = async () => {
  try {
    const response = await api.get("/accounts/types")
    return response.data
  } catch (error) {
    console.error("Error fetching account types:", error)
    // Return default account types if API fails
    return [
      { value: "Savings", label: "Savings Account" },
      { value: "Current", label: "Current Account" },
      { value: "Fixed Deposit", label: "Fixed Deposit Account" },
      { value: "Recurring Deposit", label: "Recurring Deposit Account" }
    ]
  }
}

// Get branches
export const getBranches = async () => {
  try {
    const response = await api.get("/branches")
    return response.data
  } catch (error) {
    console.error("Error fetching branches:", error)
    // Return default branch if API fails
    return [
      { Branch_ID: 1, Branch_Name: "Connaught Place Branch" },
      { Branch_ID: 2, Branch_Name: "MG Road Branch" },
      { Branch_ID: 3, Branch_Name: "Koramangala Branch" }
    ]
  }
}

// Check if account exists by account number
export const checkAccountExists = async (accountNumber) => {
  try {
    const response = await api.get(`/accounts/verify/${accountNumber}`)
    return response.data
  } catch (error) {
    console.error("Error checking account:", error)
    return false
  }
}

// Get account by IFSC and account number (for verification)
export const getAccountByIFSCAndNumber = async (ifsc, accountNumber) => {
  try {
    const response = await api.get(`/accounts/search?ifsc=${ifsc}&accountNumber=${accountNumber}`)
    return response.data
  } catch (error) {
    console.error("Error fetching account:", error)
    return null
  }
}
