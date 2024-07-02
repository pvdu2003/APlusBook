const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    isbn: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    description: { type: String, required: true, minLength: 20 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    published_date: { type: Date, required: true },
    publisher: { type: String, required: true },
    quantity_import: { type: Number, required: true },
    quantity_in_stock: { type: Number, required: true },
    quantity_sold: { type: Number, required: true },
    title: { type: String, required: true },
    cat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Book = mongoose.model("book", bookSchema);
module.exports = Book;
