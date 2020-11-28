// DEPENDENCIES
const bCrypt = require('bcrypt-nodejs');

// MODULE EXPORTS
module.exports = function (passport, user) {

    // Create the User Strategy
    let User = user;
    let LocalStrategy = require('passport-local').Strategy;

    // Add the user to the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Return the user from the session
    passport.deserializeUser(function (id, done) {

        User.findById(id).then(function (user) {

            if (user) {
                done(null, user.get());
            }
            else {
                done(user.errors, null);
            }
        });
    });

    // Create local signup for Passport
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

        function (request, email, password, done) {

            // Create an encrypted password using bcrypt
            let generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            // Find an existing user
            User.findOne({ where: { email: email }}).then(function (user) {

                // If this user already exists, error
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken!'
                    });
                } 
                // Otherwise create user
                else {

                    let userPassword = generateHash(password);

                    let data = {
                        email: email,
                        password: userPassword,
                        firstname: request.body.firstname,
                        lastname: request.body.lastname
                    };

                    // Create the user in the database
                    User.create(data).then(function (newUser, created) {

                        // New User not created
                        if (!newUser) {
                            return done(null, false);
                        }

                        // New User created
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    // Create local signin for Passport
    passport.use('local-signin', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true 
        },

        function (request, email, password, done) {

            let User = user;

            // Check password is valid
            let isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }         

            // Check if user exists
            User.findOne({ where: { email: email }}).then(function (user) {

                // Check if user does not exist
                if (!user) {
                    return done(null, false, {
                        message: 'User does not exist!'
                    });
                }

                // Check if password is correct
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password!'
                    });
                }

                // Check if user is active
                if (user.status != "active"){
                    return done(null, false, {
                        message: 'Inactive user!'
                    });
                }

                // Return the user's info
                let userinfo = user.get();
                return done(null, userinfo);

            }).catch(function (error) {

                console.log(`${error}`);

                // Return an error if signin failed
                return done(null, false, {
                    message: 'Something went wrong with your sign in!'
                });
            });
        }
    ));
}