const db = require("../config/db");

// ✅ Get all payments
exports.getPayments = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM PAYMENT"); // Correct table name
        res.json(rows);
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ✅ Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM PAYMENT WHERE Pay_ID = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Payment not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ✅ Add a new payment
exports.addPayment = async (req, res) => {
    const { Pay_Amount, Pay_Date, Loan_ID } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO PAYMENT (Pay_Amount, Pay_Date, Loan_ID) VALUES (?, ?, ?)",
            [Pay_Amount, Pay_Date, Loan_ID]
        );
        res.status(201).json({ message: "Payment added successfully", Pay_ID: result.insertId });
    } catch (error) {
        console.error("❌ Database Insert Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ✅ Update a payment
exports.updatePayment = async (req, res) => {
    const { Pay_Amount, Pay_Date } = req.body;
    try {
        const [result] = await db.query(
            "UPDATE PAYMENT SET Pay_Amount = ?, Pay_Date = ? WHERE Pay_ID = ?",
            [Pay_Amount, Pay_Date, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });
        res.json({ message: "Payment updated successfully" });
    } catch (error) {
        console.error("❌ Database Update Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ✅ Delete a payment
exports.deletePayment = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM PAYMENT WHERE Pay_ID = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("❌ Database Deletion Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
