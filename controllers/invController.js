const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const invcss = "inv";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        pagecss: invcss
    });
}

invCont.buildByInvId = async (req, res, next) => {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleByInvId(inv_id);
    const details = await utilities.buildVehicleDetails(data);
    let nav = await utilities.getNav();
    const vehicleName = data.inv_make + ' ' + data.inv_model;
    res.render("./inventory/details", {
        title: vehicleName + " Details",
        nav,
        details,
        pagecss: invcss
    });
}

module.exports = invCont;