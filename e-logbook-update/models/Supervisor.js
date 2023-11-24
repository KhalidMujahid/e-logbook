const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SupervisorSchema = new Schema(
  {
    fullname: String,
    userid: String,
    location: String,
    industry_supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Swiss",
    },
    lecturer: String,
  },
  { timestamps: true }
);

module.exports = model("Supervisor", SupervisorSchema);
