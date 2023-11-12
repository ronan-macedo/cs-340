const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async (req, res, next) => {
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

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async (data) => {
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
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
}

Util.buildVehicleDetails = async (data) => {
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;