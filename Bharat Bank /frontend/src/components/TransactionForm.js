"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { getTransactionTypes } from "../services/transactionService"
import { getAccountById, checkAccountExists } from "../services/accountService"

const TransactionForm = ({ onSubmit, accounts = [], isSubmitting = false, onCancel, defaultFromAccount = null }) => {
  const [transactionTypes, setTransactionTypes] = useState([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [receiverVerified, setReceiverVerified] = useState(false)
  const [receiverName, setReceiverName] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Sender_Acc_Number: defaultFromAccount || "",
      Receiver_Acc_Number: "",
      IFSC_Code: "BBANK0001",
      Amount: "",
      Transaction_Type: "",
      Description: "",
    },
  })

  const fromAccount = watch("Sender_Acc_Number")
  const toAccount = watch("Receiver_Acc_Number")
  const ifscCode = watch("IFSC_Code")
  const amount = watch("Amount")
  const transactionType = watch("Transaction_Type")

  // Fetch transaction types
  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const types = await getTransactionTypes()
        setTransactionTypes(types)

        // Set default transaction type if not set
        if (!transactionType) {
          setValue("Transaction_Type", "NEFT")
        }
      } catch (error) {
        console.error("Error fetching transaction types:", error)
        toast.error("Failed to load transaction types. Please try again.")
      }
    }

    fetchTransactionTypes()
  }, [setValue, transactionType])

  // Verify receiver account when account number and IFSC change
  useEffect(() => {
    const verifyReceiverAccount = async () => {
      if (toAccount && ifscCode) {
        setIsVerifying(true)
        setReceiverVerified(false)
        setReceiverName("")

        try {
          // Check if account exists
          const exists = await checkAccountExists(toAccount)

          if (exists) {
            // Get account details
            const accountDetails = await getAccountById(toAccount)
            setReceiverVerified(true)
            setReceiverName(`${accountDetails.Customer_Name || "Account Holder"}`)
          } else {
            setReceiverVerified(false)
            setReceiverName("")
          }
        } catch (error) {
          console.error("Error verifying receiver account:", error)
          setReceiverVerified(false)
          setReceiverName("")
        } finally {
          setIsVerifying(false)
        }
      }
    }

    // Debounce the verification
    const timeoutId = setTimeout(() => {
      if (toAccount && ifscCode) {
        verifyReceiverAccount()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [toAccount, ifscCode])

  const formSubmit = (data) => {
    // Format data before submission
    const formattedData = {
      ...data,
      Sender_Acc_Number: Number.parseInt(data.Sender_Acc_Number),
      Receiver_Acc_Number: Number.parseInt(data.Receiver_Acc_Number),
      Amount: Number.parseFloat(data.Amount),
    }

    onSubmit(formattedData)
  }

  // Get selected account balance
  const getSelectedAccountBalance = () => {
    if (!fromAccount) return null

    const selectedAccount = accounts.find((acc) => acc.Acc_Number.toString() === fromAccount)
    return selectedAccount ? selectedAccount.Balance : null
  }

  const selectedAccountBalance = getSelectedAccountBalance()

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Account */}
        <div>
          <label htmlFor="Sender_Acc_Number" className="form-label">
            From Account <span className="text-red-500">*</span>
          </label>
          <select
            id="Sender_Acc_Number"
            {...register("Sender_Acc_Number", { required: "Source account is required" })}
            className="form-input"
          >
            <option value="">Select account</option>
            {accounts.map((account) => (
              <option key={account.Acc_Number} value={account.Acc_Number}>
                {account.Type} - ₹{Number.parseFloat(account.Balance).toFixed(2)} (#{account.Acc_Number})
              </option>
            ))}
          </select>
          {errors.Sender_Acc_Number && <p className="form-error">{errors.Sender_Acc_Number.message}</p>}

          {selectedAccountBalance !== null && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Available Balance:{" "}
              <span className="font-medium">₹{Number.parseFloat(selectedAccountBalance).toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <label htmlFor="Transaction_Type" className="form-label">
            Transaction Type <span className="text-red-500">*</span>
          </label>
          <select
            id="Transaction_Type"
            {...register("Transaction_Type", { required: "Transaction type is required" })}
            className="form-input"
          >
            <option value="">Select type</option>
            {transactionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.Transaction_Type && <p className="form-error">{errors.Transaction_Type.message}</p>}
        </div>

        {/* To Account */}
        <div>
          <label htmlFor="Receiver_Acc_Number" className="form-label">
            To Account <span className="text-red-500">*</span>
          </label>
          <input
            id="Receiver_Acc_Number"
            type="text"
            {...register("Receiver_Acc_Number", {
              required: "Destination account is required",
              validate: (value) => value !== fromAccount || "Cannot transfer to the same account",
            })}
            className={`form-input ${receiverVerified ? "border-green-500" : ""}`}
            placeholder="Enter account number"
          />
          {errors.Receiver_Acc_Number && <p className="form-error">{errors.Receiver_Acc_Number.message}</p>}

          {isVerifying && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Verifying account...</p>}

          {receiverVerified && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">Account verified: {receiverName}</p>
          )}

          {!isVerifying && toAccount && !receiverVerified && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Account not found or invalid</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label htmlFor="IFSC_Code" className="form-label">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            id="IFSC_Code"
            type="text"
            {...register("IFSC_Code", {
              required: "IFSC code is required",
              pattern: {
                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                message: "Please enter a valid IFSC code",
              },
            })}
            className="form-input"
            placeholder="Enter IFSC code"
          />
          {errors.IFSC_Code && <p className="form-error">{errors.IFSC_Code.message}</p>}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="Amount" className="form-label">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="Amount"
            type="number"
            step="0.01"
            min="1"
            {...register("Amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
              validate: (value) => {
                if (!selectedAccountBalance) return true
                return Number.parseFloat(value) <= Number.parseFloat(selectedAccountBalance) || "Insufficient balance"
              },
            })}
            className="form-input"
            placeholder="Enter amount"
          />
          {errors.Amount && <p className="form-error">{errors.Amount.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="Description" className="form-label">
            Description
          </label>
          <input
            id="Description"
            type="text"
            {...register("Description")}
            className="form-input"
            placeholder="Enter description (optional)"
          />
          {errors.Description && <p className="form-error">{errors.Description.message}</p>}
        </div>
      </div>

      {/* Transaction Charges */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-600 rounded-lg border border-gray-200 dark:border-dark-500">
        <h3 className="text-sm font-medium mb-2">Transaction Charges</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Transfer Amount:</span>
            <span className="font-medium">₹{amount ? Number.parseFloat(amount).toFixed(2) : "0.00"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Transaction Charges:</span>
            <span className="font-medium">
              {transactionType === "RTGS"
                ? "₹25.00"
                : transactionType === "NEFT"
                  ? "₹5.00"
                  : transactionType === "IMPS"
                    ? "₹10.00"
                    : "₹0.00"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">GST (18%):</span>
            <span className="font-medium">
              {transactionType === "RTGS"
                ? "₹4.50"
                : transactionType === "NEFT"
                  ? "₹0.90"
                  : transactionType === "IMPS"
                    ? "₹1.80"
                    : "₹0.00"}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-dark-500 pt-2 mt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Amount:</span>
              <span>
                ₹
                {amount
                  ? (
                      Number.parseFloat(amount) +
                      (transactionType === "RTGS"
                        ? 29.5
                        : transactionType === "NEFT"
                          ? 5.9
                          : transactionType === "IMPS"
                            ? 11.8
                            : 0)
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>

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
              I confirm that the account details provided are correct and authorize Bharat Bank to debit my account
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
          disabled={isSubmitting || !receiverVerified}
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
              Processing...
            </div>
          ) : (
            "Transfer Funds"
          )}
        </motion.button>
      </div>
    </form>
  )
}

export default TransactionForm
