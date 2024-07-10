const User = require("../models/user.schema");

const loadTrashNum = async (req, res, next) => {
  try {
    const userTrash = await User.countDocumentsWithDeleted({ deleted: true });
    res.locals.userTrash = userTrash;
    next();
  } catch (err) {
    console.error("Error fetching number of deleted user:", err);
    next(err);
  }
};

module.exports = loadTrashNum;
