var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

// Handler function to wrap each route.
router.get("/", (req, res) => {
  res.redirect("/books");
});

/* GET home page. */
router.get("/books", async (req, res) => {
  const books = await Book.findAll();
  // res.json(books);
  res.render("index", { books });
});

module.exports = router;
