// DEPENDENCIES
const authController = require('../controllers/authcontroller.js');

// MODULE EXPORTS
module.exports = function (app, passport) {

    // LOGIN PROCESS ROUTES
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/inactive', isLoggedIn, authController.inactive);
    // app.get('/*', isLoggedIn, authController.dashboard);

    // PRIMARY DASHBOARD
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    // SIGNUP POST
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/inactive',
            failureRedirect: '/signup'
        }
    ));

    // LOGIN POST
    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',    
            failureRedirect: '/signin',
        }    
    ));

    // CHECK IF LOGGED IN
    function isLoggedIn(request, response, next) {
        if (request.user){
            
            if (request.isAuthenticated() && request.user.status == "active"){
                return next();
            }
            else {
                if (request.user.status == "inactive"){
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
}