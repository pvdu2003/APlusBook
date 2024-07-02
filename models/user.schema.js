const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    phone_num: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const User = mongoose.model("users", userSchema);
module.exports = User;
