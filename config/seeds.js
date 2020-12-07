// DEPENDENCIES
const faker = require('faker');
const bCrypt = require('bcrypt-nodejs');
var db = require("../models");

// CONSTANT DECLARATIONS FOR SEEDERS
const roles = ["admin", "parts", "warehouse"];
const status = ["active", "inactive"];
const freightcost = ["TCWA", "Customer"];
let userIds = [];

// RANDOM INTEGER FUNCTION
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Use to find out your salt
// console.log(bCrypt.genSaltSync(8));

// CREATE ADMINISTRATOR
let newAdmin = {
    firstname: "TCWA",
    lastname: "Administrator",
    email: "admin@tcwa.com",
    password: bCrypt.hashSync(process.env.DB_PASS + process.env.dbSaltReadable, process.env.dbSalt, null),
    role: "admin",
    status: "active"
}

db.User.create(newAdmin).then(function (newAdmin, created) {
    console.log(`${newAdmin.id} -> Admin ${newAdmin.email} successfully created.`)
    userIds.push(newAdmin.id);

    // IF SEEDERS DONE, CALL NEXT FUNCTION
    createUsers();
}).catch(function (error) {
    console.log("Error: couldn't add new admin!" + error);

    // Even if the admin can't be created, still create the users.
    createUsers();
});

// CREATE USERS
const createUsers = () => {

    // CREATE NEW USERS
    for (var i = 0; i < 10; i++) {

        let newUser = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: faker.internet.email(),
            password: bCrypt.hashSync(faker.internet.password() + process.env.dbSaltReadable, process.env.dbSalt, null),
            role: roles[getRandomInt(3)],
            status: status[getRandomInt(2)]
        }

        db.User.create(newUser).then(function (newUser, created) {
            console.log(`${newUser.id} -> User ${newUser.firstname} ${newUser.lastname} successfully created.`)
            userIds.push(newUser.id);

            // IF SEEDERS DONE, CALL NEXT FUNCTION
            if (userIds.length == 11) {
                createStatus();
            }

        }).catch(function (error) {
            console.log("Error: couldn't add new user!");
        });

    }
}

// CREATE STATUS
const createStatus = () => {

    let newStatus = [{ status: "Alert" } , { status: "Updated" }, { status: "New" }, { status: "Complete" }, { status: "Archived" }, { status: "Cancelled" }]
    db.Status.bulkCreate(newStatus).then(function (newStatus, created) {
        console.log(` -> Added statuses.`)

        // IF SEEDERS DONE, CALL NEXT FUNCTION
        createFreight();

    }).catch(function (error) {
        console.log("Error: couldn't add status!");

        // Even if the status can't be created, still create the freight.
        createFreight();
    });
}

// CREATE FREIGHT METHODS
const createFreight = () => {
    let newFreight = [{ freightMethod: "TNT" }, { freightMethod: "Toll" }]
    db.Freightmethod.bulkCreate(newFreight).then(function (newFreight, created) {
        console.log(` -> Added freight methods.`)

        // IF SEEDERS DONE, CALL NEXT FUNCTION
        createRequests();

    }).catch(function (error) {
        console.log("Error: couldn't add freight methods!");

        // Even if the freight can't be created, still create the requests.
        createRequests();
    });
}

// CREATE CUSTOMER REQUESTS
const createRequests = () => {
    for (var i = 0; i < 5; i++) {

        let newNote = [{
            "user": faker.name.firstName() + " " + faker.name.lastName(),
            "note": faker.commerce.productDescription()
        }]

        let newRequest = {
            requestingBranch: getRandomInt(7),
            requiringBranch: getRandomInt(7),
            customerName: faker.company.companyName(),
            customerContact: faker.name.firstName() + " " + faker.name.lastName(),
            customerPhone: faker.phone.phoneNumber(),
            customerAddress: faker.address.streetAddress(),
            ibt: faker.finance.routingNumber(),
            proforma: faker.finance.account(),
            branchInvoice: faker.finance.account(),
            parts: faker.commerce.productName(),
            freightCostAllocation: freightcost[getRandomInt(2)],
            freightAccount: faker.finance.routingNumber(),
            notes: JSON.stringify(newNote), 
            connote: faker.finance.routingNumber(),
            FreightmethodId: getRandomInt(2) + 1,
            UserId: userIds[getRandomInt(userIds.length)],
            StatusId: getRandomInt(6) + 1
        }

        db.Request.create(newRequest).then(function (newRequest, created) {
            console.log(`${i} -> Request for ${newRequest.id} successfully created.`)
        }).catch(function (error) {
            console.log("Error: couldn't add request!");
        });
    }
}