const inventoryModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
const fs = require('fs');
require("dotenv").config();
const util = {};

/**
 * Constructs the nav HTML unordered list 
 */
util.getNav = async (req, res, next) => {
    let data = await inventoryModel.getClassifications();
    let list = `<ul>
                    <li>
                        <a href="/" title="Home page">Home</a>
                    </li>`;
    data.rows.forEach((row) => {
        list += `<li>        
                    <a href="/inv/type/${row.classification_id}" 
                    title="See our inventory of ${row.classification_name} vehicles">
                    ${row.classification_name}
                    </a>
                </li>`;
    });
    list += "</ul>";
    return list;
}

/**
 * Build the classification view HTML 
 */
util.buildClassificationGrid = async (data) => {
    let grid;
    if (data.length > 0) {
        grid = '<ul class="inv-display">';
        data.forEach(vehicle => {
            grid += `<li class="inv-item">
                        <a href="/inv/detail/${vehicle.inv_id}" 
                            title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                            <img src="${vehicle.inv_thumbnail}" 
                                alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
                        </a>
                        <div class="namePrice">
                            <h2>
                                <a href="/inv/detail/${vehicle.inv_id}" 
                                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                                    ${vehicle.inv_make} ${vehicle.inv_model}
                                </a>
                            </h2>
                            <span class="inv-price">
                                $ ${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}
                            </span>
                        </div>
                    </li>`;
        });
        grid += '</ul>';
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
}

/**
 * Build the vehicle datail view HTML 
 */
util.buildVehicleDetails = async (data, loggedin, account, gallery) => {
    let details = '<div class="details">';
    if (data) {
        details += `<h1 class="detail-title">
                        ${data.inv_make} ${data.inv_model}
                    </h1>
                    <div class="vehicle-details">`;
        if (gallery.length > 0) {
            let numberOfSlides = gallery.length + 1;
            let slideCounter = 1;
            details += `<div class="vehicle-gallery">
                    <div class="vehicle-slides">
                    <div class="number-text">${slideCounter} / ${numberOfSlides}</div>
                    <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
                    </div>`;
            gallery.forEach(image => {
                slideCounter++;
                details += `<div class="vehicle-slides">
                        <div class="number-text">${slideCounter} / ${numberOfSlides}</div>
                        <img src="${image.gallery_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
                    </div>`;
            });
            slideCounter = 1;            
            details += `<span class="prev cursor" onclick="plusSlides(-1)">&#8249;</span>
                <span class="next cursor" onclick="plusSlides(1)">&#8250;</span>`;
            details += `<div class="gallery-row">
                    <div class="column">
                    <img class="dot cursor" src="${data.inv_image}" onclick="currentSlide(${slideCounter})"
                        alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
                </div>`;
            gallery.forEach(image => {
                slideCounter++;
                details += `<div class="column">
                    <img class="dot cursor" src="${image.gallery_image}" onclick="currentSlide(${slideCounter})"
                        alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
                </div>`;
            });
            details += '</div></div>';
        }
        else {
            details += `<div class="vehicle-hero">
                    <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
                </div>`;
        }
        details += `<div class="vehicle-info">
                            <span>Description:</span>
                            <p>${data.inv_description}</p>
                            <span>Year:</span>
                            <p>${data.inv_year}</p>
                            <span>Color:</span>
                            <p>${data.inv_color}</p>
                            <span>Miles:</span>
                            <p>${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
                            <span>Price:</span>
                            <p>$ ${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
                        </div>
                    </div>
                </div>
                <h2>Comments</h2>
                <div id="erros"></div>
                <div class="comment-section">
                <input type="hidden" name="inv_id" id="inv_id" value="${data.inv_id}">`;
        if (loggedin) {
            details += `<label for="comment_text"><b>Add your comment:</b></label><br>
                <textarea name="comment_text" id="comment_text"></textarea><br>
                <input type="hidden" name="account_id" id="account_id" value="${account.account_id}">
                <input type="hidden" name="account_type" id="account_type" value="${account.account_type}">
                <button id="addComment">Add Comment</button>`;
        } else {
            details += `<p class="notice">You must log in to post a comment.</p>`
        }
        details += `<div id="comments"></div>
                </div>
                <p>
                    <a href="/inv/type/${data.classification_id}" 
                        title="See our inventory of ${data.classification_name} vehicles">
                        Back to ${data.classification_name} vehicles
                    </a>
                </p>`;
    } else {
        details += `<p class="notice">Sorry, no vehicle details found.</p>
                </div>`;
    }
    return details;
}

/**
 * Build classifications form select 
 */
util.buildSelectClassification = async (classificationId) => {
    let data = await inventoryModel.getClassifications();
    let select = `<label for="classification_id"><b>Classification*</b></label><br>
        <div class="select">
        <select id="classification_id" name="classification_id">`;
    data.rows.forEach((row) => {
        select += `<option value="${row.classification_id}"`;
        select += parseInt(classificationId) === row.classification_id ? " selected" : "";
        select += `>${row.classification_name}</option>`;
    });
    select += '</select></div><br>';
    return select;
}

/**
 * Build classifications form select 
 */
util.buildClassificationList = async () => {
    let data = await inventoryModel.getClassifications();
    let select = `<select id="classificationList">;
        <option value="0" selected>Categories</option>`;
    data.rows.forEach((row) => {
        select += `<option value="${row.classification_id}">${row.classification_name}</option>`
    });
    select += '</select><br>';
    return select;
}

/**
 * Middleware to check token validity 
 */
util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            (err, accountData) => {
                if (err) {
                    req.flash("Please log in");
                    res.clearCookie("jwt");
                    return res.redirect("/account/login");
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            })
    } else {
        next();
    }
}

/**
 * Middleware to check login
 */
util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next();
    } else {
        req.flash("notice", "Please log in.");
        return res.redirect("/account/login");
    }
}

/**
 * Middleware to check logged user
 */
util.checkLogged = (req, res, next) => {
    if (!res.locals.loggedin) {
        next();
    } else {
        return res.redirect("/account/");
    }
}

/**
 * Middleware to check client permissions
 */
util.checkClientType = (req, res, next) => {
    if (res.locals.accountData.account_type == 'Employee'
        || res.locals.accountData.account_type == 'Admin') {
        next();
    } else {
        return res.redirect("/account/");
    }
}

/**
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling 
 */
util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Delete the image 
 */
util.deleteImage = (imagePath) => {
    fs.unlink("./public" + imagePath, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
}

module.exports = util;
