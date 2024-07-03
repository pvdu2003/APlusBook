const bcrypt = require("bcrypt");
const Category = require("../models/category.schema");
const Book = require("../models/book.schema");

class homeController {
  // [GET] /
  async homePage(req, res, next) {
    try {
      const top5Cat = await Book.aggregate([
        {
          $group: {
            _id: "$cat_id",
            totalQuantitySold: { $sum: "$quantity_sold" },
          },
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            _id: "$category._id",
            name: "$category.name",
            totalQuantitySold: 1,
          },
        },
      ]);
      const topBooksPerCategory = await Promise.all(
        top5Cat.map(async (cat) => {
          const books = await Book.find({ cat_id: cat._id })
            .sort({ quantity_sold: -1 })
            .limit(6)
            .lean();
          return { cat_id: cat._id, category: cat.name, books: books };
        })
      );
      res.render("pages/home/homePage", { topBooksPerCategory });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new homeController();
