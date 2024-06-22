// employeeController.js

const express = require('express');
const router = express.Router();
const service = require('../services/employeeService');
const { handleErrors } = require('../middleware/errorMiddleware');
const bcrypt = require('bcrypt');

router.get('/', async (req, res, next) => {
  try {
    const employees = await service.getAllEmployees();
    console.log(employees); // Log the employees to see if they are retrieved
    res.send(employees);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const employee = await service.getEmployeeByID(req.params.id);
    if (employee.length === 0)
      res.status(404).json({ error: 'No record with the given id' });
    else
      res.send(employee);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.deleteEmployee(req.params.id);
    if (affectedRows === 0)
      res.status(404).json({ error: 'No record with the given id' });
    else
      res.send('Delete successfully.');
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await service.createEmployee(req.body);
    res.status(201).send('Create successfully.');
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.updateEmployee(req.body, req.params.id);
    if (affectedRows === 0)
      res.status(404).json({ error: 'No record with the given id' });
    else
      res.send('Updated successfully.');
  } catch (error) {
    next(error);
  }
});

// Use the error handling middleware
router.use(handleErrors);

module.exports = router;