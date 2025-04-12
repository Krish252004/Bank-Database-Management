const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const setupDatabase = require("./config/setupDatabase"); // Import database setup function

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Support for form data

// ✅ Initialize Database Tables Only Once at Startup
(async () => {
    try {
        await setupDatabase(); // Run table creation only once
        console.log("✅ Database setup completed successfully.");
    } catch (error) {
        console.error("❌ Database Setup Error:", error.message);
        process.exit(1); // Stop execution if database setup fails
    }
})();

// Importing Routes
const routes = {
    customers: require("./routes/customerRoutes"),
    employees: require("./routes/employeeRoutes"),
    accounts: require("./routes/accountRoutes"),
    loans: require("./routes/loanRoutes"),
    payments: require("./routes/paymentRoutes"),
    banks: require("./routes/bankRoutes"),
    branches: require("./routes/branchRoutes"),
    transactions: require("./routes/transactionsRoutes"),
    manages: require("./routes/managesRoutes"),
    avail: require("./routes/availRoutes"),
    loanAccounts: require("./routes/loanAccountRoutes"),
};

// ✅ API Routes Setup & Logging
console.log("\n📌 Available API Endpoints:");
for (const [key, route] of Object.entries(routes)) {
    const endpoint = `/${key}`;
    app.use(endpoint, route);
    console.log(`🔹 ${key.charAt(0).toUpperCase() + key.slice(1)} API → http://localhost:${process.env.PORT || 5000}${endpoint}`);
}

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 Bank Management API is running! Check the console for available endpoints.");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found", message: `The requested resource ${req.url} was not found` });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});
