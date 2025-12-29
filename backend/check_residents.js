const NonEmployee = require('./models/NonEmployee');
const sequelize = require('./config/database');

async function checkResidents() {
    try {
        await sequelize.authenticate();
        const residents = await NonEmployee.findAll();
        console.log('--- Registered Residents ---');
        residents.forEach(r => {
            console.log(`Name: ${r.name}, Phone: '${r.phoneNumber}', Code: ${r.privatePartyCode}`);
        });
        console.log('----------------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkResidents();
