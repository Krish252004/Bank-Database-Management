const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

// Database Config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  multipleStatements: true,
}

const dbName = process.env.DB_NAME || "bank_db"
const schemaPath = path.join(__dirname, "../database/schema.sql")
const seedPath = path.join(__dirname, "../database/seed.sql")

async function resetDatabase() {
  let connection

  try {
    console.log("🔄 Starting complete database reset...")

    // Create connection without database selected
    connection = await mysql.createConnection(dbConfig)

    // Drop and recreate the database
    console.log(`🗑️ Dropping database ${dbName} if it exists...`)
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`)

    console.log(`🏗️ Creating fresh database ${dbName}...`)
    await connection.query(`CREATE DATABASE ${dbName}`)

    console.log(`🔄 Switching to database ${dbName}...`)
    await connection.query(`USE ${dbName}`)

    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`)
    }

    // Read and execute schema.sql
    console.log("📄 Reading schema file...")
    const schemaSQL = fs.readFileSync(schemaPath, "utf8")

    console.log("🏗️ Creating tables...")
    await connection.query(schemaSQL)

    // Check if seed file exists
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed file not found: ${seedPath}`)
    }

    // Read and execute seed.sql
    console.log("📄 Reading seed file...")
    const seedSQL = fs.readFileSync(seedPath, "utf8")

    console.log("🌱 Inserting seed data...")
    await connection.query(seedSQL)

    console.log("✅ Database reset completed successfully!")
  } catch (error) {
    console.error("❌ Database Reset Error:", error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the reset function
resetDatabase()

