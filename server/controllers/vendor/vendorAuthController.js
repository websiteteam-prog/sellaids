import bcrypt from "bcryptjs";
import connectToDb from "../../config/db.js"

export const registerVendorController = async (req, res) => {
    try {
        // fetch data from the frontend
        const {
            name, email, phone, password,
            designation, businessName, businessType, gstNumber, panNumber,
            houseNo, streetName, city, state, pincode, country,
            accountNumber, ifscCode, bankName, accountType
        } = req.body;

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

        // vendor registration proccess 
        // Insert vendor core info
        const [vendorResult] = await connectToDb.promise().query(
            `INSERT INTO vendors 
            (name,email,phone,password,designation,businessName,businessType,gstNumber,panNumber)
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [name, email, phone, hashedPassword, designation, businessName, businessType, gstNumber, panNumber]
        );
        // console.log(vendorResult)
        const vendorId = vendorResult.insertId;

        // Insert address details
        await connectToDb.promise().query(
            `INSERT INTO vendor_addresses (vendorId,houseNo,streetName,city,state,pincode,country) VALUES (?,?,?,?,?,?,?)`,
            [vendorId, houseNo, streetName, city, state, pincode, country || 'India']
        );

        // Bank details
        const bankDoc = req.files?.bankDocument ? req.files.bankDocument[0].path : null;
        await connectToDb.promise().query(
            `INSERT INTO vendor_bank_details (vendorId,accountNumber,ifscCode,bankName,accountType,bankDocumentUrl) VALUES (?,?,?,?,?,?)`,
            [vendorId, accountNumber, ifscCode, bankName, accountType || 'Savings', bankDoc]
        );

        // KYC Documents
        const documentFields = ['gstCertificateDocument', 'panCardDocument', 'businessLicenseDocument', 'aadhaarFront', 'aadhaarBack'];
        const docPromises = documentFields.map(field => {
            if (req.files?.[field]) {
                const file = req.files[field][0];
                return connectToDb.promise().query(
                    `INSERT INTO vendor_documents (vendorId, documentType, documentUrl) VALUES (?,?,?)`,
                    [vendorId, field, file.path]
                );
            }
        }).filter(Boolean);

        await Promise.all(docPromises);

        // ================= Fetch Complete Vendor Data =================
        const [[vendor]] = await connectToDb.promise().query(`SELECT id,name,email,phone,designation,businessName,businessType,gstNumber,panNumber,status,createdAt FROM vendors WHERE id=?`, [vendorId]);

        const [addresses] = await connectToDb.promise().query(`SELECT * FROM vendor_addresses WHERE vendorId=?`, [vendorId]);
        const [bankDetails] = await connectToDb.promise().query(`SELECT * FROM vendor_bank_details WHERE vendorId=?`, [vendorId]);
        const [documents] = await connectToDb.promise().query(`SELECT documentType,documentUrl FROM vendor_documents WHERE vendorId=?`, [vendorId]);

        const result = {
            ...vendor,
            addresses,
            bankDetails,
            documents
        };
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