/////////////////////////////
//        IMPORTS          //
/////////////////////////////
const express = require("express");
const path = require("path");
const Sequelize = require("./models/index.js").sequelize;
const indexRouter = require("./routes/index");
const app = express();

/////////////////////////////
//      ENGINE SETUP       //
/////////////////////////////
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/////////////////////////////
//      STATIC ROUTE       //
/////////////////////////////
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

/////////////////////////////
//  SEQUELIZE CONNECTION   //
/////////////////////////////

(async () => {
  try {
    await Sequelize.sync();
    await Sequelize.authenticate();
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

/////////////////////////////
//     SEARCH FUNCTION     //
/////////////////////////////
//Pagination
app.get("/books", async (req, res) => {
  const { count, rows } = await Book.findAndCountAll();
  const displayNumber = 5;

  let index; //index of the array - used for the offset to see up to what range of books you want to see
  let numberOfPages = Math.ceil(count / displayNumber); // creates the pages on the bottom of the screen (number of rows / how many items per page)
  let pageSelected = req.query.page; // Is the selected page number

  //index starts off with zero unless a page is clicked
  if (index || pageSelected) {
    index = pageSelected - 1; // Page Number user selected
  } else {
    index = 0;
  }

  //Sets up Page Numbers
  if (numberOfPages < displayNumber) {
    const books = await Book.findAll({
      limit: 5,
      offset: index * displayNumber,
    });
    res.render("index", { books, title: "Books", numberOfPages });
  } else {
    const books = await Book.findAll({ limit: 5, offset: index });
    res.render("index", { books, title: "Books", numberOfPages });
  }
});
//
//Shows the full list of books
app.post("/books", async (req, res) => {
  const searchQuery = req.body.query;

  if (!searchQuery) {
    // if no value is entered redirect to the main list
    res.redirect("/books");
  }

  const books = await Book.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${searchQuery}%`,
        },
        author: {
          [Op.like]: `%${searchQuery}%`,
        },
        genre: {
          [Op.like]: `%${searchQuery}%`,
        },
        year: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
    }, // end of where clause
  });

  res.render("index", { books, title: "Books" });
});

/////////////////////////////
//     ERROR HANDLING      //
/////////////////////////////

// error catch
app.use((req, res, next) => {
  console.log("DEBUG: You've hit the error catch");
  const err = new Error("Generic Error: Page Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.log("DEBUG: THIS IS THE 404 ERROR");
    err.status = 404;
    err.message = "Sorry, Page Not Found. Please Turn Off and Back On Again";
    res.status(err.status).render("error", { error: err });
  } else {
    err.status = 500;
    err.message = "My apologies! Seems I've misplaced my server!";
    console.log("DEBUG: THIS IS THE 500 ERROR");
    res.status(err.status).render("error", { error: err });
  }
});

module.exports = app;
