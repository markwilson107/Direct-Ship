// DEPENDENCIES
const authController = require('../controllers/authcontroller.js');

// MODULE EXPORTS
module.exports = function (app, passport) {

    // LOGIN PROCESS ROUTES
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/*', isLoggedIn, authController.dashboard);

    // PRIMARY DASHBOARD
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    // SIGNUP POST
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));

    // LOGIN POST
    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',    
            failureRedirect: '/signin'
        }    
    ));

    // CHECK IF LOGGED IN
    function isLoggedIn(request, response, next) {
 
        if (request.isAuthenticated())         
            return next();
             
            response.redirect('/signin');     
    }
}