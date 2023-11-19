// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require('../utilities/inv-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build vehicle details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
// Route to build inventory management view
router.get("/management", utilities.handleErrors(invController.buildManagement));
// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildaddClassification));
// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
    '/add-classification',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));
router.post(
    '/add-inventory',
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory));


module.exports = router;
