const { Router } = require("express");
const Swiss = require("../models/Swiss");

const router = Router();

router.get("/siwess", (req, res) => {
  return res.status(200).render("siwess/siwess", {
    error: null,
  });
});

// Register supervisor
router.post("/siwess", async (req, res, next) => {
  try {
    const { fname, lname, email, phone_number, location, gender } = req.body;

    if (!fname || !lname || !email || !phone_number || !location || !gender) {
      return res.status(200).render("siwess/siwess", {
        error: "Credentials are required!",
      });
    }

    // check if account exit
    const check = await Swiss.findOne({ email });
    if (check)
      return res.status(401).render("siwess", {
        error: "Account already exit!",
      });

    // save to db
    await Swiss.create(req.body)
      .then(() => {
        return res.status(200).render("siwess/siwess", {
          error: "Account created!",
        });
      })
      .catch((error) => {
        return res.status(401).render("siwess/siwess", {
          error: "An error occured please try again later!",
        });
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
