// controllers/authController.js
const bcrypt = require("bcrypt"); // For password hashing
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const db = require("../db");

class AuthController {
  static async signIn(req, res) {
    try {
      const { username, password } = req.body;

      db.query(
        "SELECT * FROM users WHERE email = ? && password = ?",
        [username, password],
        (err, data) => {
          if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
            // Set the token in a cookie
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 3600000, // 1 hour
            });
            return res.json({ redirectTo: "/dashboard" });
          } else {
            res.status(401).json({ error: "Invalid credentials" });
          }
        }
      );
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async signUp(req, res) {
    try {
      // Extract username and password from request body
      const { username, password } = req.body;

      // Check if the username already exists
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create a new user record in the database
      const newUser = await UserModel.create({
        username,
        password: hashedPassword,
      });

      // Generate JWT token for the newly registered user
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Return success response with JWT token
      res.json({ token });
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static logout(req, res) {
    // Clear the JWT token stored on the client side
    res.clearCookie("token");
    res.redirect(302, "/login");
  }
}

module.exports = AuthController;
