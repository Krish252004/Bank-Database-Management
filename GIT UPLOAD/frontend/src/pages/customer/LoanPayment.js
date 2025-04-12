"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { getLoanById, makeLoanPayment } from "../../services/loanService"
import { useAuth } from "../../contexts/AuthContext"
import { getAccounts } from "../../services/accountService"
import PaymentGateway from "../../components/PaymentGateway"

const LoanPayment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loan, setLoan] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("account")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}")
        const customerId = user?.Customer_ID || userData?.Customer_ID

        if (!customerId) {
          setError("User information not found. Please log in again.")
          setLoading(false)
          return
        }

        // Fetch loan details
        const loanData = await getLoanById(id)

        // Verify this loan belongs to the current user
        if (loanData.Customer_ID !== customerId) {
          setError("You don't have permission to view this loan.")
          setLoading(false)
          return
        }

        // Verify loan is approved
        if (loanData.Status !== "Approved") {
          setError("This loan is not approved for payments.")
          setLoading(false)
          return
        }

        setLoan(loanData)

        // Calculate monthly payment and set as default payment amount
        const principal = Number.parseFloat(loanData.Amount)
        const interestRate = Number.parseFloat(loanData.Interest_Rate)
        const term = Number.parseFloat(loanData.Term)
        const monthlyInterestRate = interestRate / 100 / 12
        const totalPayments = term * 12
        const monthlyPayment =
          (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
          (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)

        setPaymentAmount(monthlyPayment.toFixed(2))

        // Fetch user accounts
        const accountsData = await getAccounts(customerId)
        setAccounts(accountsData)

        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0].Acc_Number.toString())
        }
      } catch (err) {
        console.error("Error fetching loan details:", err)
        setError("Failed to load loan details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user])

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()

    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    if (paymentMethod === "account" && !selectedAccount) {
      toast.error("Please select an account for payment")
      return
    }

    try {
      setIsSubmitting(true)

      // Create payment data
      const paymentData = {
        Loan_ID: Number.parseInt(id),
        Amount: Number.parseFloat(paymentAmount),
        Payment_Method: paymentMethod,
        Account_Number: paymentMethod === "account" ? Number.parseInt(selectedAccount) : null,
      }

      // Make payment
      await makeLoanPayment(paymentData)

      toast.success("Payment successful!")
      navigate(`/customer/loans/${id}`)
    } catch (err) {
      console.error("Error making payment:", err)
      toast.error("Failed to process payment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-saffron"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800">
          <span className="block sm:inline">{error}</span>
        </div>
        <Link to="/customer/loans" className="btn-indian-primary">
          Back to Loans
        </Link>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="dashboard-container">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
          <span className="block sm:inline">Loan not found.</span>
        </div>
        <Link to="/customer/loans" className="btn-indian-primary">
          Back to Loans
        </Link>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-title">Loan Payment</h1>
        <Link to={`/customer/loans/${id}`} className="btn-outline">
          Back to Loan Details
        </Link>
      </div>

      {/* Loan Summary */}
      <motion.div variants={itemVariants} className="dashboard-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan ID</p>
            <p className="text-lg font-medium">#{loan.Loan_ID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan Type</p>
            <p className="text-lg font-medium">{loan.Type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
            <p className="text-lg font-medium">₹{Number.parseFloat(loan.Amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
            <p className="text-lg font-medium">{loan.Interest_Rate}% p.a.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Term</p>
            <p className="text-lg font-medium">{loan.Term} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-lg font-medium">{loan.Status}</p>
          </div>
        </div>
      </motion.div>

      {/* Payment Form */}
      <motion.div variants={itemVariants} className="dashboard-card">
        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod("account")}
              className={`px-4 py-2 rounded-md ${
                paymentMethod === "account"
                  ? "bg-indian-saffron text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-600 dark:text-gray-300"
              }`}
            >
              Pay from Account
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`px-4 py-2 rounded-md ${
                paymentMethod === "card"
                  ? "bg-indian-saffron text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-600 dark:text-gray-300"
              }`}
            >
              Pay with Card
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`px-4 py-2 rounded-md ${
                paymentMethod === "upi"
                  ? "bg-indian-saffron text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-600 dark:text-gray-300"
              }`}
            >
              Pay with UPI
            </button>
          </div>
        </div>

        {paymentMethod === "account" ? (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="selectedAccount" className="form-label">
                  Select Account <span className="text-red-500">*</span>
                </label>
                <select
                  id="selectedAccount"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.Acc_Number} value={account.Acc_Number}>
                      {account.Type} - ₹{Number.parseFloat(account.Balance).toFixed(2)} (#{account.Acc_Number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentAmount" className="form-label">
                  Payment Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="form-input"
                  placeholder="Enter payment amount"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link to={`/customer/loans/${id}`} className="btn-outline">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting} className="btn-indian-primary">
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Make Payment"
                )}
              </button>
            </div>
          </form>
        ) : (
          <PaymentGateway
            amount={paymentAmount}
            setAmount={setPaymentAmount}
            paymentMethod={paymentMethod}
            onSubmit={handlePaymentSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate(`/customer/loans/${id}`)}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default LoanPayment
