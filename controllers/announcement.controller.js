const Announcements = require("../models/announcement.schema");

class AnnouncementController {
  // GET /announcement/list
  async getAll(req, res, next) {
    try {
      const user = req.cookies.user;
      let title = req.query.title || "";
      const currentPage = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;
      title = title.trim();
      let announcements;
      let total;
      if (title) {
        announcements = await Announcements.find({
          title: { $regex: title, $options: "i" },
        })
          .skip((currentPage - 1) * size)
          .limit(size)
          .sort({ updatedAt: -1 });
        total = await Announcements.countDocuments({
          title: { $regex: title, $options: "i" },
        });
      } else {
        announcements = await Announcements.find()
          .skip((currentPage - 1) * size)
          .limit(size)
          .sort({ updatedAt: -1 });
        total = await Announcements.countDocuments();
      }
      const totalPages = Math.ceil(total / size);
      res.render("pages/announcement/announcements", {
        user,
        announcements,
        currentPage,
        totalPages,
        title,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
    }
  }
  // GET /announcement/add
  add(req, res, next) {
    try {
      const user = req.cookies.user;
      res.render("pages/announcement/add", { user });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
  // GET /announcement/:id
  async getById(req, res, next) {
    try {
      const user = req.cookies.user;
      const id = req.params.id;
      const announcement = await Announcements.findOneWithDeleted({ _id: id });
      res.render("pages/announcement/announcement", { user, announcement });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
  // POST /announcement/upload
  async uploadFile(req, res, next) {
    try {
      const user = req.cookies.user;
      const { title, body, createdBy } = req.body;
      const files = req.files;

      let err = {};
      const prevTitle = await Announcements.findOne({ title: title });
      if (prevTitle) {
        err.title = "This title is already exist!";
        return res.render("pages/announcement/add", {
          user,
          err,
        });
      }

      // Handle file upload
      const fileDetails = files.map((file) => ({
        path: file.path,
        name: file.originalname,
        type: file.mimetype,
      }));
      const announcement = new Announcements({
        title,
        body,
        createdBy,
        files: fileDetails,
      });
      await announcement.save();
      return res.redirect("/announcement/list");
    } catch (error) {
      next(error);
    }
  }

  // PUT/PATCH /announcement/update/:id
  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const { title, body, updatedBy } = req.body;
      const files = req.files;
      // Find the announcement to update
      const announcement = await Announcements.findById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      // Update the announcement
      announcement.title = title;
      announcement.body = body;
      announcement.updatedBy = updatedBy;

      // Handle file updates
      if (files.length > 0) {
        // Remove existing files
        announcement.files = [];

        // Add new files
        for (const file of files) {
          announcement.files.push({
            path: file.path,
            name: file.originalname,
          });
        }
      } else {
        announcement.files = announcement.files;
      }

      await announcement.save();
      res.redirect("/announcement/list");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  // GET /announcement/trash
  async renderTrash(req, res, next) {
    let title = req.query.title || "";
    title = title.trim();
    let announcements;
    if (title) {
      announcements = await Announcements.findWithDeleted({
        title: { $regex: title, $options: "i" },
      }).sort({ updatedAt: -1 });
    } else {
      announcements = await Announcements.findWithDeleted({
        deleted: true,
      });
    }
    res.render("pages/announcement/trash", { announcements });
  }
  // TODO: add deletedBy field in db
  // DELETE /announcement/delete/:id
  async deleteAnnouncement(req, res, next) {
    try {
      const id = req.params.id;
      await Announcements.delete({ _id: id });
      return res.redirect("/announcement/list");
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
    }
  }
  // [DELETE] /announcement/delete/:id/force
  async forceDelete(req, res, next) {
    try {
      const id = req.params.id;
      await Announcements.deleteOne({ _id: id });
      res.redirect("/announcement/list");
    } catch (error) {
      next(error);
    }
  }
  // [PATCH] /announcement/restore/:id
  async restore(req, res, next) {
    try {
      await Announcements.restore({ _id: req.params.id });
      res.redirect("/announcement/list");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AnnouncementController();
