const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extract the token from the request headers or cookies
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : req.cookies?.token;

    if (!token) {
        console.error('Unauthorized - Missing token');
        return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Verify the token
    jwt.verify(token, 'sidvoefoqeofvnkpancpanpfvnqafnvqan', (err, user) => {
        if (err) {
            console.error('Forbidden - Invalid token', err.message);

            // Provide more detailed information about the error
            if (err.name === 'TokenExpiredError') {
                console.error('Token Expired At:', new Date(err.expiredAt));
            }

            return res.status(403).json({ error: 'Forbidden - Invalid token' });
        }
        // Attach the user information to the request for further use
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };