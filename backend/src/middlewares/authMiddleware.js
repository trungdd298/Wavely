import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = async (req, res, next) => {
    // next is a callback function to pass control to the next middleware
    try {
        // get token from headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'No access token provided' });
        }
        // Authorization whether token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                console.error('Error when verifying JWT in auth middleware: ', err);
                return res.status(403).json({ message: 'Invalid access token' });
            }

            // find user based on token's payload
            const user = await User.findById(payload.userId).select('-hashedPassword'); // exclude password field

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // return user info in req object
            req.user = user;
            // pass control to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.error('Error when authorizing JWT in auth middleware: ', error);
        return res.status(500).json({ message: 'System error' });
    }
}
