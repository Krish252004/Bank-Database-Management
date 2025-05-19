const db = require("../config/db")

class Account {
  static async getAllAccounts() {
    try {
      const [rows] = await db.query("SELECT * FROM ACCOUNT")
      return rows
    } catch (error) {
      throw error
    }
  }

  static async getAccountsByCustomerId(customerId) {
    try {
      const [rows] = await db.query("SELECT * FROM ACCOUNT WHERE Customer_ID = ?", [customerId])
      return rows
    } catch (error) {
      throw error
    }
  }

  static async getAccountById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM ACCOUNT WHERE Acc_Number = ?", [id])
      return rows[0]
    } catch (error) {
      throw error
    }
  }

  static async addAccount(accountData) {
    try {
      const { Customer_ID, Balance, Type, Branch_ID = 1 } = accountData

      const [result] = await db.query(
        "INSERT INTO ACCOUNT (Customer_ID, Balance, Type, Branch_ID, Opening_Date, Status) VALUES (?, ?, ?, ?, NOW(), 'Active')",
        [Customer_ID, Balance, Type, Branch_ID],
      )

      // Return the newly created account
      if (result.insertId) {
        const [newAccount] = await db.query("SELECT * FROM ACCOUNT WHERE Acc_Number = ?", [result.insertId])
        return newAccount[0]
      }

      return result
    } catch (error) {
      throw error
    }
  }

  static async updateAccount(id, accountData) {
    try {
      const { Balance, Type } = accountData
      const [result] = await db.query("UPDATE ACCOUNT SET Balance = ?, Type = ? WHERE Acc_Number = ?", [
        Balance,
        Type,
        id,
      ])
      return result
    } catch (error) {
      throw error
    }
  }

  static async deleteAccount(id) {
    try {
      const [result] = await db.query("DELETE FROM ACCOUNT WHERE Acc_Number = ?", [id])
      return result
    } catch (error) {
      throw error
    }
  }
}

module.exports = Account
