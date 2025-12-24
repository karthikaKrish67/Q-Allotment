const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = process.env.DB_DIALECT === 'mysql'
    ? new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false
        }
    )
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: false
    });

module.exports = sequelize;
