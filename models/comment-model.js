const pool = require("../database/");
const helper = require("../utilities/comment-helper");
const commentModel = {};

commentModel.getComments = async (inv_id) => {
    try {
        const sql = `SELECT 
            c.*, 
            a.account_firstname, 
            a.account_lastname
            FROM public.comment AS c
            INNER JOIN public.account a 
            ON c.account_id = a.account_id
            WHERE c.inv_id = $1
            ORDER BY comment_createdate ASC`;
        const data = await pool.query(sql, [inv_id]);
        return data.rows;
    } catch (error) {
        throw new Error(`getComments error ${error}`);
    }
}

commentModel.addComment = async (comment_text, account_id, inv_id) => {
    try {
        const date = helper.getTimestampUTC();
        const sql = `INSERT INTO public.comment
            (comment_text, comment_createdate , account_id, inv_id)
            VALUES
            ($1, TO_TIMESTAMP($2), $3, $4) RETURNING *`;
        const data = await pool.query(sql, [comment_text, date, account_id, inv_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`addComment error ${error}`);
    }
}

commentModel.updateComment = async (comment_text, comment_id) => {
    try {
        const date = helper.getTimestampUTC();
        const sql = `UPDATE public.comment
            SET
            comment_text = $1,
            comment_updatedate = TO_TIMESTAMP($2)
            WHERE comment_id = $3
            RETURNING *`;
        const data = await pool.query(sql, [comment_text, date, comment_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`updateComment error ${error}`);
    }
}

commentModel.deleteComment = async (comment_id) => {
    try {
        const sql = `DELETE FROM public.comment
            WHERE comment_id = $1
            RETURNING *`;
        const data = await pool.query(sql, [comment_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error(`updateComment error ${error}`);
    }
}

module.exports = commentModel;