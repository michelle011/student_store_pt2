const db = require("../db");

class Order {
  static async listOrdersForUser() {
    const ordersResult = await db.query(
      `

      SELECT (
        id AS "orderId",
        customer_id AS "customerId",
        quantity AS "quantity",
        name AS "name",
        price AS "price"
      )
      FROM orders
        JOIN order_details ON orders.id = order_details.order_id
        JOIN products ON products.id = order_details.product_id
      
      WHERE customerId = (
        SELECT id from users WHERE email = $1
      )

      `,
      [user.email]
    );
    const orders = ordersResult.rows;
    return orders;
  }

  static async createOrder(user, order) {
    // inserting new order into orders table
    const orderResult = await db.query(
      `

      INSERT INTO orders (
        customer_id
      )
      VALUES (
        SELECT id from users WHERE email = $1
      )
      RETURNING id

      `,
      [user.email]
    );

    const orderId = orderResult.rows[0];

    // add all products into the order_details db with the right orderId
    order.forEach((product) => {
      db.query(
        `
      
        INSERT INTO order_details (
          order_id,
          product_id,
          quantity
        )
        VALUES ($1, $2, $3)

      `,
        [orderId.id, product.id, product.quantity]
      );
    });
  }
}

module.exports = Order;
