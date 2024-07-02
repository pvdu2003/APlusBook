const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
