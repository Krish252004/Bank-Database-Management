import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'
import { format } from "date-fns"

// Generate account statement PDF
export const generateAccountStatementPDF = (accountData, transactions, period) => {
  const doc = new jsPDF()

  // Add bank logo and header
  doc.setFontSize(20)
  doc.setTextColor(255, 153, 51) // Indian Saffron color
  doc.text("Bharat Bank", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Account Statement", 105, 25, { align: "center" })

  // Add account details
  doc.setFontSize(10)
  doc.text(`Account Number: ${accountData.Acc_Number}`, 14, 35)
  doc.text(`Account Type: ${accountData.Type}`, 14, 40)
  doc.text(`Account Holder: ${accountData.Customer_Name || "Customer"}`, 14, 45)
  doc.text(`IFSC Code: ${accountData.IFSC_Code || "BBANK0001"}`, 14, 50)

  // Add statement period
  doc.text(
    `Statement Period: ${format(new Date(period.startDate), "dd/MM/yyyy")} to ${format(new Date(period.endDate), "dd/MM/yyyy")}`,
    14,
    55,
  )

  // Add current balance
  doc.text(`Current Balance: ₹${Number.parseFloat(accountData.Balance).toFixed(2)}`, 14, 60)

  // Add generation date
  doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`, 14, 65)

  // Add transactions table
  const tableColumn = ["Date", "Description", "Reference", "Debit (₹)", "Credit (₹)", "Balance (₹)"]

  // Process transactions for the table
  let runningBalance = accountData.Balance
  const tableRows = []

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.Transaction_Date) - new Date(a.Transaction_Date),
  )

  // Calculate running balance for each transaction
  for (let i = sortedTransactions.length - 1; i >= 0; i--) {
    const transaction = sortedTransactions[i]
    const isCredit = transaction.Receiver_Acc_Number === accountData.Acc_Number
    const amount = Number.parseFloat(transaction.Amount)

    if (isCredit) {
      runningBalance -= amount // Subtract for previous balance
    } else {
      runningBalance += amount // Add for previous balance
    }
  }

  // Reset running balance to starting balance
  let startingBalance = runningBalance

  // Add transactions to table rows
  for (const transaction of sortedTransactions) {
    const isCredit = transaction.Receiver_Acc_Number === accountData.Acc_Number
    const amount = Number.parseFloat(transaction.Amount)

    if (isCredit) {
      startingBalance += amount
    } else {
      startingBalance -= amount
    }

    tableRows.push([
      format(new Date(transaction.Transaction_Date), "dd/MM/yyyy"),
      transaction.Description || "Transaction",
      transaction.Transaction_ID,
      isCredit ? "" : amount.toFixed(2),
      isCredit ? amount.toFixed(2) : "",
      startingBalance.toFixed(2),
    ])
  }

  // Add table to document
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [19, 136, 8] }, // Indian Green color
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 70 },
  })

  // Add summary
  const finalY = doc.lastAutoTable.finalY || 200

  doc.text("Transaction Summary", 14, finalY + 10)

  // Calculate total debits and credits
  const totalDebits = transactions.reduce((sum, transaction) => {
    if (transaction.Sender_Acc_Number === accountData.Acc_Number) {
      return sum + Number.parseFloat(transaction.Amount)
    }
    return sum
  }, 0)

  const totalCredits = transactions.reduce((sum, transaction) => {
    if (transaction.Receiver_Acc_Number === accountData.Acc_Number) {
      return sum + Number.parseFloat(transaction.Amount)
    }
    return sum
  }, 0)

  doc.text(`Total Debits: ₹${totalDebits.toFixed(2)}`, 14, finalY + 20)
  doc.text(`Total Credits: ₹${totalCredits.toFixed(2)}`, 14, finalY + 25)
  doc.text(`Number of Transactions: ${transactions.length}`, 14, finalY + 30)

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text("This is a computer-generated statement and does not require a signature.", 105, 285, { align: "center" })
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    doc.text("Bharat Bank - Serving the nation since 1947", 105, 295, { align: "center" })
  }

  return doc
}

// Generate loan statement PDF
export const generateLoanStatementPDF = (loanData, payments, schedule) => {
  const doc = new jsPDF()

  // Add bank logo and header
  doc.setFontSize(20)
  doc.setTextColor(255, 153, 51) // Indian Saffron color
  doc.text("Bharat Bank", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Loan Statement", 105, 25, { align: "center" })

  // Add loan details
  doc.setFontSize(10)
  doc.text(`Loan Account Number: ${loanData.Loan_ID}`, 14, 35)
  doc.text(`Loan Type: ${loanData.Type}`, 14, 40)
  doc.text(`Loan Amount: ₹${Number.parseFloat(loanData.Amount).toFixed(2)}`, 14, 45)
  doc.text(`Interest Rate: ${loanData.Interest_Rate}% p.a.`, 14, 50)
  doc.text(`Loan Term: ${loanData.Term} years`, 14, 55)
  doc.text(`Start Date: ${format(new Date(loanData.Start_Date), "dd/MM/yyyy")}`, 14, 60)
  doc.text(`End Date: ${format(new Date(loanData.End_Date), "dd/MM/yyyy")}`, 14, 65)
  doc.text(`Status: ${loanData.Status}`, 14, 70)

  // Add payment summary
  const totalPaid = payments.reduce((sum, payment) => sum + Number.parseFloat(payment.Amount), 0)
  const remainingAmount = Number.parseFloat(loanData.Amount) - totalPaid

  doc.text(`Total Amount Paid: ₹${totalPaid.toFixed(2)}`, 14, 80)
  doc.text(`Remaining Principal: ₹${remainingAmount.toFixed(2)}`, 14, 85)

  // Add payments table
  const paymentsTableColumn = ["Payment Date", "Amount (₹)", "Status"]
  const paymentsTableRows = payments.map((payment) => [
    format(new Date(payment.Payment_Date), "dd/MM/yyyy"),
    Number.parseFloat(payment.Amount).toFixed(2),
    payment.Status,
  ])

  // Add table to document
  doc.autoTable({
    head: [paymentsTableColumn],
    body: paymentsTableRows,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [19, 136, 8] }, // Indian Green color
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 95 },
  })

  // Add payment schedule
  const finalY = doc.lastAutoTable.finalY || 150

  doc.text("Payment Schedule", 14, finalY + 10)

  const scheduleTableColumn = ["Payment No.", "Due Date", "EMI (₹)", "Principal (₹)", "Interest (₹)", "Balance (₹)"]
  const scheduleTableRows = schedule.map((payment) => [
    payment.month,
    format(payment.paymentDate, "dd/MM/yyyy"),
    payment.emi.toFixed(2),
    payment.principalPayment.toFixed(2),
    payment.interestPayment.toFixed(2),
    payment.remainingPrincipal.toFixed(2),
  ])

  // Add table to document
  doc.autoTable({
    head: [scheduleTableColumn],
    body: scheduleTableRows,
    startY: finalY + 15,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [19, 136, 8] }, // Indian Green color
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: finalY + 15 },
  })

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text("This is a computer-generated statement and does not require a signature.", 105, 285, { align: "center" })
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    doc.text("Bharat Bank - Serving the nation since 1947", 105, 295, { align: "center" })
  }

  return doc
}

// Generate transaction receipt PDF
export const generateTransactionReceiptPDF = (transactionData, senderAccount, receiverAccount) => {
  const doc = new jsPDF()

  // Add bank logo and header
  doc.setFontSize(20)
  doc.setTextColor(255, 153, 51) // Indian Saffron color
  doc.text("Bharat Bank", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Transaction Receipt", 105, 25, { align: "center" })

  // Add transaction details
  doc.setFontSize(10)
  doc.text(`Transaction ID: ${transactionData.Transaction_ID}`, 14, 35)
  doc.text(`Transaction Date: ${format(new Date(transactionData.Transaction_Date), "dd/MM/yyyy HH:mm:ss")}`, 14, 40)
  doc.text(`Transaction Type: ${transactionData.Transaction_Type}`, 14, 45)
  doc.text(`Amount: ₹${Number.parseFloat(transactionData.Amount).toFixed(2)}`, 14, 50)
  doc.text(`Description: ${transactionData.Description || "Fund Transfer"}`, 14, 55)
  doc.text(`Status: ${transactionData.Status}`, 14, 60)

  // Add sender details
  doc.text("Sender Details:", 14, 70)
  doc.text(`Account Number: ${senderAccount.Acc_Number}`, 20, 75)
  doc.text(`Account Type: ${senderAccount.Type}`, 20, 80)
  doc.text(`IFSC Code: ${senderAccount.IFSC_Code || "BBANK0001"}`, 20, 85)

  // Add receiver details
  doc.text("Receiver Details:", 14, 95)
  doc.text(`Account Number: ${receiverAccount.Acc_Number}`, 20, 100)
  doc.text(`Account Type: ${receiverAccount.Type}`, 20, 105)
  doc.text(`IFSC Code: ${receiverAccount.IFSC_Code || "BBANK0001"}`, 20, 110)

  // Add footer
  doc.setFontSize(8)
  doc.text("This is a computer-generated receipt and does not require a signature.", 105, 285, { align: "center" })
  doc.text("Bharat Bank - Serving the nation since 1947", 105, 290, { align: "center" })

  return doc
}
