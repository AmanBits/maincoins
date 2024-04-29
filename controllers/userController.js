// controllers/userController.js
const UserModel = require('../models/userModel');




class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Implement other CRUD operations
}

module.exports = UserController;


