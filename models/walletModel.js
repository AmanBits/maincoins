// models/userModel.js
const db = require('../db');

class WalletModel {
  static wallet(data,id) {
    
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO wallet (binance_id,amount, id) VALUES (?, ?, ?)";
        db.query(sql, [data.binanceId,data.amount, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
  }




  // Implement other CRUD operations
}

module.exports = WalletModel;
