const db = require("../config/db");
const moment = require("moment");

// Get all holidays
module.exports.getAllHolidays = async () => {
  try {
    const [records] = await db.query("SELECT holidayID, holidayName, holidayDay, DATE_FORMAT(holidayDate, '%Y-%m-%d') AS holidayDate, mandatoryOptionalHoliday FROM holiday ORDER BY holidayDate");
    return records;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// Get holiday by ID
module.exports.getHolidayByID = async (id) => {
  try {
    const [records] = await db.query(
      "SELECT holidayID, holidayName, holidayDay, DATE_FORMAT(holidayDate, '%Y-%m-%d') AS holidayDate, mandatoryOptionalHoliday FROM holiday WHERE holidayID = ?",
      [id]
    );
    return records[0];
  } catch (error) {
    console.error(`Error fetching holiday with ID ${id}:`, error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// Update holiday by ID
module.exports.updateHoliday = async (update, id) => {
  const { 
    holidayName = update.holidayName, 
    holidayDay = update.holidayDay,
    holidayDate = update.holidayDate,
    mandatoryOptionalHoliday = update.mandatoryOptionalHoliday
  } = update;

  // Format holidayDate to ensure only the date part is stored
  const formattedDate = moment(holidayDate).format("YYYY-MM-DD");
  
  try {
    const [result] = await db.query(
      'UPDATE holiday SET holidayName = ?, holidayDay = ?, holidayDate = ?, mandatoryOptionalHoliday = ? WHERE holidayID = ?',
      [holidayName, holidayDay, formattedDate, mandatoryOptionalHoliday, id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error(`Error updating holiday with ID ${id}:`, error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// Delete holiday by ID
module.exports.deleteHoliday = async (id) => {
  try {
    const [{ affectedRows }] = await db.query(
      "DELETE FROM holiday WHERE holidayID = ?",
      [id]
    );
    return affectedRows;
  } catch (error) {
    console.error(`Error deleting holiday with ID ${id}:`, error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// Create a new holiday
module.exports.createHoliday = async (holidayData) => {
  const { 
    holidayName, 
    holidayDay,
    holidayDate,
    mandatoryOptionalHoliday
  } = holidayData;

  // Format holidayDate to ensure only the date part is stored
  const formattedDate = moment(holidayDate).format("YYYY-MM-DD");

  try {
    const [result] = await db.query(
      "INSERT INTO holiday (holidayName, holidayDay, holidayDate, mandatoryOptionalHoliday) VALUES (?, ?, ?, ?)",
      [holidayName, holidayDay, formattedDate, mandatoryOptionalHoliday]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating holiday:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};