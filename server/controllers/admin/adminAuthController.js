import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js";

export const registerAdminController = async (req, res, next) => {
    try {
        // fetch data from the frontend
        const { id, name, email, password, phone } = req.body;

        // if check all fields are required or not
        if (!id || !name || !email || !password || !phone) {
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

        // check admin exist or not
        const [rows] = await connectToDb.promise().query("SELECT * FROM admin WHERE email = ?", [email])
        if (rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // admin register
        const [result] = await connectToDb.promise().query("INSERT INTO admin (id, name, email, password, phone) values(?, ?, ?, ?, ?)", [id, name, email, hashedPassword, phone])
        return successResponse(res, 201, `${name} register successfully`, result)
    } catch (error) {
        next(error)
    }
}

export const loginAdminController = async (req, res, next) => {
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

        // check admin exist or not
        const [rows] = await connectToDb.promise().query("SELECT * FROM admin WHERE email = ?", [email])
        if (rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Admin not exist"
            })
        }

        const admin = rows[0];

        // compare the password
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        req.session.adminId = admin.id;
        req.session.cookie.maxAge = 30 * 60 * 1000;

        return successResponse(res, 200, `${admin.name} login successfully`, { id: admin.id, name: admin.name, email: admin.email })
    } catch (error) {
        next(error)
    }
}

export const logoutAdminController = async (req, res, next) => {
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
        return successResponse(res, 200, `Admin logout successfully`)
    } catch (error) {
        next(error)
    }
}