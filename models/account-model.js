const pool = require("../database/");
const accountModel = {};

/**
 * Register new account
 */
accountModel.registerAccount = async (account_firstname, account_lastname, account_email, account_password) => {
    try {
        const sql = `INSERT INTO public.account 
            (account_firstname, 
            account_lastname, 
            account_email, 
            account_password, 
            account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Check for existing email  
 */
accountModel.checkExistingEmail = async (account_email) => {
    try {
        const sql = "SELECT * FROM public.account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);
        return email.rowCount;
    } catch (error) {
        throw new Error("No matching email found");
    }
}

/**
 * Check for existing email by user
 */
accountModel.checkExistingEmailByUser = async (account_email) => {
    try {
        const sql = "SELECT account_id, account_email FROM public.account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);
        return email.rows[0];
    } catch (error) {
        throw new Error("No matching email found");
    }
}

/**
 * Return account data using email address
 */
accountModel.getAccountByEmail = async (account_email) => {
    try {
        const result = await pool.query(
            `SELECT 
                account_id, 
                account_firstname, 
                account_lastname, 
                account_email, 
                account_type, 
                account_password 
            FROM public.account 
            WHERE account_email = $1`,
            [account_email]);
        return result.rows[0];
    } catch (error) {
        throw new Error("No matching email found");
    }
}

/**
 * Return account data using email address
 */
accountModel.getAccountByAccountId = async (account_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                account_id, 
                account_firstname, 
                account_lastname, 
                account_email,
                account_type            
            FROM public.account 
            WHERE account_id = $1`,
            [account_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error("No matching account found");
    }
}

/**
 * Update profile info
 */
accountModel.updateProfile = async (account_firstname, account_lastname, account_email, account_id) => {
    try {
        const sql = `UPDATE public.account
        SET
        account_firstname = $1,
        account_lastname = $2,
        account_email = $3
        WHERE
        account_id = $4
        RETURNING *`;
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Update profile info
 */
accountModel.updatePassword = async (account_password, account_id) => {
    try {
        const sql = `UPDATE public.account
        SET
        account_password = $1
        WHERE
        account_id = $2
        RETURNING *`;
        return await pool.query(sql, [account_password, account_id]);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = accountModel;