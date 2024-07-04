const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class bookController {
  // [GET] /book/:id
  async getById(req, res, next) {
    let id = req.params.id;
    const book = await Book.findById(id);
    res.render("pages/book/bookDetail", { book });
  }
}

module.exports = new bookController();
