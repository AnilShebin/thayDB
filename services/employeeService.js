const db = require('../config/db');
const bcrypt = require('bcrypt');

const createEmployee = async (employeeData) => {
  try {
    const {
      employeeID,
      employeeName,
      employeeAge,
      employeeGender,
      employeeDOJ,
      employeeRemarks,
      employeeAccruedLeaves,
      email,
      roleName,
      password,
    } = employeeData;

    const providedPassword = password || 'password@123';
    const hashedPassword = await bcrypt.hash(providedPassword, 10);

    const [result] = await db.query(
      "INSERT INTO employee (employeeID, employeeName, employeeAge, employeeGender, employeeDOJ, employeeRemarks, employeeAccruedLeaves, email, roleName, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        employeeID,
        employeeName,
        employeeAge,
        employeeGender,
        employeeDOJ,
        employeeRemarks,
        employeeAccruedLeaves,
        email,
        roleName,
        hashedPassword,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error in createEmployee:', error.message);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const [records] = await db.query("SELECT * FROM employee WHERE email = ?", [email]);
  return records[0];
};

const getUserByEmployeeID = async (employeeID) => {
  const [records] = await db.query("SELECT * FROM employee WHERE employeeID = ?", [employeeID]);
  return records[0];
};

const getAllEmployees = async () => {
  try {
    const [records] = await db.query("SELECT employeeID, employeeName, employeeAge, employeeGender, employeeDOJ, employeeRemarks, employeeAccruedLeaves, email, roleName FROM employee");
    return records;
  } catch (error) {
    console.error('Error in getAllEmployees:', error.message);
    throw error;
  }
};

const getEmployeeByID = async (id) => {
  const [records] = await db.query("SELECT employeeID, employeeName, employeeAge, employeeGender, employeeDOJ, employeeRemarks, employeeAccruedLeaves, email, roleName FROM employee WHERE employeeID = ?", [id]);
  return records;
};

const deleteEmployee = async (id) => {
  const [{ affectedRows }] = await db.query("DELETE FROM employee WHERE employeeID = ?", [id]);
  return affectedRows;
};

const updateEmployee = async (update, id) => {
  const {
    employeeID,
    employeeName,
    employeeAge,
    employeeGender,
    employeeDOJ,
    employeeRemarks,
    employeeAccruedLeaves,
    roleName,
  } = update;

  const [result] = await db.query(
    "UPDATE employee SET employeeID = ?, employeeName = ?, employeeAge = ?, employeeGender = ?, employeeDOJ = ?, employeeRemarks = ?, employeeAccruedLeaves = ?, roleName = ? WHERE employeeID = ?",
    [
      employeeID,
      employeeName,
      employeeAge,
      employeeGender,
      employeeDOJ,
      employeeRemarks,
      employeeAccruedLeaves,
      roleName,
      id,
    ]
  );
  return result.affectedRows;
};

const getRoleByroleName = async (roleName) => {
  const [records] = await db.query("SELECT * FROM roles WHERE roleName = ?", [roleName]);
  return records[0];
};

module.exports = {
  getUserByEmail,
  getUserByEmployeeID,
  getAllEmployees,
  getEmployeeByID,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getRoleByroleName,
};