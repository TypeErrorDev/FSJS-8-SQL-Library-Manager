/////////////////////////////
//          IMPORTS        //
/////////////////////////////

var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/////////////////////////////
//      GET Requests       //
/////////////////////////////

// GET / - Home route redirects to /books
router.get("/", (req, res) => {
  console.log("DEBUG: Redirect to /books");
  res.redirect("/books");
});

// GET /books - Show the full list of books
router.get("/books", async (req, res) => {
  const books = await Book.findAll();
  console.log("DEBUG: You are in the /books route");
  // res.json(books);
  res.render("index", { books, title: "Books" });
});

// GET /books/new - Show the create new book form
router.get("/books/new", async (req, res) => {
  // const books = await Book.create();
  console.log("DEBUG: " + req.body);
  res.redirect("/books");
});

// GET /books/:id - Show book detail form
router.get("/books/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("updateBook", { book, title: book.title });
  } else {
    res.sendStatus(404);
  }
});

/////////////////////////////
//      POST REQUESTS      //
/////////////////////////////

// POST /books/new - Create a new book

// POST /books/:id - Update book info

// POST /books/:id/delete - Delete a book

module.exports = router;
