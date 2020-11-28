// https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
// Passport tutorial

// MODULE EXPORTS
module.exports = function(sequelize, Sequelize) {
 
    // CREATE DEFAULT USER TABLE
    let User = sequelize.define('User', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: Sequelize.INTEGER
        },
 
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        last_login: {
            type: Sequelize.DATE
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive'
        }
 
    });
 
    return User;
 
}