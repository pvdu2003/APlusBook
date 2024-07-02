const Category = require("../models/category.schema");

const loadCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.locals.categories = categories;
    next();
  } catch (err) {
    console.error("Error fetching categories:", err);
    next(err);
  }
};

module.exports = loadCategories;
