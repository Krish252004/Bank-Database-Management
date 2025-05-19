import api from "./api"

// Process UPI payment
export const processUPIPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments/upi", paymentData)
    return response.data
  } catch (error) {
    console.error("Error processing UPI payment:", error)
    throw error
  }
}

// Process card payment
export const processCardPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments/card", paymentData)
    return response.data
  } catch (error) {
    console.error("Error processing card payment:", error)
    throw error
  }
}

// Process net banking payment
export const processNetBankingPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments/netbanking", paymentData)
    return response.data
  } catch (error) {
    console.error("Error processing net banking payment:", error)
    throw error
  }
}

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/status`)
    return response.data
  } catch (error) {
    console.error(`Error fetching payment status for ${paymentId}:`, error)
    throw error
  }
}

// Verify UPI ID
export const verifyUPIID = async (upiId) => {
  try {
    const response = await api.post("/payments/upi/verify", { upiId })
    return response.data
  } catch (error) {
    console.error(`Error verifying UPI ID ${upiId}:`, error)
    throw error
  }
}

// Generate QR code for payment
export const generatePaymentQR = async (amount, description, upiId) => {
  try {
    const response = await api.post("/payments/qr/generate", {
      amount,
      description,
      upiId,
    })
    return response.data
  } catch (error) {
    console.error("Error generating payment QR code:", error)
    throw error
  }
}

// Mock implementation for payment gateway integration
export const initializePaymentGateway = (config = {}) => {
  // This would normally initialize a payment gateway SDK
  console.log("Payment gateway initialized with config:", config)

  return {
    // Process payment method
    processPayment: async (paymentDetails) => {
      try {
        // Simulate API call to payment gateway
        console.log("Processing payment:", paymentDetails)

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Randomly succeed or fail (90% success rate)
        const isSuccess = Math.random() < 0.9

        if (isSuccess) {
          return {
            success: true,
            transactionId: `PG${Date.now()}`,
            message: "Payment processed successfully",
          }
        } else {
          throw new Error("Payment processing failed")
        }
      } catch (error) {
        console.error("Payment gateway error:", error)
        throw error
      }
    },

    // Get available payment methods
    getPaymentMethods: async () => {
      return [
        { id: "upi", name: "UPI", icon: "upi-icon.png" },
        { id: "card", name: "Credit/Debit Card", icon: "card-icon.png" },
        { id: "netbanking", name: "Net Banking", icon: "netbanking-icon.png" },
        { id: "wallet", name: "Mobile Wallet", icon: "wallet-icon.png" },
      ]
    },
  }
}

// Process bill payment
export const processBillPayment = async (billData) => {
  try {
    const response = await api.post("/payments/bill", billData)
    return response.data
  } catch (error) {
    console.error("Error processing bill payment:", error)
    throw error
  }
}

// Get saved payment methods for a customer
export const getSavedPaymentMethods = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/paymentMethods`)
    return response.data
  } catch (error) {
    console.error(`Error fetching saved payment methods for customer ${customerId}:`, error)
    throw error
  }
}

// Save a payment method for a customer
export const savePaymentMethod = async (customerId, paymentMethod) => {
  try {
    const response = await api.post(`/customers/${customerId}/paymentMethods`, paymentMethod)
    return response.data
  } catch (error) {
    console.error(`Error saving payment method for customer ${customerId}:`, error)
    throw error
  }
}

// Delete a saved payment method
export const deletePaymentMethod = async (customerId, paymentMethodId) => {
  try {
    const response = await api.delete(`/customers/${customerId}/paymentMethods/${paymentMethodId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting payment method ${paymentMethodId} for customer ${customerId}:`, error)
    throw error
  }
}
