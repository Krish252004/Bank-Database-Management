"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAccounts } from "../../services/accountService"
import { getTransactions } from "../../services/transactionService"
import { useAuth } from "../../contexts/AuthContext"
import { motion } from "framer-motion"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Doughnut, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showQuickTransfer, setShowQuickTransfer] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Only fetch accounts for the current user
        const customerId = user?.Customer_ID

        if (!customerId) {
          setError("User information not found. Please log in again.")
          setLoading(false)
          return
        }

        // Get accounts for this specific customer
        const accountsData = await getAccounts(customerId)

        // Check if this is a new customer with no accounts
        if (!accountsData || accountsData.length === 0) {
          setIsNewCustomer(true)
          setAccounts([])
          setTransactions([])
          setLoading(false)
          return
        }

        setAccounts(accountsData)
        setIsNewCustomer(false)

        // Get account IDs for this customer
        const userAccountIds = accountsData.map((account) => account.Acc_Number)

        if (userAccountIds.length > 0) {
          // Get transactions for these accounts
          const transactionsData = await getTransactions()
          // Filter transactions to only show those related to the user's accounts
          const userTransactions = transactionsData.filter(
            (transaction) =>
              userAccountIds.includes(transaction.sender_account_id) ||
              userAccountIds.includes(transaction.receiver_account_id),
          )
          setTransactions(userTransactions.slice(0, 5)) // Get only the 5 most recent transactions
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + Number.parseFloat(account.Balance || 0), 0)

  // Prepare chart data for account types
  const accountTypes = accounts.reduce((acc, account) => {
    acc[account.Type] = (acc[account.Type] || 0) + Number.parseFloat(account.Balance || 0)
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(accountTypes),
    datasets: [
      {
        data: Object.values(accountTypes),
        backgroundColor: [
          "rgba(255, 153, 51, 0.7)", // Indian Saffron
          "rgba(19, 136, 8, 0.7)", // Indian Green
          "rgba(0, 0, 128, 0.7)", // Indian Blue
          "rgba(255, 99, 132, 0.7)", // Pink
        ],
        borderColor: ["rgba(255, 153, 51, 1)", "rgba(19, 136, 8, 1)", "rgba(0, 0, 128, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Monthly spending data
  const spendingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Expenses",
        data: [12500, 19000, 15000, 22000, 18000, 24000],
        backgroundColor: "rgba(255, 153, 51, 0.7)",
        borderColor: "rgba(255, 153, 51, 1)",
        borderWidth: 1,
      },
      {
        label: "Income",
        data: [25000, 25000, 30000, 28000, 28000, 35000],
        backgroundColor: "rgba(19, 136, 8, 0.7)",
        borderColor: "rgba(19, 136, 8, 1)",
        borderWidth: 1,
      },
    ],
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-saffron"></div>
          <p className="mt-4 text-indian-saffron">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If this is a new customer with no accounts, show a welcome message
  if (isNewCustomer) {
    return (
      <div className="dashboard-container">
        <div className="mb-6">
          <h1 className="dashboard-title">
            Welcome, <span className="text-indian-saffron">{user?.F_Name || "New Customer"}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get started with BharatBank by creating your first account.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md p-8 text-center">
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
          <h2 className="text-2xl font-bold mt-4">No Accounts Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            You don't have any accounts yet. Create your first account to start banking with us.
          </p>
          <Link to="/customer/accounts" className="btn-indian-primary mt-6 inline-block">
            Create Your First Account
          </Link>
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="dashboard-title">
              Welcome, <span className="text-indian-saffron">{user?.F_Name || "Customer"}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's an overview of your accounts and recent activity.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickTransfer(!showQuickTransfer)}
              className="btn-indian-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
              Quick Transfer
            </motion.button>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Quick Transfer Form */}
      {showQuickTransfer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white dark:bg-dark-700 rounded-lg shadow-md p-4 border-l-4 border-indian-saffron"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Transfer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Account</label>
              <select className="form-input">
                {accounts.map((account) => (
                  <option key={account.Acc_Number} value={account.Acc_Number}>
                    {account.Type} - ₹{Number.parseFloat(account.Balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Account</label>
              <input type="text" placeholder="Enter account number or UPI ID" className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
              <input type="number" placeholder="Enter amount" className="form-input" />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowQuickTransfer(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-indian-saffron text-white rounded-md hover:bg-indian-saffron/90">
              Transfer Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Dashboard Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-dark-600">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-indian-saffron text-indian-saffron"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`${
                activeTab === "accounts"
                  ? "border-indian-saffron text-indian-saffron"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Accounts
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`${
                activeTab === "transactions"
                  ? "border-indian-saffron text-indian-saffron"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("spending")}
              className={`${
                activeTab === "spending"
                  ? "border-indian-saffron text-indian-saffron"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Spending Analysis
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card bg-gradient-to-r from-indian-saffron to-indian-saffron/80 text-white"
            >
              <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
              <p className="text-3xl font-bold rupee-animate">₹{totalBalance.toFixed(2)}</p>
              <p className="mt-2 text-white/80">Across all accounts</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card"
            >
              <h2 className="text-lg font-semibold mb-2">Active Accounts</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
              <Link
                to="/customer/accounts"
                className="mt-2 text-indian-saffron dark:text-indian-saffron hover:underline block"
              >
                View all accounts
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card"
            >
              <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
              <div className="flex flex-col space-y-2">
                <Link to="/customer/accounts" className="btn-indian-primary text-center">
                  Create New Account
                </Link>
                <Link
                  to="/customer/transactions"
                  className="btn-outline border-indian-saffron text-indian-saffron hover:bg-indian-saffron/10 text-center"
                >
                  Make a Transfer
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Account Distribution Chart */}
          {accounts.length > 0 && (
            <motion.div variants={itemVariants} className="dashboard-card mb-8">
              <h2 className="text-lg font-semibold mb-4">Account Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || ""
                            const value = context.raw || 0
                            return `${label}: ₹${value.toFixed(2)}`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Recent Transactions */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="dashboard-subtitle">Recent Transactions</h2>
              <Link
                to="/customer/transactions"
                className="text-sm text-indian-saffron dark:text-indian-saffron hover:underline"
              >
                View All
              </Link>
            </div>

            {transactions.length === 0 ? (
              <div className="dashboard-card">
                <p className="text-gray-600 dark:text-gray-400">No recent transactions.</p>
                <Link to="/customer/transactions" className="mt-4 btn-indian-primary inline-block">
                  Make Your First Transaction
                </Link>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="dashboard-card overflow-hidden"
              >
                <div className="table-container">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Date</th>
                        <th className="table-header-cell">Description</th>
                        <th className="table-header-cell">Amount</th>
                        <th className="table-header-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {transactions.map((transaction) => {
                        // Determine if this is a credit or debit for the current user
                        const userAccountIds = accounts.map((acc) => acc.Acc_Number)
                        const isCredit = userAccountIds.includes(transaction.receiver_account_id)
                        const isDebit = userAccountIds.includes(transaction.sender_account_id)

                        return (
                          <tr key={transaction.id} className="table-row">
                            <td className="table-cell">
                              {new Date(transaction.date || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="table-cell">
                              {transaction.description ||
                                (isCredit
                                  ? `Received from Account #${transaction.sender_account_id}`
                                  : `Transfer to Account #${transaction.receiver_account_id}`)}
                            </td>
                            <td className="table-cell font-medium">
                              <span className={isCredit ? "text-green-600" : "text-red-600"}>
                                {isCredit ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className="badge badge-success">Completed</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {/* Accounts Tab Content */}
      {activeTab === "accounts" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Accounts</h2>
            <Link to="/customer/accounts" className="btn-indian-primary">
              Create New Account
            </Link>
          </div>

          {accounts.length === 0 ? (
            <div className="dashboard-card text-center py-12">
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
              <Link to="/customer/accounts" className="mt-6 btn-indian-primary inline-block">
                Create Your First Account
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <motion.div
                  key={account.Acc_Number}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
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
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-600 flex justify-between">
                    <Link
                      to={`/customer/accounts/${account.Acc_Number}`}
                      className="text-indian-saffron dark:text-indian-saffron hover:underline text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to="/customer/transactions"
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
      )}

      {/* Transactions Tab Content */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <Link to="/customer/transactions" className="btn-indian-primary">
              New Transaction
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="dashboard-card text-center py-12">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No transactions found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
              <Link to="/customer/transactions" className="mt-6 btn-indian-primary inline-block">
                Make Your First Transfer
              </Link>
            </div>
          ) : (
            <div className="dashboard-card overflow-hidden">
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Date</th>
                      <th className="table-header-cell">From</th>
                      <th className="table-header-cell">To</th>
                      <th className="table-header-cell">Description</th>
                      <th className="table-header-cell">Amount</th>
                      <th className="table-header-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {transactions.map((transaction) => {
                      const userAccountIds = accounts.map((acc) => acc.Acc_Number)
                      const isCredit = userAccountIds.includes(transaction.receiver_account_id)

                      return (
                        <tr key={transaction.id} className="table-row">
                          <td className="table-cell">
                            {new Date(transaction.date || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="table-cell">Account #{transaction.sender_account_id}</td>
                          <td className="table-cell">Account #{transaction.receiver_account_id}</td>
                          <td className="table-cell">{transaction.description || "Transfer"}</td>
                          <td className="table-cell font-medium">
                            <span className={isCredit ? "text-green-600" : "text-red-600"}>
                              {isCredit ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="table-cell">
                            <span className="badge badge-success">Completed</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Spending Analysis Tab Content */}
      {activeTab === "spending" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Spending Analysis</h2>
            <div className="flex space-x-2">
              <select className="form-input py-1 px-3 text-sm">
                <option>Last 6 Months</option>
                <option>Last 3 Months</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card"
            >
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Income</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1,71,000.00</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  25%
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card"
            >
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1,10,500.00</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-red-600 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  12%
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="dashboard-card"
            >
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Savings</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹60,500.00</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  18%
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </motion.div>
          </div>

          <div className="dashboard-card mb-8">
            <h2 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h2>
            <div className="h-80">
              <Bar
                data={spendingData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => "₹" + value.toLocaleString("en-IN"),
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => context.dataset.label + ": ₹" + context.raw.toLocaleString("en-IN"),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dashboard-card">
              <h2 className="text-lg font-semibold mb-4">Top Spending Categories</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Shopping</span>
                    <span className="text-sm font-medium">₹28,500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-indian-saffron h-2.5 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Food & Dining</span>
                    <span className="text-sm font-medium">₹22,300</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-indian-green h-2.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Transportation</span>
                    <span className="text-sm font-medium">₹15,800</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-indian-blue h-2.5 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Utilities</span>
                    <span className="text-sm font-medium">₹12,400</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="text-lg font-semibold mb-4">Upcoming Payments</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Credit Card Bill</p>
                      <p className="text-xs text-gray-500">Due in 3 days</p>
                    </div>
                  </div>
                  <p className="font-medium text-red-600">₹15,200</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Home Loan EMI</p>
                      <p className="text-xs text-gray-500">Due in 7 days</p>
                    </div>
                  </div>
                  <p className="font-medium text-red-600">₹24,500</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Electricity Bill</p>
                      <p className="text-xs text-gray-500">Due in 12 days</p>
                    </div>
                  </div>
                  <p className="font-medium text-red-600">₹3,800</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CustomerDashboard
