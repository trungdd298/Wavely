import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_TTL = '30m';
const MILISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * MILISECONDS_PER_DAY;

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res
                .status(400)
                .json({
                    message:
                        "Must have username, password, email, firstName, lastName"
                });
        }

        // check whether username exists
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res
                .status(409)
                .json({
                    message:
                        "username's already existed"
                });
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

        // create a new user
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });

        // return
        return res.sendStatus(204);

    } catch (error) {
        console.error('Error when signing up: ', error);
        return res.status(500).json({ message: 'System error' });
    }
}

export const signIn = async (req, res) => {
    try {
        // get inputs
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username and password' });
        }

        // get hashedPassword in db
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({
                    message:
                        'username or password is incorrect'
                });
        }

        // check password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    message:
                        'username or password is incorrect'
                });
        }

        // if match, create access token JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // store refresh token in session db
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // return refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // backend and frontend on different domains
            maxAge: REFRESH_TOKEN_TTL
        });

        // return access token in response body
        return res.status(200).json({ message: `User ${user.displayName} logged in!`, accessToken });

    } catch (error) {
        console.error('Error when signing in: ', error);
        return res.status(500).json({ message: 'System error' });
    }
}
