const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnEmployee = sequelize.define('UnEmployee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privatePartyCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING
    }
});

module.exports = UnEmployee;
