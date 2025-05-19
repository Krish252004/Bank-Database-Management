"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { getLoanTypes, getLoanPurposes, calculateLoanDetails } from "../services/loanService"

const LoanForm = ({ onSubmit, initialData = null, isSubmitting = false, onCancel }) => {
  const [loanTypes, setLoanTypes] = useState([])
  const [loanPurposes, setLoanPurposes] = useState([])
  const [loanDetails, setLoanDetails] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      Type: "",
      Amount: "",
      Interest_Rate: "",
      Term: "",
      Purpose: "",
      Employment_Type: "",
      Monthly_Income: "",
      Existing_EMI: "",
    },
  })

  const loanType = watch("Type")
  const amount = watch("Amount")
  const interestRate = watch("Interest_Rate")
  const term = watch("Term")

  useEffect(() => {
    // Fetch loan types
    const fetchLoanTypes = async () => {
      try {
        const types = await getLoanTypes()
        setLoanTypes(types)

        // Set initial values if editing
        if (initialData) {
          reset(initialData)

          // Fetch loan purposes for the initial loan type
          if (initialData.Type) {
            const purposes = await getLoanPurposes(initialData.Type)
            setLoanPurposes(purposes)
          }
        }
      } catch (error) {
        console.error("Error fetching loan types:", error)
        toast.error("Failed to load loan types. Please try again.")
      }
    }

    fetchLoanTypes()
  }, [initialData, reset])

  // Update loan purposes when loan type changes
  useEffect(() => {
    const fetchPurposes = async () => {
      if (loanType) {
        try {
          const purposes = await getLoanPurposes(loanType)
          setLoanPurposes(purposes)
        } catch (error) {
          console.error("Error fetching loan purposes:", error)
        }
      } else {
        setLoanPurposes([])
      }
    }

    fetchPurposes()
  }, [loanType])

  // Calculate loan details when amount, interest rate, or term changes
  useEffect(() => {
    if (amount && interestRate && term) {
      const details = calculateLoanDetails(
        Number.parseFloat(amount),
        Number.parseFloat(interestRate),
        Number.parseFloat(term),
      )
      setLoanDetails(details)
    } else {
      setLoanDetails(null)
    }
  }, [amount, interestRate, term])

  // Set default interest rate based on loan type
  useEffect(() => {
    if (loanType && !initialData) {
      let rate
      switch (loanType) {
        case "Home Loan":
          rate = "8.5"
          break
        case "Personal Loan":
          rate = "12.5"
          break
        case "Car Loan":
          rate = "9.5"
          break
        case "Education Loan":
          rate = "7.5"
          break
        case "Business Loan":
          rate = "14.0"
          break
        case "Gold Loan":
          rate = "10.5"
          break
        default:
          rate = "10.0"
      }
      setValue("Interest_Rate", rate)
    }
  }, [loanType, setValue, initialData])

  const formSubmit = (data) => {
    // Format data before submission
    const formattedData = {
      ...data,
      Amount: Number.parseFloat(data.Amount),
      Interest_Rate: Number.parseFloat(data.Interest_Rate),
      Term: Number.parseFloat(data.Term),
      Monthly_Income: data.Monthly_Income ? Number.parseFloat(data.Monthly_Income) : undefined,
      Existing_EMI: data.Existing_EMI ? Number.parseFloat(data.Existing_EMI) : undefined,
    }

    onSubmit(formattedData)
  }

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Type */}
        <div>
          <label htmlFor="Type" className="form-label">
            Loan Type <span className="text-red-500">*</span>
          </label>
          <select id="Type" {...register("Type", { required: "Loan type is required" })} className="form-input">
            <option value="">Select loan type</option>
            {loanTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.Type && <p className="form-error">{errors.Type.message}</p>}
        </div>

        {/* Loan Purpose */}
        <div>
          <label htmlFor="Purpose" className="form-label">
            Loan Purpose <span className="text-red-500">*</span>
          </label>
          <select
            id="Purpose"
            {...register("Purpose", { required: "Loan purpose is required" })}
            className="form-input"
            disabled={!loanType}
          >
            <option value="">Select purpose</option>
            {loanPurposes.map((purpose) => (
              <option key={purpose.value} value={purpose.value}>
                {purpose.label}
              </option>
            ))}
          </select>
          {errors.Purpose && <p className="form-error">{errors.Purpose.message}</p>}
        </div>

        {/* Loan Amount */}
        <div>
          <label htmlFor="Amount" className="form-label">
            Loan Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="Amount"
            type="number"
            step="1000"
            min="10000"
            {...register("Amount", {
              required: "Loan amount is required",
              min: { value: 10000, message: "Minimum loan amount is ₹10,000" },
              max: {
                value:
                  loanType === "Home Loan"
                    ? 10000000
                    : loanType === "Car Loan"
                      ? 2000000
                      : loanType === "Personal Loan"
                        ? 1000000
                        : loanType === "Education Loan"
                          ? 5000000
                          : loanType === "Business Loan"
                            ? 5000000
                            : loanType === "Gold Loan"
                              ? 1000000
                              : 10000000,
                message: `Maximum loan amount is ₹${
                  loanType === "Home Loan"
                    ? "1,00,00,000"
                    : loanType === "Car Loan"
                      ? "20,00,000"
                      : loanType === "Personal Loan"
                        ? "10,00,000"
                        : loanType === "Education Loan"
                          ? "50,00,000"
                          : loanType === "Business Loan"
                            ? "50,00,000"
                            : loanType === "Gold Loan"
                              ? "10,00,000"
                              : "1,00,00,000"
                }`,
              },
            })}
            className="form-input"
            placeholder="Enter loan amount"
          />
          {errors.Amount && <p className="form-error">{errors.Amount.message}</p>}
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="Interest_Rate" className="form-label">
            Interest Rate (% p.a.) <span className="text-red-500">*</span>
          </label>
          <input
            id="Interest_Rate"
            type="number"
            step="0.1"
            min="5"
            max="20"
            {...register("Interest_Rate", {
              required: "Interest rate is required",
              min: { value: 5, message: "Minimum interest rate is 5%" },
              max: { value: 20, message: "Maximum interest rate is 20%" },
            })}
            className="form-input"
            placeholder="Enter interest rate"
          />
          {errors.Interest_Rate && <p className="form-error">{errors.Interest_Rate.message}</p>}
        </div>

        {/* Loan Term */}
        <div>
          <label htmlFor="Term" className="form-label">
            Loan Term (Years) <span className="text-red-500">*</span>
          </label>
          <input
            id="Term"
            type="number"
            step="1"
            min="1"
            max="30"
            {...register("Term", {
              required: "Loan term is required",
              min: { value: 1, message: "Minimum term is 1 year" },
              max: {
                value:
                  loanType === "Home Loan"
                    ? 30
                    : loanType === "Car Loan"
                      ? 7
                      : loanType === "Personal Loan"
                        ? 5
                        : loanType === "Education Loan"
                          ? 15
                          : loanType === "Business Loan"
                            ? 10
                            : loanType === "Gold Loan"
                              ? 3
                              : 30,
                message: `Maximum term is ${
                  loanType === "Home Loan"
                    ? "30"
                    : loanType === "Car Loan"
                      ? "7"
                      : loanType === "Personal Loan"
                        ? "5"
                        : loanType === "Education Loan"
                          ? "15"
                          : loanType === "Business Loan"
                            ? "10"
                            : loanType === "Gold Loan"
                              ? "3"
                              : "30"
                } years`,
              },
            })}
            className="form-input"
            placeholder="Enter loan term"
          />
          {errors.Term && <p className="form-error">{errors.Term.message}</p>}
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="Employment_Type" className="form-label">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            id="Employment_Type"
            {...register("Employment_Type", { required: "Employment type is required" })}
            className="form-input"
          >
            <option value="">Select employment type</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Professional">Professional</option>
            <option value="Retired">Retired</option>
            <option value="Other">Other</option>
          </select>
          {errors.Employment_Type && <p className="form-error">{errors.Employment_Type.message}</p>}
        </div>

        {/* Monthly Income */}
        <div>
          <label htmlFor="Monthly_Income" className="form-label">
            Monthly Income (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="Monthly_Income"
            type="number"
            step="1000"
            min="10000"
            {...register("Monthly_Income", {
              required: "Monthly income is required",
              min: { value: 10000, message: "Minimum monthly income should be ₹10,000" },
            })}
            className="form-input"
            placeholder="Enter monthly income"
          />
          {errors.Monthly_Income && <p className="form-error">{errors.Monthly_Income.message}</p>}
        </div>

        {/* Existing EMI */}
        <div>
          <label htmlFor="Existing_EMI" className="form-label">
            Existing EMI (₹)
          </label>
          <input
            id="Existing_EMI"
            type="number"
            step="100"
            min="0"
            {...register("Existing_EMI")}
            className="form-input"
            placeholder="Enter existing EMI amount (if any)"
          />
          {errors.Existing_EMI && <p className="form-error">{errors.Existing_EMI.message}</p>}
        </div>
      </div>

      {/* Loan Details Preview */}
      {loanDetails && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-dark-600 rounded-lg border border-gray-200 dark:border-dark-500">
          <h3 className="text-lg font-medium mb-4">Loan Details Preview</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</p>
              <p className="text-lg font-semibold text-indian-saffron">₹{loanDetails.emi.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
              <p className="text-lg font-semibold text-indian-saffron">₹{loanDetails.totalInterest.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Payment</p>
              <p className="text-lg font-semibold text-indian-saffron">₹{loanDetails.totalPayment.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              {...register("terms", { required: "You must accept the terms and conditions" })}
              className="h-4 w-4 text-indian-saffron focus:ring-indian-saffron border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
              I accept the{" "}
              <a href="#" className="text-indian-saffron hover:underline">
                terms and conditions
              </a>
            </label>
            {errors.terms && <p className="form-error mt-1">{errors.terms.message}</p>}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="btn-indian-primary"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {initialData ? "Updating..." : "Applying..."}
            </div>
          ) : initialData ? (
            "Update Loan Application"
          ) : (
            "Submit Loan Application"
          )}
        </motion.button>
      </div>
    </form>
  )
}

export default LoanForm
