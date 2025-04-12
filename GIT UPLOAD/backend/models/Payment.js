const db = require("../config/db");

const Payment = {
    getAllPayments: (callback) => {
        db.query("SELECT * FROM payments", callback);
    },

    getPaymentById: (id, callback) => {
        db.query("SELECT * FROM payments WHERE id = ?", [id], callback);
    },

    addPayment: (paymentData, callback) => {
        const { loan_id, amount, payment_date } = paymentData;
        db.query(
            "INSERT INTO payments (loan_id, amount, payment_date) VALUES (?, ?, ?)",
            [loan_id, amount, payment_date],
            callback
        );
    },

    updatePayment: (id, paymentData, callback) => {
        const { amount, payment_date } = paymentData;
        db.query(
            "UPDATE payments SET amount = ?, payment_date = ? WHERE id = ?",
            [amount, payment_date, id],
            callback
        );
    },

    deletePayment: (id, callback) => {
        db.query("DELETE FROM payments WHERE id = ?", [id], callback);
    }
};

module.exports = Payment;

