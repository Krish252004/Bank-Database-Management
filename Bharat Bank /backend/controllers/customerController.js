const dbPromise = require("../config/db")

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM CUSTOMER")
    res.json(rows)
  } catch (error) {
    console.error("Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM CUSTOMER WHERE Customer_ID = ?", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: "Customer not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Add new customer
exports.addCustomer = async (req, res) => {
  const { F_Name, L_Name, Phone_No, Address, Email, Password } = req.body
  try {
    const db = await dbPromise
    // Insert into CUSTOMER table with Email and Password fields
    const [result] = await db.query(
      "INSERT INTO CUSTOMER (F_Name, L_Name, Phone_No, Address, Email, Password) VALUES (?, ?, ?, ?, ?, ?)",
      [F_Name, L_Name, Phone_No, Address, Email, Password],
    )

    res.status(201).json({
      message: "Customer added successfully",
      Customer_ID: result.insertId,
      customerData: {
        Customer_ID: result.insertId,
        F_Name,
        L_Name,
        Phone_No,
        Address,
        Email,
      },
    })
  } catch (error) {
    console.error("Database Insert Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Update customer
exports.updateCustomer = async (req, res) => {
  const { F_Name, L_Name, Phone_No, Address, Email, Password } = req.body
  try {
    const db = await dbPromise
    let query = "UPDATE CUSTOMER SET F_Name = ?, L_Name = ?, Phone_No = ?, Address = ?"
    const params = [F_Name, L_Name, Phone_No, Address]

    // Add Email and Password to update if provided
    if (Email) {
      query += ", Email = ?"
      params.push(Email)
    }

    if (Password) {
      query += ", Password = ?"
      params.push(Password)
    }

    query += " WHERE Customer_ID = ?"
    params.push(req.params.id)

    const [result] = await db.query(query, params)

    if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" })
    res.json({ message: "Customer updated successfully" })
  } catch (error) {
    console.error("Database Update Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const db = await dbPromise
    const [result] = await db.query("DELETE FROM CUSTOMER WHERE Customer_ID = ?", [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" })
    res.json({ message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Database Deletion Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Get customer by email (for authentication)
exports.getCustomerByEmail = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM CUSTOMER WHERE Email = ?", [req.params.email])
    if (rows.length === 0) return res.status(404).json({ error: "Customer not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}
