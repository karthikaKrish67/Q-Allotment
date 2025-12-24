require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('--- Database Connection Test ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_DIALECT:', process.env.DB_DIALECT);
console.log('DB_PASSWORD Length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

if (process.env.DB_PASSWORD === 'your_password_here') {
    console.error('\n❌ ERROR: Your password is still the placeholder "your_password_here".');
    process.exit(1);
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function test() {
    try {
        await sequelize.authenticate();
        console.log('\n✅ SUCCESS: Connection establishes successfully!');
    } catch (error) {
        console.error('\n❌ FAILURE: Connection failed.');
        console.error('Error Code:', error.parent ? error.parent.code : error.name);
        console.error('Error Message:', error.message);

        if (error.parent && error.parent.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\nTIP: "Access Denied" usually means the password or user "root" is incorrect.');
        } else if (error.parent && error.parent.code === 'ECONNREFUSED') {
            console.log('\nTIP: "Connection Refused" means MySQL is not running or the port (3306) is wrong.');
        }
    } finally {
        await sequelize.close();
    }
}

test();
