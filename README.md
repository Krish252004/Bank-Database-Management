# Bank Database Management System
# Bharat Bank Management System

The Bharat Bank Management System is a full-stack web application designed to replicate real-world banking operations through a clean, modular, and scalable software architecture. It provides separate dashboards for customers and employees, allowing them to securely interact with account, transaction, and loan data in real-time.

This project is built entirely using **React.js** on the frontend and **Node.js with Express.js** on the backend, and it leverages **MySQL** for structured, relational data storage. The system emphasizes usability, security, and data consistency through a RESTful API design and normalized database schema.

## Overview

The system simulates a working environment for a commercial bank by offering a dual-role interface:
- **Customers** can open bank accounts, apply for loans, and track transactions.
- **Employees** can view customer information, process loan applications, and manage the system backend.

The application was developed for academic and practical exposure to full-stack development with a strong emphasis on real-world use cases, modular code organization, and clean UI practices.


## Core Features

### Customer Functionality
- Secure registration and login system.
- Bank account creation and management.
- Real-time transaction history.
- Loan application with status tracking.

### Employee Functionality
- Secure login for employees.
- View and manage customer accounts.
- Review and process customer loan applications.
- Access all loan and transaction records.

### Additional Functionalities
- Role-based access control (customer vs. employee).
- Clean, component-based UI with React.
- RESTful API endpoints secured by environment configuration.
- Full database schema with constraints and seed data.

---

## Technology Stack

### Frontend
- **React.js** (component-based SPA)
- **Tailwind CSS** for modern utility-first styling
- **Axios** for API integration
- **React Router** for routing and navigation

### Backend
- **Node.js** with **Express.js**
- REST API design pattern
- **dotenv** for environment variable management

### Database
- **MySQL** (InnoDB engine with foreign key constraints)
- Entity-Relationship design modeled into normalized schema
- SQL scripts provided for schema creation, alteration, and seeding

---

## Architecture

The project is divided into three main modules:
- **Frontend** (React client for customer/employee interfaces)
- **Backend** (Node.js server with Express routes and controllers)
- **Database** (MySQL schema with business logic and initial data)

Data flows securely through API endpoints exposed by the backend and consumed by the frontend using asynchronous HTTP requests. The backend enforces validations and handles all transactions with the relational database.

---

## Installation and Setup

### Prerequisites
- Node.js and npm
- MySQL Server
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/bharat-bank-management.git
cd bharat-bank-management

### Step 2: Setup Backend
cd backend
npm install
node server.js

### Step 3: Set Up the Frontend
cd ../frontend
npm install
npm start

bharat-bank-management/
├── backend/     -> Express.js server, API, DB models and controllers
├── frontend/    -> React.js client with modular views and routing
├── database/    -> SQL scripts for schema creation and seeding






