const Message = require("../models/Message");
const Pleacement = require("../models/Pleacement");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
const Swiss = require("../models/Swiss");

const router = require("express").Router();

// admin login page
router.get("/admin-login", (req, res) => {
  res.status(200).render("admin/admin-login", {
    error: null,
  });
});

// Admin Login
router.post("/admin", async (req, res, next) => {
  try {
    const { adminId, adminPin } = req.body;
    if (!adminId || !adminPin) {
      res.status(401).render("admin/admin-login", {
        error: "Credentials are required!",
      });
      return;
    }

    if (adminId === "1" && adminPin === "1") {
      res.status(301).redirect("/admin-dashboard");
    } else {
      res.status(200).render("admin/admin-login", {
        error: "Invalid credentials!",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
});

// GET: regsiter student page
router.get("/register/student", (req, res) => {
  return res.status(200).render("admin/register-student", {
    error: null,
  });
});

// GET: regsiter supervisor page
router.get("/register/supervisor", async (req, res, next) => {
  try {
    // get all industrial supervisors
    const supervisors = await Swiss.find();
    return res.status(200).render("admin/register-supervisor", {
      supervisors,
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// GET: placement page
router.get("/admin/placement", async (req, res, next) => {
  try {
    //  get all supervisors
    const supervisors = await Supervisor.find();
    return res.status(200).render("admin/placement", {
      error: null,
      supervisors,
    });
  } catch (error) {
    next(error);
  }
});

// GET: inbox page
router.get("/admin/inbox", async (req, res, next) => {
  try {
    const messages = await Message.find().populate("student");
    return res.status(200).render("admin/inbox", {
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// GET: inbox view  page
router.get("/admin/inbox/:id", async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("student")
      .populate("supervisor");
    return res.status(200).render("admin/view-inbox", {
      message,
    });
  } catch (error) {
    next(error);
  }
});

// admin dashboard
router.get("/admin-dashboard", async (req, res, next) => {
  try {
    // get all students in the DB
    const students = await Pleacement.find()
      .populate("student_id")
      .populate("supervisor");

    return res.status(200).render("admin/admin-dashboard", {
      students,
    });
  } catch (error) {
    next(error);
  }
});

// POST
// register student
router.post("/student", async (req, res, next) => {
  try {
    const { fullname, matnumber, departement, level, program } = req.body;

    if (!fullname || !matnumber || !departement || !level || !program) {
      return res.status(200).render("admin/register-student", {
        error: "Credentials req required",
      });
    }

    // check if matnumber already exit
    const check = await Student.findOne({ matnumber });
    if (check) {
      return res.status(401).render("admin/register-student", {
        error: "Account already exit!",
      });
    }

    // generate reg_number
    const reg_number = Date.now();

    // save into db
    await Student.create({
      fullname,
      matnumber,
      reg_number,
      departement,
      level,
      program,
    })
      .then(() => {
        return res.status(200).render("admin/register-student", {
          error: "Account created",
        });
      })
      .catch(() => {
        return res.status(401).render("admin/register-student", {
          error: "An error occured please try again later",
        });
      });
  } catch (error) {
    next(error);
  }
});

// placement registration
router.post("/placement", async (req, res, next) => {
  try {
    const {
      matnumber,
      company_name,
      company_address,
      section_of_work,
      supervisor,
    } = req.body;

    if (
      !matnumber ||
      !company_name ||
      !company_address ||
      !section_of_work ||
      !supervisor
    ) {
      //  get all supervisors
      const supervisors = await Supervisor.find();
      return res.status(401).render("admin/placement", {
        error: "All credentials are required!",
        supervisors,
      });
    }

    // validate the student mat number
    const check = await Student.findOne({ matnumber });
    if (!check) {
      //  get all supervisors
      const supervisors = await Supervisor.find();
      return res.status(401).render("admin/placement", {
        error: "Invalid matric number",
        supervisors,
      });
    } else {
      // first check if student have not submitted his/her placement before
      const pl = await Pleacement.findOne({ student_id: check._id });
      if (pl) {
        //  get all supervisors
        const supervisors = await Supervisor.find();
        return res.status(401).render("admin/placement", {
          error: "Student have already submitted his/her placement already!",
          supervisors,
        });
      }

      // save into db
      const placement = await Pleacement.create({
        student_id: check._id,
        company_address,
        company_name,
        section_of_work,
        supervisor,
      });

      if (placement) {
        const student = await Student.findOne({ matnumber });
        if (student) {
          student.placement = placement._id;
          student.supervisor = supervisor;
          const save = await student.save();
          if (save) {
            //  get all supervisors
            const supervisors = await Supervisor.find();
            return res.status(200).render("admin/placement", {
              error: "Details saved!",
              supervisors,
            });
          } else {
            //  get all supervisors
            const supervisors = await Supervisor.find();
            return res.status(400).render("admin/placement", {
              error:
                "An error occured while saving the data, please try again later",
              supervisors,
            });
          }
        } else {
          //  get all supervisors
          const supervisors = await Supervisor.find();
          return res.status(200).render("admin/placement", {
            error: "Error occured please try again later",
            supervisors,
          });
        }
      } else {
        //  get all supervisors
        const supervisors = await Supervisor.find();
        return res.status(400).render("admin/placement", {
          error: "An error occured please try again later",
          supervisors,
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

// inbox
router.post("/inbox", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// register supervisor
router.post("/supervisor", async (req, res, next) => {
  try {
    const { fullname, location, industry_supervisor, lecturer } = req.body;

    if (!fullname || !location || !industry_supervisor || !lecturer) {
      // get all industrial supervisors
      const supervisors = await Swiss.find();
      return res.status(401).render("admin/register-supervisor", {
        supervisors,
        error: "Credentials are required!",
      });
    }

    // generate ID
    const userid = Date.now();

    await Supervisor.create({
      fullname,
      userid,
      location,
      industry_supervisor,
      lecturer,
    })
      .then(async (data) => {
        const supervisors = await Swiss.find();
        return res.status(200).render("admin/register-supervisor", {
          supervisors,
          error: `Account created! User ID: ${data.userid}`,
        });
      })
      .catch(async () => {
        const supervisors = await Swiss.find();
        return res.status(401).render("admin/register-supervisor", {
          supervisors,
          error: "An error occured please try again later",
        });
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
