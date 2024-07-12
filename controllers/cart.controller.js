const Cart = require("../models/cart.schema");

class cartController {
  // [GET] /cart/list
  async getAll(req, res, next) {
    try {
      res.send("Cart list!!!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching books.");
    }
  }
  // [POST] /cart/add
  async addHandler(req, res, next) {
    try {
      let user = req.cookies.user;
      const { book_id, title, quantity } = req.body;
      let cart = await Cart.findOne({ user_id: user._id });
      if (!cart) {
        cart = new Cart({ user_id: user._id, carts: [] });
      }
      const isAdded = cart.carts.some(
        (cartItem) => cartItem.book_id.toString() === book_id
      );
      if (isAdded) {
        await Cart.findOneAndUpdate(
          { user_id: user._id, "carts.book_id": book_id },
          { $set: { "carts.$.quantity": quantity } }
        );
        return res.redirect("/cart/list");
      }
      cart.carts.push({ book_id, title, quantity });
      await cart.save();
      res.redirect("/cart/list");
    } catch (error) {
      next(error);
    }
  }
  // [DELETE] /book/delete/:id
  async deleteHandler(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new cartController();
