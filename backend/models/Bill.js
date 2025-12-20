const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const NonEmployee = require('./NonEmployee');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false // e.g., "January 2024"
    },
    rentAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    maintenanceAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Bill.belongsTo(NonEmployee);
NonEmployee.hasMany(Bill);

module.exports = Bill;
