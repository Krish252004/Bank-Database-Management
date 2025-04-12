const db = require("../config/db")

class Customer {
  static async getAllCustomers() {
    try {
      const [rows] = await db.query("SELECT * FROM CUSTOMER")
      return rows
    } catch (error) {
      throw error
    }
  }

  static async getCustomerById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM CUSTOMER WHERE Customer_ID = ?", [id])
      return rows
    } catch (error) {
      throw error
    }
  }

  static async getCustomerByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM CUSTOMER WHERE Email = ?", [email])
      return rows
    } catch (error) {
      throw error
    }
  }

  static async addCustomer(customerData) {
    try {
      const { F_Name, L_Name, Phone_No, Address, Email, Password } = customerData
      const [result] = await db.query(
        "INSERT INTO CUSTOMER (F_Name, L_Name, Phone_No, Address, Email, Password) VALUES (?, ?, ?, ?, ?, ?)",
        [F_Name, L_Name, Phone_No, Address, Email, Password],
      )
      return result
    } catch (error) {
      throw error
    }
  }

  static async updateCustomer(id, customerData) {
    try {
      const { F_Name, L_Name, Phone_No, Address, Email, Password } = customerData

      let query = "UPDATE CUSTOMER SET F_Name = ?, L_Name = ?, Phone_No = ?, Address = ?"
      const params = [F_Name, L_Name, Phone_No, Address]

      if (Email) {
        query += ", Email = ?"
        params.push(Email)
      }

      if (Password) {
        query += ", Password = ?"
        params.push(Password)
      }

      query += " WHERE Customer_ID = ?"
      params.push(id)

      const [result] = await db.query(query, params)
      return result
    } catch (error) {
      throw error
    }
  }

  static async deleteCustomer(id) {
    try {
      const [result] = await db.query("DELETE FROM CUSTOMER WHERE Customer_ID = ?", [id])
      return result
    } catch (error) {
      throw error
    }
  }

  static async authenticateCustomer(email, password) {
    try {
      const [rows] = await db.query("SELECT * FROM CUSTOMER WHERE Email = ? AND Password = ?", [email, password])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      throw error
    }
  }
}

module.exports = Customer
