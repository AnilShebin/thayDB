const express = require('express');
const router = express.Router();
const service = require('../services/roleService');
const { handleErrors } = require('../middleware/errorMiddleware'); 

router.get('/', async (req, res, next) => {
  try {
    const roles = await service.getAllRoles();
    res.send(roles);
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const role = await service.getRoleByID(req.params.id); // Corrected function name
    if (role.length === 0)
      res.status(404).json({ error: 'No record with given id' });
    else
      res.send(role);
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling)
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.deleteRole(req.params.id);
    if (affectedRows === 0)
      res.status(404).json({ error: 'No record with given id' });
    else
      res.send('Delete successfully.');
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling)
  }
});

router.post('/', async (req, res, next) => {
  try {
    await service.createRole(req.body);
    res.status(201).send('Create successfully.');
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling)
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const affectedRows = await service.updateRole(req.body, req.params.id);
    if (affectedRows === 0)
      res.status(404).json({ error: 'No record with given id' });
    else
      res.send('Updated successfully.');
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling)
  }
});

// Use the error handling middleware
router.use(handleErrors);

module.exports = router;