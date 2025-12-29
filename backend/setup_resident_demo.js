const sequelize = require('./config/database');
const User = require('./models/User');
const NonEmployee = require('./models/NonEmployee');
const Quarter = require('./models/Quarter');
const Allotment = require('./models/Allotment');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const setupResidentDemo = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Create/Find a Demo Resident (NonEmployee)
        const demoCode = 'PPC001';
        let resident = await NonEmployee.findOne({ where: { privatePartyCode: demoCode } });

        if (!resident) {
            resident = await NonEmployee.create({
                name: 'John Doe',
                privatePartyCode: demoCode,
                address: '123 Test Street, Campus',
                phoneNumber: '9876543210'
            });
            console.log('Demo Resident created.');
        } else {
            console.log('Demo Resident exists.');
        }

        // 2. Create/Find a User Login for this Resident
        const password = 'user123';
        let user = await User.findOne({ where: { username: demoCode } });

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username: demoCode,
                password: hashedPassword,
                role: 'user'
            });
            console.log(`Demo User created. Login: ${demoCode} / ${password}`);
        } else {
            console.log(`Demo User exists. Login: ${demoCode} / ${password}`);
        }

        // 3. Ensure a Quarter is Allotted to this Resident (for Dashboard visibility)
        // Find a Quarter first
        let quarter = await Quarter.findOne({ where: { status: 'Occupied' } });

        // If no occupied quarter, find a vacant one and occupy it
        if (!quarter) {
            quarter = await Quarter.findOne({ where: { status: 'Vacant' } });
            if (quarter) {
                // Determine if already allotted to this specific user to avoid duplicates
                const existingAllotment = await Allotment.findOne({ where: { NonEmployeeId: resident.id, status: 'Active' } });

                if (!existingAllotment) {
                    await Allotment.create({
                        NonEmployeeId: resident.id,
                        QuarterId: quarter.id,
                        status: 'Active'
                    });

                    quarter.status = 'Occupied';
                    await quarter.save();
                    console.log(`Allotted Quarter ${quarter.quarterNumber} to ${resident.name}`);
                }
            } else {
                console.log('No quarters available to allot for demo.');
            }
        } else {
            // Check if connected to our resident, if not, create a new connection for demo purposes (might conflict with existing, but okay for dev)
            // Ideally we find an allotment for THIS resident.
            const myAllotment = await Allotment.findOne({ where: { NonEmployeeId: resident.id, status: 'Active' } });
            if (!myAllotment) {
                console.log('User has no active allotment. Attempting to allot a vacant quarter...');
                const vacantQ = await Quarter.findOne({ where: { status: 'Vacant' } });
                if (vacantQ) {
                    await Allotment.create({
                        NonEmployeeId: resident.id,
                        QuarterId: vacantQ.id,
                        status: 'Active'
                    });
                    vacantQ.status = 'Occupied';
                    await vacantQ.save();
                    console.log(`Allotted Quarter ${vacantQ.quarterNumber} to ${resident.name}`);
                } else {
                    console.log('No vacant quarters to allot to demo user.');
                }
            } else {
                console.log('Demo user already has an active allotment.');
            }
        }

    } catch (error) {
        console.error('Error setting up resident demo:', error);
    } finally {
        // await sequelize.close(); // Keep open if needed or close. Standard script closes.
        process.exit();
    }
};

setupResidentDemo();
