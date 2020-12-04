// MODULE EXPORTS
module.exports = function (sequelize, Sequelize) {

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

    customerName: {
      type: Sequelize.STRING
    },

    customerContact: {
      type: Sequelize.STRING
    },

    customerPhone: {
      type: Sequelize.STRING
    },

    customerAddress: {
      type: Sequelize.STRING
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
    },

    connote: {
      type: Sequelize.STRING
    },

  });

  Request.associate = function (models) {
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