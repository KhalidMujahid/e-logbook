const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AdminSchema = new Schema(
  {
    siwes_co: String,
    admin: String,
    message: String,
    placement_info: String,
  },
  { timestamps: true }
);

module.exports = model("Admin", AdminSchema);
