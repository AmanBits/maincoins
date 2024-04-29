// middleware/auth.js
const jwt = require("jsonwebtoken");
const path = require("path");



const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies


  if (!token) {
    const htmlFilePath = path.join(__dirname, "..", "templates", "index.html");
    return res.sendFile(htmlFilePath);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    const htmlFilePath = path.join(__dirname, "..", "templates", "index.html");
    return res.sendFile(htmlFilePath);
  }
};

module.exports = authMiddleware;
