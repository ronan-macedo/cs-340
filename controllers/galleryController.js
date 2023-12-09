const galleryModel = require("../models/gallery-model");
const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');
const galleryCss = "gallery";

const galleryController = {};

/**
 * Build build gallery by inv_id view
 */
galleryController.buildGalleryManagement = async (req, res) => {
    const inv_id = req.params.inv_id;
    const addDisable = await galleryModel.countImages(inv_id) >= 3;
    const inventory = await inventoryModel.getInventoryByInvId(inv_id);
    let title = `${inventory.inv_make} ${inventory.inv_model} Gallery`;
    let nav = await utilities.getNav();
    res.render("./gallery/gallery-management", {
        title: title,
        nav,
        pagecss: galleryCss,
        inventory: inventory,
        errors: null,
        addDisable: addDisable
    });
}

galleryController.getImages = async (req, res) => {
    const inv_id = parseInt(req.params.inv_id);

    try {
        const images = await galleryModel.getImages(inv_id);
        return res.status(200).json(images);
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

galleryController.addImage = async (req, res) => {
    const { inv_id } = req.body;

    try {
        if (!req.files) {
            req.flash(
                "notice",
                "Please, provide an image."
            );

            res.status(400).redirect(`/gallery/${inv_id}`);
            return;
        }

        let fileExtension = req.files.gallery_image.name.split('.').pop();
        const validExtensions = ["jpg", "png", "gif"];

        if (!validExtensions.includes(fileExtension)) {
            req.flash(
                "notice",
                "Please provide images in jpg, png, or gif format."
            );
            res.status(400).redirect(`/gallery/${inv_id}`);
            return;
        }

        const image = req.files.gallery_image;
        const imageIdentifier = uuidv4();
        gallery_image = `/images/gallery/${imageIdentifier}.png`;

        const result = await galleryModel.addImage(gallery_image, inv_id);

        if (result) {
            await sharp(image.data)
                .resize({ width: 500, height: 320 })
                .toFormat("png")
                .toFile("./public" + gallery_image);

            res.status(201).redirect(`/gallery/${inv_id}`);
        } else {
            req.flash(
                "notice",
                "An unexpected error occurred while adding the image."
            );
            res.status(400).redirect(`/gallery/${inv_id}`);
        }
    } catch (error) {
        req.flash("notice", "Sorry, add image failed.");
        const isAddEnable = await galleryModel.countImages(inv_id) <= 3;
        const inventory = await inventoryModel.getInventoryByInvId(inv_id);
        let title = `${inventory.inv_make} ${inventory.inv_model} Gallery`;
        let nav = await utilities.getNav();
        res.render("./gallery/gallery-management", {
            title: title,
            nav,
            pagecss: galleryCss,
            inventory: inventory,
            errors: null,
            isAddEnable: isAddEnable
        });
    }
}

galleryController.deleteImage = async (req, res) => {
    const gallery_id = parseInt(req.params.gallery_id);

    try {
        await deleteImagesFromDirectory(gallery_id);

        const result = await galleryModel.deleteImage(gallery_id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ errors: ["An unexpected error occurred while deleting the image."] });
        }
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

/**
 * Get and delete images from directory
 */
const deleteImagesFromDirectory = async (gallery_id) => {
    const imagePath = await galleryModel.getImage(gallery_id);
    let gallery_image = imagePath.gallery_image;

    utilities.deleteImage(gallery_image);
}

module.exports = galleryController;