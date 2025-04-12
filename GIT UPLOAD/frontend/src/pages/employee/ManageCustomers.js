"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../../services/CustomerService"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("table") // table or grid

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (editingCustomer) {
      setValue("firstName", editingCustomer.F_Name)
      setValue("lastName", editingCustomer.L_Name)
      setValue("phone", editingCustomer.Phone_No)
      setValue("address", editingCustomer.Address)
      setShowForm(true)
    }
  }, [editingCustomer, setValue])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
      setError("")
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError("Failed to load customers. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      const customerData = {
        F_Name: data.firstName,
        L_Name: data.lastName,
        Phone_No: data.phone,
        Address: data.address,
        Email: data.email,
        DOB: data.dob,
        Gender: data.gender,
        Aadhar: data.aadhar,
        PAN: data.pan,
      }

      if (editingCustomer) {
        await updateCustomer(editingCustomer.Customer_ID, customerData)
        toast.success("Customer updated successfully!")
      } else {
        await createCustomer(customerData)
        toast.success("Customer added successfully!")
        // Trigger confetti effect on successful addition
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }

      setShowForm(false)
      setEditingCustomer(null)
      reset()
      fetchCustomers()
    } catch (err) {
      console.error("Error saving customer:", err)
      toast.error(editingCustomer ? "Failed to update customer." : "Failed to add customer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id)
        toast.success("Customer deleted successfully!")
        fetchCustomers()
      } catch (err) {
        console.error("Error deleting customer:", err)
        toast.error("Failed to delete customer.")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
    reset()
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.F_Name && customer.F_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.L_Name && customer.L_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.Phone_No && customer.Phone_No.includes(searchTerm)) ||
      (customer.Address && customer.Address.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading && customers.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-primary-600 font-medium">Loading customer data...</p>
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
      transition: { type: "spring", stiffness: 100 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="dashboard-container"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="dashboard-title mb-2">Manage Customers</h1>
          <p className="text-gray-600 dark:text-gray-400">Add, edit, and manage customer information in the system.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Customer"}
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}

      {/* Customer Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-card mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    className="form-input"
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    className="form-input"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="form-input"
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="text"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    className="form-input"
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="dob" className="form-label">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dob"
                    type="date"
                    {...register("dob", { required: "Date of birth is required" })}
                    className="form-input"
                  />
                  {errors.dob && <p className="form-error">{errors.dob.message}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="form-label">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    {...register("gender", { required: "Gender is required" })}
                    className="form-input"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="form-error">{errors.gender.message}</p>}
                </div>

                <div>
                  <label htmlFor="aadhar" className="form-label">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="aadhar"
                    type="text"
                    {...register("aadhar", {
                      required: "Aadhar number is required",
                      pattern: {
                        value: /^[0-9]{12}$/,
                        message: "Please enter a valid 12-digit Aadhar number",
                      },
                    })}
                    className="form-input"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                  {errors.aadhar && <p className="form-error">{errors.aadhar.message}</p>}
                </div>

                <div>
                  <label htmlFor="pan" className="form-label">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pan"
                    type="text"
                    {...register("pan", {
                      required: "PAN number is required",
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: "Please enter a valid PAN number (e.g., ABCDE1234F)",
                      },
                    })}
                    className="form-input"
                    placeholder="Enter PAN number"
                  />
                  {errors.pan && <p className="form-error">{errors.pan.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="form-label">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className="form-input min-h-[80px]"
                  placeholder="Enter full address"
                ></textarea>
                {errors.address && <p className="form-error">{errors.address.message}</p>}
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
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
                      {editingCustomer ? "Updating..." : "Adding..."}
                    </div>
                  ) : editingCustomer ? (
                    "Update Customer"
                  ) : (
                    "Add Customer"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and View Toggle */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search customers by name, phone, or address..."
            className="form-input pl-10 w-full"
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

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("table")}
            className={`px-3 py-2 rounded-md ${
              viewMode === "table"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-dark-600 dark:text-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 rounded-md ${
              viewMode === "grid"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-dark-600 dark:text-gray-300"
            }`}
          >
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Customers Display */}
      {filteredCustomers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-card text-center py-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm ? "No customers found matching your search." : "No customers found."}
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding your first customer.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-6 btn-primary"
          >
            Add Your First Customer
          </motion.button>
        </motion.div>
      ) : viewMode === "table" ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="dashboard-card overflow-hidden"
        >
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
                <AnimatePresence>
                  {filteredCustomers.map((customer) => (
                    <motion.tr key={customer.Customer_ID} variants={itemVariants} className="table-row">
                      <td className="table-cell">{customer.Customer_ID}</td>
                      <td className="table-cell font-medium">
                        {customer.F_Name} {customer.L_Name}
                      </td>
                      <td className="table-cell">{customer.Phone_No}</td>
                      <td className="table-cell">{customer.Address}</td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(customer)}
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(customer.Customer_ID)}
                            className="text-red-600 dark:text-red-400 hover:underline"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer.Customer_ID}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="dashboard-card"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {customer.F_Name} {customer.L_Name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.Customer_ID}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{customer.Phone_No}</span>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{customer.Address}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-dark-600">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(customer)}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(customer.Customer_ID)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default ManageCustomers

