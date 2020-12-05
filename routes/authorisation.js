// DEPENDENCIES
const authController = require('../controllers/authcontroller.js');
const db = require("../models");

// MODULE EXPORTS
module.exports = function (app, passport) {

    // LOGIN PROCESS ROUTES
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/inactive', isLoggedIn, authController.inactive);

    // PRIMARY DASHBOARD
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    // ARCHIVED POSTS
    app.get('/archive', isLoggedIn, authController.archivedRequests);

    // USERS DASHBOARD
    app.get("/api/users", isAdmin, function (request, res) {

        console.log("GETTING USERS");

        db.User.findAll({}).then(function (results) {
            res.json(results);
        });
    });

    app.get("/api/countrequests", isLoggedIn, function(request,res){
        
        db.Request.findAndCountAll({}).then(function (results) {
            res.json(results.count);
        })
    })

    app.get('/users', isAdmin, authController.users);

    // ALL OTHER PAGES
    app.get('/newrequest', isLoggedIn, authController.newrequest);
    app.get('/*', isLoggedIn, authController.dashboard);

    // SIGNUP POST
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/inactive',
        failureRedirect: '/signup',
        failureFlash: true
    }
    ));

    // LOGIN POST
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    }
    ));

    // CHECK IF LOGGED IN
    function isLoggedIn(request, response, next) {
        if (request.user) {

            if (request.isAuthenticated() && request.user.status == "active") {

                return next();
            }
            else {
                if (request.user.status == "inactive") {
                    request.session.destroy(function (error) {
                        response.render('inactive');
                    });
                }
                else {
                    response.redirect('/signin');
                }
            }
        }
        else {
            response.redirect('/signin');
        }
    }

    // CHECK IF USER IS AN ADMINISTRATOR
    function isAdmin(request, response, next) {
        if (request.user) {

            if (request.isAuthenticated() && request.user.status == "active" && request.user.role == "admin") {

                return next();
            }
            else {
                if (request.user.status == "inactive") {
                    request.session.destroy(function (error) {
                        response.render('/signin');
                    });
                }
                else {
                    response.redirect('/dashboard');
                }
            }
        }
        else {
            response.redirect('/signin');
        }
    }
}