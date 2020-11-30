// MODULE EXPORTS
var exports = module.exports = {}

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
    result.render('dashboard', {layout: 'backend'});
}

exports.users = function (request, result) {
    result.render('users', {layout: 'users'});
}

exports.newrequest = function (request, result) {
    console.log("Here 1")
    result.render('newrequest', {layout: 'newrequest'});
}