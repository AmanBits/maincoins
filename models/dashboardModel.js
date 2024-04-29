// models/userModel.js
const db = require("../db");

class DashboardModel {
  static getDashboard(id) {
    return new Promise((resolve, reject) => {
      // Perform inner join with wallet table and filter by isValid column
      const sql = `
            SELECT users.*, 
                   CASE WHEN SUM(wallet.isValid) > 0 THEN SUM(wallet.amount) ELSE 0 END AS total_amount
            FROM users 
            LEFT JOIN wallet 
            ON users.id = wallet.id AND wallet.isValid != 0
            WHERE users.id = ?
            GROUP BY users.id`;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getCoinInvest(user_id, coin_id) {
    return new Promise((resolve, reject) => {
      // Fetch all data from the deposit table and calculate sum of deposit_amount
      const sql = `SELECT *, 
      (SELECT SUM(deposit_amount) 
       FROM deposit 
       WHERE id = ? AND coin_id = ?) AS total_deposit 
FROM deposit 
WHERE id = ? AND coin_id = ? ORDER BY created_at DESC limit 10`;
      db.query(sql, [user_id, coin_id, user_id, coin_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // If there are no deposits for the user, return 0 as total_deposit
       
          if (results.length != 0) {
            var total_deposit = {
              total_deposit: results[0].total_deposit || 0,
              result: results,
            };
          } else {
            var total_deposit = 0;
          }

          resolve({ total_deposit });
        }
      });
    });
  }

  static getInvest(id) {
    return new Promise((resolve, reject) => {
      // Fetch all data from the deposit table and calculate sum of deposit_amount
      const sql = `
          SELECT SUM(deposit_amount) AS total_deposit
          FROM deposit
          WHERE id = ?`;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // If there are no deposits for the user, return 0 as total_deposit

          if (results.length != 0) {
            var total_deposit = results[0].total_deposit || 0;
          } else {
            var total_deposit = results[0].total_deposit || 0;
          }

          resolve({ total_deposit });
        }
      });
    });
  }
  // Implement other CRUD operations
}

module.exports = DashboardModel;
