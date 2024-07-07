// routes/index.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const AuthController = require("../controllers/authController");
const Dashboard = require("../controllers/dashboardController");
const Wallet = require("../controllers/walletController");
const authMiddleware = require("../middleware/auth");
const CoinDetails = require("../controllers/coinDetailController");
const db = require("../db");
const fetch = require('node-fetch');


let topCoins = require("../services/topCoins");


const ThirdPartyApiService = require("../services/thirdPartyApiService");
const DashboardModel = require("../models/dashboardModel");

// Add Signin route
router.post("/signin", AuthController.signIn);
// Add signup route
router.post("/signup", AuthController.signUp);
// Add logout route
router.get("/logout", AuthController.logout);

// Protected routes
router.use(authMiddleware); // Middleware to authenticate all routes below

// User routes
router.get("/users", UserController.getAllUsers);

// Add other user routes here
router.get("/dashboard", Dashboard.getDashboard);
router.post("/addwallet", Wallet.createWallet);
router.get("/getCoins", ThirdPartyApiService.fetchDataFromApi);
router.get("/coinDetails/:id", CoinDetails.getCoinDetails);
router.post("/coinGraph", async (req, res) => {
  try {
    const { coinvalue, timeFrame } = req.body; // Assuming coinvalue and timeFrame are sent in the request body
    const options = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token":
          "coinranking159b8a3f419c9af1da37f3902d94bb17b1b7d82fc7054735",
      },
    };

    const response = await fetch(
      `https://api.coinranking.com/v2/coin/${req.body.coin}/history?timePeriod=${req.body.time}`,
      options
    );
    const result = await response.json();

    res.send(result);
  } catch (error) {
    console.error("Error fetching data from third-party API:", error);
    res.status(500).send("Error fetching data from third-party API");
  }
});

router.get("/topCoins", async (req, res) => {
  try {
    let top = await topCoins();
    res.json(top);
  } catch (error) {
    console.error("Error fetching top coins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function deposite(id, amount, coinId) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO deposit (id,deposit_amount, coin_id) VALUES (?, ?, ?)";
    db.query(sql, [id, amount, coinId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

router.post("/currentPrice", (req, res) => {
  const id = req.body.coin;
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
        res.json(result);
      });
  } catch (error) {
    console.error("Error fetching data from third-party API:", error);
    throw error;
  }
});

router.post("/addDeposit", async (req, res) => {
  const wallet = await DashboardModel.getDashboard(req.user.id);
  const invest = await DashboardModel.getInvest(req.user.id);

  if (
    wallet[0].total_amount - invest.total_deposit > 0 &&
    wallet[0].total_amount - invest.total_deposit >= parseFloat(req.body.amount)
  ) {
    var result = await deposite(req.user.id, req.body.amount, req.body.coinId);

    res.json({ message: "Thanks for buying." });
  } else {
    res.json({ message: "Your wallet balance is enough to buy" });
  }
});

module.exports = router;
