const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all manages records
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM MANAGES");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching manages records:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Assign an employee to manage an account
router.post("/", async (req, res) => {
    const { Emp_ID, Acc_Number } = req.body;
    try {
        await pool.query("INSERT INTO MANAGES (Emp_ID, Acc_Number) VALUES (?, ?)", [Emp_ID, Acc_Number]);
        res.json({ message: "Manager assigned successfully" });
    } catch (error) {
        console.error("Error assigning manager:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
