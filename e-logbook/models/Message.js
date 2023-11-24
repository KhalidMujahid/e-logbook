const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
    },
    title: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
