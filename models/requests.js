// MODULE EXPORTS
module.exports = function(sequelize, Sequelize) {
 
    // CREATE DEFAULT USER TABLE
    let Request = sequelize.define('Request', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: Sequelize.INTEGER
        },
 

        requestingBranch: {
            type: Sequelize.INTEGER,
            notNull: true
        },
 
        requiringBranch: {
            type: Sequelize.INTEGER,
            notNull: true
        },
 
        ibt: {
            type: Sequelize.STRING
        },
 
        proforma: {
            type: Sequelize.STRING
        },
  
        branchInvoice: {
            type: Sequelize.INTEGER,
            notNull: true
        },
 
        parts: {
            type: Sequelize.TEXT
        },
 
        freightCostAllocation: {
            type: Sequelize.STRING
        },

        freightAccount: {
          type: Sequelize.STRING
       },
 
        notes: {
            type: Sequelize.TEXT
        } 
   
    });
 
    Request.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Request.belongsTo(models.Customer, {
            foreignKey: {
              allowNull: false
            }
          });
          Request.belongsTo(models.Freightmethod, {
            foreignKey: {
              allowNull: false
            }
          });
          Request.belongsTo(models.Status, {
            foreignKey: {
              allowNull: false
            }
          });
          Request.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
    };

    return Request;
 
}