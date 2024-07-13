const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    carts: [
      {
        _id: { type: objectId, auto: true },
        book_id: { type: objectId, ref: "book" },
        title: { type: String },
        publisher: { type: String },
        quantity: { type: Number, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
