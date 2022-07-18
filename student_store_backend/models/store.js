const db = require("../db");

class Store {
  /**
   *
   * @param {*} user
   * @returns a list for all products from the database
   */
  static async listProducts(user) {
    const query = `SELECT name, category, image, description, price FROM products ORDER BY date_created ASC`;

    const result = await db.query(query, [user.email.toLowerCase()]);

    return result.rows;
  }
}

module.exports = Store;
