const invModel = require("../models/inventory-model");
const util = {};

/**
 * Constructs the nav HTML unordered list 
 */
util.getNav = async (req, res, next) => {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
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
            grid += '<li class="inv-item">';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors"></a>';
            grid += '<div class="namePrice">';
            grid += '<h2>';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
            grid += '</h2>';
            grid += '<span class="inv-price">$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
            grid += '</div>';
            grid += '</li>';
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
util.buildVehicleDetails = async (data) => {
    let details = '<div class="vehicle-details">';
    if (data) {
        details += '<h1 class="detail-title">' + data.inv_make + ' ' + data.inv_model + '</h1>';
        details += '<div class="vehicle-hero">';
        details += '<img src="' + data.inv_image + '" alt="Image of '
            + data.inv_make + ' ' + data.inv_model
            + ' on CSE Motors">';
        details += '</div>';
        details += '<div class="vehicle-info">';
        details += '<span>Description:</span>'
        details += '<p>' + data.inv_description + '</p>'
        details += '<span>Year:</span>'
        details += '<p>' + data.inv_year + '</p>'
        details += '<span>Color:</span>'
        details += '<p>' + data.inv_color + '</p>'
        details += '<span>Miles:</span>'
        details += '<p>' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
        details += '<span>Price:</span>'
        details += '<p>$ ' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
        details += '</div>';
        details += '</div>';
    } else {
        details += '<p class="notice">Sorry, no vehicle details found.</p>';
        details += '</div>';
    }
    return details
}

/**
 * Build classifications form select 
 */
util.buildSelectClassification = async () => {
    let data = await invModel.getClassifications();
    let select = '<label for="classification_id"><b>Classification*</b></label><br>';
    select += '<select id="classification_id" name="classification_id">';
    data.rows.forEach((row) => {
        select += '<option value="' +
            row.classification_id +
            '">' +
            row.classification_name +
            '</option>';
    });
    select += '</select><br>';
    return select;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = util;
