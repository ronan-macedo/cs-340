const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");
const sharp = require("sharp");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// Define inventory scope css
const inventoryCss = "inv";
const inventoryController = {};

/**
 * Build inventory view by classification_id
 */
inventoryController.buildInventory = async (req, res) => {
    const classification_id = req.params.classificationId;
    const data = await inventoryModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = await inventoryModel.getClassificationName(classification_id);
    let title = `${className} vehicles`;
    res.render("./inventory/classification", {
        title: title,
        nav,
        grid,
        pagecss: inventoryCss,
    });
}

/**
 * Build vehicle detail by inv_id view 
 */
inventoryController.buildInventoryDetails = async (req, res) => {
    const inv_id = req.params.inv_id;
    const loggedin = res.locals.loggedin;
    const account = res.locals.accountData ? res.locals.accountData: null;
    const data = await inventoryModel.getInventoryByInvId(inv_id);
    const details = await utilities.buildVehicleDetails(data, loggedin, account);
    let nav = await utilities.getNav();
    const title = `${data.inv_make} ${data.inv_model} Details`;
    res.render("./inventory/details", {
        title: title,
        nav,
        details,
        pagecss: inventoryCss,
    });
}

/**
 * Build build gallery by inv_id view
 */
inventoryController.buildGallery = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("./inventory/gallery", {
        title: "Gallery",
        nav,
        pagecss: inventoryCss,
        errors: null,
    });
}

/**
 * Build vehicle detail by inv_id view 
 */
inventoryController.buildManagement = async (req, res) => {
    let nav = await utilities.getNav();
    let select = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        pagecss: inventoryCss,
        selectClassification: select,
        errors: null,
    });
}

/**
 * Build add classification view 
 */
inventoryController.buildAddClassification = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        pagecss: inventoryCss,
        errors: null,
    });
}

/**
 * Build add inventory view 
 */
inventoryController.buildAddInventory = async (req, res) => {
    let nav = await utilities.getNav();
    let select = await utilities.buildSelectClassification(null);
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        pagecss: inventoryCss,
        errors: null,
        selectClassification: select
    });
}

/**
 * Build add inventory view 
 */
inventoryController.buildUpdateInventory = async (req, res) => {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await inventoryModel.getInventoryByInvId(inv_id);
    const select = await utilities.buildSelectClassification(itemData.classification_id);
    const title = `Edit ${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/update-inventory", {
        title: title,
        nav,
        selectClassification: select,
        pagecss: inventoryCss,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: parseInt(itemData.inv_year),
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_price: parseFloat(itemData.inv_price),
        inv_miles: parseInt(itemData.inv_miles),
        inv_color: itemData.inv_color,
    });
}

/**
 * Build add inventory view 
 */
inventoryController.buildDeleteInventory = async (req, res) => {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await inventoryModel.getInventoryByInvId(inv_id);
    const title = `Delete ${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-inventory", {
        title: title,
        nav,
        pagecss: inventoryCss,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: parseInt(itemData.inv_year),
        inv_price: parseFloat(itemData.inv_price),
        inv_miles: parseInt(itemData.inv_miles),
    });
}

/**
 * Add new classification
 */
inventoryController.addClassification = async (req, res) => {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    try {
        const result = await inventoryModel.addClassification(classification_name);

        if (result) {
            req.flash(
                "success",
                `New category added ${classification_name}`);

            res.status(201).redirect("/inv/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, add classification failed.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            pagecss: inventoryCss,
            errors: null,
            classification_name,
        });
    }
}

/**
 * Add new inventory
 */
inventoryController.addInventory = async (req, res) => {
    let nav = await utilities.getNav();

    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body;

    try {
        let inv_image = "/images/vehicles/no-image.png"
        let inv_thumbnail = "/images/vehicles/no-image-tn.png";

        if (req.files) {
            let fileExtension = req.files.inv_image.name.split('.').pop();
            const validExtensions = ["jpg", "png", "gif"];

            if (!validExtensions.includes(fileExtension)) {
                throw new Error("Please provide images in jpg, png, or gif format.");
            }

            const image = req.files.inv_image;
            const imageIdentifier = uuidv4();
            inv_image = `/images/vehicles/${imageIdentifier}.png`;
            inv_thumbnail = `/images/vehicles/${imageIdentifier}-tn.png`;

            await sharp(image.data)
                .resize({ width: 500, height: 320 })
                .toFormat("png")
                .toFile("./public" + inv_image);
            await sharp(image.data)
                .resize({ width: 200, height: 150 })
                .toFormat("png")
                .toFile("./public" + inv_thumbnail);
        }

        const result = await inventoryModel.addInventory(
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
                `New inventory added ${inv_make} ${inv_model}`
            );

            res.status(201).redirect("/inv/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, add inventory failed.");
        let select = await utilities.buildSelectClassification(classification_id);
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            pagecss: inventoryCss,
            errors: null,
            selectClassification: select,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        });
    }
}

/**
 * Update inventory
 */
inventoryController.updateInventory = async (req, res) => {
    let nav = await utilities.getNav();

    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        inv_id } = req.body;

    try {
        const imagePath = await inventoryModel.getImagesPath(inv_id);
        let inv_image = imagePath.inv_image;
        let inv_thumbnail = imagePath.inv_thumbnail;

        if (req.files) {
            let fileExtension = req.files.inv_image.name.split('.').pop();
            const validExtensions = ["jpg", "png", "gif"];

            if (!validExtensions.includes(fileExtension)) {
                throw new Error("Please provide images in jpg, png, or gif format.");
            }

            await deleteImagesFromDirectory(inv_id);

            const image = req.files.inv_image;
            const imageIdentifier = uuidv4();
            inv_image = `/images/vehicles/${imageIdentifier}.png`;
            inv_thumbnail = `/images/vehicles/${imageIdentifier}-tn.png`;

            await sharp(image.data)
                .resize({ width: 500, height: 320 })
                .toFormat("png")
                .toFile("./public" + inv_image);
            await sharp(image.data)
                .resize({ width: 200, height: 150 })
                .toFormat("png")
                .toFile("./public" + inv_thumbnail);
        }

        const result = await inventoryModel.updateInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id);

        if (result) {
            req.flash(
                "success",
                `${inv_make} ${inv_model} updated.`
            );

            res.status(200).redirect("/inv/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, update inventory failed.");
        const select = await utilities.buildSelectClassification(classification_id);
        const title = `Edit ${inv_make} ${inv_model}`;
        res.status(500).render("./inventory/update-inventory", {
            title: title,
            nav,
            selectClassification: select,
            pagecss: inventoryCss,
            errors: null,
            inv_id: inv_id,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_year: parseInt(inv_year),
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: parseFloat(inv_price),
            inv_miles: parseInt(inv_miles),
            inv_color: inv_color,
        });
    }
}

/**
 * Delete inventory
 */
inventoryController.deleteInventory = async (req, res) => {
    const { inv_make, inv_model, inv_id } = req.body;

    try {
        await deleteImagesFromDirectory(inv_id);

        const result = await inventoryModel.deleteInventory(parseInt(inv_id));

        if (result) {
            req.flash(
                "success",
                `${inv_make} ${inv_model} Deleted.`
            );

            res.status(200).redirect("/inv/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, delete inventory failed.");
        const itemName = `${inv_make} ${inv_model}`;
        const itemData = await inventoryModel.getInventoryByInvId(inv_id);
        let title = "Delete " + itemName;
        res.status(500).render("./inventory/delete-inventory", {
            title: title,
            nav,
            pagecss: inventoryCss,
            errors: null,
            inv_id: itemData.inv_id,
            nv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: parseInt(itemData.inv_year),
            inv_price: parseFloat(itemData.inv_price),
            inv_miles: parseInt(itemData.inv_miles),
        });
    }
}

/**
 * Return Inventory by Classification As JSON 
 */
inventoryController.getInventory = async (req, res) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await inventoryModel.getInventoryByClassificationId(classification_id);

    if (invData.length > 0) {
        return res.status(200).json(invData);
    } else {
        return res.status(404).json();
    }
}

const deleteImagesFromDirectory = async (inv_id) => {
    const imagePath = await inventoryModel.getImagesPath(inv_id);
    let inv_image = imagePath.inv_image;
    let inv_thumbnail = imagePath.inv_thumbnail;

    if (inv_image != "/images/vehicles/no-image.png") {
        deleteImage(inv_image);
    }

    if (inv_thumbnail != "/images/vehicles/no-image-tn.png") {
        deleteImage(inv_thumbnail);
    }
}

const deleteImage = (imagePath) => {
    fs.unlink("./public" + imagePath, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
}

module.exports = inventoryController;