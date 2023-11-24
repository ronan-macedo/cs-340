const pool = require("../database/");
const invModel = {};

/**
 * Get all classification data 
 */
invModel.getClassifications = async () => {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/**
 * Get all inventory items and classification_name by classification_id 
 */
invModel.getInventoryByClassificationId = async (classificationId) => {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classificationId]);
        return data.rows;
    } catch (error) {
        throw new Error("getclassificationsbyid error " + error);
    }
}

/**
 * Get classification_name by classification_id
 */
invModel.getClassificationName = async (classification_id) => {
    try {
        const sql = "SELECT classification_name FROM public.classification WHERE classification_id = $1";
        const data = await pool.query(sql, [classification_id]);
        return data.rows[0].classification_name
    } catch (error) {
        throw new Error("getClassificationName error " + error);
    }
}

/**
 * Get vehicle detail by invId
 */
invModel.getInventoryByInvId = async (invId) => {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            INNER JOIN public.classification AS c 
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`, 
            [invId]);
        return data.rows[0];
    } catch (error) {
        throw new Error("getInventoryByInvId error " + error);
    }
}

/**
 * Check existing classification by classification_name
 */
invModel.checkExistingClassification = async (classification_name) => {
    try {
        const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
        const classification = await pool.query(sql, [classification_name]);
        return classification.rowCount;
    } catch (error) {
        throw new Error("checkExistingClassification error " + error);
    }
}

/**
 * Add new classification
 */
invModel.addClassification = async (classification_name) => {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        throw new Error("addClassification error " + error);
    }
}

/**
 * Add new inventory
 */
invModel.addInventory = async (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id) => {
    try {
        const sql = `INSERT INTO public.inventory 
            (inv_make, inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        return await pool.query(sql, [inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id]);
    } catch (error) {
        throw new Error("addClassification error " + error);
    }
}

/**
 * Update inventory
 */
invModel.updateInventory = async (
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
    inv_id) => {
    try {
        const sql = `UPDATE public.inventory
            SET
            inv_make = $1,
            inv_model = $2,
            inv_year = $3,
            inv_description = $4,
            inv_image = $5,
            inv_thumbnail = $6,
            inv_price = $7,
            inv_miles = $8,
            inv_color = $9,
            classification_id = $10
            WHERE
            inv_id = $11
            RETURNING *`;
        return await pool.query(sql, [inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id]);
    } catch (error) {
        throw new Error("updateInventory error " + error);
    }
}

invModel.deleteInventory = async (inv_id) => {
    try {
        const sql = `DELETE FROM public.inventory
            WHERE inv_id = $1`;
        return await pool.query(sql, [inv_id]);
    } catch (error) {
        throw new Error("deleteInventory error " + error);
    }
}

module.exports = invModel;