"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../../services/accountService"
import { getCustomers } from "../../services/CustomerService"
import { toast } from "react-toastify"

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (editingAccount) {
      setValue("customerId", editingAccount.Customer_ID)
      setValue("accountType", editingAccount.Type)
      setValue("balance", editingAccount.Balance)
      setShowForm(true)
    }
  }, [editingAccount, setValue])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [accountsData, customersData] = await Promise.all([getAccounts(), getCustomers()])
      setAccounts(accountsData)
      setCustomers(customersData)
      setError("")
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      const accountData = {
        Customer_ID: Number.parseInt(data.customerId),
        Type: data.accountType,
        Balance: Number.parseFloat(data.balance),
      }

      if (editingAccount) {
        await updateAccount(editingAccount.Acc_Number, accountData)
        toast.success("Account updated successfully!")
      } else {
        await createAccount(accountData)
        toast.success("Account created successfully!")
      }

      setShowForm(false)
      setEditingAccount(null)
      reset()
      fetchData()
    } catch (err) {
      console.error("Error saving account:", err)
      toast.error(editingAccount ? "Failed to update account." : "Failed to create account.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id)
        toast.success("Account deleted successfully!")
        fetchData()
      } catch (err) {
        console.error("Error deleting account:", err)
        toast.error("Failed to delete account.")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAccount(null)
    reset()
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.Acc_Number.toString().includes(searchTerm) ||
      account.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.Customer_ID.toString().includes(searchTerm),
  )

  if (loading && accounts.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-title">Manage Accounts</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Create Account"}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Account Form */}
      {showForm && (
        <div className="dashboard-card mb-8 animate-slide-down">
          <h2 className="text-xl font-semibold mb-4">{editingAccount ? "Edit Account" : "Create New Account"}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="customerId" className="form-label">
                Customer
              </label>
              <select
                id="customerId"
                {...register("customerId", { required: "Customer is required" })}
                className="form-input"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.Customer_ID} value={customer.Customer_ID}>
                    {customer.F_Name} {customer.L_Name} (ID: {customer.Customer_ID})
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="form-error">{errors.customerId.message}</p>}
            </div>

            <div>
              <label htmlFor="accountType" className="form-label">
                Account Type
              </label>
              <select
                id="accountType"
                {...register("accountType", { required: "Account type is required" })}
                className="form-input"
              >
                <option value="">Select account type</option>
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
              </select>
              {errors.accountType && <p className="form-error">{errors.accountType.message}</p>}
            </div>

            <div>
              <label htmlFor="balance" className="form-label">
                Initial Balance ($)
              </label>
              <input
                id="balance"
                type="number"
                step="0.01"
                min="0"
                {...register("balance", {
                  required: "Balance is required",
                  min: { value: 0, message: "Balance cannot be negative" },
                })}
                className="form-input"
                placeholder="Enter amount"
              />
              {errors.balance && <p className="form-error">{errors.balance.message}</p>}
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={handleCancel} className="btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
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
                    {editingAccount ? "Updating..." : "Creating..."}
                  </div>
                ) : editingAccount ? (
                  "Update Account"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search accounts..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
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
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-cell text-center py-8">
                    {searchTerm ? "No accounts found matching your search." : "No accounts found."}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.Acc_Number} className="table-row">
                    <td className="table-cell">{account.Acc_Number}</td>
                    <td className="table-cell">{account.Type}</td>
                    <td className="table-cell font-medium">${Number.parseFloat(account.Balance).toFixed(2)}</td>
                    <td className="table-cell">{account.Customer_ID}</td>
                    <td className="table-cell">
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account.Acc_Number)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageAccounts

