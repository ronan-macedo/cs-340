const utilities = require("../utilities");
// Define home scope css
const homeCss = "home";

const baseController = {};

baseController.buildHome = async (req, res) => {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav, pagecss: homeCss, });
}

baseController.InternalServerError = async (req, res) => {
    res.render("index", { title: "Home", nav, pagecss: homeCss, });
}

module.exports = baseController;
