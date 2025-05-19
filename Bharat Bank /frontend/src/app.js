"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

// Layouts
import MainLayout from "./layouts/MainLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CustomerDashboard from "./pages/customer/Dashboard"
import AccountsPage from "./pages/customer/Accounts"
import TransactionsPage from "./pages/customer/Transactions"
import LoansPage from "./pages/customer/Loans"
import EmployeeDashboard from "./pages/employee/Dashboard"
import ManageCustomers from "./pages/employee/ManageCustomers"
import ManageAccounts from "./pages/employee/ManageAccounts"
import ManageLoans from "./pages/employee/ManageLoans"
import NotFound from "./pages/NotFound"

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (userType && user.role !== userType) {
    return <Navigate to={`/${user.role}/dashboard`} />
  }

  return children
}

function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute userType="customer">
            <DashboardLayout userType="customer" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="loans" element={<LoansPage />} />
      </Route>

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute userType="employee">
            <DashboardLayout userType="employee" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="accounts" element={<ManageAccounts />} />
        <Route path="loans" element={<ManageLoans />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

