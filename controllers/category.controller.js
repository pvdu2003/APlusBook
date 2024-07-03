const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class categoryController {
  // [GET] /category/:id
  async getById(req, res, next) {
    let id = req.params.id;
    const category = await Category.findById(id);
    const books = await Book.find({ cat_id: id });
    res.render("pages/category/categoryDetail", { books, category });
  }
}

module.exports = new categoryController();
