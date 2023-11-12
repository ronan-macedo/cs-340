const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async (req, res) => {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav, pagecss: "home" });
}

baseController.InternalServerError = async (req, res) => {
    res.render("index", { title: "Home", nav, pagecss: "home" });
}

module.exports = baseController;