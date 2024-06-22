const db = require("../config/db");

const getAllEmployeeDetails = async () => {
  const [records] = await db.query("SELECT * FROM timerdetails");
  return records;
};

const getEmployeeDetailsByID = async (id) => {
  const [records] = await db.query("SELECT * FROM timerdetails WHERE employeeID = ?", [id]);
  return records;
};

const getEmployeeDetailsByIDanddate = async (id ,date) => {
  const [records] = await db.query("SELECT * FROM timerdetails WHERE employeeID = ? AND DATE (date) = ?", [id, date]);
  return records;
};

const getEmployeeDetailsByIDanddates = async (id ,startdate ,enddate) => {
  const [records] = await db.query("SELECT * FROM timerdetails WHERE (date BETWEEN ? and ? ) AND (employeeID = ?) ORDER BY date DESC;", [startdate,enddate,id]);
  return records;
};

const getEmployeeDetailsByDate = async (startdate) => {
  const [records] = await db.query("SELECT * FROM timerdetails where date = ? ", [startdate]);
  return records;
};

const createCheckIn = async (checkInData, employeeID) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const checkInDateTime = new Date();

  try {
    const [existingCheckIn] = await db.query(
      "SELECT checkInDateTime FROM timerdetails WHERE employeeID = ? AND date = ?",
      [employeeID, currentDate]
    );

    if (existingCheckIn.length > 0) {
      const checkInError = new Error('Employee already checked in today. Cannot check in again.');
      checkInError.name = 'CheckInError';
      throw checkInError;
    }

    const [result] = await db.query(
      "INSERT INTO timerdetails (employeeID, checkInDateTime, date) VALUES (?, ?, ?)",
      [employeeID, checkInDateTime, currentDate]
    );

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const createCheckOut = async (checkOutData, employeeID) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const checkOutDateTime = new Date();

  try {
    const [checkInRecord] = await db.query(
      "SELECT checkInDateTime FROM timerdetails WHERE employeeID = ? AND date = ? AND checkOutDateTime IS NULL",
      [employeeID, currentDate]
    );

    if (!checkInRecord || !checkInRecord.length) {
      return 'NotFound';
    }

    const checkInDateTime = checkInRecord[0].checkInDateTime;
    const timeDifference = checkOutDateTime - new Date(checkInDateTime);
    const workingHours = timeDifference / (1000 * 60 * 60);

    const [result] = await db.query(
      "UPDATE timerdetails SET checkOutDateTime = ?, totalWorkingHours = TIME_FORMAT(?, '%H:%i:%s'), date = ? WHERE employeeID = ? AND checkOutDateTime IS NULL",
      [checkOutDateTime, new Date(workingHours * 60 * 60 * 1000).toISOString().substr(11, 8), currentDate, employeeID]
    );

    return 'Success';
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEmployeeDetails,
  getEmployeeDetailsByID,
  getEmployeeDetailsByIDanddate,
  getEmployeeDetailsByIDanddates,
  getEmployeeDetailsByDate,
  createCheckIn,
  createCheckOut,
};