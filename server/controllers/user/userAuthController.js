import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"
import { OAuth2Client } from "google-auth-library";
import { successResponse } from "../../utils/apiResponse.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)

export const registerUserController = async (req, res, next) => {
    try {
        // fetch data from the frontend
        const { name, email, password, phone } = req.body;

        // if check all fields are required or not
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Password validation(min 8 chars)
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }

        // Phone number validation (must be 10 digits)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number. Must be 10 digits and start with 6-9.",
            });
        }

        // check user exist or not
        const [rows] = await connectToDb.promise().query("SELECT email FROM users WHERE email = ?", [email])
        if (rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // user register
        const [result] = await connectToDb.promise().query("INSERT INTO users (name, email, password, phone) values(?, ?, ?, ?)", [name, email, hashedPassword, phone])
        return successResponse(res, 201, `${name} register successfully`, result)
    } catch (error) {
        next(error)
    }
}

export const loginUserController = async (req, res, next) => {
    try {
        // fetch data from the frontend
        const { email, password } = req.body;

        // if check all fields are required or not
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Password validation(min 8 chars)
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }

        // check user exist or not
        const [rows] = await connectToDb.promise().query("SELECT id, name, email, password FROM users WHERE email = ?", [email])
        if (rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "User not exist"
            })
        }

        const user = rows[0];

        // compare the password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        req.session.userId = user.id;
        req.session.cookie.maxAge = 30 * 60 * 1000;

        return successResponse(res, 200, `${user.name} login successfully`, { id: user.id, name: user.name, email: user.email })
    } catch (error) {
        next(error)
    }
}

export const logoutUserController = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "session destroy failed",
                    error: err,
                });
            }
        })

        // clear cookie from client side
        res.clearCookie("connect.sid"); // default cookie name (change if custom)
        return successResponse(res, 200, `User logout successfully`)
    } catch (error) {
        next(error)
    }
}

export const googleLoginUserController = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: "No ID token provided" });
        }
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // 1. Check if user already exists
        const [rows] = await connectToDb.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        let user;

        if (rows.length === 0) {
            // 2. If not, create user
            const [result] = await connectToDb.promise().query(
                "INSERT INTO users (name, email, picture, google_id) VALUES (?, ?, ?, ?)",
                [name, email, googleId]
            );

            user = {
                id: result.insertId,
                name,
                email,
                google_id: googleId
            };
        } else {
            user = rows[0];
        }

        // 3. Set session
        req.session.userId = user.id;
        req.session.userName = user.name;

        return successResponse(res, 200, `${user.name} logged in with Google successfully`, { id: user.id, name: user.name, email: user.email })

    } catch (error) {
        next(error)
    }
}