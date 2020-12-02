const faker = require('faker');
const bCrypt = require('bcrypt-nodejs');
var db = require("../models");

const roles = ["admin", "parts", "warehouse"];
const status = ["active", "inactive"];
const branch = ["Albany", "Bunbury", "Forrestfield", "Geraldton", "Guilford", "Port Hedland", "Spearwood"];
let userIds = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

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
    }).catch(function(error){
        console.log("Error: couldn't add as "+error.errors[0].message);
    });

}

let newStatus = [{ status: "New"},{status: "Complete"},{status: "Archived"}]
db.Status.bulkCreate(newStatus).then(function (newStatus, created) {
    console.log(` -> Added statuses.`)
}).catch(function(error){
    console.log("Error: couldn't add as "+error.errors[0].message);
});

let newFreight = [{ freightMethod: "TNT"},{freightMethod: "Toll"}]
db.Freightmethod.bulkCreate(newFreight).then(function (newFreight, created) {
    console.log(` -> Added freight methods.`)
}).catch(function(error){
    console.log("Error: couldn't add as "+error.errors[0].message);
});

for (var i = 0; i < 2; i++) {

    let newCustomer = {        
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        contact: faker.name.firstName() + " " + faker.name.lastName(),
        phone: faker.phone.phoneNumber()        
    }

    db.Customer.create(newCustomer).then(function (newCustomer, created) {
        console.log(`${i} -> Customer ${newCustomer.name} successfully created.`)
    }).catch(function(error){
        console.log(error)
    });

}

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
        CustomerId: 1,
        FreightmethodId: getRandomInt(1)+1,
        UserId: 1,
        StatusId: 1
    }

    db.Request.create(newRequest).then(function (newRequest, created) {
        console.log(`${i} -> Request for ${newRequest.toString()} successfully created.`)
    }).catch(function(error){
        console.log(error)
    });

}