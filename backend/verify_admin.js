const sequelize = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const username = 'admin';
        const password = 'admin';

        let admin = await User.findOne({ where: { username } });

        if (!admin) {
            console.log('Admin user not found. Creating...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully. Credentials: admin/admin');
        } else {
            console.log('Admin user exists. Resetting password to "admin"...');
            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin password reset to "admin".');
        }

    } catch (error) {
        console.error('Error verifying admin:', error);
    } finally {
        await sequelize.close();
    }
};

verifyAdmin();
