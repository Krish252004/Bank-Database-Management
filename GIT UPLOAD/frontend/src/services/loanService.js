import api from "./api"

export const getLoans = async (customerId = null) => {
  try {
    let url = "/loans"
    if (customerId) {
      url += `?customerId=${customerId}`
    }
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching loans:", error)
    throw error
  }
}

export const getLoanById = async (id) => {
  try {
    const response = await api.get(`/loans/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching loan ${id}:`, error)
    throw error
  }
}

export const createLoan = async (loanData) => {
  try {
    const response = await api.post("/loans", loanData)
    return response.data
  } catch (error) {
    console.error("Error creating loan:", error)
    throw error
  }
}

export const updateLoan = async (id, loanData) => {
  try {
    const response = await api.put(`/loans/${id}`, loanData)
    return response.data
  } catch (error) {
    console.error(`Error updating loan ${id}:`, error)
    throw error
  }
}

export const deleteLoan = async (id) => {
  try {
    const response = await api.delete(`/loans/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting loan ${id}:`, error)
    throw error
  }
}

// Get loan types (for dropdown options)
export const getLoanTypes = async () => {
  return [
    { value: "Home Loan", label: "Home Loan" },
    { value: "Personal Loan", label: "Personal Loan" },
    { value: "Car Loan", label: "Car Loan" },
    { value: "Education Loan", label: "Education Loan" },
    { value: "Business Loan", label: "Business Loan" },
    { value: "Gold Loan", label: "Gold Loan" },
  ]
}

// Get loan purpose options (for dropdown)
export const getLoanPurposes = async (loanType) => {
  const purposes = {
    "Home Loan": [
      { value: "Purchase", label: "Home Purchase" },
      { value: "Construction", label: "Home Construction" },
      { value: "Renovation", label: "Home Renovation" },
      { value: "Refinance", label: "Refinance Existing Loan" },
    ],
    "Personal Loan": [
      { value: "Medical", label: "Medical Expenses" },
      { value: "Wedding", label: "Wedding Expenses" },
      { value: "Travel", label: "Travel" },
      { value: "Debt Consolidation", label: "Debt Consolidation" },
      { value: "Other", label: "Other Personal Expenses" },
    ],
    "Car Loan": [
      { value: "New Car", label: "New Car Purchase" },
      { value: "Used Car", label: "Used Car Purchase" },
      { value: "Refinance", label: "Refinance Existing Car Loan" },
    ],
    "Education Loan": [
      { value: "Undergraduate", label: "Undergraduate Studies" },
      { value: "Postgraduate", label: "Postgraduate Studies" },
      { value: "Vocational", label: "Vocational Training" },
      { value: "Study Abroad", label: "Study Abroad" },
    ],
    "Business Loan": [
      { value: "Startup", label: "Startup Funding" },
      { value: "Expansion", label: "Business Expansion" },
      { value: "Equipment", label: "Equipment Purchase" },
      { value: "Working Capital", label: "Working Capital" },
    ],
    "Gold Loan": [
      { value: "Personal", label: "Personal Needs" },
      { value: "Business", label: "Business Needs" },
      { value: "Emergency", label: "Emergency Funds" },
    ],
  }

  return loanType && purposes[loanType] ? purposes[loanType] : []
}

// Calculate EMI
export const calculateEMI = (principal, rate, tenure) => {
  // Convert interest rate from annual to monthly percentage
  const monthlyRate = rate / 12 / 100

  // Convert tenure from years to months
  const tenureInMonths = tenure * 12

  // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
    (Math.pow(1 + monthlyRate, tenureInMonths) - 1)

  return emi
}

// Calculate total payment and interest
export const calculateLoanDetails = (principal, rate, tenure) => {
  const emi = calculateEMI(principal, rate, tenure)
  const tenureInMonths = tenure * 12
  const totalPayment = emi * tenureInMonths
  const totalInterest = totalPayment - principal

  return {
    emi,
    totalPayment,
    totalInterest,
    tenureInMonths,
  }
}

// Get loan payment schedule
export const getLoanPaymentSchedule = (principal, rate, tenure) => {
  const emi = calculateEMI(principal, rate, tenure)
  const tenureInMonths = tenure * 12
  const monthlyRate = rate / 12 / 100

  const schedule = []
  let remainingPrincipal = principal
  const paymentDate = new Date()

  for (let month = 1; month <= tenureInMonths; month++) {
    // Calculate interest for this month
    const interestPayment = remainingPrincipal * monthlyRate

    // Calculate principal for this month
    const principalPayment = emi - interestPayment

    // Update remaining principal
    remainingPrincipal -= principalPayment

    // Calculate payment date
    paymentDate.setMonth(paymentDate.getMonth() + 1)

    // Add to schedule
    schedule.push({
      month,
      paymentDate: new Date(paymentDate),
      emi,
      principalPayment,
      interestPayment,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    })
  }

  return schedule
}

// Make loan payment
export const makeLoanPayment = async (loanId, amount) => {
  try {
    const response = await api.post("/loanPayments", {
      Loan_ID: loanId,
      Amount: amount,
    })
    return response.data
  } catch (error) {
    console.error("Error making loan payment:", error)
    throw error
  }
}

// Get loan payments
export const getLoanPayments = async (loanId) => {
  try {
    const response = await api.get(`/loanPayments?loanId=${loanId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching loan payments for loan ${loanId}:`, error)
    throw error
  }
}

// Check loan eligibility
export const checkLoanEligibility = async (customerData, loanAmount, loanType) => {
  try {
    const response = await api.post("/loans/checkEligibility", {
      customerData,
      loanAmount,
      loanType,
    })
    return response.data
  } catch (error) {
    console.error("Error checking loan eligibility:", error)
    throw error
  }
}
