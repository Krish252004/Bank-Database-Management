"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../services/api"
import { getCustomerByEmail } from "../services/CustomerService"
import { getEmployeeByEmail } from "../services/employeeService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is already logged in on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Check if user is already logged in
  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const userType = localStorage.getItem("userType")
      const userData = localStorage.getItem("userData")

      if (token && userType && userData) {
        // Set default headers for all requests
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Parse user data
        const parsedUserData = JSON.parse(userData)

        // Set user data with role
        setUser({
          ...parsedUserData,
          role: userType,
        })
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("userType")
      localStorage.removeItem("userData")
      api.defaults.headers.common["Authorization"] = ""
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (credentials, userType) => {
    try {
      let userData = null
      let customerId = null
      let employeeId = null

      // Try to authenticate with real API first
      if (userType === "customer") {
        // Check if customer exists in database
        const existingCustomer = await getCustomerByEmail(credentials.email)

        if (existingCustomer) {
          // Use existing customer data
          userData = {
            id: existingCustomer.Customer_ID,
            name: existingCustomer.F_Name,
            email: existingCustomer.Email,
            fullName: `${existingCustomer.F_Name} ${existingCustomer.L_Name}`,
            Customer_ID: existingCustomer.Customer_ID,
            F_Name: existingCustomer.F_Name,
            L_Name: existingCustomer.L_Name,
            Phone_No: existingCustomer.Phone_No,
            Address: existingCustomer.Address,
            isNewCustomer: false,
          }
          customerId = existingCustomer.Customer_ID
        } else {
          // Create mock data for new customer
          customerId = Math.floor(Math.random() * 1000) + 1
          userData = {
            id: customerId,
            name: credentials.email.split("@")[0],
            email: credentials.email,
            fullName: `${credentials.email.split("@")[0]} Kumar`,
            Customer_ID: customerId,
            F_Name: credentials.email.split("@")[0],
            L_Name: "Kumar",
            Phone_No: "9876543210",
            Address: "123 Main Street, Mumbai",
            isNewCustomer: true,
          }
        }
      } else {
        // Employee authentication
        const existingEmployee = await getEmployeeByEmail(credentials.email)

        if (existingEmployee) {
          // Use existing employee data
          userData = {
            id: existingEmployee.Emp_ID,
            name: existingEmployee.F_Name,
            email: existingEmployee.Email,
            fullName: `${existingEmployee.F_Name} ${existingEmployee.L_Name}`,
            Emp_ID: existingEmployee.Emp_ID,
            F_Name: existingEmployee.F_Name,
            L_Name: existingEmployee.L_Name,
            Phone_No: existingEmployee.Phone_No,
            Address: existingEmployee.Address,
            Branch_ID: existingEmployee.Branch_ID,
          }
          employeeId = existingEmployee.Emp_ID
        } else {
          // Create mock data for new employee
          employeeId = Math.floor(Math.random() * 1000) + 1
          userData = {
            id: employeeId,
            name: "Admin User",
            email: credentials.email,
            fullName: "Admin User",
            Emp_ID: employeeId,
            F_Name: "Admin",
            L_Name: "User",
            Phone_No: "9876543210",
            Address: "456 Bank Street, Delhi",
            Branch_ID: 1,
          }
        }
      }

      const token = "demo_token_123456"

      // Store token and set default headers
      localStorage.setItem("token", token)
      localStorage.setItem("userType", userType)
      localStorage.setItem("userData", JSON.stringify(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Set user data with role
      setUser({ ...userData, role: userType })

      toast.success("Login successful!")
      navigate(`/${userType}/dashboard`)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      toast.error(error.response?.data?.error || "Login failed. Please try again.")
      return false
    }
  }

  // Signup function
  const signup = async (userData, userType) => {
    try {
      // Format data for database tables
      const formattedData = {
        F_Name: userData.firstName,
        L_Name: userData.lastName,
        Phone_No: userData.phone,
        Address: userData.address,
        Email: userData.email,
        Password: userData.password,
      }

      // In a real implementation, you would call your API:
      if (userType === "customer") {
        // Store in CUSTOMER table
        await api.post(`/customers`, formattedData)
      } else {
        // Store in EMPLOYEE table with Branch_ID
        await api.post(`/employees/add`, {
          ...formattedData,
          Branch_ID: 1, // Default branch ID
        })
      }

      toast.success("Account created successfully! Please login.")
      navigate("/login")
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      toast.error(error.response?.data?.error || "Signup failed. Please try again.")
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userData")
    api.defaults.headers.common["Authorization"] = ""
    setUser(null)
    toast.info("You have been logged out.")
    navigate("/")
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
