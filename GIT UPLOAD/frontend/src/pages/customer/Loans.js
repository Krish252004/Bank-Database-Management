"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { getLoans, createLoan } from "../../services/loanService"
import { useAuth } from "../../contexts/AuthContext"
import LoanForm from "../../components/LoanForm"

const LoansPage = () => {
  const { user } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [user])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      // Get user data from context
      const customerId = user?.Customer_ID

      if (!customerId) {
        setError("User information not found. Please log in again.")
        setLoading(false)
        return
      }

      const data = await getLoans(customerId)
      setLoans(data)

      // Check if this is a new customer with no loans
      setIsNewCustomer(data.length === 0)

      setError("")
    } catch (err) {
      console.error("Error fetching loans:", err)
      setError("Failed to load loans. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLoan = async (loanData) => {
    try {
      setIsSubmitting(true)
      // Get user data from context
      const customerId = user?.Customer_ID

      if (!customerId) {
        toast.error("User information not found. Please log in again.")
        return
      }

      // Add customer ID to loan data
      const completeLoanData = {
        ...loanData,
        Customer_ID: customerId,
        Status: "Pending",
      }

      const result = await createLoan(completeLoanData)

      if (result && result.loanData) {
        // Add the new loan to the loans list
        setLoans((prevLoans) => [...prevLoans, result.loanData])
        setIsNewCustomer(false)
      }

      toast.success("Loan application submitted successfully!")
      setShowLoanForm(false)
    } catch (err) {
      console.error("Error creating loan:", err)
      toast.error("Failed to submit loan application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && loans.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-saffron"></div>
        </div>
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

  // Helper function to calculate EMI
  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / 12 / 100
    const months = tenure * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-title">Your Loans</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLoanForm(!showLoanForm)}
          className="btn-indian-primary"
        >
          {showLoanForm ? "Cancel" : "Apply for Loan"}
        </motion.button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loan Application Form */}
      <AnimatePresence>
        {showLoanForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-card mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">Apply for a New Loan</h2>
            <LoanForm onSubmit={handleCreateLoan} isSubmitting={isSubmitting} onCancel={() => setShowLoanForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loans List */}
      {loans.length === 0 ? (
        <motion.div variants={itemVariants} className="dashboard-card text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No loans found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by applying for your first loan.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLoanForm(true)}
            className="mt-6 btn-indian-primary"
          >
            Apply for Your First Loan
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.map((loan) => {
            const emi = calculateEMI(
              Number.parseFloat(loan.Amount),
              Number.parseFloat(loan.Interest_Rate),
              Number.parseFloat(loan.Term),
            )

            return (
              <motion.div
                key={loan.Loan_ID}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
                className="dashboard-card card-hover"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loan #{loan.Loan_ID}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{loan.Type} Loan</p>
                    <p className="text-2xl font-bold text-indian-saffron dark:text-indian-saffron mt-2">
                      ₹{Number.parseFloat(loan.Amount).toFixed(2)}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadgeColor(loan.Status)}`}>{loan.Status}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
                    <p className="text-base font-medium">{loan.Interest_Rate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tenure</p>
                    <p className="text-base font-medium">{loan.Term} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</p>
                    <p className="text-base font-medium">₹{emi.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
                    <p className="text-base font-medium">{loan.Purpose || "General"}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-600 flex justify-between">
                  <Link
                    to={`/customer/loans/${loan.Loan_ID}`}
                    className="text-indian-saffron dark:text-indian-saffron hover:underline text-sm"
                  >
                    View Details
                  </Link>
                  {loan.Status === "Approved" && (
                    <Link
                      to={`/customer/loans/${loan.Loan_ID}/payments`}
                      className="text-indian-saffron dark:text-indian-saffron hover:underline text-sm"
                    >
                      Make Payment
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default LoansPage
