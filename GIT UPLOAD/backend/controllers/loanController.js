const dbPromise = require("../config/db")

// ✅ Get all loans
exports.getLoans = async (req, res) => {
  try {
    const db = await dbPromise
    // Check if customerId is provided as a query parameter
    const customerId = req.query.customerId

    let query = "SELECT * FROM LOAN"
    let params = []

    // If customerId is provided, filter loans by customer ID
    if (customerId) {
      query = "SELECT * FROM LOAN WHERE Customer_ID = ?"
      params = [customerId]
    }

    const [rows] = await db.query(query, params)

    // Return empty array if no loans found
    if (rows.length === 0) {
      return res.json([])
    }

    res.json(rows)
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM LOAN WHERE Loan_ID = ?", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: "Loan not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Add a new loan
exports.addLoan = async (req, res) => {
  let connection;
  try {
    const db = await dbPromise
    connection = await db.getConnection()
    const { Amount, Customer_ID, Interest_Rate, Term, Type, Purpose, Status = "Pending" } = req.body

    // Validate required fields
    if (!Amount || !Customer_ID || !Interest_Rate || !Term || !Type || !Purpose) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Amount, Customer_ID, Interest_Rate, Term, Type, and Purpose are required"
      })
    }

    // Start a transaction
    await connection.beginTransaction()

    try {
      // Check if customer exists
      const [customer] = await connection.query("SELECT 1 FROM CUSTOMER WHERE Customer_ID = ?", [Customer_ID])
      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      // Insert the loan
      const [result] = await connection.query(
        "INSERT INTO LOAN (Amount, Customer_ID, Interest_Rate, Term, Type, Purpose, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [Amount, Customer_ID, Interest_Rate, Term, Type, Purpose, Status]
      )

      // Create a loan account
      await connection.query(
        "INSERT INTO LOAN_ACCOUNT (Loan_ID, Type, Balance, Status) VALUES (?, ?, ?, ?)",
        [result.insertId, Type, Amount, "Active"]
      )

      // Commit the transaction
      await connection.commit()

      res.status(201).json({
        message: "Loan created successfully",
        Loan_ID: result.insertId
      })
    } catch (error) {
      // Rollback the transaction on error
      if (connection) {
        await connection.rollback()
      }
      throw error
    }
  } catch (error) {
    console.error("❌ Error creating loan:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  } finally {
    // Release connection back to the pool
    if (connection) {
      try {
        await connection.release()
      } catch (error) {
        console.error("Error releasing connection:", error)
      }
    }
  }
}

// ✅ Update a loan
exports.updateLoan = async (req, res) => {
  let connection;
  try {
    const db = await dbPromise
    connection = await db.getConnection()
    const { Status, Amount, Interest_Rate, Term, Type, Purpose } = req.body
    const loanId = req.params.id

    // Start a transaction
    await connection.beginTransaction()

    try {
      // Check if loan exists
      const [loan] = await connection.query("SELECT * FROM LOAN WHERE Loan_ID = ?", [loanId])
      if (loan.length === 0) {
        throw new Error("Loan not found")
      }

      // Update loan details
      const updateFields = []
      const updateValues = []

      if (Status) {
        updateFields.push("Status = ?")
        updateValues.push(Status)
      }
      if (Amount) {
        updateFields.push("Amount = ?")
        updateValues.push(Amount)
      }
      if (Interest_Rate) {
        updateFields.push("Interest_Rate = ?")
        updateValues.push(Interest_Rate)
      }
      if (Term) {
        updateFields.push("Term = ?")
        updateValues.push(Term)
      }
      if (Type) {
        updateFields.push("Type = ?")
        updateValues.push(Type)
      }
      if (Purpose) {
        updateFields.push("Purpose = ?")
        updateValues.push(Purpose)
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields to update" })
      }

      updateValues.push(loanId)
      const query = `UPDATE LOAN SET ${updateFields.join(", ")} WHERE Loan_ID = ?`
      await connection.query(query, updateValues)

      // If amount was updated, update loan account balance
      if (Amount) {
        await connection.query(
          "UPDATE LOAN_ACCOUNT SET Balance = ? WHERE Loan_ID = ?",
          [Amount, loanId]
        )
      }

      // Commit the transaction
      await connection.commit()

      res.json({ message: "Loan updated successfully" })
    } catch (error) {
      // Rollback the transaction on error
      if (connection) {
        await connection.rollback()
      }
      throw error
    }
  } catch (error) {
    console.error("❌ Error updating loan:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  } finally {
    // Release connection back to the pool
    if (connection) {
      try {
        await connection.release()
      } catch (error) {
        console.error("Error releasing connection:", error)
      }
    }
  }
}

// ✅ Delete a loan
exports.deleteLoan = async (req, res) => {
  let connection;
  try {
    const db = await dbPromise
    connection = await db.getConnection()
    const loanId = req.params.id

    // Start a transaction
    await connection.beginTransaction()

    try {
      // Check if loan exists
      const [loan] = await connection.query("SELECT * FROM LOAN WHERE Loan_ID = ?", [loanId])
      if (loan.length === 0) {
        throw new Error("Loan not found")
      }

      // Delete loan account first (due to foreign key constraint)
      await connection.query("DELETE FROM LOAN_ACCOUNT WHERE Loan_ID = ?", [loanId])

      // Delete the loan
      await connection.query("DELETE FROM LOAN WHERE Loan_ID = ?", [loanId])

      // Commit the transaction
      await connection.commit()

      res.json({ message: "Loan deleted successfully" })
    } catch (error) {
      // Rollback the transaction on error
      if (connection) {
        await connection.rollback()
      }
      throw error
    }
  } catch (error) {
    console.error("❌ Error deleting loan:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  } finally {
    // Release connection back to the pool
    if (connection) {
      try {
        await connection.release()
      } catch (error) {
        console.error("Error releasing connection:", error)
      }
    }
  }
}
