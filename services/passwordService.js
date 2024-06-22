const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { updatePasswordById } = require('../services/authService');

// Update Password by ID Route
router.put('/:id', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const employeeID = req.params.id;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Update the password using the service function
    const affectedRows = await updatePasswordById(newPassword, employeeID);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No record with the given id' });
    } else {
      return res.send('Password updated successfully.');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;