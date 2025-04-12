-- Insert sample data into BANK table
INSERT INTO BANK (B_Name, Address) VALUES
('Global Bank', '123 Main Street, New York, NY 10001'),
('City Finance', '456 Park Avenue, Chicago, IL 60601');

-- Insert sample data into BRANCH table
INSERT INTO BRANCH (Branch_Name, Address, B_Code) VALUES
('Downtown Branch', '123 Main Street, New York, NY 10001', 1),
('Uptown Branch', '789 Fifth Avenue, New York, NY 10022', 1),
('Loop Branch', '456 Park Avenue, Chicago, IL 60601', 2);

-- Insert sample data into CUSTOMER table
INSERT INTO CUSTOMER (F_Name, L_Name, Phone_No, Address) VALUES
('John', 'Doe', '555-123-4567', '123 Elm Street, New York, NY 10001'),
('Jane', 'Smith', '555-987-6543', '456 Oak Avenue, Chicago, IL 60601'),
('Michael', 'Johnson', '555-456-7890', '789 Pine Road, New York, NY 10022'),
('Emily', 'Williams', '555-789-0123', '321 Cedar Lane, Chicago, IL 60602');

-- Insert sample data into EMPLOYEE table
INSERT INTO EMPLOYEE (F_Name, L_Name, Phone_No, Address, Branch_ID) VALUES
('Robert', 'Brown', '555-111-2222', '111 Maple Drive, New York, NY 10001', 1),
('Sarah', 'Davis', '555-333-4444', '222 Birch Street, New York, NY 10022', 2),
('David', 'Miller', '555-555-6666', '333 Walnut Avenue, Chicago, IL 60601', 3),
('Jennifer', 'Wilson', '555-777-8888', '444 Cherry Lane, Chicago, IL 60602', 3);

-- Insert sample data into ACCOUNT table
INSERT INTO ACCOUNT (Balance, Type, Customer_ID) VALUES
(5000.00, 'Savings', 1),
(2500.00, 'Checking', 1),
(10000.00, 'Savings', 2),
(3500.00, 'Checking', 3),
(7500.00, 'Savings', 4);

-- Insert sample data into LOAN table
INSERT INTO LOAN (Amount, Customer_ID) VALUES
(15000.00, 1),
(25000.00, 2),
(10000.00, 3),
(30000.00, 4);

-- Insert sample data into AVAIL table
INSERT INTO AVAIL (Customer_ID, Loan_ID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- Insert sample data into MANAGES table
INSERT INTO MANAGES (Emp_ID, Acc_Number) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5);

-- Insert sample data into LOAN_ACCOUNT table
INSERT INTO LOAN_ACCOUNT (Loan_ID, Type) VALUES
(1, 'Personal'),
(2, 'Home'),
(3, 'Auto'),
(4, 'Education');

-- Insert sample data into PAYMENT table
INSERT INTO PAYMENT (Pay_Amount, Pay_Date, Loan_ID) VALUES
(500.00, '2023-01-15', 1),
(800.00, '2023-01-20', 2),
(300.00, '2023-01-25', 3),
(1000.00, '2023-01-30', 4);

-- Insert sample data into TRANSACTIONS table
INSERT INTO TRANSACTIONS (sender_account_id, receiver_account_id, amount, description, date) VALUES
(1, 3, 1000.00, 'Transfer to Jane', '2023-01-05 10:30:00'),
(2, 4, 500.00, 'Payment for services', '2023-01-10 14:45:00'),
(3, 5, 750.00, 'Monthly rent', '2023-01-15 09:15:00'),
(4, 1, 250.00, 'Debt repayment', '2023-01-20 16:20:00');

