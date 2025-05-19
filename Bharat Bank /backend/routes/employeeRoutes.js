const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.getEmployees);         // Get all employees
router.post("/add", employeeController.addEmployee);      // Add a new employee
router.get("/:id", employeeController.getEmployeeById);   // Get employee by ID
router.put("/:id", employeeController.updateEmployee);    // Update employee by ID
router.delete("/:id", employeeController.deleteEmployee); // Delete employee by ID

module.exports = router;
