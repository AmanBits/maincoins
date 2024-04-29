// controllers/userController.js
const DashboardModel = require("../models/dashboardModel");

const fs = require("fs");
const { format } = require("util");
// Function to convert USD to rupees and format with commas
function usdToRupees(usdAmount) {
  const rupeeAmount = usdAmount * 83.68; // Assuming 1 USD = 75 INR
  return formatCurrency(rupeeAmount, "INR");
}

// Function to format currency with commas and add currency symbol
function formatCurrency(amount, currency) {
  const formattedAmount = amount.toLocaleString("en-IN");
  return `₹${formattedAmount}`;
}

function wrapHTML(user, deposit) {
  return new Promise((resolve, reject) => {
    // Read the HTML template file asynchronously
    fs.readFile("./templates/dashboard.html", "utf-8", (err, html) => {
      if (err) {
        // If there's an error reading the file, reject the promise
        reject(err);
        return;
      }

      // Replace the placeholder with the provided ID

      let modifiedHtml = html.replace("{{%CONTENT%}}", user[0].username);

      modifiedHtml = modifiedHtml.replace(
        "{{%AMOUNT%}}",
        formatCurrency(user[0].total_amount - deposit.total_deposit)
      );

      modifiedHtml = modifiedHtml.replace(
        "{{%TOTAL_INVEST_AMOUNT%}}",
        formatCurrency(deposit.total_deposit, "INR")
      );
      // Resolve the promise with the modified HTML string
      resolve(modifiedHtml);
    });
  });
}

class DashboardController {
  static async getDashboard(req, res) {
    try {
      const users = await DashboardModel.getDashboard(req.user.id);
      const deposit = await DashboardModel.getInvest(req.user.id);
      const data = await wrapHTML(users, deposit);
      res.end(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Implement other CRUD operations
}

module.exports = DashboardController;
