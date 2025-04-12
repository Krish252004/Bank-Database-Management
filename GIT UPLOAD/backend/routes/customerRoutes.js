const express = require("express")
const router = express.Router()
const customerController = require("../controllers/customerController")

// Get all customers
router.get("/", customerController.getCustomers)

// Get customer by email
router.get("/email/:email", customerController.getCustomerByEmail)

// Get customer by ID
router.get("/:id", customerController.getCustomerById)

// Add a new customer
router.post("/", customerController.addCustomer)

// Update a customer
router.put("/:id", customerController.updateCustomer)

// Delete a customer
router.delete("/:id", customerController.deleteCustomer)

module.exports = router

