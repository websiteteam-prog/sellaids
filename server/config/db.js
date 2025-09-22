import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const connectToDb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// test connection
connectToDb.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message)
    } else {
        console.log("Database connected successfully!")
        connection.release() // release connection back to pool
    }
})

export default connectToDb