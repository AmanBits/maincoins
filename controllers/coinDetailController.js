// controllers/CoinDetails.js
const CoinDetailsModel = require("../models/coinDetailModel");
const fetch = require('node-fetch');


const fs = require("fs");
const DashboardModel = require("../models/dashboardModel");

const { format } = require("util");
// Function to convert USD to rupees and format with commas
function usdToRupees(usdAmount) {
  const rupeeAmount = usdAmount * 75; // Assuming 1 USD = 75 INR
  return formatCurrency(rupeeAmount, "INR");
}

// Function to format currency with commas and add currency symbol
function formatCurrency(amount, currency) {
  const formattedAmount = amount.toLocaleString("en-IN");
  return `₹${formattedAmount}`;
}

function formatUSD(value) {
  const trillion = 1000000000000;
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;

  if (value >= trillion) {
    return (value / trillion).toFixed(2) + "T";
  } else if (value >= billion) {
    return (value / billion).toFixed(2) + "B";
  } else if (value >= million) {
    return (value / million).toFixed(2) + "M";
  } else if (value >= thousand) {
    return (value / thousand).toFixed(2) + "K";
  } else {
    return value.toFixed(2);
  }
}

function wrapHTML(user, result, deposit, invest) {
  return new Promise((resolve, reject) => {
    // Read the HTML template file asynchronously
    fs.readFile("./templates/coin.html", "utf-8", (err, html) => {
      if (err) {
        // If there's an error reading the file, reject the promise
        reject(err);
        return;
      }

      
      

      let modifiedHtml = html.replace("{{%CONTENT%}}", result.data.coin.name);
      modifiedHtml = modifiedHtml.replace(
        "{{%DESCRIPTION%}}",
        result.data.coin.description
      );
      modifiedHtml = modifiedHtml.replace(
        "{{%AMOUNT%}}",
        formatCurrency(user[0].total_amount - (invest.total_deposit!=0?invest.total_deposit:0))
      );

      modifiedHtml = modifiedHtml.replace(
        "{{%INVEST_AMOUNT%}}",
        formatCurrency(
          (deposit.total_deposit != 0 ? deposit.total_deposit.total_deposit : 0)
        )
      );

      modifiedHtml = modifiedHtml.replace(
        "{{%INVEST%}}",
        deposit.total_deposit != 0 ? deposit.total_deposit.total_deposit : 0
      );
      // Initialize historyList as an empty string
      let historyList = "";

      // Iterate over each item in deposit.total_deposit.result
      if (deposit.total_deposit != 0) {
        deposit.total_deposit.result.forEach((item) => {
          // Construct HTML for each item and append it to historyList
          historyList += `
    <li class="user-item" style="list-style-type: none;">
      <div class="row p-2">
        <div class="col-2 "><img class="rounded-10" style="width:30px;height:30px" src="${
          result.data.coin.iconUrl
        }"alt="profile"></div>
        <div class="col-7"><p class="fw-bold p-0 m-0">${
          result.data.coin.name
        } </p><span class=" fw-bold text-sm ${
            result.data.coin.change < 0 ? "text-danger" : "text-success"
          }">(
        ${result.data.coin.change}%
      )${
        result.data.coin.change < 0
          ? '<i class="bi fw-bold text-sm bi-arrow-down"></i>'
          : '<i class="bi fw-bold text-sm bi-arrow-up"></i>'
      }
      </span><p class="p-0 m-0">INR : ${item.deposit_amount}  <span class="${
            item.deposit_amount * (result.data.coin.change / 100) < 0
              ? "text-danger"
              : item.deposit_amount * (result.data.coin.change / 100) === 0
              ? "text-success"
              : "text-success"
          }">
${
  item.deposit_amount * (result.data.coin.change / 100) > 0
    ? "+"
    : item.deposit_amount * (result.data.coin.change / 100) < 0
    ? "-"
    : "+"
}
${Math.abs(item.deposit_amount * (result.data.coin.change / 100)).toFixed(2)}
</span>
</p>

     
     </div>
        <div class="col-3">
        <div class="date text-sm">${item.created_at.toLocaleDateString()}</div>
        <div class="time text-sm">${item.created_at.toLocaleTimeString()}</div>
      </div>
      
        </div>
    </li>`;
        });
      } else {
        historyList += "No record found";
      }

      // Replace {{%HISTORY%}} in modifiedHtml with historyList
      modifiedHtml = modifiedHtml.replace("{{%HISTORY%}}", historyList);

    
      modifiedHtml = modifiedHtml.replace(
        "{{%CURRENT_PRICE%}}",
        parseFloat(result.data.coin.price).toFixed(4)
      );

      modifiedHtml = modifiedHtml.replace(
        "{{%CHANGE_CURRENT_PRICE%}}",
        result.data.coin.change
      );

      modifiedHtml = modifiedHtml.replace(
        "{{%MARKET_CAP%}}",
        formatUSD(Number(result.data.coin.marketCap))
      );
      modifiedHtml = modifiedHtml.replace(
        "{{%VOLUME%}}",
        formatUSD(Number(result.data.coin["24hVolume"]))
      );
      modifiedHtml = modifiedHtml.replace(
        "{{%CIRCULATING%}}",
        formatUSD(Number(result.data.coin.supply.circulating))
      );

      modifiedHtml = modifiedHtml.replace("{{%RANK%}}", result.data.coin.rank);

      modifiedHtml = modifiedHtml.replace(
        "{{%ALL_TIME_HIGH%}}",
        formatUSD(Number(result.data.coin.allTimeHigh.price))
      );
      modifiedHtml = modifiedHtml.replace(
        "{{%CHANGE%}}",
        result.data.coin.change
      );

      // Resolve the promise with the modified HTML string
      resolve(modifiedHtml);
    });
  });
}

class CoinDetails {
  static async getCoinDetails(req, res) {
    const id = req.params.id;

    try {
      const options = {
        headers: {
          "Content-Type": "application/json",
          "x-access-token":
            "coinranking159b8a3f419c9af1da37f3902d94bb17b1b7d82fc7054735",
        },
      };
      fetch("https://api.coinranking.com/v2/coin/" + id, options)
        .then((response) => response.json())
        .then(async (result) => {
          const users = await DashboardModel.getDashboard(req.user.id);
          const invest = await DashboardModel.getInvest(req.user.id);
          const deposit = await DashboardModel.getCoinInvest(req.user.id, id);
          const data = await wrapHTML(users, result, deposit, invest);

          res.end(data);
        });
    } catch (error) {
      console.error("Error fetching data from third-party API:", error);
      throw error;
    }
  }

  // Implement other CRUD operations
}

module.exports = CoinDetails;
