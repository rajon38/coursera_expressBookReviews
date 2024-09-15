const jwt = require('jsonwebtoken');

const JWToken =  'secretkey';  // Make sure to load this from your .env file

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract the token from the "Authorization" header

    if (!token) {
        return res.status(403).json({ status: "unauthorized", message: "Token missing!" });
    }

    jwt.verify(token, JWToken, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(401).json({ status: "unauthorized", message: "Invalid Token" });
        } else {
            req.user = decoded; // Save the decoded token data (username, etc.) in the request object
            next(); // Pass to the next middleware or route
        }
    });
};

module.exports = authMiddleware;
