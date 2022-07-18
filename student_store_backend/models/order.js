const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Order {
  static async createOrder({ order, user }) {
    //Take a user's order and store in database

    const result = await db.query(
      `
        
        INSERT INTO orders (customer_id)
        VALUES((SELECT id FROM users WHERE email = $1))
        RETURNING id,
                  customer_id,
                  created_at;
        `,
      [user.email]
    );

    var orderId = result.rows[0].id;

    order.forEach((element) => {
      const result = db.query(
        `
            INSERT INTO order_details (order_id, product_id, quantity)
            VALUES($1,$2,$3)
            RETURNING order_id,
                      product_id,
                      quantity;
            `,
        [orderId, element.id, element.quantity]
      );
    });

    return result.rows;
  }

  static async listOrdersForUser(user) {
    const result = await db.query(
      ` SELECT orders.id AS "orderId",
                           orders.customer_id AS "customerId",
                           order_details.quantity AS "quantity",
                           products.name AS "name",
                           products.price AS "price"
                    FROM orders
                        JOIN order_details ON orders.id = order_details.order_id
                        JOIN products ON products.id = order_details.product_id
                    WHERE customer_id = (SELECT id FROM users WHERE id = $1);
    
    `,
      [user.id]
    );

    //  console.log(user.id)
    // console.log(result.rows)

    return result.rows;
  }
}

module.exports = Order;
