const Book = require("../models/book.schema");

const loadTrashNum = async (req, res, next) => {
  try {
    const trashNum = await Book.countDocumentsWithDeleted({ deleted: true });
    console.log(trashNum);
    res.locals.trashNum = trashNum;
    next();
  } catch (err) {
    console.error("Error fetching number of deleted book:", err);
    next(err);
  }
};

module.exports = loadTrashNum;
