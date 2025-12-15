const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quarter = sequelize.define('Quarter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quarterNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false // Type I, II, III
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Vacant' // Vacant, Occupied
    }
});

module.exports = Quarter;
