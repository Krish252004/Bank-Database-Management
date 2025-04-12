"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { getAccounts, createAccount } from "../../services/accountService"
import { useAuth } from "../../contexts/AuthContext"
import AccountForm from "../../components/AccountForm"

const AccountsPage = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [user])

  const fetchAccounts = async () => {
    try {
      setLoading(true)

      // Get customer ID from user context
      const customerId = user?.Customer_ID

      if (!customerId) {
        setError("User information not found. Please log in again.")
        setLoading(false)
        return
      }

      const data = await getAccounts(customerId)
      setAccounts(data)

      // Check if this is a new customer (no accounts)
      setIsNewCustomer(data.length === 0)

      // If new customer, show create form automatically
      if (data.length === 0) {
        setShowCreateForm(true)
      }

      setError("")
    } catch (err) {
      console.error("Error fetching accounts:", err)
      setError("Failed to load accounts. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (accountData) => {
    try {
      setIsSubmitting(true)

      // Get customer ID from user context
      const customerId = user?.Customer_ID

      if (!customerId) {
        toast.error("User information not found. Please log in again.")
        return
      }

      // Add customer ID to account data
      const completeAccountData = {
        ...accountData,
        Customer_ID: customerId,
        Status: 'Active',
        Opening_Date: new Date().toISOString()
      }

      console.log("Submitting account data:", completeAccountData)

      const result = await createAccount(completeAccountData)

      if (result && result.accountData) {
        // Add the new account to the accounts list
        setAccounts((prevAccounts) => [...prevAccounts, result.accountData])
        setIsNewCustomer(false)
        toast.success("Account created successfully!")
        setShowCreateForm(false)
      } else {
        toast.success("Account created successfully!")
        // Refresh accounts to get the latest data
        fetchAccounts()
        setShowCreateForm(false)
      }
    } catch (err) {
      console.error("Error creating account:", err)
      toast.error(err.response?.data?.error || "Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && accounts.length === 0) {
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

  // If this is a new customer with no accounts, show a welcome message and account creation form
  if (isNewCustomer && !showCreateForm) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="dashboard-title">Welcome to BharatBank</h1>
        </div>

        <motion.div variants={itemVariants} className="dashboard-card text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-indian-saffron"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
            Get Started with Your First Account
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to BharatBank! To begin your banking journey, please create your first account.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="mt-6 btn-indian-primary"
          >
            Create Your First Account
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-title">Your Accounts</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-indian-primary"
        >
          {showCreateForm ? "Cancel" : "Create New Account"}
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

      {/* Create Account Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-card mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Account</h2>
            <AccountForm
              onSubmit={handleCreateAccount}
              isSubmitting={isSubmitting}
              onCancel={() => setShowCreateForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accounts List */}
      {accounts.length === 0 && !isNewCustomer ? (
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No accounts found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating your first account.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="mt-6 btn-indian-primary"
          >
            Create Your First Account
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <motion.div
              key={account.Acc_Number}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
              className="dashboard-card card-hover"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account #{account.Acc_Number}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{account.Type} Account</p>
                  <p className="text-2xl font-bold text-indian-saffron dark:text-indian-saffron mt-2">
                    ₹{Number.parseFloat(account.Balance).toFixed(2)}
                  </p>
                </div>
                <span
                  className={`badge ${
                    account.Type === "Savings"
                      ? "bg-indian-green text-white"
                      : account.Type === "Current"
                        ? "bg-indian-saffron text-white"
                        : "bg-indian-blue text-white"
                  }`}
                >
                  {account.Type}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>IFSC: {account.IFSC_Code || "BBANK0001"}</p>
                <p>Status: {account.Status || "Active"}</p>
                <p>Opened: {new Date(account.Opening_Date || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-600 flex justify-between">
                <Link
                  to={`/customer/accounts/${account.Acc_Number}`}
                  className="text-indian-saffron dark:text-indian-saffron hover:underline text-sm"
                >
                  View Details
                </Link>
                <Link
                  to={`/customer/transactions?from=${account.Acc_Number}`}
                  className="text-indian-saffron dark:text-indian-saffron hover:underline text-sm"
                >
                  Make Transfer
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default AccountsPage
