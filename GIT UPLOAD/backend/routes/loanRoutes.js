const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

// Get all loans or filter by customer ID
router.get("/", loanController.getLoans);

// Create a new loan
router.post("/", loanController.addLoan);

// Get loan by ID
router.get("/:id", loanController.getLoanById);

// Update a loan
router.put("/:id", loanController.updateLoan);

// Delete a loan
router.delete("/:id", loanController.deleteLoan);

module.exports = router;
