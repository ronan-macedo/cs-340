const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const inventoryCss = "inv";
const validate = {};

/**
 * Classification validation rules 
 */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^\w+$/)
            .withMessage("Classification should be single word.")
            .custom(async (classification_name) => {
                const classification = await inventoryModel.checkExistingClassification(classification_name);
                if (classification) {
                    throw new Error("Classification exists. Please choose other classification name.");
                }
            }),
    ];
}

/**
 * Inventory validation rules 
 */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a manufactorer name."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model name."),

        body("inv_year")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a year.")
            .custom(async (inv_year) => {
                const year = parseInt(inv_year);
                if (year < 1870 || year > 2999) {
                    throw new Error("Year should be between 1870 or more. Please choose other year.");
                }
            }),

        body("inv_description")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a description."),        

        body("inv_price")
            .trim()
            .isFloat()
            .withMessage("Please provide a price."),

        body("inv_miles")
            .trim()
            .isFloat()
            .withMessage("Please provide miles."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color name."),

        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Please provide a classification."),
    ];
}

/**
 * Inventory validation rules 
 */
validate.inventoryUpdateRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a manufactorer name."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model name."),

        body("inv_year")
            .trim()
            .isNumeric()
            .withMessage("Please provide a year.")
            .custom(async (inv_year) => {
                const year = parseInt(inv_year);
                if (year < 1870 || year > 2999) {
                    throw new Error("Year should be between 1870 or more. Please choose other year.");
                }
            }),

        body("inv_description")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a description."),        

        body("inv_price")
            .trim()
            .isFloat()
            .withMessage("Please provide a price."),

        body("inv_miles")
            .trim()
            .isFloat()
            .withMessage("Please provide miles."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color name."),

        body("classification_id")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification."),

        body("inv_id")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a inventory identification."),
    ];
}

/**
 * Check data and return errors or continue to add classification
 */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.status(400).render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            pagecss: inventoryCss,
            classification_name,
        });
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to add inventory
 */
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;

    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let select = await utilities.buildSelectClassification(classification_id);

        res.status(400).render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            pagecss: inventoryCss,
            selectClassification: select,
            inv_make,
            inv_model,
            inv_year,
            inv_description,            
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to update inventory
 */
validate.checkInventoryUpdateData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,        
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
    } = req.body;

    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let select = await utilities.buildSelectClassification(classification_id);
        const imagePath = await inventoryModel.getImagesPath(inv_id);
        let inv_image = imagePath.inv_image;

        res.status(400).render("./inventory/update-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            pagecss: inventoryCss,
            selectClassification: select,
            inv_id: inv_id,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_image: inv_image,
            inv_year: parseInt(inv_year),
            inv_description: inv_description,            
            inv_price: parseFloat(inv_price),
            inv_miles: parseInt(inv_miles),
            inv_color: inv_color
        });
        return;
    }
    next();
}

module.exports = validate;