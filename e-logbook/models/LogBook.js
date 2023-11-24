const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LogBookSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    week_number: String,
    entry_date: Date,
    diagram: String,
    comments: String,
    sketches: String,
  },
  { timestamps: true }
);

module.exports = model("LogBook", LogBookSchema);
