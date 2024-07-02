const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/f8_education");
    console.log("Connect successfully!");
  } catch (error) {
    console.log("Fail to Connect!");
  }
}
module.exports = { connect };
