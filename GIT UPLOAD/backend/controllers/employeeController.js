const dbPromise = require("../config/db")

// ✅ Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM EMPLOYEE")
    res.json(rows)
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM EMPLOYEE WHERE Emp_ID = ?", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: "Employee not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("❌ Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Add new employee
exports.addEmployee = async (req, res) => {
  const { F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password } = req.body
  try {
    const db = await dbPromise
    const [result] = await db.query(
      "INSERT INTO EMPLOYEE (F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password],
    )
    res.status(201).json({
      message: "Employee added successfully",
      Emp_ID: result.insertId,
      employeeData: {
        Emp_ID: result.insertId,
        F_Name,
        L_Name,
        Phone_No,
        Address,
        Branch_ID,
        Email,
      },
    })
  } catch (error) {
    console.error("❌ Database Insert Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Update employee
exports.updateEmployee = async (req, res) => {
  const { F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password } = req.body
  try {
    const db = await dbPromise
    let query = "UPDATE EMPLOYEE SET F_Name = ?, L_Name = ?, Phone_No = ?, Address = ?, Branch_ID = ?"
    const params = [F_Name, L_Name, Phone_No, Address, Branch_ID]

    // Add Email and Password to update if provided
    if (Email) {
      query += ", Email = ?"
      params.push(Email)
    }

    if (Password) {
      query += ", Password = ?"
      params.push(Password)
    }

    query += " WHERE Emp_ID = ?"
    params.push(req.params.id)

    const [result] = await db.query(query, params)

    if (result.affectedRows === 0) return res.status(404).json({ error: "Employee not found" })
    res.json({ message: "Employee updated successfully" })
  } catch (error) {
    console.error("❌ Database Update Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// ✅ Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const db = await dbPromise
    const [result] = await db.query("DELETE FROM EMPLOYEE WHERE Emp_ID = ?", [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: "Employee not found" })
    res.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("❌ Database Deletion Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

// Get employee by email (for authentication)
exports.getEmployeeByEmail = async (req, res) => {
  try {
    const db = await dbPromise
    const [rows] = await db.query("SELECT * FROM EMPLOYEE WHERE Email = ?", [req.params.email])
    if (rows.length === 0) return res.status(404).json({ error: "Employee not found" })
    res.json(rows[0])
  } catch (error) {
    console.error("Database Query Error:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}
