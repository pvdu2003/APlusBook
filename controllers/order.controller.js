require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cart.schema");
const Order = require("../models/order.schema");

class orderController {
  // [GET] /order/list
  async getAll(req, res, next) {
    try {
      const user = req.cookies.user;
      const order = await Order.findOne({ user_id: user._id }).populate({
        path: "orders.items.book_id",
        select: "title price image",
      });
      res.render("pages/order/orderList", { order, user });
    } catch (error) {
      next(error);
    }
  }
  // [POST] /order/checkout
  async checkout(req, res, next) {
    try {
      const user = req.cookies.user;
      const items = JSON.parse(req.body.selectedBooks);
      const line_items = items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
            },
            unit_amount: item.itemPrice * 100,
          },
          quantity: item.quantity,
        };
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.BASE_URL}/order/list`,
        cancel_url: `${process.env.BASE_URL}/cart/list`,
        customer_email: user.email,
        metadata: {
          userId: user._id,
        },
        shipping_address_collection: {
          allowed_countries: ["US", "VN", "CN"],
        },
      });
      const orders = items.map((item) => {
        return {
          book_id: item._id,
          quantity: item.quantity,
        };
      });
      const existUser = await Order.findOne({ user_id: user._id });
      if (!existUser) {
        const order = new Order({
          user_id: user._id,
          orders: [
            {
              session_id: session.id,
              items: orders,
              total: session.amount_total / 100,
              status: "Pending",
            },
          ],
        });
        await order.save();
      } else {
        const order = await Order.findOneAndUpdate(
          { user_id: user._id },
          {
            $push: {
              orders: {
                session_id: session.id,
                items: orders,
                total: session.amount_total / 100,
                status: "Pending",
              },
            },
          },
          { new: true }
        );
        if (!order) {
          throw new Error("Order not found");
        }
      }
      // Remove the ordered items from the cart
      await Cart.updateMany(
        {
          user_id: user._id,
          "carts.book_id": { $in: items.map((item) => item._id) },
        },
        {
          $pull: {
            carts: {
              book_id: { $in: items.map((item) => item._id) },
            },
          },
        }
      );
      res.redirect(session.url);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "An error occurred while creating the checkout session",
      });
    }
  }
  // [DELETE] /order/delete/:id
  async deleteHandler(req, res, next) {}
}

module.exports = new orderController();
