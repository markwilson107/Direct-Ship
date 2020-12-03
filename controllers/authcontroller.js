// MODULE EXPORTS
var exports = module.exports = {}
var db = require("../models");
var moment = require('moment'); // require

// Signup process
exports.signup = function (request, result) {
    let message = request.flash('error');
    result.render('signup', { error: message });
}

// Login process
exports.signin = function (request, result) {
    let message = request.flash('error');
    result.render('signin', { error: message });
}

// Inactive account
exports.inactive = function (request, result) {

    request.session.destroy(function (error) {
        result.render('inactive');
    });
}

// Logout process
exports.logout = function (request, result) {

    request.session.destroy(function (error) {
        result.redirect('/');
    });
}

// Logged in dashboard
exports.dashboard = function (request, result) {
    db.Request.findAll({
        include: [db.Freightmethod, db.User, db.Status]
    }).then(function (data) {
        // Check if string is empty and return accordingly (for both object and string)
        function isEmpty(returnObj, string) {
            if (string === "" || string === "[{}]") {
                if (returnObj === true) {
                return [];
                } else {
                return "[]";
                }
            } else {
                if (returnObj === true) {
                    return JSON.parse(string);
                } else {
                    return string;
                }
            }
        }
        const requestData = data.map(row => ({
            id: row.id,
            requestBranch: row.requestingBranch,
            requireBranch: row.requiringBranch,
            ibt: row.ibt,
            proforma: row.proforma,
            branchInvoice: row.branchInvoice,
            parts: row.parts,
            freightCost: row.freightCostAllocation,
            notes: isEmpty(true ,row.notes),
            rawNotes: isEmpty(false ,row.notes),
            reqOn: moment(row.createdAt).format("MMM Do YYYY"),
            customerName: row.customerName,
            customerContact: row.customerContact,
            customerPhone: row.customerPhone,
            customerAddress: row.customerAddress,
            freightMethod: row.Freightmethod.freightMethod,
            freightAcc: row.freightAcc,
            status: row.Status.status,
            reqBy: `${row.User.firstname} ${row.User.lastname}`
        }));
        result.render('dashboard', { layout: 'backend', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}` });
    });

}

// Access users table
exports.users = function (request, result) {
    result.render('users', { layout: 'users', admin: checkAdmin(request.user.role) });
}

// Access new request page
exports.newrequest = function (request, result) {

    // Send current logged in user id to new request form
    let currentUsedId = request.user.id;

    db.Freightmethod.findAll().then(function (data) {
        result.render('newrequest', { layout: 'newrequest', request: data, admin: checkAdmin(request.user.role), userId: currentUsedId });
    });
}

// Check if user is an administrator
function checkAdmin(role) {
    let adminCheck = false;
    if (role == "admin") {
        adminCheck = true;
    }
    return adminCheck;
}
