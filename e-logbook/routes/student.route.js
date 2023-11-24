const Message = require("../models/Message");
const Student = require("../models/Student");
const multer = require("multer");
const path = require("path");
const LogBook = require("../models/LogBook");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
});

const upload = multer({ storage });

const router = require("express").Router();

//Student Login to dashboard

router.post("/student_login", async (req, res, next) => {
  try {
    const { matnumber, password } = req.body;
    if (!matnumber || !password) {
      return res.status(401).render("index", {
        error: "Credentials are required!",
      });
    } else {
      const student = await Student.findOne({ matnumber });
      if (student) {
        res.status(301).redirect(`/student-dashboard/${student._id}`);
      } else {
        return res.status(401).render("index", {
          error: "Credentials are required!",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

// student dashboard
router.get("/student-dashboard/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("supervisor")
      .populate("placement");
    return res.status(200).render("student/student-dashboard", {
      student,
    });
  } catch (error) {
    next(error);
  }
});

//GET: send message page
router.get("/message/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "supervisor"
    );
    res.status(200).render("student/send-message", {
      student,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// POST send message page
router.post("/message", async (req, res, next) => {
  try {
    const { reg_number, supervisor_id, message, title } = req.body;

    const student = await Student.findOne({ reg_number }).populate(
      "supervisor"
    );

    if (!reg_number || !supervisor_id || !message || !title) {
      return res.status(200).render("student/send-message", {
        student,
        error: "Credentials are required!",
      });
    }

    // save into DB
    await Message.create({
      student: student._id,
      supervisor: supervisor_id,
      content: message,
      title,
    })
      .then((data) => {
        return res.status(200).render("student/send-message", {
          student,
          error: "Message sent!",
        });
      })
      .catch((err) => {
        return res.status(200).render("student/send-message", {
          student,
          error: "An error occured!",
        });
      });
  } catch (error) {
    next(error);
  }
});

// fill logbook page
router.get("/fill-logbook/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    res.status(200).render("student/fill-logbook", {
      student,
    });
  } catch (error) {
    next(error);
  }
});

//GET: student inbox
router.get("/student-inbox/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    const messages = await Message.find({ student: req.params.id }).populate(
      "supervisor"
    );
    res.status(200).render("student/student-inbox", {
      student,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

//GET: single message by reciver ID
router.get("/get/student-inbox/:id", async (req, res, next) => {
  try {
    // find the message
    const message = await Message.findById(req.params.id)
      .populate("supervisor")
      .populate("student");
    return res.status(200).render("student/student-inbox-view", {
      message,
    });
  } catch (error) {
    next(error);
  }
});

// Upload/update profile picture
router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const { reg_number } = req.body;

    // find student
    const findStudent = await Student.findOne({ reg_number });
    if (findStudent) {
      findStudent.profle_image = req.file.filename;
      await findStudent.save();
      return res.status(200).redirect(`/student-dashboard/${findStudent._id}`);
    } else {
      return res.status(400).send("Profile update fail");
    }
  } catch (error) {
    next(error);
  }
});

//POST: fill logbook
router.post("/fill_logbook", async (req, res, next) => {
  try {
    const { reg_number, week, date, comment } = req.body;

    // find student
    const student = await Student.findOne({ reg_number });
    if (student) {
      // Fill logbook
      await LogBook.create({
        student: student._id,
        week_number: week,
        entry_date: date,
        comments: comment,
      })
        .then(() => {
          res.status(200).send("Details saved!");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return;
    }
  } catch (error) {
    next(error);
  }
});

// attachment
router.post("/attachment", upload.single("images"), async (req, res, next) => {
  try {
    const { reg_number } = req.body;

    // find student
    const student = await Student.findOne({ reg_number });
    if (student) {
      // find student int the logbook
      const logbook = await LogBook.findOne({ student: student._id });

      if (logbook) {
        logbook.diagram = req.file.filename;
        const s = await logbook.save();
        if (s) {
          return res.status(200).send("Saved!");
        } else {
          return res.status(400).send("Error occured!");
        }
      } else {
        console.log("Error");
      }
    } else {
      console.log("Error");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
