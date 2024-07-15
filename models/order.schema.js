const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orders: [
      {
        session_id: { type: String, required: true },
        items: [
          {
            book_id: { type: objectId, ref: "book" },
            quantity: { type: Number, required: true },
          },
        ],
        total: { type: Number, required: true },
        status: { type: String, required: true },
        paidAt: { type: Date, default: Date.now },
        cancelledAt: { type: Date },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
