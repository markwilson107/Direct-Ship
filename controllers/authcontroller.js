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
    db.Request.findAll({}).then(function(data) {
        result.render('dashboard', {layout: 'backend', request: data});
    });
    
}

exports.users = function (request, result) {
    result.render('users', {layout: 'users'});
}