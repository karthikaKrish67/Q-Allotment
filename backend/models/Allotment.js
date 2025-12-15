const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UnEmployee = require('./UnEmployee');
const Quarter = require('./Quarter');

const Allotment = sequelize.define('Allotment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    allotmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active' // Active, Cancelled
    }
});

Allotment.belongsTo(UnEmployee);
UnEmployee.hasOne(Allotment); // Assuming one active allotment per person for simplicity? Or hasMany? Let's say hasMany for history.

Allotment.belongsTo(Quarter);
Quarter.hasMany(Allotment);

module.exports = Allotment;
