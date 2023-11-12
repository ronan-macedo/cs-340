/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv");
const app = express();
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");

/* ***********************
 * Routes
 *************************/
env.config();
app.use(require("./routes/static"));
app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));
app.set("layout", "./layouts/layout"); // not at views root

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Error route
app.get("/error", utilities.handleErrors(baseController.InternalServerError));

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"));

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';  
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    pagecss: false,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;
const appMessage = (port || host) ?
  `app listening on http://${host}:${port}` :
  "app is up and running";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(appMessage);
});
