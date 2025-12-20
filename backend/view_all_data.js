const fs = require('fs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Quarter = require('./models/Quarter');
const UnEmployee = require('./models/UnEmployee');
const Allotment = require('./models/Allotment');
const Bill = require('./models/Bill');
const Complaint = require('./models/Complaint');

async function showData() {
    const data = {};
    try {
        await sequelize.authenticate();

        data.users = await User.findAll();
        data.quarters = await Quarter.findAll();
        data.unEmployees = await UnEmployee.findAll();
        data.allotments = await Allotment.findAll();
        data.bills = await Bill.findAll();
        data.complaints = await Complaint.findAll();

        fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
        console.log('Data written to db_dump.json');

    } catch (err) {
        console.error('Error:', err);
    }
}

showData();
