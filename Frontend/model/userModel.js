const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class UserModel extends BaseSQLModel {
  constructor() {
    super("signUp"); 
  }

  async findByKey(key, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${key} = ?`;
    const results = await this.executeQuery(query, [value]);
    return results[0]; // Return the first match
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.executeQuery(query, [id]);
    return results[0]; // Return the user with the given ID
  }

  // Create a new user with the given username and password
  async createUser(username, phone,email,password) {
    console.log("Creating user with values:", username, phone, email, password);
    const query = `INSERT INTO ${this.tableName} (username, phone_number,email,password_hash) VALUES (?, ?, ?, ?)`;
    const result = await this.executeQuery(query, [username, phone,email,password]);
    return result; // Return the result of the insert operation
  }
}

module.exports = new UserModel();