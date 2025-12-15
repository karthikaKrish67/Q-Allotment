const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UnEmployee = require('./UnEmployee');

const Complaint = sequelize.define('Complaint', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending' // Pending, In Progress, Completed
    }
});

Complaint.belongsTo(UnEmployee);
UnEmployee.hasMany(Complaint);

module.exports = Complaint;
