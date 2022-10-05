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
