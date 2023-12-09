const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const accountCss = "account";
const validate = {};

/**
 * Registration validation rules 
 */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email.");
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
}

/**
 * Login validation rules 
 */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
}

/**
 * Update profile validation rules 
 */
validate.updateProfileRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // valid email is required
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const { account_id } = req.body;
                const existingAccount = await accountModel.checkExistingEmailByUser(account_email);
                if (existingAccount && existingAccount.account_id !== parseInt(account_id)) {
                    throw new Error("Email belongs to another user. Please choose different email.");
                }
            }),
    ];
}

/**
 * Change password validation rules 
 */
validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
}

/**
 * Check data and return errors or continue to registration
 */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.status(400).render("./account/register", {
            errors,
            title: "Registration",
            nav,
            pagecss: accountCss,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to login
 */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.status(400).render("./account/login", {
            errors,
            title: "Login",
            nav,
            pagecss: accountCss,
            account_email,
        });
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to update password
 */
validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const accountData = await accountModel.getAccountByAccountId(account_id);
        res.status(400).render("./account/account-update", {
            title: "Account Update",
            nav,
            pagecss: accountCss,
            errors: errors,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: account_id,
        });
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to update profile
 */
validate.checkUpdateProfileData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("./account/account-update", {
            title: "Account Update",
            nav,
            pagecss: accountCss,
            errors: errors,
            account_firstname: account_firstname,
            account_lastname: account_lastname,
            account_email: account_email,
            account_id: account_id,
        });
        return;
    }
    next();
}

module.exports = validate;
