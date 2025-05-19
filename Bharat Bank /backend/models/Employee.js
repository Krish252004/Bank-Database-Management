const db = require("../config/db")

class Employee {
  static async getAllEmployees() {
    try {
      const [rows] = await db.query("SELECT * FROM EMPLOYEE")
      return rows
    } catch (error) {
      throw error
    }
  }

  static async getEmployeeById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM EMPLOYEE WHERE Emp_ID = ?", [id])
      return rows[0]
    } catch (error) {
      throw error
    }
  }

  static async getEmployeeByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM EMPLOYEE WHERE Email = ?", [email])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async addEmployee(employeeData) {
    try {
      const { F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password } = employeeData
      const [result] = await db.query(
        "INSERT INTO EMPLOYEE (F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password],
      )
      return result
    } catch (error) {
      throw error
    }
  }

  static async updateEmployee(id, employeeData) {
    try {
      const { F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password } = employeeData

      let query = "UPDATE EMPLOYEE SET F_Name = ?, L_Name = ?, Phone_No = ?, Address = ?, Branch_ID = ?"
      const params = [F_Name, L_Name, Phone_No, Address, Branch_ID]

      if (Email) {
        query += ", Email = ?"
        params.push(Email)
      }

      if (Password) {
        query += ", Password = ?"
        params.push(Password)
      }

      query += " WHERE Emp_ID = ?"
      params.push(id)

      const [result] = await db.query(query, params)
      return result
    } catch (error) {
      throw error
    }
  }

  static async deleteEmployee(id) {
    try {
      const [result] = await db.query("DELETE FROM EMPLOYEE WHERE Emp_ID = ?", [id])
      return result
    } catch (error) {
      throw error
    }
  }

  static async authenticateEmployee(email, password) {
    try {
      const [rows] = await db.query("SELECT * FROM EMPLOYEE WHERE Email = ? AND Password = ?", [email, password])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      throw error
    }
  }
}

module.exports = Employee
