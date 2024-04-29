// controllers/userController.js
const walletModel = require('../models/walletModel');




class WalletController {
    
  static async createWallet(req, res) {
    
    try {
      const users = await walletModel.wallet(req.body,req.user.id);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Implement other CRUD operations
}

module.exports = WalletController;


