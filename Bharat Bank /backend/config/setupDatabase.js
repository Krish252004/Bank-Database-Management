const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Database Config
const databaseConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "12345678",
    database: process.env.DB_NAME || "bank_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true, // ✅ Allow multiple statements execution
};

// ✅ Paths to schema and seed files
const schemaPath = path.join(__dirname, "../../database/schema.sql");
const seedPath = path.join(__dirname, "../../database/seed.sql");

const createDatabase = async () => {
    let connection;
    try {
        // ✅ Create a separate connection (not from pool) for setup
        connection = await mysql.createConnection({
            host: databaseConfig.host,
            user: databaseConfig.user,
            password: databaseConfig.password,
            multipleStatements: true, // ✅ Enable multiple queries at once
        });

        // ✅ Create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseConfig.database}`);
        console.log(`✅ Database '${databaseConfig.database}' checked/created successfully.`);

        // ✅ Switch to the newly created database
        await connection.query(`USE ${databaseConfig.database}`);
        console.log(`✅ Switched to database '${databaseConfig.database}'.`);

        // ✅ Check if tables already exist (Count only actual tables, not views)
        const [tables] = await connection.query(
            `SELECT COUNT(*) AS tableCount FROM information_schema.tables 
             WHERE table_schema = '${databaseConfig.database}' AND table_type = 'BASE TABLE'`
        );

        if (tables[0].tableCount > 0) {
            console.log("✅ Tables already exist. Skipping schema execution.");
        } else {
            console.log("🛠 No tables found. Executing schema...");

            // ✅ Check if schema file exists
            if (!fs.existsSync(schemaPath)) {
                throw new Error(`❌ Schema file not found: ${schemaPath}`);
            }

            // ✅ Read and execute schema.sql
            const schemaSQL = fs.readFileSync(schemaPath, "utf8");
            await connection.query(schemaSQL);
            console.log("✅ Database schema executed successfully.");
        }

        // ✅ Check if seed data already exists in `customer` table
        const [rows] = await connection.query(`SELECT COUNT(*) AS rowCount FROM customer`);
        if (rows[0].rowCount === 0) {
            console.log("🌱 No data found. Seeding database...");

            // ✅ Check if seed file exists
            if (!fs.existsSync(seedPath)) {
                throw new Error(`❌ Seed file not found: ${seedPath}`);
            }

            // ✅ Read and execute seed.sql (multiple statements enabled)
            const seedSQL = fs.readFileSync(seedPath, "utf8");
            await connection.query(seedSQL);
            console.log("✅ Seed data inserted successfully.");
        } else {
            console.log("✅ Data already present. Skipping seeding.");
        }

        await connection.end(); // Close setup connection
    } catch (error) {
        console.error("❌ Database Setup Error:", error.message);
        process.exit(1); // Exit process if setup fails
    }
};

// Initialize DB setup
module.exports = createDatabase;
