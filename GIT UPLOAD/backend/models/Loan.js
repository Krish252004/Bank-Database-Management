const db = require("../config/db");

const Loan = {
    getAllLoans: (callback) => {
        db.query("SELECT * FROM loans", callback);
    },

    getLoanById: (id, callback) => {
        db.query("SELECT * FROM loans WHERE id = ?", [id], callback);
    },

    addLoan: (loanData, callback) => {
        const { customer_id, amount, interest_rate, tenure } = loanData;
        db.query(
            "INSERT INTO loans (customer_id, amount, interest_rate, tenure) VALUES (?, ?, ?, ?)",
            [customer_id, amount, interest_rate, tenure],
            callback
        );
    },

    updateLoan: (id, loanData, callback) => {
        const { amount, interest_rate, tenure } = loanData;
        db.query(
            "UPDATE loans SET amount = ?, interest_rate = ?, tenure = ? WHERE id = ?",
            [amount, interest_rate, tenure, id],
            callback
        );
    },

    deleteLoan: (id, callback) => {
        db.query("DELETE FROM loans WHERE id = ?", [id], callback);
    }
};

module.exports = Loan;

