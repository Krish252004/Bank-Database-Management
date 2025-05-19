"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAccounts } from "../../services/accountService"
import { getCustomers } from "../../services/CustomerService"
import { getLoans } from "../../services/loanService"
import { useAuth } from "../../contexts/AuthContext"
import { motion } from "framer-motion"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    totalBalance: 0,
    accountTypes: {},
    loanAmount: 0,
    recentActivity: [],
  })

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const [accountsData, customersData, loansData] = await Promise.all([getAccounts(), getCustomers(), getLoans()])
        setAccounts(accountsData)
        setCustomers(customersData)
        setLoans(loansData)

        // Calculate statistics
        const totalBalance = accountsData.reduce((sum, account) => sum + Number.parseFloat(account.Balance || 0), 0)

        // Count account types
        const accountTypes = accountsData.reduce((acc, account) => {
          acc[account.Type] = (acc[account.Type] || 0) + 1
          return acc
        }, {})

        // Calculate total loan amount
        const loanAmount = loansData.reduce((sum, loan) => sum + Number.parseFloat(loan.Amount || 0), 0)

        // Generate recent activity (mock data for now)
        const recentActivity = [
          { type: "account_created", user: "Rahul Sharma", time: "2 hours ago" },
          { type: "loan_approved", user: "Priya Patel", time: "5 hours ago" },
          { type: "transaction", user: "Amit Kumar", time: "1 day ago" },
          { type: "account_updated", user: "Neha Singh", time: "2 days ago" },
        ]

        setStats({
          totalBalance,
          accountTypes,
          loanAmount,
          recentActivity,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare chart data
  const pieData = {
    labels: Object.keys(stats.accountTypes),
    datasets: [
      {
        data: Object.values(stats.accountTypes),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Customer growth data (mock data)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Customers",
        data: [12, 19, 15, 22, 30, 25],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Customer Growth",
      },
    },
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-container">
      <div className="mb-6">
        <h1 className="dashboard-title">Welcome, {userData?.fullName || user?.name || "Employee"}</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's an overview of the bank's current status.</p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="dashboard-card bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        >
          <h2 className="text-lg font-semibold mb-2">Total Customers</h2>
          <p className="text-3xl font-bold">{customers.length}</p>
          <Link to="/employee/customers" className="mt-2 text-primary-100 hover:text-white block">
            View all customers
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="dashboard-card"
        >
          <h2 className="text-lg font-semibold mb-2">Active Accounts</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
          <Link to="/employee/accounts" className="mt-2 text-primary-600 dark:text-primary-400 hover:underline block">
            View all accounts
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="dashboard-card"
        >
          <h2 className="text-lg font-semibold mb-2">Total Funds</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.totalBalance.toFixed(2)}</p>
          <p className="mt-2 text-primary-600 dark:text-primary-400">Across {accounts.length} accounts</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Account Types Distribution</h2>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Customer Growth</h2>
          <div className="h-64">
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="dashboard-card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
            >
              <div
                className={`p-2 rounded-full mr-3 ${
                  activity.type === "account_created"
                    ? "bg-green-100 text-green-600"
                    : activity.type === "loan_approved"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "transaction"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {activity.type === "account_created" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {activity.type === "loan_approved" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {activity.type === "transaction" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                )}
                {activity.type === "account_updated" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.type === "account_created" && "New account created"}
                  {activity.type === "loan_approved" && "Loan application approved"}
                  {activity.type === "transaction" && "Transaction completed"}
                  {activity.type === "account_updated" && "Account details updated"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Customers */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="dashboard-subtitle">Recent Customers</h2>
          <Link to="/employee/customers" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="dashboard-card overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Phone</th>
                  <th className="table-header-cell">Address</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {customers.slice(0, 5).map((customer) => (
                  <motion.tr
                    key={customer.Customer_ID}
                    className="table-row"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <td className="table-cell">{customer.Customer_ID}</td>
                    <td className="table-cell font-medium">
                      {customer.F_Name} {customer.L_Name}
                    </td>
                    <td className="table-cell">{customer.Phone_No}</td>
                    <td className="table-cell">{customer.Address}</td>
                    <td className="table-cell">
                      <Link
                        to={`/employee/customers?edit=${customer.Customer_ID}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/employee/customers?edit=${customer.Customer_ID}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Recent Accounts */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="dashboard-subtitle">Recent Accounts</h2>
          <Link to="/employee/accounts" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="dashboard-card overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Account #</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Balance</th>
                  <th className="table-header-cell">Customer ID</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {accounts.slice(0, 5).map((account) => (
                  <motion.tr
                    key={account.Acc_Number}
                    className="table-row"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <td className="table-cell">{account.Acc_Number}</td>
                    <td className="table-cell">{account.Type}</td>
                    <td className="table-cell font-medium">₹{Number.parseFloat(account.Balance).toFixed(2)}</td>
                    <td className="table-cell">{account.Customer_ID}</td>
                    <td className="table-cell">
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/employee/accounts?view=${account.Acc_Number}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/employee/accounts?edit=${account.Acc_Number}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EmployeeDashboard

