"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getLoanById, getLoanPayments } from "../../services/loanService"
import { useAuth } from "../../contexts/AuthContext"

const LoanDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [loan, setLoan] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

        setLoan(loanData)

        // Fetch loan payments
        const paymentsData = await getLoanPayments(id)
        setPayments(paymentsData)
      } catch (err) {
        console.error("Error fetching loan details:", err)
        setError("Failed to load loan details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user])

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

  // Calculate loan details
  const principal = Number.parseFloat(loan.Amount)
  const interestRate = Number.parseFloat(loan.Interest_Rate)
  const term = Number.parseFloat(loan.Term)
  const monthlyInterestRate = interestRate / 100 / 12
  const totalPayments = term * 12
  const monthlyPayment =
    (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
  const totalInterest = monthlyPayment * totalPayments - principal
  const totalAmount = principal + totalInterest

  // Calculate remaining balance
  const paidAmount = payments.reduce((sum, payment) => sum + Number.parseFloat(payment.Amount), 0)
  const remainingBalance = totalAmount - paidAmount

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

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 text-white"
      case "Pending":
        return "bg-yellow-500 text-white"
      case "Rejected":
        return "bg-red-500 text-white"
      case "Closed":
        return "bg-gray-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-title">Loan Details</h1>
        <Link to="/customer/loans" className="btn-outline">
          Back to Loans
        </Link>
      </div>

      {/* Loan Summary Card */}
      <motion.div variants={itemVariants} className="dashboard-card mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan #{loan.Loan_ID}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{loan.Type} Loan</h2>
            <p className="text-3xl font-bold text-indian-saffron dark:text-indian-saffron mt-2">
              ₹{principal.toFixed(2)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`badge ${getStatusBadgeColor(loan.Status)} text-lg px-4 py-2`}>{loan.Status}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
            <p className="text-lg font-medium">{interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loan Term</p>
            <p className="text-lg font-medium">{term} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Payment</p>
            <p className="text-lg font-medium">₹{monthlyPayment.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
            <p className="text-lg font-medium">₹{totalInterest.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="text-lg font-medium">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Balance</p>
            <p className="text-lg font-medium">₹{remainingBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600 flex flex-wrap gap-4">
          <button className="btn-outline">Download Statement</button>
          {loan.Status === "Approved" && (
            <Link to={`/customer/loans/${loan.Loan_ID}/payments`} className="btn-indian-primary">
              Make Payment
            </Link>
          )}
        </div>
      </motion.div>

      {/* Loan Details */}
      <motion.div variants={itemVariants} className="dashboard-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Loan Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
            <p className="text-base font-medium">{loan.Purpose || "General"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Application Date</p>
            <p className="text-base font-medium">
              {new Date(loan.Application_Date || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Approval Date</p>
            <p className="text-base font-medium">
              {loan.Approval_Date ? new Date(loan.Approval_Date).toLocaleDateString() : "Pending"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Disbursement Date</p>
            <p className="text-base font-medium">
              {loan.Disbursement_Date ? new Date(loan.Disbursement_Date).toLocaleDateString() : "Pending"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Employment Type</p>
            <p className="text-base font-medium">{loan.Employment_Type || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
            <p className="text-base font-medium">
              ₹{loan.Monthly_Income ? Number.parseFloat(loan.Monthly_Income).toFixed(2) : "Not specified"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Repayment Schedule */}
      <motion.div variants={itemVariants}>
        <h2 className="dashboard-subtitle mb-4">Repayment Schedule</h2>
        <div className="dashboard-card overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Payment No.</th>
                  <th className="table-header-cell">Due Date</th>
                  <th className="table-header-cell">Payment Amount</th>
                  <th className="table-header-cell">Principal</th>
                  <th className="table-header-cell">Interest</th>
                  <th className="table-header-cell">Balance</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {Array.from({ length: Math.min(12, totalPayments) }).map((_, index) => {
                  const paymentNumber = index + 1
                  const dueDate = new Date()
                  dueDate.setMonth(dueDate.getMonth() + paymentNumber)

                  // Calculate amortization
                  const interestPayment =
                    principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, index) -
                    monthlyPayment * (Math.pow(1 + monthlyInterestRate, index) - 1)
                  const principalPayment = monthlyPayment - interestPayment
                  const remainingBalance =
                    principal * Math.pow(1 + monthlyInterestRate, index + 1) -
                    monthlyPayment * (Math.pow(1 + monthlyInterestRate, index + 1) - 1)

                  // Check if payment has been made
                  const payment = payments.find((p) => p.Payment_Number === paymentNumber)
                  const isPaid = !!payment

                  return (
                    <tr key={paymentNumber} className="table-row">
                      <td className="table-cell">{paymentNumber}</td>
                      <td className="table-cell">{dueDate.toLocaleDateString()}</td>
                      <td className="table-cell font-medium">₹{monthlyPayment.toFixed(2)}</td>
                      <td className="table-cell">₹{principalPayment.toFixed(2)}</td>
                      <td className="table-cell">₹{interestPayment.toFixed(2)}</td>
                      <td className="table-cell">₹{Math.max(0, remainingBalance).toFixed(2)}</td>
                      <td className="table-cell">
                        {isPaid ? (
                          <span className="badge bg-green-500 text-white">Paid</span>
                        ) : (
                          <span className="badge bg-yellow-500 text-white">Pending</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoanDetail
