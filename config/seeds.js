// DEPENDENCIES
const faker = require('faker');
const bCrypt = require('bcrypt-nodejs');
var db = require("../models");

// CONSTANT DECLARATIONS FOR SEEDERS
const roles = ["admin", "parts", "warehouse"];
const status = ["active", "inactive"];
const branch = ["Albany", "Bunbury", "Forrestfield", "Geraldton", "Guilford", "Port Hedland", "Spearwood"];
let userIds = [];
let customerIds = [];

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
}).catch(function (error) {
    console.log("Error: couldn't add new admin!" + error);
});

// CREATE STATUS
const createStatus = () => {

    let newStatus = [{ status: "New" }, { status: "Complete" }, { status: "Archived" }]
    db.Status.bulkCreate(newStatus).then(function (newStatus, created) {
        console.log(` -> Added statuses.`)

        // IF SEEDERS DONE, CALL NEXT FUNCTION
        createFreight();

    }).catch(function (error) {
        console.log("Error: couldn't add status!");
    });
}

// CREATE FREIGHT METHODS
const createFreight = () => {
    let newFreight = [{ freightMethod: "TNT" }, { freightMethod: "Toll" }]
    db.Freightmethod.bulkCreate(newFreight).then(function (newFreight, created) {
        console.log(` -> Added freight methods.`)

        // IF SEEDERS DONE, CALL NEXT FUNCTION
        createCustomers();

    }).catch(function (error) {
        console.log("Error: couldn't add freight methods!");
    });
}

// CREATE CUSTOMERS
const createCustomers = () => {
    for (var i = 0; i < 4; i++) {

        let newCustomer = {
            name: faker.company.companyName(),
            address: faker.address.streetAddress(),
            contact: faker.name.firstName() + " " + faker.name.lastName(),
            phone: faker.phone.phoneNumber()
        }

        db.Customer.create(newCustomer).then(function (newCustomer, created) {
            console.log(`${i} -> Customer ${newCustomer.name} successfully created.`)
            customerIds.push(newCustomer.id);

             // IF SEEDERS DONE, CALL NEXT FUNCTION
            if (customerIds.length >= 4) {
                createRequests();
            }

        }).catch(function (error) {
            console.log("Error: couldn't add customer!");
        });
    }
}

// CREATE CUSTOMER REQUESTS
const createRequests = () => {
    for (var i = 0; i < 5; i++) {

        let newRequest = {
            requestingBranch: getRandomInt(7),
            requiringBranch: getRandomInt(7),
            ibt: faker.finance.routingNumber(),
            proforma: getRandomInt(2),
            branchInvoice: getRandomInt(2),
            parts: getRandomInt(2),
            freightCostAllocation: faker.commerce.price(),
            notes: "",
            CustomerId: customerIds[getRandomInt(customerIds.length)],
            FreightmethodId: getRandomInt(2) + 1,
            UserId: userIds[getRandomInt(userIds.length)],
            StatusId: getRandomInt(2) + 1
        }

        db.Request.create(newRequest).then(function (newRequest, created) {
            console.log(`${i} -> Request for ${newRequest.id} successfully created.`)
        }).catch(function (error) {
            console.log("Error: couldn't add request!");
        });
    }
}