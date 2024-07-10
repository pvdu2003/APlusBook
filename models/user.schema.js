const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, minLength: 6 },
    phone_num: { type: String },
    email: { type: String, required: true },
    role: { type: String, default: "user" },
    address: { type: String },
    dob: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.plugin(mongoose_delete, {
  indexFields: "all",
  overrideMethods: "all",
});
const User = mongoose.model("users", userSchema);
module.exports = User;
