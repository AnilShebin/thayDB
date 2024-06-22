const handleErrors = (err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'Forbidden - Invalid token or expired' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Bad Request - Validation failed', details: err.message });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Not Found', details: err.message });
  }

  if (err.name === 'DatabaseError') {
    return res.status(500).json({ error: 'Internal Server Error - Database operation failed', details: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { handleErrors };
