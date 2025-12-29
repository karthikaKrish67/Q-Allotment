const sequelize = require('./config/database');
const User = require('./models/User');
const NonEmployee = require('./models/NonEmployee');
const bcrypt = require('bcryptjs');

const checkAndFix = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        // Check Users
        const users = await User.findAll();
        console.log('Current Users:', users.map(u => ({ id: u.id, username: u.username, role: u.role })));

        const targetUser = 'PPC001';
        const targetPass = 'user123';

        let user = await User.findOne({ where: { username: targetUser } });
        if (!user) {
            console.log(`User ${targetUser} not found. Creating...`);
            const hashedPassword = await bcrypt.hash(targetPass, 10);
            user = await User.create({
                username: targetUser,
                password: hashedPassword,
                role: 'user'
            });
            console.log('User created successfully.');
        } else {
            console.log(`User ${targetUser} found.`);
            // Reset password just in case
            const hashedPassword = await bcrypt.hash(targetPass, 10);
            user.password = hashedPassword;
            await user.save();
            console.log('Password reset to user123');
        }

        // Check NonEmployee
        let ne = await NonEmployee.findOne({ where: { privatePartyCode: targetUser } });
        if (!ne) {
            console.log(`NonEmployee ${targetUser} not found. Creating...`);
            await NonEmployee.create({
                name: 'Demo Res',
                privatePartyCode: targetUser,
                address: '123 Demo St',
                phoneNumber: '1112223333'
            });
            console.log('NonEmployee created.');
        } else {
            console.log(`NonEmployee ${targetUser} found.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
};

checkAndFix();
