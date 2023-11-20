const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
// Define inventory scope css
const invcss = "inv";

const invCont = {};

/**
 * Build inventory by classification view 
 */
invCont.buildByClassificationId = async (req, res, next) => {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = await invModel.getClassificationName(classification_id);
    let title = className + " vehicles"
    res.render("./inventory/classification", {
        title: title,
        nav,
        grid,
        pagecss: invcss,
    });
}

/**
 * Build vehicle detail by invId view 
 */
invCont.buildByInvId = async (req, res, next) => {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryByInvId(inv_id);
    const details = await utilities.buildVehicleDetails(data);
    let nav = await utilities.getNav();
    const vehicleName = data.inv_make + ' ' + data.inv_model;
    let title = vehicleName + " Details"
    res.render("./inventory/details", {
        title: title,
        nav,
        details,
        pagecss: invcss,
    });
}

/**
 * Build vehicle detail by invId view 
 */
invCont.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Management",
        nav,
        pagecss: invcss,
    });
}

/**
 * Build add classification view 
 */
invCont.buildaddClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        pagecss: invcss,
        errors: null,
    });
}

/**
 * Build add inventory view 
 */
invCont.buildAddInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let select = await utilities.buildSelectClassification(null);
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        pagecss: invcss,
        errors: null,
        selectClassification: select
    });
}

invCont.addClassification = async (req, res) => {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    const result = await invModel.addClassification(classification_name);

    if (result) {
        req.flash(
            "success",
            `New category added ${classification_name}`
        );
        nav = await utilities.getNav();
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            pagecss: invcss,
        });
    } else {
        req.flash("notice", "Sorry, add classification failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            pagecss: invcss,
            errors: null,
        });
    }
}

invCont.addInventory = async (req, res) => {
    let nav = await utilities.getNav();
    let select = await utilities.buildSelectClassification(null);

    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body;

    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id);

    if (result) {
        req.flash(
            "success",
            `New vehicle added ${inv_make} ${inv_model}`
        );
        nav = await utilities.getNav();
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            pagecss: invcss,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, add inventory failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            pagecss: invcss,
            errors: null,
            selectClassification: select,
        });
    }
}

module.exports = invCont;
