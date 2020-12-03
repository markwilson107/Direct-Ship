// MODULE EXPORTS
var exports = module.exports = {}
var db = require("../models");

// Signup process
exports.signup = function (request, result) {
    let message = request.flash('error');
    result.render('signup', {error: message});
}

// Login process
exports.signin = function (request, result) {
    let message = request.flash('error');
    result.render('signin', {error: message});
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
        include: [ db.Customer, db.Freightmethod, db.User]
    }).then(function(data) {
        result.render('dashboard', {layout: 'backend', request: data, admin: checkAdmin(request.user.role)});
    });
}

exports.users = function (request, result) {
    result.render('users', {layout: 'users', admin: checkAdmin(request.user.role)});
}

function checkAdmin(role){
    let adminCheck = false;
    if (role == "admin"){
        adminCheck = true;
    }
    return adminCheck;
}

exports.newrequest = function (request, result) {

    db.Freightmethod.findAll().then(function(data) {
        result.render('newrequest', {layout: 'newrequest', request: data, admin: checkAdmin(request.user.role)});
    });
    // result.render('newrequest', {layout: 'newrequest'});

}