const db = require('../config/db');
const bcrypt = require('bcrypt');
const { getRoleByroleName } = require('../services/employeeService');

let lastGeneratedEmployeeID;

// Function to initialize lastGeneratedEmployeeID from the database
const initializeLastGeneratedEmployeeID = async () => {
  const [result] = await db.query("SELECT MAX(employeeID) AS maxEmployeeID FROM employee");
  lastGeneratedEmployeeID = result[0].maxEmployeeID || 111110; // Initialize with the last employee ID or a default value
};

// Call the initialization function
initializeLastGeneratedEmployeeID();

// Helper function to generate a sequential 6-digit employeeID
const generateEmployeeID = () => {
  lastGeneratedEmployeeID++;
  // Ensure it stays within the 6-digit limit
  if (lastGeneratedEmployeeID > 999999) {
    throw new Error('Employee ID limit exceeded.');
  }
  return lastGeneratedEmployeeID;
};

// Helper function to hash the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createUser = async ({ employeeName, email, password }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw { status: 400, message: 'Email already registered. Please choose a different one.' };
    }

    const employeeID = generateEmployeeID();
    const hashedPassword = await hashPassword(password);
    const defaultRoleName = 'guest';
    const roleName = await createRoleIfNotExists(defaultRoleName);

    const [result] = await db.query(
      "INSERT INTO employee (employeeName, email, password, roleName, employeeID) VALUES (?, ?, ?, ?, ?)",
      [employeeName, email, hashedPassword, roleName, employeeID]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error in createUser:', error.message);
    throw error;
  }
};

const createRoleIfNotExists = async (roleName) => {
  const existingRole = await getRoleByroleName(roleName);

  if (existingRole) {
    return existingRole.roleName;
  }

  const [result] = await db.query(
    "INSERT INTO roles (roleName) VALUES (?)",
    [roleName]
  );

  return roleName;
};

const getUserByEmail = async (email) => {
  const [records] = await db.query("SELECT * FROM employee WHERE email = ?", [email]);
  return records[0];
};

const getUserByEmployeeID = async (employeeID) => {
  const [records] = await db.query(
    "SELECT * FROM employee WHERE employeeID = ?",
    [employeeID]
  );
  return records[0];
};

const updatePasswordById = async (newPassword, employeeID) => {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      'UPDATE employee SET password = ? WHERE employeeID = ?',
      [hashedPassword, parseInt(employeeID, 10)] // Ensure employeeID is treated as numeric
    );

    return result.affectedRows;
  } catch (error) {
    console.error('Error in updatePasswordById:', error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByEmployeeID,
  hashPassword,
  updatePasswordById,
};