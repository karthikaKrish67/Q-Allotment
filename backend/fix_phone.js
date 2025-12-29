const NonEmployee = require('./models/NonEmployee');
const sequelize = require('./config/database');

async function fixPhone() {
    try {
        await sequelize.authenticate();
        console.log('Updating resident phone...');

        // Find by code
        const resident = await NonEmployee.findOne({ where: { privatePartyCode: 'PPC001' } });
        if (resident) {
            console.log(`Found resident: ${resident.name}, Old Phone: ${resident.phoneNumber}`);
            resident.phoneNumber = '9876543210';
            await resident.save();
            console.log(`Updated resident to Phone: ${resident.phoneNumber}`);
        } else {
            console.log('Resident PPC001 not found, creating...');
            await NonEmployee.create({
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '9876543210',
                address: 'Block A, Qtr 101',
                privatePartyCode: 'PPC001',
                aadhaarNumber: '123456789012'
            });
            console.log('Created resident John Doe with 9876543210');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

fixPhone();
