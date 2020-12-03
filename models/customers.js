// MODULE EXPORTS
module.exports = function (sequelize, Sequelize) {

    // CREATE DEFAULT USER TABLE
    let Customer = sequelize.define('Customer', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: Sequelize.INTEGER
        },

        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        address: {
            type: Sequelize.TEXT
        },

        contact: {
            type: Sequelize.STRING
        },

        phone: {
            type: Sequelize.STRING
        }

    });

    // Customer.associate = function(models) {
    //     // Associating Author with Posts
    //     // When an Author is deleted, also delete any associated Posts
    //     Customer.hasMany(models.Request, {
    //       onDelete: "cascade"
    //     });
    //   };

    return Customer;

}