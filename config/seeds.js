const faker = require('faker');
const bCrypt = require('bcrypt-nodejs');
var db = require("../models");

const roles = ["admin", "parts", "warehouse"];
const status = ["active", "inactive"];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

for (var i = 0; i < 10; i++) {

    let newUser = {
        firstname: faker.name.firstName(),
        lastname: faker.name.firstName(),
        email: faker.internet.email(),
        password: bCrypt.hashSync(faker.internet.password(), bCrypt.genSaltSync(8), null),
        role: roles[getRandomInt(3)],
        status: status[getRandomInt(2)]
    }

    db.User.create(newUser).then(function (newUser, created) {
        
    });
}