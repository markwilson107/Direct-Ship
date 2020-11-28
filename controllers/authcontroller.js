// MODULE EXPORTS
var exports = module.exports = {}

// Signup process
exports.signup = function (request, result) {
    result.render('signup');
}

// Login process
exports.signin = function (request, result) {
    result.render('signin');
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
    result.render('dashboard', {layout: 'backend'});
}