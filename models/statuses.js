// MODULE EXPORTS
module.exports = function(sequelize, Sequelize) {
 
    // CREATE DEFAULT USER TABLE
    let Status = sequelize.define('Status', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: Sequelize.INTEGER
        },
 
        status: {
            type: Sequelize.STRING,
            notEmpty: true,
            unique: true
        }
 
    });
 
    return Status;
 
}