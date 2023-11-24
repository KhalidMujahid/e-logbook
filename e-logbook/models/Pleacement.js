const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PlacementSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    company_name: String,
    company_address: String,
    section_of_work: String,
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
    },
  },
  { timestamps: true }
);

module.exports = model("Placement", PlacementSchema);
