import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"
import { OAuth2Client  } from "google-auth-library";

const CLIENT_ID  = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)

export const registerUserController = async (req, res) => {
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

        // check user exist or not
        const [results] = await connectToDb.promise().query("SELECT * FROM users WHERE email = ?", [email])
        if (results.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        console.log([results])

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // user register
        const [result] = await connectToDb.promise().query("INSERT INTO users (name, email, password, phone) values(?, ?, ?, ?)", [name, email, hashedPassword, phone])
        return res.status(201).json({
            success: true,
            message: `${name} register successfully`,
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User register failed",
            error: error.message
        })
    }
}

export const loginUserController = async (req, res) => {
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

        // check user exist or not
        const [results] = await connectToDb.promise().query("SELECT * FROM users WHERE email = ?", [email])
        if (results.length === 0) {
            return res.status(200).json({
                success: false,
                message: "User not exist"
            })
        }

        const user = results[0];

        // compare the password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        req.session.userId = user.id;
        console.log(req.session)

        return res.status(200).json({
            success: true,
            message: `${user.name} login successfully`,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User login failed",
            error: error.message
        })
    }
}

export const logoutUserController = async (req, res) => {
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
        return res.status(200).json({
            success: true,
            message: "User logout successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User logout failed",
            error: error
        })
    }
}

export const googleLoginUserController = async (req, res) => {
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

        return res.status(200).json({
            success: true,
            message: `${user.name} logged in with Google successfully`,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid ID token", error: error.message });
    }
}