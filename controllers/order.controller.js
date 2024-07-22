require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cart.schema");
const Order = require("../models/order.schema");
const Book = require("../models/book.schema");
const User = require("../models/user.schema");

class orderController {
  // [GET] /order/list
  async getAll(req, res, next) {
    try {
      const user = req.cookies.user;
      const order = await Order.findOne({ user_id: user._id }).populate({
        path: "orders.items.book_id",
        select: "title price image",
      });
      order.orders.sort((a, b) => {
        return new Date(b.paidAt) - new Date(a.paidAt);
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
      if (session.statusCode === 400) {
        return res.redirect(session.cancel_url);
      }
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
      for (const item of items) {
        await Book.updateOne(
          { _id: item._id },
          {
            $inc: {
              quantity_in_stock: -item.quantity,
              quantity_sold: item.quantity,
            },
          }
        );
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
  // [GET] /order/manage
  async manage(req, res, next) {
    try {
      const user = req.cookies.user;
      // const currentPage = parseInt(req.query.page) || 1;
      // const size = parseInt(req.query.size) || 20;
      const name = req.query.name || "";
      let totalOrders;
      let orders;
      if (name) {
        const usr = await User.findOne({
          name: { $regex: name, $options: "i" },
        });
        if (!usr) {
          return res.render("pages/order/orderManage", { user, orders: [] });
        }
        orders = await Order.find({ user_id: user._id })
          .populate({
            path: "orders.items.book_id",
            select: "title price",
          })
          .populate({
            path: "user_id",
            select: "name username",
          })
          .sort({ paidAt: -1 });
      } else {
        orders = await Order.find({})
          .populate({
            path: "orders.items.book_id",
            select: "title price",
          })
          .populate({
            path: "user_id",
            select: "name username",
          })
          .sort({ paidAt: -1 });
      }

      totalOrders = await Order.countDocuments({ user_id: user._id });
      res.render("pages/order/orderManage", {
        orders,
        totalOrders,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  // [GET] /order/:id
  async detail(req, res, next) {
    try {
      const user = req.cookies.user;
      const id = req.params.id;
      const order = await Order.findOne({ user_id: user._id })
        .populate({
          path: "orders.items.book_id",
          select: "title price author image description",
        })
        .populate({
          path: "user_id",
          select: "name username",
        });

      const orderDetail = order.orders.filter(
        (order) => order._id.toString() === id
      )[0];
      res.render("pages/order/orderDetail", { orderDetail, user });
    } catch (error) {
      next(error);
    }
  }

  // [PATCH] /order/update/:id
  async updateHandler(req, res, next) {
    try {
      const user_id = req.params.id;
      const { status, index } = req.body;
      const order = await Order.findOne({ user_id });
      if (!order) {
        throw new Error("Order not found");
      }
      order.orders[index].status = status;
      await order.save();
      res.redirect("/order/manage");
    } catch (error) {
      next(error);
    }
  }
  // [GET] /order/fails
  async getFailOrders(req, res, next) {
    try {
      const user = req.cookies.user;
      const name = req.query.name || "";
      let failedOrders;
      if (name) {
        const usr = await User.findOne({
          name: { $regex: name, $options: "i" },
        });
        if (!usr) {
          return res.render("pages/order/orderFail", { user, orders: [] });
        }
        failedOrders = await Order.find({
          user_id: user._id,
          "orders.status": "Fail",
        })
          .populate({
            path: "orders.items.book_id",
            select: "title price",
          })
          .populate({
            path: "user_id",
            select: "name username",
          })
          .sort({ paidAt: -1 });
      } else {
        failedOrders = await Order.find({
          "orders.status": "Fail",
        })
          .populate({
            path: "orders.items.book_id",
            select: "title price",
          })
          .populate({
            path: "user_id",
            select: "name username",
          })
          .sort({ paidAt: -1 });
      }
      const orders = failedOrders.map((order) => ({
        _id: order._id,
        user_id: order.user_id,
        orders: order.orders.filter((o) => o.status === "Fail"),
      }));
      res.render("pages/order/orderFail", { orders, user });
    } catch (error) {
      next(error);
    }
  }
  // [DELETE] /order/delete/:id
  async deleteHandler(req, res, next) {}
}

module.exports = new orderController();
