const router = require("express").Router();

//get home page
router.get("/", (req, res) => {
  res.status(200).render("index", {
    error: null,
  });
});

module.exports = router;
