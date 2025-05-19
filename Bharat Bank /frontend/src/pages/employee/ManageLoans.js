"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getLoans, createLoan, updateLoan, deleteLoan } from "../../services/loanService"
import { getCustomers } from "../../services/CustomerService"
import { toast } from "react-toastify"

const ManageLoans = () => {
  const [loans, setLoans] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingLoan, setEditingLoan] = useState(null)
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
    if (editingLoan) {
      setValue("customerId", editingLoan.Customer_ID)
      setValue("amount", editingLoan.Amount)
      setShowForm(true)
    }
  }, [editingLoan, setValue])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [loansData, customersData] = await Promise.all([getLoans(), getCustomers()])
      setLoans(loansData)
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

      const loanData = {
        Customer_ID: Number.parseInt(data.customerId),
        Amount: Number.parseFloat(data.amount),
      }

      if (editingLoan) {
        await updateLoan(editingLoan.Loan_ID, loanData)
        toast.success("Loan updated successfully!")
      } else {
        await createLoan(loanData)
        toast.success("Loan created successfully!")
      }

      setShowForm(false)
      setEditingLoan(null)
      reset()
      fetchData()
    } catch (err) {
      console.error("Error saving loan:", err)
      toast.error(editingLoan ? "Failed to update loan." : "Failed to create loan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (loan) => {
    setEditingLoan(loan)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      try {
        await deleteLoan(id)
        toast.success("Loan deleted successfully!")
        fetchData()
      } catch (err) {
        console.error("Error deleting loan:", err)
        toast.error("Failed to delete loan.")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingLoan(null)
    reset()
  }

  const filteredLoans = loans.filter(
    (loan) =>
      loan.Loan_ID.toString().includes(searchTerm) ||
      loan.Customer_ID.toString().includes(searchTerm) ||
      loan.Amount.toString().includes(searchTerm),
  )

  if (loading && loans.length === 0) {
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
        <h1 className="dashboard-title">Manage Loans</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Create Loan"}
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

      {/* Loan Form */}
      {showForm && (
        <div className="dashboard-card mb-8 animate-slide-down">
          <h2 className="text-xl font-semibold mb-4">{editingLoan ? "Edit Loan" : "Create New Loan"}</h2>
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
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { required: "Amount is required" })}
                className="form-input"
                placeholder="Enter amount"
              />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
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
                    {editingLoan ? "Updating..." : "Creating..."}
                  </div>
                ) : editingLoan ? (
                  "Update Loan"
                ) : (
                  "Create Loan"
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
            placeholder="Search loans..."
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

      {/* Loans Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Loan ID</th>
                <th className="table-header-cell">Customer ID</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-cell text-center py-8">
                    {searchTerm ? "No loans found matching your search." : "No loans found."}
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.Loan_ID} className="table-row">
                    <td className="table-cell">{loan.Loan_ID}</td>
                    <td className="table-cell">{loan.Customer_ID}</td>
                    <td className="table-cell">${loan.Amount}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(loan)}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loan.Loan_ID)}
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

export default ManageLoans

