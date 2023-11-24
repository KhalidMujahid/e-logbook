const router = require("express").Router();

//get landing page
router.get("/", (req, res) => {
  res.status(200).render("landing");
});

//get home page
router.get("/home", (req, res) => {
  res.status(200).render("index", {
    error: null,
  });
});

module.exports = router;
