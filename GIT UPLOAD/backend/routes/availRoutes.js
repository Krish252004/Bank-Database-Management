const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all avail records
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM AVAIL");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching avail records:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Link a customer to a loan
router.post("/", async (req, res) => {
    const { Customer_ID, Loan_ID } = req.body;
    try {
        await pool.query("INSERT INTO AVAIL (Customer_ID, Loan_ID) VALUES (?, ?)", [Customer_ID, Loan_ID]);
        res.json({ message: "Loan linked to customer successfully" });
    } catch (error) {
        console.error("Error linking loan:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
