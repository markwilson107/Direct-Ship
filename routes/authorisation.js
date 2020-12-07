// DEPENDENCIES
const authController = require('../controllers/authcontroller.js');
const db = require("../models");
var moment = require('moment');

const theBranches = ["Albany", "Bunbury", "Forrestfield", "Geraldton", "Guildford", "Port Hedland", "Spearwood"]

// MODULE EXPORTS
module.exports = function (app, passport) {

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
            requestBranch: theBranches[row.requestingBranch - 1],
            requireBranch: theBranches[row.requiringBranch - 1],
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

    // Check if user is an administrator
    function checkAdmin(role) {
        let adminCheck = false;
        if (role == "admin") {
            adminCheck = true;
        }
        return adminCheck;
    }

    // LOGIN PROCESS ROUTES
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/inactive', isLoggedIn, authController.inactive);

    // PRIMARY DASHBOARD
    //app.get('/dashboard', isLoggedIn, authController.dashboard);
    app.get('/dashboard', isLoggedIn, function (request, result) {
        db.Request.findAll({
            include: [db.Freightmethod, db.User, db.Status],
            where: { statusId: { $not: ['5', '6'] } },
            order: [['StatusId', 'ASC']],
        }).then(function (data) {
            const requestData = mapData(data);
            result.render('dashboard', { layout: 'backend', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
        });
    });

    // PRIMARY DASHBOARD WITH REQUEST ID
    app.get('/dashboard/:id', isLoggedIn, function (request, result) {
        db.Request.findAll({
            include: [db.Freightmethod, db.User, db.Status],
            where: { statusId: { $not: ['5', '6'] } },
            order: [['StatusId', 'ASC']],
        }).then(function (data) {
            let requestData = mapData(data);
            result.render('dashboard', { layout: 'backend', request: requestData, requestId: request.params.id, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
        });
    });

    // ARCHIVED POSTS
    app.get('/archive', isLoggedIn, function (request, result) {
        db.Request.findAll({
            include: [db.Freightmethod, db.User, db.Status],
            where: { statusId: ['5', '6'] },
            order: [['StatusId', 'ASC']],
        }).then(function (data) {
            let requestData = mapData(data);
            result.render('archive', { layout: 'archive', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
        });
    });

    // USERS DASHBOARD
    app.get("/api/users", isAdmin, function (request, res) {

        console.log("GETTING USERS");

        db.User.findAll({}).then(function (results) {
            res.json(results);
        });
    });

    app.get("/api/countrequests", isLoggedIn, function (request, res) {

        db.Request.findAndCountAll({}).then(function (results) {
            res.json(results.count);
        })
    })

    app.get('/users', isAdmin, authController.users);

    // ALL OTHER PAGES
    app.get('/newrequest', isLoggedIn, authController.newrequest);
    app.get('/*', isLoggedIn, function (request, result) {
        db.Request.findAll({
            include: [db.Freightmethod, db.User, db.Status],
            where: { statusId: { $not: ['5', '6'] } },
            order: [['StatusId', 'ASC']],
        }).then(function (data) {
            let requestData = mapData(data);
            result.render('dashboard', { layout: 'backend', request: requestData, currentUser: `${request.user.firstname} ${request.user.lastname}`, admin: checkAdmin(request.user.role) });
        });
    });

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