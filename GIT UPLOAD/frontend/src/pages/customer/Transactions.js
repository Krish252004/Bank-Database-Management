"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { format, subDays, subMonths } from "date-fns"
import { getAccounts } from "../../services/accountService"
import { getTransactions, createTransaction } from "../../services/transactionService"
import { useAuth } from "../../contexts/AuthContext"
import { generateAccountStatementPDF } from "../../utils/pdfGenerator"
import TransactionForm from "../../components/TransactionForm"

const TransactionsPage = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [customDateRange, setCustomDateRange] = useState({ startDate: "", endDate: "" })
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const [totalDebits, setTotalDebits] = useState(0)

  const pdfRef = useRef(null)

  useEffect(() => {
    fetchData()

    // Check if we should open the transfer form with a pre-selected account
    const params = new URLSearchParams(location.search)
    const fromAccount = params.get("from")
    if (fromAccount) {
      setShowTransferForm(true)
      setSelectedAccount(fromAccount)
    }
  }, [location])

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

      // Get accounts for this customer
      const accountsData = await getAccounts(customerId)
      setAccounts(accountsData)

      // Get transactions for this customer
      const allTransactions = await getTransactions({ customerId })

      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.Transaction_Date) - new Date(a.Transaction_Date))

      setTransactions(allTransactions)
      setFilteredTransactions(allTransactions)

      // Calculate total balance
      const balance = accountsData.reduce((sum, account) => sum + Number.parseFloat(account.Balance), 0)
      setTotalBalance(balance)

      // Calculate total credits and debits
      const accountIds = accountsData.map((account) => account.Acc_Number)
      calculateTotals(allTransactions, accountIds)

      setError("")
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = (transactionList, accountIds) => {
    let credits = 0
    let debits = 0

    transactionList.forEach((transaction) => {
      const isCredit = accountIds.includes(transaction.Receiver_Acc_Number)
      const isDebit = accountIds.includes(transaction.Sender_Acc_Number)

      if (isCredit) {
        credits += Number.parseFloat(transaction.Amount)
      }

      if (isDebit) {
        debits += Number.parseFloat(transaction.Amount)
      }
    })

    setTotalCredits(credits)
    setTotalDebits(debits)
  }

  const handleCreateTransaction = async (transactionData) => {
    try {
      setIsSubmitting(true)
      await createTransaction(transactionData)
      toast.success("Transaction completed successfully!")
      setShowTransferForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creating transaction:", err)
      toast.error("Failed to complete transaction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFilterChange = async (e) => {
    const range = e.target.value
    setDateRange(range)

    if (range === "custom") {
      return // Wait for custom date input
    }

    filterTransactionsByDateRange(range)
  }

  const handleCustomDateChange = (e) => {
    setCustomDateRange({
      ...customDateRange,
      [e.target.name]: e.target.value,
    })
  }

  const applyCustomDateFilter = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    filterTransactionsByCustomDateRange(customDateRange.startDate, customDateRange.endDate)
  }

  const filterTransactionsByDateRange = (range) => {
    let filteredData = []
    const today = new Date()

    switch (range) {
      case "today":
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.Transaction_Date)
          return transactionDate.toDateString() === today.toDateString()
        })
        break

      case "week":
        const weekAgo = subDays(today, 7)
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.Transaction_Date)
          return transactionDate >= weekAgo
        })
        break

      case "month":
        const monthAgo = subMonths(today, 1)
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.Transaction_Date)
          return transactionDate >= monthAgo
        })
        break

      case "6months":
        const sixMonthsAgo = subMonths(today, 6)
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.Transaction_Date)
          return transactionDate >= sixMonthsAgo
        })
        break

      case "all":
      default:
        filteredData = transactions
        break
    }

    setFilteredTransactions(filteredData)

    // Recalculate totals
    const accountIds = accounts.map((account) => account.Acc_Number)
    calculateTotals(filteredData, accountIds)
  }

  const filterTransactionsByCustomDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999) // Set to end of day

    const filteredData = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.Transaction_Date)
      return transactionDate >= start && transactionDate <= end
    })

    setFilteredTransactions(filteredData)

    // Recalculate totals
    const accountIds = accounts.map((account) => account.Acc_Number)
    calculateTotals(filteredData, accountIds)
  }

  const handleDownloadStatement = async () => {
    try {
      if (!selectedAccount) {
        toast.error("Please select an account to download statement")
        return
      }

      // Get account details
      const account = accounts.find((acc) => acc.Acc_Number.toString() === selectedAccount)

      if (!account) {
        toast.error("Account not found")
        return
      }

      // Get transactions for this account
      const statementTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.Sender_Acc_Number.toString() === selectedAccount ||
          transaction.Receiver_Acc_Number.toString() === selectedAccount,
      )

      // Determine date range for statement
      let startDate, endDate

      if (dateRange === "custom" && customDateRange.startDate && customDateRange.endDate) {
        startDate = customDateRange.startDate
        endDate = customDateRange.endDate
      } else {
        const today = new Date()

        switch (dateRange) {
          case "today":
            startDate = format(today, "yyyy-MM-dd")
            endDate = format(today, "yyyy-MM-dd")
            break

          case "week":
            startDate = format(subDays(today, 7), "yyyy-MM-dd")
            endDate = format(today, "yyyy-MM-dd")
            break

          case "month":
            startDate = format(subMonths(today, 1), "yyyy-MM-dd")
            endDate = format(today, "yyyy-MM-dd")
            break

          case "6months":
            startDate = format(subMonths(today, 6), "yyyy-MM-dd")
            endDate = format(today, "yyyy-MM-dd")
            break

          case "all":
          default:
            // Use the earliest and latest transaction dates
            if (statementTransactions.length > 0) {
              const dates = statementTransactions.map((t) => new Date(t.Transaction_Date))
              startDate = format(new Date(Math.min(...dates)), "yyyy-MM-dd")
              endDate = format(new Date(Math.max(...dates)), "yyyy-MM-dd")
            } else {
              startDate = format(subMonths(today, 6), "yyyy-MM-dd")
              endDate = format(today, "yyyy-MM-dd")
            }
            break
        }
      }

      // Generate PDF
      const pdf = generateAccountStatementPDF(account, statementTransactions, { startDate, endDate })

      // Save PDF
      pdf.save(`Account_Statement_${account.Acc_Number}_${format(new Date(), "yyyyMMdd")}.pdf`)

      toast.success("Statement downloaded successfully")
    } catch (error) {
      console.error("Error generating statement:", error)
      toast.error("Failed to generate statement. Please try again.")
    }
  }

  if (loading && transactions.length === 0) {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="dashboard-title">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your transaction history</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTransferForm(!showTransferForm)}
          className="btn-indian-primary"
        >
          {showTransferForm ? "Cancel" : "New Transfer"}
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

      {/* Transfer Form */}
      <AnimatePresence>
        {showTransferForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-card"
          >
            <h2 className="text-xl font-semibold mb-4">New Fund Transfer</h2>
            <TransactionForm
              onSubmit={handleCreateTransaction}
              accounts={accounts}
              isSubmitting={isSubmitting}
              onCancel={() => setShowTransferForm(false)}
              defaultFromAccount={selectedAccount}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Statement Options */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Date Range Filter */}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Date
            </label>
            <select id="dateRange" className="form-input" value={dateRange} onChange={handleFilterChange}>
              <option value="all">All Transactions</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range Inputs */}
          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-input"
                  value={customDateRange.startDate}
                  onChange={handleCustomDateChange}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-input"
                  value={customDateRange.endDate}
                  onChange={handleCustomDateChange}
                />
              </div>
              <button onClick={applyCustomDateFilter} className="btn-indian-primary">
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Download Statement */}
        <div>
          <label htmlFor="accountSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Download Statement
          </label>
          <div className="flex items-center gap-2">
            <select
              id="accountSelect"
              className="form-input"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.Acc_Number} value={account.Acc_Number}>
                  {account.Type} - {account.Acc_Number}
                </option>
              ))}
            </select>
            <button onClick={handleDownloadStatement} className="btn-indian-primary">
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Balance</h3>
          <p className="text-2xl font-bold text-indian-saffron">₹{totalBalance.toFixed(2)}</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Credits</h3>
          <p className="text-2xl font-bold text-green-600">+₹{totalCredits.toFixed(2)}</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Debits</h3>
          <p className="text-2xl font-bold text-red-600">-₹{totalDebits.toFixed(2)}</p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Description</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Type</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-cell text-center py-8">
                    No transactions found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.Transaction_ID} className="table-row">
                    <td className="table-cell">{new Date(transaction.Transaction_Date).toLocaleDateString()}</td>
                    <td className="table-cell">{transaction.Description}</td>
                    <td className="table-cell">₹{transaction.Amount}</td>
                    <td className="table-cell">{transaction.Transaction_Type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionsPage
