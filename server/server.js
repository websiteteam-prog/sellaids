const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // apna MySQL user dalna
  password: "",      // agar password set hai toh dalna
  database: "sellaids"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ MySQL connected!");
  }
});

// ✅ Register API
app.post("/api/auth/register", (req, res) => {
  const { mobile, email, password } = req.body;

  if (!mobile || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (mobile, email, password) VALUES (?, ?, ?)";
  db.query(sql, [mobile, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("❌ Error inserting user:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "User registered successfully!" });
  });
});


// ✅ Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Error finding user:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, "secret123", {
      expiresIn: "1h",
    });

    // ✅ Send user data also
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        mobile: user.mobile,   // yeh header me naam dikhane ke liye
        email: user.email,
      },
    });
  });
});

// ✅ Server start
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});