const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all banks
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM BANK");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching banks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a bank
router.post("/", async (req, res) => {
    const { B_Name, Address } = req.body;
    try {
        const result = await pool.query("INSERT INTO BANK (B_Name, Address) VALUES (?, ?)", [B_Name, Address]);
        res.json({ message: "Bank added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error adding bank:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
