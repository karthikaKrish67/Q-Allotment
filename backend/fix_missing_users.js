const sequelize = require('./config/database');
const User = require('./models/User');
const NonEmployee = require('./models/NonEmployee');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixMissingUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const residents = await NonEmployee.findAll();
        console.log(`Found ${residents.length} residents.`);

        for (const resident of residents) {
            const existingUser = await User.findOne({ where: { username: resident.privatePartyCode } });

            if (!existingUser) {
                console.log(`Creating user for resident: ${resident.name} (${resident.privatePartyCode})`);
                const hashedPassword = await bcrypt.hash('user123', 10);
                await User.create({
                    username: resident.privatePartyCode,
                    password: hashedPassword,
                    role: 'user'
                });
                console.log(`User created for ${resident.privatePartyCode}`);
            } else {
                // Ensure role is 'user' for residents
                if (existingUser.role === 'admin' && resident.privatePartyCode !== 'admin') {
                    // Maybe it was misassigned? Usually PPC001 should be 'user'.
                    // For safety, let's just make sure it's 'user' if it matches a privatePartyCode
                    existingUser.role = 'user';
                    await existingUser.save();
                    console.log(`Updated role to 'user' for ${resident.privatePartyCode}`);
                }
            }
        }

        console.log('Done fixing missing users.');
    } catch (error) {
        console.error('Error fixing users:', error);
    } finally {
        process.exit();
    }
};

fixMissingUsers();
