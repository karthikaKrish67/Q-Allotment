const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const NonEmployee = require('./models/NonEmployee');
const Quarter = require('./models/Quarter');
const Allotment = require('./models/Allotment');
const Bill = require('./models/Bill');
const Complaint = require('./models/Complaint');
const sequelize = require('./config/database');
require('dotenv').config();

async function viewAllData() {
    try {
        await sequelize.authenticate();
        const data = {
            users: await User.findAll(),
            quarters: await Quarter.findAll(),
            nonEmployees: await NonEmployee.findAll(),
            allotments: await Allotment.findAll(),
            bills: await Bill.findAll(),
            complaints: await Complaint.findAll()
        };
        fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
        console.log('Data written to db_dump.json');
    } catch (error) {
        console.error('Error viewing data:', error);
    } finally {
        process.exit();
    }
}

viewAllData();
