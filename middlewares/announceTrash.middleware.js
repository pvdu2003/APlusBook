const Announcement = require("../models/announcement.schema");

const loadTrashNum = async (req, res, next) => {
  try {
    const announceTrash = await Announcement.countDocumentsWithDeleted({
      deleted: true,
    });
    res.locals.announceTrash = announceTrash;
    next();
  } catch (err) {
    console.error("Error fetching number of deleted announcement:", err);
    next(err);
  }
};

module.exports = loadTrashNum;
