// server.js
const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const db = require("./db");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cookie-parser middleware
app.use(cookieParser());

app.use("/css", express.static("templates/css"));
app.use("/js", express.static("templates/js"));
app.use("/vendors", express.static("templates/vendors"));
app.use("/images", express.static("templates/images"));



// Routes
app.use("/", routes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
