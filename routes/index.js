/////////////////////////////
//          IMPORTS        //
/////////////////////////////

var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/////////////////////////////
//      GET Requests       //
/////////////////////////////

// GET / - Home route redirects to /listOfBooks
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
router.get("/books/createbook", async (req, res) => {
  console.log("DEBUG: You are in the /books/createbook route");
  res.render("newBook", { Book, title: "Create New Book" });
});

// GET /books/:id - Show book detail form
router.get("/books/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    console.log("DEBUG: You are in the /books/:id route");
    res.render("updateBook", { book, title: book.title });
  } else {
    res.sendStatus(404);
  }
});

/////////////////////////////
//      POST REQUESTS      //
/////////////////////////////

// POST /books/new - Create a new book
router.post("/", async (req, res) => {});

// POST /books/:id - Update book info
router.post("/:id/edit", async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + books.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("book/edit", {
        book,
        errors: error.errors,
        title: "Edit book",
      });
    } else {
      throw error;
    }
  }
});

// POST /books/:id/delete - Delete a book

module.exports = router;
