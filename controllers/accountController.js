const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Define account scope css
const accountCss = "account";
const accountController = {};

/**
 *  Deliver login view
 */
accountController.buildLogin = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("./account/login", {
        title: "Login",
        nav,
        pagecss: accountCss,
        errors: null,
    });
}

/**
 *  Deliver register view
 */
accountController.buildRegister = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("./account/register", {
        title: "Register",
        nav,
        pagecss: accountCss,
        errors: null,
    });
}

/**
 *  Deliver account management view
 */
accountController.buildAccountManagement = async (req, res) => {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const accountData = await accountModel.getAccountByAccountId(account_id);
    res.render("./account/account-management", {
        title: "Account Management",
        nav,
        pagecss: accountCss,
        errors: null,
        accountData,
    });
}

/**
 *  Deliver account management view
 */
accountController.buildAccountUpdate = async (req, res) => {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const accountData = await accountModel.getAccountByAccountId(account_id);
    res.render("./account/account-update", {
        title: "Account Update",
        nav,
        pagecss: accountCss,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    });
}

/**
 *  Register new account
 */
accountController.registerAccount = async (req, res) => {
    let nav = await utilities.getNav();
    const title = "Registration";
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration");
        res.status(500).render("./account/register", {
            title: title,
            nav,
            pagecss: accountCss,
            errors: null,
        });
        return;
    }

    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

        if (regResult) {
            req.flash(
                "success",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            );

            res.status(201).redirect("/account/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, the registration failed");
        res.status(501).render("./account/register", {
            title: title,
            nav,
            pagecss: accountCss,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        });
    }
}

/**
 *  Process login
 */
accountController.accountLogin = async (req, res) => {
    let nav = await utilities.getNav();
    const title = "Login";
    const { account_email, account_password } = req.body;
    let accountData;

    try {
        accountData = await accountModel.getAccountByEmail(account_email);

        if (!accountData) {
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("./account/login", {
                title: title,
                nav,
                errors: null,
                pagecss: accountCss,
                account_email,
            });
            return;
        }
    } catch (error) {
        req.flash("notice", "Sorry, the login failed");
        res.status(501).render("./account/login", {
            title: title,
            nav,
            pagecss: accountCss,
            errors: null,
            account_email,
        });
        return;
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            res.redirect("/account/");
        }
    } catch (error) {
        return new Error('Access Forbidden');
    }
}

/**
 *  Update profile
 */
accountController.updateProfile = async (req, res) => {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;

    try {
        const result = await accountModel.updateProfile(
            account_firstname,
            account_lastname,
            account_email,
            account_id);

        if (result) {
            req.flash(
                "success",
                `Congratulations, ${account_firstname}. Your profile was succefully updated.`
            );

            res.status(200).redirect("/account/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, update profile failed");
        const accountData = await accountModel.getAccountByAccountId(account_id);
        res.status(501).render("./account/account-update", {
            title: "Account Update",
            nav,
            pagecss: accountCss,
            errors: null,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: accountData.account_id,
        });
    }
}

/**
 *  Update password
 */
accountController.updatePassword = async (req, res) => {
    let nav = await utilities.getNav();
    const title = "Account Update";
    const { account_password, account_id } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the update password");
        const account_id = res.locals.accountData.account_id;
        const accountData = await accountModel.getAccountByAccountId(account_id);
        res.status(500).render("./account/account-update", {
            title: title,
            nav,
            pagecss: accountCss,
            errors: null,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: accountData.account_id,
        });
        return;
    }

    try {
        const result = await accountModel.updatePassword(
            hashedPassword,
            account_id);

        if (result) {
            req.flash(
                "success",
                `Congratulations, ${result.rows[0].account_firstname}. Your password was succefully updated.`
            );

            res.status(201).redirect("/account/");
        }
    } catch (error) {
        req.flash("notice", "Sorry, update password failed");
        const account_id = res.locals.accountData.account_id;
        const accountData = await accountModel.getAccountByAccountId(account_id);
        res.status(501).render("./account/account-update", {
            title: title,
            nav,
            pagecss: accountCss,
            errors: null,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: accountData.account_id,
        });
    }
}

/**
 *  Process logout
 */
accountController.accountLogout = async (req, res) => {
    res.clearCookie("jwt");
    return res.redirect("/");
}

module.exports = accountController;
