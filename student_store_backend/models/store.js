const db = require("../db");

class Store {
  static async listProducts() {
    const productsResult = await db.query(`

      SELECT * FROM products

      `);
    const products = productsResult.rows;
    return products;
  }
}

module.exports = Store;
