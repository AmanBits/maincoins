// models/CoinDetailDashboard.js
const db = require('../db');

class CoinDetailDashboard {
  static getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Implement other CRUD operations
}

module.exports = CoinDetailDashboard;
