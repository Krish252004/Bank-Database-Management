const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const transactionController = require("../controllers/transactionController");

// Get all accounts or filter by customer ID
router.get("/", accountController.getAccounts);

// Get account types
router.get("/types", accountController.getAccountTypes);

// Verify account by IFSC and account number
router.get("/verify", accountController.getAccountByIFSCAndNumber);

// Verify account by ID
router.get("/verify/:id", accountController.checkAccountExists);

// Get account by ID
router.get("/:id", accountController.getAccountById);

// Get account balance
router.get("/:id/balance", accountController.getAccountBalance);

// Check if account exists
router.get("/:id/exists", accountController.checkAccountExists);

// Get account transactions (statement)
router.get("/:id/transactions", transactionController.getTransactions);

// Create a new account
router.post("/", accountController.createAccount);

// Update an account
router.put("/:id", accountController.updateAccount);

// Delete an account
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
