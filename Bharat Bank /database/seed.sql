-- Insert sample data into BANK table
INSERT INTO BANK (B_Name, Address) VALUES
('Bharat Bank', '123 Connaught Place, New Delhi, Delhi 110001'),
('Bharat Bank', '456 MG Road, Mumbai, Maharashtra 400001');

-- Insert sample data into BRANCH table
INSERT INTO BRANCH (Branch_Name, Address, B_Code, IFSC_Code) VALUES
('Connaught Place Branch', '123 Connaught Place, New Delhi, Delhi 110001', 1, 'BHAR0000001'),
('MG Road Branch', '456 MG Road, Mumbai, Maharashtra 400001', 1, 'BHAR0000002'),
('Koramangala Branch', '789 80 Feet Road, Bengaluru, Karnataka 560095', 1, 'BHAR0000003');

-- Insert sample data into CUSTOMER table
INSERT INTO CUSTOMER (F_Name, L_Name, Phone_No, Address, Email, Password) VALUES
('Rajesh', 'Kumar', '9876543210', 'A-123, Green Park, New Delhi, Delhi 110016', 'rajesh.kumar@email.com', 'password123'),
('Priya', 'Sharma', '8765432109', 'B-456, Andheri East, Mumbai, Maharashtra 400069', 'priya.sharma@email.com', 'password123'),
('Arjun', 'Patel', '7654321098', 'C-789, Koramangala, Bengaluru, Karnataka 560095', 'arjun.patel@email.com', 'password123'),
('Ananya', 'Singh', '6543210987', 'D-101, Salt Lake, Kolkata, West Bengal 700091', 'ananya.singh@email.com', 'password123'),
('Vikram', 'Reddy', '5432109876', 'E-202, Jubilee Hills, Hyderabad, Telangana 500033', 'vikram.reddy@email.com', 'password123');

-- Insert sample data into EMPLOYEE table
INSERT INTO EMPLOYEE (F_Name, L_Name, Phone_No, Address, Branch_ID, Email, Password) VALUES
('Amit', 'Verma', '9876543211', 'F-303, Saket, New Delhi, Delhi 110017', 1, 'amit.verma@bharatbank.com', 'employee123'),
('Neha', 'Gupta', '8765432110', 'G-404, Bandra West, Mumbai, Maharashtra 400050', 2, 'neha.gupta@bharatbank.com', 'employee123'),
('Rahul', 'Malhotra', '7654321099', 'H-505, Indiranagar, Bengaluru, Karnataka 560038', 3, 'rahul.malhotra@bharatbank.com', 'employee123');

-- Insert sample data into ACCOUNT table
INSERT INTO ACCOUNT (Balance, Type, Customer_ID, Branch_ID, Opening_Date, Status) VALUES
(50000.00, 'Savings', 1, 1, '2023-01-01 10:00:00', 'Active'),
(25000.00, 'Current', 1, 1, '2023-01-15 11:30:00', 'Active'),
(100000.00, 'Savings', 2, 2, '2023-02-01 09:15:00', 'Active'),
(75000.00, 'Current', 3, 3, '2023-02-15 14:45:00', 'Active'),
(30000.00, 'Savings', 4, 1, '2023-03-01 16:20:00', 'Active'),
(150000.00, 'Current', 5, 2, '2023-03-15 13:10:00', 'Active');

-- Insert sample data into LOAN table
INSERT INTO LOAN (Amount, Customer_ID, Interest_Rate, Term, Type, Purpose, Status) VALUES
(500000.00, 1, 8.5, 20, 'Home Loan', 'House Purchase', 'Active'),
(1000000.00, 2, 10.0, 15, 'Business Loan', 'Business Expansion', 'Active'),
(750000.00, 3, 9.0, 10, 'Personal Loan', 'Medical Expenses', 'Active'),
(300000.00, 4, 8.0, 5, 'Education Loan', 'Higher Education', 'Active'),
(2000000.00, 5, 8.5, 25, 'Home Loan', 'Property Construction', 'Active');

-- Insert sample data into AVAIL table
INSERT INTO AVAIL (Customer_ID, Loan_ID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert sample data into MANAGES table
INSERT INTO MANAGES (Emp_ID, Acc_Number) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(2, 5),
(3, 6);

-- Insert sample data into LOAN_ACCOUNT table
INSERT INTO LOAN_ACCOUNT (Loan_ID, Type) VALUES
(1, 'Home'),
(2, 'Business'),
(3, 'Personal'),
(4, 'Education'),
(5, 'Home');

-- Insert sample data into PAYMENT table
INSERT INTO PAYMENT (Pay_Amount, Pay_Date, Loan_ID) VALUES
(25000.00, '2023-04-01', 1),
(50000.00, '2023-04-05', 2),
(37500.00, '2023-04-10', 3),
(15000.00, '2023-04-15', 4),
(100000.00, '2023-04-20', 5);

-- Insert sample data into TRANSACTIONS table
INSERT INTO TRANSACTIONS (Sender_Acc_Number, Receiver_Acc_Number, Amount, Transaction_Type, Description, Status, Transaction_Date) VALUES
(1, 3, 10000.00, 'Transfer', 'Monthly rent payment', 'Completed', '2023-04-01 10:30:00'),
(2, 4, 5000.00, 'Transfer', 'Utility bill payment', 'Completed', '2023-04-05 14:45:00'),
(3, 5, 15000.00, 'Transfer', 'Business payment', 'Completed', '2023-04-10 09:15:00'),
(4, 1, 2000.00, 'Transfer', 'Friend payment', 'Completed', '2023-04-15 16:20:00'),
(5, 2, 25000.00, 'Transfer', 'Salary transfer', 'Completed', '2023-04-20 11:30:00');

