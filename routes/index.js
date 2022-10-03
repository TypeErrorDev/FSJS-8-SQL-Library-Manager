/////////////////////////////
//          IMPORTS        //
/////////////////////////////

var express = require("express");
const { render } = require("../app");
var router = express.Router();
const Book = require("../models").Book;

/////////////////////////////
//      GET Requests       //
/////////////////////////////

// GET / - Home route redirects to /books
router.get("/", (req, res) => {
  console.log("DEBUG: Redirect to /books");
  res.redirect("books");
});

// GET /books - Show the full library of books
router.get("/books", async (req, res) => {
  const books = await Book.findAll();
  console.log("DEBUG: You are in the /books route");
  // res.json(books);
  res.render("index", { books, title: "Books" });
});

// GET /books/createbook - Show the create new book form
router.get("/books/createbook", async (req, res) => {
  console.log("DEBUG: You are in the /books/createbook route");
  res.render("newBook", { Book });
});

// GET /books/:id - Show book detail form
router.get("/books/:id", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    console.log("DEBUG: You are in the /books/:id route");
    res.render("updateBook", { book, title: book.title });
  } else {
    // const err = new Error("Holy Smokes, this is a 404 Error");
    // err.status = 404;
    next();
  }
});

/////////////////////////////
//      POST REQUESTS      //
/////////////////////////////

// POST /books/createbook - Create a new book
router.post("/books/createbook", async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect(`/`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("newBook", {
        book,
        errors: error.errors,
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
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
      res.redirect("/books/" + book.id);
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
        title: book.title,
        author: book.author,
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
    // res.sendStatus(404);
  }
});

/////////////////////////////
//   ERROR MIDDLEWARE      //
/////////////////////////////
router.use((req, res, next) => {
  console.log("DEBUG: You've hit the error catch");
  const err = new Error("Generic Error: Page Not Found");
  res.status(404);
  next(err);
});

router.use((err, req, res) => {
  if (err) {
    if (err.status === 404) {
      console.log("DEBUG: THIS IS THE 404 ERROR");
      res.render("pageNotFound", err.message, { err });
    } else if (err.status === 500) {
      err.message = "My apologies! Seems I've misplaced my server!";
      console.log("DEBUG: THIS IS THE 500 ERROR");
      res.render("error500", { err });
    }
  }
});

/////////////////////////////
//      EXPORT ROUTER      //
/////////////////////////////

module.exports = router;
