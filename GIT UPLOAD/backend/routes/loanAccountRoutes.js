const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all loan accounts
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM LOAN_ACCOUNT");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching loan accounts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a loan account
router.post("/", async (req, res) => {
    const { Loan_ID, Type } = req.body;
    try {
        await pool.query("INSERT INTO LOAN_ACCOUNT (Loan_ID, Type) VALUES (?, ?)", [Loan_ID, Type]);
        res.json({ message: "Loan account added successfully" });
    } catch (error) {
        console.error("Error adding loan account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
