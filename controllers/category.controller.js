const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class categoryController {
  // [GET] /category/:id?page
  async getById(req, res, next) {
    let id = req.params.id;
    const category = await Category.findById(id);
    let currentPage = parseInt(req.query.page) || 1;
    const limit = 10;
    const totalBooks = await Book.countDocuments({
      cat_id: id,
    });
    const totalPages = Math.ceil(totalBooks / limit);
    const books = await Book.find({ cat_id: id })
      .skip((currentPage - 1) * limit)
      .limit(limit);
    res.render("pages/category/categoryDetail", {
      books,
      category,
      currentPage,
      totalPages,
    });
  }
}

module.exports = new categoryController();
