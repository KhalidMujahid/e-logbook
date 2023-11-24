const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    fullname: String,
    matnumber: String,
    reg_number: String,
    password: String,
    departement: String,
    profle_image: {
      type: String,
      default: "default.png",
    },
    level: String,
    program: String,
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },
    placement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Placement",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
