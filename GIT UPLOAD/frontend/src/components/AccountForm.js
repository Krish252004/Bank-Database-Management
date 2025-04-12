"use client"

import { useState, useEffect } from "react"
import { getAccountTypes, getBranches } from "../services/accountService"

const AccountForm = ({ onSubmit, isSubmitting, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    Type: initialData.Type || "Savings",
    Balance: initialData.Balance || "5000",
    Branch_ID: initialData.Branch_ID || 1,
    Nominee_Name: initialData.Nominee_Name || "",
    Nominee_Relation: initialData.Nominee_Relation || "",
    Nominee_DOB: initialData.Nominee_DOB || "",
  })

  const [accountTypes, setAccountTypes] = useState([])
  const [branches, setBranches] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await getAccountTypes()
        setAccountTypes(types)

        const branchesData = await getBranches()
        setBranches(branchesData)
      } catch (error) {
        console.error("Error fetching form data:", error)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.Type) {
      newErrors.Type = "Account type is required"
    }

    if (!formData.Balance) {
      newErrors.Balance = "Initial balance is required"
    } else if (isNaN(formData.Balance) || Number.parseFloat(formData.Balance) < 0) {
      newErrors.Balance = "Balance must be a positive number"
    }

    if (!formData.Branch_ID) {
      newErrors.Branch_ID = "Branch is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create New Account Form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Type <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="accountType"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            className={`form-input w-full ${errors.Type ? "border-red-500" : ""}`}
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={!!errors.Type}
            aria-describedby={errors.Type ? "type-error" : undefined}
          >
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.Type && <p id="type-error" className="text-red-500 text-xs mt-1" role="alert">{errors.Type}</p>}
        </div>

        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Initial Balance (₹) <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="balance"
            type="number"
            name="Balance"
            value={formData.Balance}
            onChange={handleChange}
            className={`form-input w-full ${errors.Balance ? "border-red-500" : ""}`}
            placeholder="Enter initial deposit amount"
            min="0"
            step="0.01"
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={!!errors.Balance}
            aria-describedby={errors.Balance ? "balance-error" : undefined}
          />
          {errors.Balance && <p id="balance-error" className="text-red-500 text-xs mt-1" role="alert">{errors.Balance}</p>}
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="branch"
            name="Branch_ID"
            value={formData.Branch_ID}
            onChange={handleChange}
            className={`form-input w-full ${errors.Branch_ID ? "border-red-500" : ""}`}
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={!!errors.Branch_ID}
            aria-describedby={errors.Branch_ID ? "branch-error" : undefined}
          >
            {branches.map((branch) => (
              <option key={branch.Branch_ID} value={branch.Branch_ID}>
                {branch.Branch_Name}
              </option>
            ))}
          </select>
          {errors.Branch_ID && <p id="branch-error" className="text-red-500 text-xs mt-1" role="alert">{errors.Branch_ID}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-600 pt-4 mt-4">
        <h3 className="text-md font-medium mb-2">Nominee Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nomineeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nominee Name
            </label>
            <input
              id="nomineeName"
              type="text"
              name="Nominee_Name"
              value={formData.Nominee_Name}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="Enter nominee name"
              disabled={isSubmitting}
              aria-label="Nominee Name"
            />
          </div>

          <div>
            <label htmlFor="nomineeRelation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Relationship
            </label>
            <input
              id="nomineeRelation"
              type="text"
              name="Nominee_Relation"
              value={formData.Nominee_Relation}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="E.g., Spouse, Child, Parent"
              disabled={isSubmitting}
              aria-label="Nominee Relationship"
            />
          </div>

          <div>
            <label htmlFor="nomineeDOB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              id="nomineeDOB"
              type="date"
              name="Nominee_DOB"
              value={formData.Nominee_DOB}
              onChange={handleChange}
              className="form-input w-full"
              disabled={isSubmitting}
              aria-label="Nominee Date of Birth"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-dark-800 dark:text-gray-300 dark:border-dark-600 dark:hover:bg-dark-700"
          disabled={isSubmitting}
          aria-label="Cancel account creation"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indian-saffron text-white rounded-md hover:bg-indian-saffron/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indian-saffron"
          disabled={isSubmitting}
          aria-label="Create new account"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </div>
    </form>
  )
}

export default AccountForm
