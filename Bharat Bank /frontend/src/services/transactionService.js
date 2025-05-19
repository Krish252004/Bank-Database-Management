import api from "./api"

// Get all transactions
export const getTransactions = async (filters = {}) => {
  try {
    let url = "/transactions"
    const params = new URLSearchParams()
    
    if (filters.accountId) params.append("accountId", filters.accountId)
    if (filters.customerId) params.append("customerId", filters.customerId)
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.type) params.append("type", filters.type)
    if (filters.minAmount) params.append("minAmount", filters.minAmount)
    if (filters.maxAmount) params.append("maxAmount", filters.maxAmount)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

// Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error)
    throw error
  }
}

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/transactions", transactionData)
    return response.data
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

// Get transactions by account ID
export const getTransactionsByAccount = async (accountId) => {
  try {
    const response = await api.get(`/accounts/${accountId}/transactions`)
    return response.data
  } catch (error) {
    console.error(`Error fetching transactions for account ${accountId}:`, error)
    throw error
  }
}

// Get transaction types (for dropdown options)
export const getTransactionTypes = async () => {
  try {
    const response = await api.get("/transactions/types")
    return response.data
  } catch (error) {
    console.error("Error fetching transaction types:", error)
    // Return static data as fallback
    return [
      { value: "NEFT", label: "NEFT Transfer" },
      { value: "RTGS", label: "RTGS Transfer" },
      { value: "IMPS", label: "IMPS Transfer" },
      { value: "UPI", label: "UPI Payment" },
      { value: "ATM", label: "ATM Withdrawal" },
      { value: "CASH", label: "Cash Deposit/Withdrawal" },
      { value: "CHEQUE", label: "Cheque Deposit" },
    ]
  }
}

// Get transaction status options
export const getTransactionStatusOptions = async () => {
  try {
    const response = await api.get("/transactions/status-options")
    return response.data
  } catch (error) {
    console.error("Error fetching transaction status options:", error)
    // Return static data as fallback
    return [
      { value: "Completed", label: "Completed" },
      { value: "Pending", label: "Pending" },
      { value: "Failed", label: "Failed" },
      { value: "Reversed", label: "Reversed" },
    ]
  }
}

// Get transactions by date range
export const getTransactionsByDateRange = async (accountId, startDate, endDate) => {
  return getTransactions({ accountId, startDate, endDate })
}

// Get transactions by type
export const getTransactionsByType = async (accountId, type) => {
  return getTransactions({ accountId, type })
}

// Get transactions by amount range
export const getTransactionsByAmountRange = async (accountId, minAmount, maxAmount) => {
  return getTransactions({ accountId, minAmount, maxAmount })
}

// Fund transfer between accounts
export const fundTransfer = async (transferData) => {
  try {
    const response = await api.post("/transactions/transfer", transferData)
    return response.data
  } catch (error) {
    console.error("Error during fund transfer:", error)
    throw error
  }
}

// Generate PDF statement
export const generatePDFStatement = async (accountId, startDate, endDate) => {
  try {
    const transactions = await getTransactionsByDateRange(accountId, startDate, endDate)
    const response = await api.get(`/accounts/${accountId}`)

    return {
      account: response.data,
      transactions: transactions,
      period: { startDate, endDate },
    }
  } catch (error) {
    console.error("Error generating PDF statement:", error)
    throw error
  }
}
