const pool = require("../database/");
const galleryModel = {};

galleryModel.getImages = async (inv_id) => {
    try {
        const sql = `SELECT * 
            FROM public.gallery
            WHERE inv_id = $1`;
        const data = await pool.query(sql, [inv_id]);
        return data.rows;
    } catch (error) {
        throw new Error(`getImages error ${error}`);
    }
}

galleryModel.getImage = async (gallery_id) => {
    try {
        const sql = `SELECT * 
            FROM public.gallery
            WHERE gallery_id = $1`;
        const data = await pool.query(sql, [gallery_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`getImage error ${error}`);
    }
}

galleryModel.addImage = async (gallery_image, inv_id) => {
    try {
        const sql = `INSERT INTO public.gallery
            (gallery_image, inv_id)
            VALUES ($1, $2)
            RETURNING *`;
        const data = await pool.query(sql, [gallery_image, inv_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`addImage error ${error}`);
    }
}

galleryModel.deleteImage = async (gallery_id) => {
    try {
        const sql = `DELETE FROM public.gallery
            WHERE gallery_id = $1
            RETURNING *`;
        const data = await pool.query(sql, [gallery_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`deleteImage error ${error}`);
    }
}

galleryModel.countImages = async (inv_id) => {
    try {
        const sql = `SELECT * 
            FROM public.gallery
            WHERE inv_id = $1`;
        const data = await pool.query(sql, [inv_id]);
        return data.rowCount;
    } catch (error) {
        throw new Error(`countImages error ${error}`);
    }
}

module.exports = galleryModel;