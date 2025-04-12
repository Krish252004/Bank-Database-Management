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
    multipleStatements: true,
};

// Paths to schema and seed files
const schemaPath = path.join(__dirname, "../../database/schema.sql");
const seedPath = path.join(__dirname, "../../database/seed.sql");
const alterPath = path.join(__dirname, "../../database/alter.sql");
const fixLoanAccountPath = path.join(__dirname, "../../database/fix_loan_account.sql");

console.log("🔍 Checking for schema at:", schemaPath);
console.log("🔍 Checking for seed at:", seedPath);
console.log("🔍 Checking for alter at:", alterPath);
console.log("🔍 Checking for fix_loan_account at:", fixLoanAccountPath);

const initializeDatabase = async () => {
    let connection;
    try {
        // Create a separate connection for setup
        connection = await mysql.createConnection({
            host: databaseConfig.host,
            user: databaseConfig.user,
            password: databaseConfig.password,
            multipleStatements: true,
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\``);
        console.log(`✅ Database '${databaseConfig.database}' checked/created.`);

        // Switch to the database
        await connection.query(`USE \`${databaseConfig.database}\``);
        console.log(`✅ Switched to database '${databaseConfig.database}'.`);

        // Check if tables exist
        const [tables] = await connection.query("SHOW TABLES");
        if (tables.length === 0) {
            console.log("🔄 No tables found. Creating database schema...");
            
            // Read and execute schema file
            const schema = fs.readFileSync(schemaPath, "utf8");
            await connection.query(schema);
            console.log("✅ Database schema created successfully.");

            // Run seed data if available
            if (fs.existsSync(seedPath)) {
                console.log("🌱 Loading seed data...");
                const seed = fs.readFileSync(seedPath, "utf8");
                await connection.query(seed);
                console.log("✅ Seed data loaded successfully.");
            }
        } else {
            console.log("✅ Tables already exist.");
            
            // Fix LOAN_ACCOUNT table structure
            if (fs.existsSync(fixLoanAccountPath)) {
                console.log("🔄 Fixing LOAN_ACCOUNT table structure...");
                const fixLoanAccount = fs.readFileSync(fixLoanAccountPath, "utf8");
                try {
                    await connection.query(fixLoanAccount);
                    console.log("✅ LOAN_ACCOUNT table structure fixed successfully.");
                } catch (error) {
                    console.error("❌ Error fixing LOAN_ACCOUNT table:", error.message);
                }
            }
            
            // Execute ALTER statements if available
            if (fs.existsSync(alterPath)) {
                console.log("🔄 Applying database alterations...");
                const alter = fs.readFileSync(alterPath, "utf8");
                try {
                    await connection.query(alter);
                    console.log("✅ Database alterations applied successfully.");
                } catch (error) {
                    // Check if the error is due to duplicate columns
                    if (error.message.includes('Duplicate column name')) {
                        console.log("ℹ️ Some columns already exist. Skipping...");
                    } else {
                        console.error("❌ Error applying alterations:", error.message);
                    }
                }
            }
        }

        // Close the setup connection
        await connection.end();

        // Create and return the connection pool
        return mysql.createPool(databaseConfig);
    } catch (error) {
        console.error("❌ Database Setup Error:", error.message);
        if (connection) {
            try {
                await connection.end();
            } catch (e) {
                console.error("Error closing connection:", e.message);
            }
        }
        throw error;
    }
};

// Initialize database and export the pool
const dbPromise = initializeDatabase().catch(error => {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
});

module.exports = dbPromise;
