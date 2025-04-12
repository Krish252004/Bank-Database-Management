"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { initializePaymentGateway } from "../services/paymentService"

const PaymentGateway = ({ amount, description, onSuccess, onCancel, customerId = null }) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentGateway, setPaymentGateway] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Initialize payment gateway
  useEffect(() => {
    const gateway = initializePaymentGateway({
      merchantId: "BHARATBANK123",
      environment: "production",
    })

    setPaymentGateway(gateway)

    // Fetch available payment methods
    const fetchPaymentMethods = async () => {
      try {
        const methods = await gateway.getPaymentMethods()
        setPaymentMethods(methods)

        // Set default payment method
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id)
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error)
      }
    }

    fetchPaymentMethods()
  }, [])

  const handlePaymentMethodChange = (methodId) => {
    setSelectedMethod(methodId)
  }

  const processPayment = async (formData) => {
    if (!paymentGateway) return

    setIsProcessing(true)
    setPaymentStatus(null)

    try {
      // Prepare payment details based on selected method
      const paymentDetails = {
        amount,
        currency: "INR",
        description,
        customerId,
        paymentMethod: selectedMethod,
        ...formData,
      }

      // Process payment
      const result = await paymentGateway.processPayment(paymentDetails)

      setPaymentStatus({
        success: true,
        message: "Payment processed successfully",
        transactionId: result.transactionId,
      })

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess(result)
      }, 2000)
    } catch (error) {
      console.error("Payment processing error:", error)

      setPaymentStatus({
        success: false,
        message: error.message || "Payment processing failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Render payment form based on selected method
  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                {...register("cardNumber", {
                  required: "Card number is required",
                  pattern: {
                    value: /^[0-9]{16}$/,
                    message: "Please enter a valid 16-digit card number",
                  },
                })}
                className="form-input"
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="form-label">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: "Please enter a valid expiry date (MM/YY)",
                    },
                  })}
                  className="form-input"
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="form-error">{errors.expiryDate.message}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="form-label">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  {...register("cvv", {
                    required: "CVV is required",
                    pattern: {
                      value: /^[0-9]{3,4}$/,
                      message: "Please enter a valid CVV",
                    },
                  })}
                  className="form-input"
                  placeholder="123"
                />
                {errors.cvv && <p className="form-error">{errors.cvv.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="cardHolderName" className="form-label">
                Card Holder Name
              </label>
              <input
                id="cardHolderName"
                type="text"
                {...register("cardHolderName", { required: "Card holder name is required" })}
                className="form-input"
                placeholder="John Doe"
              />
              {errors.cardHolderName && <p className="form-error">{errors.cardHolderName.message}</p>}
            </div>
          </div>
        )

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="upiId" className="form-label">
                UPI ID
              </label>
              <input
                id="upiId"
                type="text"
                {...register("upiId", {
                  required: "UPI ID is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
                    message: "Please enter a valid UPI ID (e.g., name@upi)",
                  },
                })}
                className="form-input"
                placeholder="yourname@upi"
              />
              {errors.upiId && <p className="form-error">{errors.upiId.message}</p>}
            </div>
          </div>
        )

      case "netbanking":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="bank" className="form-label">
                Select Bank
              </label>
              <select
                id="bank"
                {...register("bank", { required: "Bank selection is required" })}
                className="form-input"
              >
                <option value="">Select your bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="AXIS">Axis Bank</option>
                <option value="PNB">Punjab National Bank</option>
                <option value="BOB">Bank of Baroda</option>
                <option value="CANARA">Canara Bank</option>
                <option value="KOTAK">Kotak Mahindra Bank</option>
              </select>
              {errors.bank && <p className="form-error">{errors.bank.message}</p>}
            </div>
          </div>
        )

      case "wallet":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="walletType" className="form-label">
                Select Wallet
              </label>
              <select
                id="walletType"
                {...register("walletType", { required: "Wallet selection is required" })}
                className="form-input"
              >
                <option value="">Select your wallet</option>
                <option value="PAYTM">Paytm</option>
                <option value="PHONEPE">PhonePe</option>
                <option value="GPAY">Google Pay</option>
                <option value="AMAZONPAY">Amazon Pay</option>
                <option value="MOBIKWIK">MobiKwik</option>
              </select>
              {errors.walletType && <p className="form-error">{errors.walletType.message}</p>}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="text"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className="form-input"
                placeholder="9876543210"
              />
              {errors.mobileNumber && <p className="form-error">{errors.mobileNumber.message}</p>}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">Please select a payment method</p>
          </div>
        )
    }
  }

  return (
    <div className="payment-gateway">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Complete your payment of ₹{Number.parseFloat(amount).toFixed(2)}
        </p>
      </div>

      {/* Payment Status */}
      {paymentStatus && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            paymentStatus.success
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          <div className="flex items-center">
            {paymentStatus.success ? (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{paymentStatus.message}</span>
          </div>
          {paymentStatus.success && paymentStatus.transactionId && (
            <p className="mt-2 text-sm">Transaction ID: {paymentStatus.transactionId}</p>
          )}
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="form-label">Select Payment Method</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentMethodChange(method.id)}
              className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                selectedMethod === method.id
                  ? "border-indian-saffron bg-indian-saffron/10"
                  : "border-gray-200 hover:border-indian-saffron/50 hover:bg-gray-50"
              }`}
            >
              <div className="h-8 w-8 mb-2 flex items-center justify-center">
                {method.id === "card" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indian-saffron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                )}
                {method.id === "upi" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indian-saffron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {method.id === "netbanking" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indian-saffron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                )}
                {method.id === "wallet" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indian-saffron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium">{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit(processPayment)}>
        {renderPaymentForm()}

        <div className="mt-8 flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isProcessing}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isProcessing || !selectedMethod}
            className="btn-indian-primary"
          >
            {isProcessing ? (
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
              `Pay ₹${Number.parseFloat(amount).toFixed(2)}`
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default PaymentGateway
