const express = require("express");
const helmet = require("helmet");
const studentRouter = require("./routes/student.route");
const homeRouter = require("./routes/home.route");
const adminRouter = require("./routes/admin.route");
const supervisorRouter = require("./routes/supervisor.route");
const PORT = process.env.PORT || 3000;
const app = express();

// connect DB
require("./config/db");

// middlewares
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/", homeRouter);
app.use("/", studentRouter);
app.use("/", adminRouter);
app.use("/", supervisorRouter);
app.use("/", require("./routes/swiss.route"));

app.listen(PORT, () => console.log("Server running on port ", PORT));
