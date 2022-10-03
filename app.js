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
//     ERROR FUNCTIONS     //
/////////////////////////////
// catch 404 and forward to error handler
(async () => {
  try {
    await Sequelize.sync();
    await Sequelize.authenticate();
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

/////////////////////////////
//     ERROR HANDLING      //
/////////////////////////////
app.use((req, res, next) => {
  console.log("DEBUG: You've hit the error catch");
  const err = new Error("Generic Error: Page Not Found");
  res.status(404);
  next(err);
});

app.use((err, req, res) => {
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

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//   // render the page
//   // if i dont render line 43, doesnt hit the error catch on index.js :(
//   res.render("error404");
// });

module.exports = app;
