// model/baseSQLModel.js
const { db } = require("../utils/database"); // Import the database object

class BaseSQLModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async executeQuery(query, params = []) {
    try {
      const [results] = await db.execute(query, params);
      return results;
    } catch (error) {
      console.error("Query Execution Error:", error);
      throw error;
    }
  }

  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const results = await this.executeQuery(query);
    return results;
  }

  async findByColumn(column) {
    const query = `SELECT ${column} FROM ${this.tableName}`;
    const results = await this.executeQuery(query);
    return results;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.executeQuery(query, [id]);
    return results[0];
  }

  async findByKey(key, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${key} = ?`;
    const results = await this.executeQuery(query, [value]);
    return results[0];
  }

  async findAllByKey(key, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${key} = ?`;
    const results = await this.executeQuery(query, [value]);
    return results;
  }

  async create(data) {
    try {
        const query = `INSERT INTO ${this.tableName} SET ?`;
        const [result] = await this.executeQuery(query, data);
        return result.insertId;
    } catch (error) {
        console.error("Create error:", error);
        throw error;
    }
}

  async update(id, data) {
    const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
    const result = await this.executeQuery(query, [data, id]);
    return result.affectedRows;
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQuery(query, [id]);
    return result.affectedRows;
  }
}

module.exports = BaseSQLModel;