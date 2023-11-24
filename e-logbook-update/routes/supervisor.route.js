const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
const Message = require("../models/Message");

const router = require("express").Router();

//GET: supervisor login
router.get("/supervisor-login", (req, res) => {
  res.status(200).render("supervisor/supervisor-login", {
    error: null,
  });
});

//POST: supervisor login
router.post("/super", async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(200).render("supervisor/supervisor-login", {
        error: "Credential is required!",
      });
      return;
    }

    const supers = await Supervisor.findOne({ userid: id });

    if (supers) {
      res.status(301).redirect(`/supervisor-dashboard/${supers._id}`);
    } else {
      res.status(401).render("supervisor/supervisor-login", {
        error: "Invalid credential",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
});

// GET: supervisor dashboard
router.get("/supervisor-dashboard/:id", async (req, res, next) => {
  try {
    // get all students in the DB
    const students = await Student.find({ supervisor: req.params.id });
    return res.status(200).render("supervisor/supervisor-dashboard", {
      students,
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
});

// GET: supervisor send message page
router.get("/supervisor/send/:id", async (req, res, next) => {
  try {
    const supers = await Supervisor.findById(req.params.id);
    const students = await Student.find({ supervisor: req.params.id });

    return res.status(200).render("supervisor/supervisor-send-message", {
      supers,
      students,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});
// Send message route for supervisors
router.post("/sup_message", async (req, res, next) => {
  try {
    const { supervisor_id, student_id, title, message } = req.body;

    const supers = await Supervisor.findOne({ userid: supervisor_id });
    const students = await Student.find({ supervisor: supers._id });

    if (!supervisor_id || !student_id || !title || !message) {
      return res.status(200).render("supervisor/supervisor-send-message", {
        supers,
        students,
        error: "Credentials are required!",
      });
    }

    // send message
    await Message.create({
      supervisor: supers._id,
      student: student_id,
      title,
      content: message,
    })
      .then(() => {
        return res.status(200).render("supervisor/supervisor-send-message", {
          supers,
          students,
          error: "Message sent",
        });
      })
      .catch((error) => {
        return res.status(200).render("supervisor/supervisor-send-message", {
          supers,
          students,
          error: "An error occured!",
        });
      });
  } catch (error) {
    next(error);
  }
});

// GET: supervisor inbox page
router.get("/supervisor/inbox/:id", async (req, res, next) => {
  try {
    // find my messages
    const messages = await Message.find({ supervisor: req.params.id }).populate(
      "student"
    );
    return res.status(200).render("supervisor/supervisor-inbox", {
      id: req.params.id,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// GET: supervisor view message page
router.get("/supervisor/read/:id", async (req, res, next) => {
  try {
    // fetch all My messages
    const message = await Message.findById(req.params.id)
      .populate("student")
      .populate("supervisor");
    return res.status(200).render("supervisor/supervisor-view-inbox", {
      message,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
