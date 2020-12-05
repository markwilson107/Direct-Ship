// MODULE EXPORTS
var exports = module.exports = {}
var db = require("../models");
var moment = require('moment'); // require

const theBranches = ["Albany","Bunbury","Forrestfield","Geraldton","Guildford","Port Hedland","Spearwood"]

// Map data function
function mapData(dataInput) {
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
    return dataInput.map(row => ({
        id: row.id,
        requestBranch: theBranches[row.requestingBranch-1],
        requireBranch: theBranches[row.requiringBranch-1],
        ibt: row.ibt,
        proforma: row.proforma,
        branchInvoice: row.branchInvoice,
        parts: row.parts,
        freightCost: row.freightCostAllocation,
        notes: isEmpty(true, row.notes),
        rawNotes: isEmpty(false, row.notes),
        reqOn: moment(row.createdAt).format("MMM Do YYYY"),
        customerName: row.customerName,
        customerContact: row.customerContact,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        freightMethod: row.Freightmethod.freightMethod,
        freightAcc: row.freightAccount,
        status: row.Status.status,
        statusId: row.Status.id,
        reqBy: `${row.User.firstname} ${row.User.lastname}`
    }));
}

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
        include: [db.Freightmethod, db.User, db.Status],
        where: { statusId: { $not: '4' } },
        order: [['StatusId', 'ASC']],
    }).then(function (data) {
        let requestData = mapData(data);
        result.render('dashboard', { layout: 'backend', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
    });

}

// Access users table
exports.users = function (request, result) {
    result.render('users', { layout: 'users', admin: checkAdmin(request.user.role) });
}

// Access new request page
exports.newrequest = function (request, result) {

    // Send current logged in user id to new request form
    db.Freightmethod.findAll().then(function (data) {
        result.render('newrequest', { layout: 'newrequest', request: data, admin: checkAdmin(request.user.role), currentUser: `${request.user.firstname} ${request.user.lastname}`, currentUserId: `${request.user.id}` });
    });
}

// Access archived requests page
exports.archivedRequests = function (request, result) {
    db.Request.findAll({
        include: [db.Freightmethod, db.User, db.Status],
        where: { statusId: '4' },
        order: [['StatusId', 'ASC']],
    }).then(function (data) {
        let requestData = mapData(data);
        result.render('archive', { layout: 'backend', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
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