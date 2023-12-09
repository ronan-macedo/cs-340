const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const galleryController = require("../controllers/galleryController");

// Route to build gallery management
router.get(
    "/:inv_id",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(galleryController.buildGalleryManagement));

router.get(
    "/images/getImages/:inv_id",
    utilities.handleErrors(galleryController.getImages));

router.post(
    "/images/addImage",    
    utilities.handleErrors(galleryController.addImage));

router.post(
    "/images/deleteImage/:gallery_id",
    utilities.handleErrors(galleryController.deleteImage));

module.exports = router;