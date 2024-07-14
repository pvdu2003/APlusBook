const Cart = require("../models/cart.schema");

class orderController {
  // [GET] /order/list
  async getAll(req, res, next) {}
  // [POST] /order/checkout
  async checkout(req, res, next) {
    res.json(req.body);
  }
  // [DELETE] /order/delete/:id
  async deleteHandler(req, res, next) {}
}

module.exports = new orderController();
