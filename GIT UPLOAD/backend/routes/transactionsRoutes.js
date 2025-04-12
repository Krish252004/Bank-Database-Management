const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Get all transactions with filters
router.get("/", transactionController.getTransactions);

// Get transaction types
router.get("/types", transactionController.getTransactionTypes);

// Get transaction status options
router.get("/status-options", transactionController.getTransactionStatusOptions);

// Get transaction by ID
router.get("/:id", transactionController.getTransactionById);

// Create a new transaction
router.post("/", transactionController.createTransaction);

// Fund transfer between accounts
router.post("/transfer", transactionController.fundTransfer);

module.exports = router;
