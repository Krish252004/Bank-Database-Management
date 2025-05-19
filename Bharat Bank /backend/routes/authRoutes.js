const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

// Customer Signup Route
router.post("/customer/signup", async (req, res) => {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if customer already exists
        const [existingCustomer] = await db.query("SELECT * FROM customers WHERE email = ?", [email]);
        if (existingCustomer.length > 0) {
            return res.status(400).json({ error: "Customer already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new customer
        await db.query(
            "INSERT INTO customers (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, address, hashedPassword]
        );

        res.status(201).json({ message: "Customer registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
