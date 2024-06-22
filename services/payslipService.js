// Import the database module
const db = require("../config/db");

// Function to generate a payslip for an employee
module.exports.generatePaySlip = async (employeeId) => {
  try {
    const [results] = await db.query("SELECT employeeID, employeeName, employeeAge, employeeDOJ, employeeRemarks,employeeAccruedLeaves FROM employee WHERE employeeID = ?", [employeeId]);

    if (results.length > 0) {
      const employee = results[0];
      
      // Define dailySalary with a constant value
      const dailySalary = 600 * 26;

      const basicSalary = dailySalary;
      const totalWorkingDays = 26;
      const daysPresent = calculateDaysPresent(totalWorkingDays, employee.employeeAccruedLeaves);
      const monthlySalary = calculateNetSalary(basicSalary);
      const bonusSalary = calculateBonusSalary(basicSalary);
      const leaveDeduction = calculateLeaveDeduction(employee.employeeAccruedLeaves);
      const pfAmount = calculatePFAmount(basicSalary);
      const hraAmount = calculateHRA(basicSalary);

      const paySlip = {
        employeeID: employee.employeeID,
        employeeName: employee.employeeName,
        dateOfJoining: formatDate(employee.employeeDOJ),
        basicSalary: basicSalary,
        //monthlySalary: monthlySalary,
        month: new Date().toLocaleString('en-us', { month: 'long' }),
        bonusSalary: bonusSalary,
        //leaveDeduction: leaveDeduction,
        pfAmount: pfAmount,
        hraAmount: hraAmount,
        daysPresent: daysPresent,
        netSalary: monthlySalary + bonusSalary - leaveDeduction - pfAmount + hraAmount,
      };

      return paySlip;
    } else {
      throw new Error("Employee not found");
    }
  } catch (error) {
    throw error;
  }
};

// Placeholder function to calculate net salary
function calculateNetSalary(salary) {
  return salary; 
}

// Function to calculate bonus salary
function calculateBonusSalary(salary) {
  // Assume a bonus of 12% of the salary
  return salary * 0.12;
}

// Function to calculate leave deduction
function calculateLeaveDeduction(employeeAccruedLeaves) {
  // Assuming 26 working days in a month
  const totalWorkingDays = 26;
  
  // Assume a daily salary of 600
  const dailySalary = 600;

  // Calculate total deduction for all leave days in the month
  const totalDeduction = employeeAccruedLeaves * dailySalary;

  return totalDeduction;
}

// Function to calculate PF amount
function calculatePFAmount(salary) {
  // Assume PF is 5% of the salary
  return salary * 0.05;
}

// Function to calculate HRA amount
function calculateHRA(salary) {
  // Assume HRA is 40% of the salary
  return salary * 0.40;
}

// Function to calculate the number of days present
function calculateDaysPresent(totalWorkingDays, employeeAccruedLeaves) {
  return totalWorkingDays - employeeAccruedLeaves;
}

// Function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString(); 
}