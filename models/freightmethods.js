// MODULE EXPORTS
module.exports = function (sequelize, Sequelize) {

    // CREATE DEFAULT USER TABLE
    let Freightmethod = sequelize.define('Freightmethod', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: Sequelize.INTEGER
        },

        freightMethod: {
            type: Sequelize.STRING,
            notEmpty: true,
            unique: true
        }

    });

    return Freightmethod;

}