// MODULE EXPORTS
var exports = module.exports = {}
var db = require("../models");

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
// MOVED TO authorisation.js

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
// MOVED TO authorisation.js

// Check if user is an administrator
function checkAdmin(role) {
    let adminCheck = false;
    if (role == "admin") {
        adminCheck = true;
    }
    return adminCheck;
}