const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/ELB")
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));
