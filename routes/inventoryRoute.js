// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const inventoryController = require("../controllers/inventoryController");
const inventoryValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildInventory));
// Route to build vehicle details view
router.get("/detail/:inv_id", utilities.handleErrors(inventoryController.buildInventoryDetails));
// Route to build edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.buildUpdateInventory));
// Route to build delete inventory view
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.buildDeleteInventory));
// Route to build inventory management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.buildManagement));
// Route to build add classification view
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.buildAddClassification));
// Route to build add inventory view
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.buildAddInventory));
// Route to handle inventory JSON response
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(inventoryController.getInventory));
// Route to build gallery by inv_id view
router.get("/gallery", utilities.handleErrors(inventoryController.buildGallery));
// Process new classification
router.post(
    '/add-classification',
    inventoryValidate.classificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(inventoryController.addClassification));
// Process new inventory
router.post(
    '/add-inventory',
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryData,
    utilities.handleErrors(inventoryController.addInventory));
// Process update inventory
router.post(
    '/update-inventory',
    inventoryValidate.inventoryUpdateRules(),
    inventoryValidate.checkInventoryUpdateData,
    utilities.handleErrors(inventoryController.updateInventory));
// Process delete inventory
router.post(
    '/delete-inventory',
    utilities.handleErrors(inventoryController.deleteInventory));

module.exports = router;
