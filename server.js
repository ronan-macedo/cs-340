/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));
app.set("layout", "./layouts/layout"); // not at views root

// Index route
app.get("/", (req, res) => {
  res.render("index", { title: "Home", pagecss: "home" });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`);
});
