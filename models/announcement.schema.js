const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const announcementSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    title: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    files: [
      {
        path: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String },
      },
    ],
    createdBy: { type: String, ref: "users", required: true },
    updatedBy: { type: String, ref: "users" },
    deletedBy: { type: objectId, ref: "users" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
announcementSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
  deletedBy: true,
});
const Announcements = mongoose.model("announcements", announcementSchema);
module.exports = Announcements;
