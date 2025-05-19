"use client"

import { useState, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "../components/Logo"

const DashboardLayout = ({ userType }) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Mock notifications
    setNotifications([
      { id: 1, type: "info", message: "Welcome to Bharat Bank Dashboard", time: "2 min ago" },
      { id: 2, type: "success", message: "Your account has been verified successfully", time: "1 hour ago" },
      { id: 3, type: "warning", message: "Please update your KYC details", time: "2 days ago" },
    ])

    return () => clearInterval(timer)
  }, [])

  const customerNavItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: "home" },
    { name: "Accounts", path: "/customer/accounts", icon: "credit-card" },
    { name: "Transactions", path: "/customer/transactions", icon: "refresh-cw" },
    { name: "Loans", path: "/customer/loans", icon: "rupee" },
    { name: "UPI Payments", path: "/customer/upi", icon: "smartphone" },
    { name: "Fixed Deposits", path: "/customer/deposits", icon: "box" },
    { name: "Profile", path: "/customer/profile", icon: "user" },
  ]

  const employeeNavItems = [
    { name: "Dashboard", path: "/employee/dashboard", icon: "home" },
    { name: "Customers", path: "/employee/customers", icon: "users" },
    { name: "Accounts", path: "/employee/accounts", icon: "credit-card" },
    { name: "Loans", path: "/employee/loans", icon: "rupee" },
    { name: "Transactions", path: "/employee/transactions", icon: "refresh-cw" },
    { name: "Reports", path: "/employee/reports", icon: "bar-chart" },
    { name: "Settings", path: "/employee/settings", icon: "settings" },
  ]

  const navItems = userType === "customer" ? customerNavItems : employeeNavItems

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        )
      case "credit-card":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "refresh-cw":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "rupee":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 012 2v1H7a1 1 0 000 2h3v1a2 2 0 01-2 2H7a1 1 0 100 2h1a4 4 0 004-4v-1h1a1 1 0 100-2h-1V9a4 4 0 00-4-4H7z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "users":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )
      case "smartphone":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "box":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "user":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )
      case "bar-chart":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )
      case "settings":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-dark-800">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 flex z-40"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-dark-700"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Logo />
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`${
                        location.pathname === item.path
                          ? "bg-indian-saffron/10 text-indian-saffron dark:bg-indian-saffron/20 dark:text-indian-saffron"
                          : "text-gray-600 hover:bg-gray-50 hover:text-indian-saffron dark:text-gray-300 dark:hover:bg-dark-600 dark:hover:text-indian-saffron"
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                    >
                      <div className="mr-4 h-6 w-6">{renderIcon(item.icon)}</div>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-dark-600 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indian-saffron to-indian-green flex items-center justify-center text-white font-bold">
                      {user?.F_Name?.charAt(0) || user?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {user?.F_Name} {user?.L_Name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-indian-saffron hover:text-indian-saffron/80 dark:text-indian-saffron dark:hover:text-indian-saffron/80"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo />
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white dark:bg-dark-700 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? "bg-indian-saffron/10 text-indian-saffron dark:bg-indian-saffron/20 dark:text-indian-saffron"
                        : "text-gray-600 hover:bg-gray-50 hover:text-indian-saffron dark:text-gray-300 dark:hover:bg-dark-600 dark:hover:text-indian-saffron"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <div className="mr-3 h-5 w-5">{renderIcon(item.icon)}</div>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-dark-600 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indian-saffron to-indian-green flex items-center justify-center text-white font-bold">
                    {user?.F_Name?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {user?.F_Name} {user?.L_Name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-indian-saffron hover:text-indian-saffron/80 dark:text-indian-saffron dark:hover:text-indian-saffron/80"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-dark-700 shadow">
          <button
            className="md:hidden px-4 border-r border-gray-200 dark:border-dark-600 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indian-saffron"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                | {currentTime.toLocaleTimeString("en-IN")}
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notification dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-white dark:bg-dark-600 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indian-saffron"
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-600"></span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-dark-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-600">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No new notifications</div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-4 py-3 border-b border-gray-100 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600"
                            >
                              <div className="flex items-start">
                                <div
                                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                    notification.type === "info"
                                      ? "bg-blue-100 text-blue-600"
                                      : notification.type === "success"
                                        ? "bg-green-100 text-green-600"
                                        : notification.type === "warning"
                                          ? "bg-yellow-100 text-yellow-600"
                                          : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {notification.type === "info" && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {notification.type === "success" && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {notification.type === "warning" && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-600">
                        <button className="text-xs text-indian-saffron hover:text-indian-saffron/80 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Help button */}
              <button className="bg-white dark:bg-dark-600 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indian-saffron">
                <span className="sr-only">Help</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

