const Cart = require("../models/cart.schema");

class cartController {
  // [GET] /cart/list
  async getAll(req, res, next) {
    const user = req.cookies.user;
    Cart.findOne({ user_id: user._id })
      .populate({
        path: "carts.book_id",
        model: "book",
        select: "title author price image",
      })
      .then((cart) => {
        if (!cart) {
          return res.render("pages/cart/myCart", { carts: [] });
        }

        // Group the carts by publisher
        const cartsByPublisher = cart.carts.reduce((acc, item) => {
          if (!acc[item.publisher]) {
            acc[item.publisher] = {
              publisher: item.publisher,
              books: [],
              totalBooks: 0,
              totalPrice: 0,
            };
          }

          acc[item.publisher].books.push({
            ...item.toObject(),
            author: item.book_id.author,
            genre: item.book_id.genre,
            price: item.book_id.price,
          });
          acc[item.publisher].totalBooks += item.quantity;
          acc[item.publisher].totalPrice += item.book_id.price * item.quantity;

          return acc;
        }, {});

        // Convert the object to an array
        const result = Object.values(cartsByPublisher);
        res.render("pages/cart/myCart", { carts: result });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  }
  // [POST] /cart/add
  async addHandler(req, res, next) {
    try {
      let user = req.cookies.user;
      const { book_id, title, quantity, publisher } = req.body;
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
      cart.carts.push({ book_id, title, publisher, quantity });
      await cart.save();
      res.redirect("/cart/list");
    } catch (error) {
      next(error);
    }
  }
  // [DELETE] /book/delete/:id
  async deleteHandler(req, res, next) {
    try {
      let id = req.params.id;
      const user = req.cookies.user;
      const cart = await Cart.findOne({ user_id: user._id });
      cart.carts = cart.carts.filter((cart) => cart._id.toString() !== id);
      await cart.save();
      res.redirect("/cart/list");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new cartController();
