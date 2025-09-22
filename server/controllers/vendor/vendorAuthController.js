import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"

export const registerVendorController = async (req, res) => {
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

        // check vendor exist or not
        const [results] = await connectToDb.promise().query("SELECT * FROM vendors WHERE email = ?", [email])
        if (results.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Vendor already exists"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // vendor register
        const [result] = await connectToDb.promise().query("INSERT INTO vendors (name, email, password, phone) values(?, ?, ?, ?)", [name, email, hashedPassword, phone])
        return res.status(201).json({
            success: true,
            message: `${name} register successfully`,
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Vendor register failed",
            error: error.message
        })
    }
}

export const loginVendorController = async (req, res) => {
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

        // check vendor exist or not
        const [results] = await connectToDb.promise().query("SELECT * FROM vendors WHERE email = ?", [email])
        if (results.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Vendor not exist"
            })
        }

        const vendor = results[0];

        // compare the password
        const isMatch = await bcrypt.compare(password, vendor.password)
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        req.session.vendorId = vendor.id;
        req.session.vendorName = vendor.name;
        // console.log(req.session)

        return res.status(200).json({
            success: true,
            message: `${vendor.name} register successfully`,
            data: {
                id: vendor.id,
                name: vendor.name,
                email: vendor.email,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Vendor login failed",
            error: error.message
        })
    }
}

export const logoutVendorController = async (req, res) => {
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
            message: "Vendor logout successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Vendor logout failed",
            error: error
        })
    }
}