const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authMiddleware = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ msg: 'Unauthorized' });
            }
            next();
        } catch (err) {
            console.error(err.message);
            res.status(401).json({ msg: 'Unauthorized' });
        }
    } 
    
    if (!token) {
        res.status(401).json({ msg: 'Unauthorized, no token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authMiddleware, authorizeRoles };
