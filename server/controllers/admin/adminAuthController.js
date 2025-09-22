import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"

export const loginAdminController = async (req, res) => {
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

        // check admin exist or not
        const [results] = await connectToDb.promise().query("SELECT * FROM admins WHERE email = ?", [email])
        if (results.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Admin not exist"
            })
        }

        const admin = results[0];

        // compare the password
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        req.session.adminId = admin.id;
        req.session.adminName = admin.name;
        // console.log(req.session)

        return res.status(200).json({
            success: true,
            message: `${admin.name} register successfully`,
            data: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message
        })
    }
}

export const logoutAdminController = async (req, res) => {
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
            message: "Admin logout successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin logout failed",
            error: error
        })
    }
}