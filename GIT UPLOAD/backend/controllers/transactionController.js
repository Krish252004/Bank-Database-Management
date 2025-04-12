const dbPromise = require("../config/db");

// Get all transactions with optional filters
exports.getTransactions = async (req, res) => {
    try {
        const db = await dbPromise;
        const { accountId, customerId, startDate, endDate, type, minAmount, maxAmount } = req.query;
        
        // If customerId is provided, first get all accounts for this customer
        let customerAccounts = [];
        if (customerId) {
            const [accounts] = await db.query(
                "SELECT Acc_Number FROM ACCOUNT WHERE Customer_ID = ?",
                [customerId]
            );
            customerAccounts = accounts.map(acc => acc.Acc_Number);
            
            if (customerAccounts.length === 0) {
                return res.json([]); // Return empty array if customer has no accounts
            }
        }

        let query = "SELECT * FROM TRANSACTIONS";
        const params = [];
        const conditions = [];

        if (accountId) {
            conditions.push("(Sender_Acc_Number = ? OR Receiver_Acc_Number = ?)");
            params.push(accountId, accountId);
        } else if (customerAccounts.length > 0) {
            // Create placeholders for the IN clause
            const placeholders = customerAccounts.map(() => "?").join(",");
            conditions.push(`(Sender_Acc_Number IN (${placeholders}) OR Receiver_Acc_Number IN (${placeholders}))`);
            // Add account numbers twice - once for sender, once for receiver
            params.push(...customerAccounts, ...customerAccounts);
        }

        if (startDate) {
            conditions.push("Transaction_Date >= ?");
            params.push(startDate);
        }
        if (endDate) {
            conditions.push("Transaction_Date <= ?");
            params.push(endDate);
        }
        if (type) {
            conditions.push("Transaction_Type = ?");
            params.push(type);
        }
        if (minAmount) {
            conditions.push("Amount >= ?");
            params.push(minAmount);
        }
        if (maxAmount) {
            conditions.push("Amount <= ?");
            params.push(maxAmount);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY Transaction_Date DESC";

        console.log("Query:", query); // For debugging
        console.log("Params:", params); // For debugging

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT * FROM TRANSACTIONS WHERE Transaction_ID = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// Get transaction types
exports.getTransactionTypes = async (req, res) => {
    try {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT DISTINCT Transaction_Type FROM TRANSACTIONS");
        const types = rows.map(row => row.Transaction_Type);
        res.json(types);
    } catch (error) {
        console.error("Error fetching transaction types:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// Get transaction status options
exports.getTransactionStatusOptions = async (req, res) => {
    try {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT DISTINCT Status FROM TRANSACTIONS");
        const statuses = rows.map(row => row.Status);
        res.json(statuses);
    } catch (error) {
        console.error("Error fetching transaction status options:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// Create a new transaction
exports.createTransaction = async (req, res) => {
    let connection;
    try {
        // Get database connection
        const db = await dbPromise;
        connection = await db.getConnection();
        
        // Validate request body
        const { Sender_Acc_Number, Receiver_Acc_Number, Amount, Transaction_Type, Description } = req.body;
        
        console.log("Received transaction data:", {
            Sender_Acc_Number,
            Receiver_Acc_Number,
            Amount,
            Transaction_Type,
            Description
        });

        // Validate required fields
        if (!Sender_Acc_Number || !Receiver_Acc_Number || !Amount || !Transaction_Type) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: "Sender_Acc_Number, Receiver_Acc_Number, Amount, and Transaction_Type are required"
            });
        }

        // Convert and validate account numbers
        const senderAccNumber = parseInt(Sender_Acc_Number);
        const receiverAccNumber = parseInt(Receiver_Acc_Number);
        
        if (isNaN(senderAccNumber) || isNaN(receiverAccNumber)) {
            return res.status(400).json({
                error: "Invalid account numbers",
                details: "Account numbers must be valid numbers"
            });
        }

        // Validate amount
        const amount = parseFloat(Amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount",
                details: "Amount must be a number greater than 0"
            });
        }

        // Start transaction
        await connection.beginTransaction();

        try {
            // Check sender account
            const [senderAccount] = await connection.query(
                "SELECT Balance, Status FROM ACCOUNT WHERE Acc_Number = ?",
                [senderAccNumber]
            );
            
            if (!senderAccount || senderAccount.length === 0) {
                throw new Error(`Sender account ${senderAccNumber} not found`);
            }

            if (senderAccount[0].Status !== 'Active') {
                throw new Error(`Sender account ${senderAccNumber} is not active`);
            }

            if (senderAccount[0].Balance < amount) {
                throw new Error(`Insufficient balance in sender account ${senderAccNumber}. Available: ${senderAccount[0].Balance}, Required: ${amount}`);
            }

            // Check receiver account
            const [receiverAccount] = await connection.query(
                "SELECT Status FROM ACCOUNT WHERE Acc_Number = ?",
                [receiverAccNumber]
            );
            
            if (!receiverAccount || receiverAccount.length === 0) {
                throw new Error(`Receiver account ${receiverAccNumber} not found`);
            }

            if (receiverAccount[0].Status !== 'Active') {
                throw new Error(`Receiver account ${receiverAccNumber} is not active`);
            }

            // Insert transaction
            const [result] = await connection.query(
                "INSERT INTO TRANSACTIONS (Sender_Acc_Number, Receiver_Acc_Number, Amount, Transaction_Type, Description, Status, Transaction_Date) VALUES (?, ?, ?, ?, ?, 'Completed', NOW())",
                [senderAccNumber, receiverAccNumber, amount, Transaction_Type, Description || null]
            );

            // Update sender balance
            await connection.query(
                "UPDATE ACCOUNT SET Balance = Balance - ? WHERE Acc_Number = ?",
                [amount, senderAccNumber]
            );

            // Update receiver balance
            await connection.query(
                "UPDATE ACCOUNT SET Balance = Balance + ? WHERE Acc_Number = ?",
                [amount, receiverAccNumber]
            );

            // Commit transaction
            await connection.commit();

            res.status(201).json({
                message: "Transaction created successfully",
                Transaction_ID: result.insertId
            });
        } catch (error) {
            // Rollback transaction on error
            if (connection) {
                await connection.rollback();
            }
            console.error("Transaction error:", error);
            res.status(400).json({ 
                error: "Transaction failed",
                details: error.message
            });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message 
        });
    } finally {
        // Release connection back to the pool
        if (connection) {
            try {
                await connection.release();
            } catch (error) {
                console.error("Error releasing connection:", error);
            }
        }
    }
}

// Fund transfer between accounts
exports.fundTransfer = async (req, res) => {
    try {
        const db = await dbPromise;
        const { fromAccount, toAccount, amount, description } = req.body;

        // Validate required fields
        if (!fromAccount || !toAccount || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Start a transaction
        await db.beginTransaction();

        try {
            // Check if sender has sufficient balance
            const [senderAccount] = await db.query(
                "SELECT Balance FROM ACCOUNT WHERE Acc_Number = ?",
                [fromAccount]
            );

            if (senderAccount.length === 0) {
                throw new Error("Sender account not found");
            }

            if (senderAccount[0].Balance < amount) {
                throw new Error("Insufficient balance");
            }

            // Check if receiver account exists
            const [receiverAccount] = await db.query(
                "SELECT 1 FROM ACCOUNT WHERE Acc_Number = ?",
                [toAccount]
            );

            if (receiverAccount.length === 0) {
                throw new Error("Receiver account not found");
            }

            // Create the transaction
            const [result] = await db.query(
                "INSERT INTO TRANSACTIONS (Sender_Acc_Number, Receiver_Acc_Number, Amount, Transaction_Type, Description, Status, Transaction_Date) VALUES (?, ?, ?, 'Transfer', ?, 'Completed', NOW())",
                [fromAccount, toAccount, amount, description]
            );

            // Update sender account balance
            await db.query(
                "UPDATE ACCOUNT SET Balance = Balance - ? WHERE Acc_Number = ?",
                [amount, fromAccount]
            );

            // Update receiver account balance
            await db.query(
                "UPDATE ACCOUNT SET Balance = Balance + ? WHERE Acc_Number = ?",
                [amount, toAccount]
            );

            // Commit the transaction
            await db.commit();

            res.status(201).json({
                message: "Fund transfer successful",
                Transaction_ID: result.insertId
            });
        } catch (error) {
            // Rollback the transaction on error
            await db.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Error in fund transfer:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
} 