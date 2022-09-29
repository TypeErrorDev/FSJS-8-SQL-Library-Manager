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
  res.render("newBook", { Book, title: "Create A New Book" });
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
router.post("/books/new", async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    console.log("DEBUG: You are in the /books/new route");
    res.redirect(`/books`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("newBook", {
        book,
        errors: error.errors,
        title: "Create A New Book",
      });
    } else {
      throw error;
    }
  }
});

// POST /books/:id - Update book info
router.post("/books/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      console.log("DEBUG: Successfully updated book");
      res.redirect("/books" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("updateBook", {
        book,
        errors: error.errors,
        title: "Update Book",
      });
    } else {
      throw error;
    }
  }
});

// POST /books/:id/delete - Delete a book
router.post("/books/:id/delete", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    console.log("DEBUG: Successfully ran the delete route");
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
});

/////////////////////////////
//      EXPORT ROUTER      //
/////////////////////////////

module.exports = router;
