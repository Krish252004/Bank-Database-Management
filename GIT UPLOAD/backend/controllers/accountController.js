const dbPromise = require("../config/db")

// ✅ Get all accounts
exports.getAccounts = async (req, res) => {
  try {
    const db = await dbPromise
    // Check if customerId is provided as a query parameter
    const customerId = req.query.customerId

    let query = "SELECT * FROM ACCOUNT"
    let params = []

    // If customerId is provided, filter accounts by customer ID
    if (customerId) {
      query = "SELECT * FROM ACCOUNT WHERE Customer_ID = ?"
      params = [customerId]
    }

    const [rows] = await db.query(query, params)

    // If no accounts found, return empty array instead of error
    if (rows.length === 0) {
      return res.json([])
    }

    res.json(rows)
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get account by ID
exports.getAccountById = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM ACCOUNT WHERE Acc_Number = ?", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: "Account not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get account types
exports.getAccountTypes = async (req, res) => {
  try {
    const types = [
      { value: "Savings", label: "Savings Account" },
      { value: "Current", label: "Current Account" },
      { value: "Fixed Deposit", label: "Fixed Deposit Account" },
      { value: "Recurring Deposit", label: "Recurring Deposit Account" }
    ]
    res.json(types)
  } catch (error) {
    console.error("❌ Error fetching account types:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get account balance
exports.getAccountBalance = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query(
      "SELECT Balance FROM ACCOUNT WHERE Acc_Number = ?",
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: "Account not found" })
    res.json({ balance: rows[0].Balance })
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Check if account exists
exports.checkAccountExists = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query(
      "SELECT Acc_Number FROM ACCOUNT WHERE Acc_Number = ?",
      [req.params.id]
    )
    res.json(rows.length > 0)
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get account by IFSC and account number
exports.getAccountByIFSCAndNumber = async (req, res) => {
  try {
    const db = await dbPromise
    const { ifsc, accountNumber } = req.query
    const [rows] = await db.query(
      `SELECT a.*, b.Branch_Name, b.IFSC_Code, c.F_Name, c.L_Name 
       FROM ACCOUNT a 
       LEFT JOIN BRANCH b ON a.Branch_ID = b.Branch_ID 
       LEFT JOIN CUSTOMER c ON a.Customer_ID = c.Customer_ID 
       WHERE b.IFSC_Code = ? AND a.Acc_Number = ?`,
      [ifsc, accountNumber]
    )
    if (rows.length === 0) return res.status(404).json({ error: "Account not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Create new account
exports.createAccount = async (req, res) => {
  try {
    const db = await dbPromise
    const { Balance, Type, Customer_ID, Branch_ID = 1, Nominee_Name, Nominee_Relation, Nominee_DOB } = req.body

    // Validate required fields
    if (!Balance || !Type || !Customer_ID) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Balance, Type, and Customer_ID are required",
      })
    }

    // Validate balance
    const balanceNum = Number(Balance)
    if (isNaN(balanceNum) || balanceNum < 0) {
      return res.status(400).json({
        error: "Invalid balance",
        details: "Balance must be a positive number",
      })
    }

    // First, check if the customer exists
    const [customerCheck] = await db.query("SELECT * FROM CUSTOMER WHERE Customer_ID = ?", [Customer_ID])

    if (customerCheck.length === 0) {
      return res.status(404).json({ error: "Customer not found" })
    }

    // Check if the branch exists
    const [branchCheck] = await db.query("SELECT * FROM BRANCH WHERE Branch_ID = ?", [Branch_ID])

    if (branchCheck.length === 0) {
      return res.status(404).json({ error: "Branch not found" })
    }

    // Start a transaction
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Insert the new account
      const [result] = await connection.query(
        `INSERT INTO ACCOUNT (Balance, Type, Customer_ID, Branch_ID, Opening_Date, Status, 
          Nominee_Name, Nominee_Relation, Nominee_DOB) 
         VALUES (?, ?, ?, ?, NOW(), 'Active', ?, ?, ?)`,
        [balanceNum, Type, Customer_ID, Branch_ID, Nominee_Name || null, Nominee_Relation || null, Nominee_DOB || null]
      )

      // Get the newly created account with all details
      const [newAccount] = await connection.query(
        `SELECT a.*, b.Branch_Name, c.F_Name, c.L_Name 
         FROM ACCOUNT a 
         LEFT JOIN BRANCH b ON a.Branch_ID = b.Branch_ID 
         LEFT JOIN CUSTOMER c ON a.Customer_ID = c.Customer_ID 
         WHERE a.Acc_Number = ?`,
        [result.insertId]
      )

      if (!newAccount[0]) {
        throw new Error("Failed to retrieve created account")
      }

      // Commit the transaction
      await connection.commit()

      res.status(201).json({
        message: "Account created successfully",
        accountData: newAccount[0]
      })
    } catch (error) {
      // Rollback in case of error
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("❌ Database Insert Error:", error)
    res.status(500).json({ 
      error: "Failed to create account",
      details: error.message
    })
  }
}

// ✅ Update account
exports.updateAccount = async (req, res) => {
  try {
    const db = await dbPromise
    const { Balance, Type } = req.body
    const [result] = await db.query("UPDATE ACCOUNT SET Balance = ?, Type = ? WHERE Acc_Number = ?", [
      Balance,
      Type,
      req.params.id,
    ])
    if (result.affectedRows === 0) return res.status(404).json({ error: "Account not found" })
    res.json({ message: "Account updated successfully" })
  } catch (error) {
    console.error("❌ Database Update Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const db = await dbPromise
    const [result] = await db.query("DELETE FROM ACCOUNT WHERE Acc_Number = ?", [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: "Account not found" })
    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("❌ Database Deletion Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}
