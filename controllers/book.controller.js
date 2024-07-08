const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class bookController {
  // [GET] /book/:id
  async getById(req, res, next) {
    let id = req.params.id;
    const book = await Book.findById(id);
    res.render("pages/book/bookDetail", { book });
  }

  // [GET] /book/list?page&from&to&title
  async getAll(req, res, next) {
    try {
      const currentPage = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;
      const from = parseInt(req.query.from) || 0;
      const to = parseInt(req.query.to) || 150;
      const title = req.query.title || "";
      let books;
      let totalBooks;
      // Only range of price
      if (from > 0 || to > 0) {
        books = await Book.find({
          price: { $gte: from, $lte: to },
        })
          .skip((currentPage - 1) * size)
          .limit(size);
        totalBooks = await Book.countDocuments({
          price: { $gte: from, $lte: to },
        });
        // Only title
      } else if (title) {
        books = await Book.find({ title: { $regex: title, $options: "i" } })
          .skip((currentPage - 1) * size)
          .limit(size);
        totalBooks = await Book.countDocuments({
          title: { $regex: title, $options: "i" },
        });
        // Both price and title
      } else if (from > 0 && to > 0 && title) {
        books = await Book.find({
          price: { $gte: from, $lte: to },
          title: { $regex: title, $options: "i" },
        })
          .skip((currentPage - 1) * size)
          .limit(size);
        totalBooks = await Book.countDocuments({
          price: { $gte: from, $lte: to },
          title: { $regex: title, $options: "i" },
        });
        // All books
      } else {
        books = await Book.find()
          .skip((currentPage - 1) * size)
          .limit(size);
        totalBooks = await Book.countDocuments();
      }
      const totalPages = Math.ceil(totalBooks / size);
      res.render("pages/book/bookList", {
        books,
        currentPage,
        totalPages,
        from,
        to,
        title,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching books.");
    }
  }
  // [GET] /book/manage
  async manage(req, res, next) {
    const currentPage = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const title = req.query.title || "";
    let totalBooks;
    let books;
    if (title) {
      books = await Book.find({ title: { $regex: title, $options: "i" } })
        .skip((currentPage - 1) * size)
        .limit(size);
      totalBooks = await Book.countDocuments({
        title: { $regex: title, $options: "i" },
      });
    } else {
      books = await Book.find()
        .skip((currentPage - 1) * size)
        .limit(size);
      totalBooks = await Book.countDocuments();
    }
    const totalPages = Math.ceil(totalBooks / size);

    res.render("pages/book/bookManage", {
      books,
      currentPage,
      totalPages,
      title,
    });
  }
  // [GET] /book/update/:id
  async update(req, res, next) {
    const id = req.params.id;
    const book = await Book.findById(id);
    res.render("pages/book/bookUpdate", { book });
  }
  // [PATCH] /book/update/:id
  async updateHandler(req, res, next) {
    try {
      const id = req.params.id;
      const {
        title,
        price,
        author,
        category,
        description,
        isbn,
        publisher,
        published_date,
        quantity_import,
        quantity_in_stock,
        cat_id,
      } = req.body;
      let quantity_sold = quantity_import - quantity_in_stock;
      let image;
      const book = await Book.findById(id);
      let err = {};

      if (quantity_sold < 0) {
        err.quantity_import =
          "Quantity import must be greater than quantity in stock!";
        err.quantity_in_stock =
          "Quantity import must be greater than quantity in stock!";
        return res.render("pages/book/bookUpdate", { book, err });
      }

      if (req.file) {
        image = `/images/${req.file.filename}`;
      } else {
        // If no new image is uploaded, get the current image URL from the database
        image = book.image;
      }
      await Book.findByIdAndUpdate(id, {
        title,
        price,
        author,
        category,
        description,
        isbn,
        publisher,
        published_date,
        quantity_import,
        quantity_in_stock,
        quantity_sold,
        cat_id,
        image: image,
      });
      res.redirect("/book/manage");
    } catch (error) {
      next(error);
      // console.error(error);
      // res.render("pages/book/bookUpdate", { book: req.body, error });
    }
  }
}

module.exports = new bookController();
