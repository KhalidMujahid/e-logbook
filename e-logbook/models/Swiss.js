const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SwissSchema = new Schema(
  {
    fname: String,
    lname: String,
    email: String,
    phone_number: String,
    location: String,
    gender: String,
  },
  { timestamps: true }
);

module.exports = model("Swiss", SwissSchema);
