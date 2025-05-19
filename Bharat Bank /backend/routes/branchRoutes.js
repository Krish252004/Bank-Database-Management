const express = require("express");
const router = express.Router();
const dbPromise = require("../config/db");

// Get all branches
router.get("/", async (req, res) => {
    try {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT * FROM BRANCH");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a branch
router.post("/", async (req, res) => {
    try {
        const db = await dbPromise;
        const { Branch_Name, Address, B_Code } = req.body;
        const [result] = await db.query(
            "INSERT INTO BRANCH (Branch_Name, Address, B_Code) VALUES (?, ?, ?)",
            [Branch_Name, Address, B_Code]
        );
        res.json({ message: "Branch added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error adding branch:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
