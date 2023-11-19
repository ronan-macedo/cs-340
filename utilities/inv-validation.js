const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name) => {
                const classification = await invModel.checkExistingClassification(classification_name);
                if (classification) {
                    throw new Error("Classification exists. Please choose other classification name.");
                }
            }),
    ];
}

validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a manufactorer name."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a model name."),

        body("inv_year")
            .notEmpty()
            .withMessage("Please provide a year."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a image path."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .notEmpty()
            .withMessage("Please provide a price."),

        body("inv_miles")
            .notEmpty()
            .withMessage("Please provide miles."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a color name."),

        body("classification_id")
            .notEmpty()
            .withMessage("Please provide a classification."),
    ];
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            pagecss: "inv",
            classification_name,
        });
        return;
    }
    next();
}

validate.checkInventoryData = async (req, res, next) => {
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
        classification_id
    } = req.body;

    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let select = await utilities.buildSelectClassification();

        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            pagecss: "inv",
            selectClassification: select,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
}

module.exports = validate;