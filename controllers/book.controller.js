const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class bookController {
  // [GET] /book/:id
  async getById(req, res, next) {
    let id = req.params.id;
    const book = await Book.findById(id);
    res.render("pages/book/bookDetail", { book });
  }

  // [GET] /book/list
  async getAll(req, res, next) {
    try {
      const currentPage = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;

      const books = await Book.find()
        .skip((currentPage - 1) * size)
        .limit(size);
      const totalBooks = await Book.countDocuments();
      const totalPages = Math.ceil(totalBooks / size);

      res.render("pages/book/bookList", { books, currentPage, totalPages });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching books.");
    }
  }
}

module.exports = new bookController();
