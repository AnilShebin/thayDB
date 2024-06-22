// authController.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, updatePasswordById } = require('../services/authService');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { employeeName, email, password } = req.body;

    // Set the default role name to "guest"
    const roleName = 'guest';

    // Create a new user without generating a token during signup
    const userId = await createUser({
      employeeName,
      email,
      password,
    });

    res.status(201).json({ message: 'Signup successful', userId });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from the database using email
    const user = await getUserByEmail(email);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Retrieve the role name directly from the user object
    const roleName = user.roleName;

    // Create a JWT token after a successful login
    const token = jwt.sign(
      { userId: user.id, employeeID: user.employeeID, roleName: roleName },
      'sidvoefoqeofvnkpancpanpfvnqafnvqan',
      { expiresIn: '3h' } // Set expiration to 3 hours
    );

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true });

    // Include the token in the response
    res.status(200).json({ message: 'Login successful', userId: user.id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// Update Password by ID Route
router.put('/update-password/:id', async (req, res) => {
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